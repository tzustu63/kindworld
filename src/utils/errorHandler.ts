import { firebaseAnalytics } from '@services/firebase';
import { monitoringService } from '@services/monitoringService';
import { Alert } from 'react-native';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export type ErrorCategory =
  | 'authentication'
  | 'network'
  | 'validation'
  | 'permission'
  | 'data'
  | 'system'
  | 'unknown';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  recoverable: boolean;
  retryable: boolean;
  metadata?: Record<string, any>;
}

export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
}

type ErrorCallback = (error: AppError) => void;

export class ErrorHandler {
  private static retryAttempts: Map<string, number> = new Map();
  private static errorCallbacks: ErrorCallback[] = [];
  private static readonly DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  };

  /**
   * Register a callback to be notified when errors occur
   */
  static registerCallback(callback: ErrorCallback): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Main error handling method
   */
  static handle(error: AppError): void {
    this.logError(error);
    this.notifyCallbacks(error);

    if (error.severity === 'critical') {
      this.showCriticalError(error);
    } else {
      this.showError(error);
    }

    if (error.recoverable) {
      this.attemptRecovery(error);
    }
  }

  /**
   * Handle errors from caught exceptions
   */
  static handleException(
    error: Error | any,
    context?: string,
  ): AppError {
    const appError = this.categorizeError(error, context);
    this.handle(appError);
    return appError;
  }

  /**
   * Categorize errors based on error type and message
   */
  static categorizeError(error: Error | any, context?: string): AppError {
    const errorMessage = error?.message || String(error);
    const errorCode = error?.code || 'UNKNOWN_ERROR';

    // Authentication errors
    if (this.isAuthError(errorCode, errorMessage)) {
      return this.createAuthError(errorCode, errorMessage);
    }

    // Network errors
    if (this.isNetworkError(errorCode, errorMessage)) {
      return this.createNetworkError(errorCode, errorMessage);
    }

    // Validation errors
    if (this.isValidationError(errorCode, errorMessage)) {
      return this.createValidationError(errorCode, errorMessage);
    }

    // Permission errors
    if (this.isPermissionError(errorCode, errorMessage)) {
      return this.createPermissionError(errorCode, errorMessage);
    }

    // Data errors
    if (this.isDataError(errorCode, errorMessage)) {
      return this.createDataError(errorCode, errorMessage);
    }

    // System errors
    return this.createSystemError(errorCode, errorMessage, context);
  }

  /**
   * Log error to Firebase Analytics and Crashlytics
   */
  private static logError(error: AppError): void {
    try {
      // Log to Analytics
      firebaseAnalytics().logEvent('error_occurred', {
        error_code: error.code,
        error_message: error.message,
        error_severity: error.severity,
        error_category: error.category,
        error_recoverable: error.recoverable,
        error_retryable: error.retryable,
        ...error.metadata,
      });

      // Log to Crashlytics for non-fatal errors
      const crashError = new Error(error.message);
      crashError.name = error.code;
      monitoringService.logError(crashError, {
        severity: error.severity,
        category: error.category,
        recoverable: String(error.recoverable),
        retryable: String(error.retryable),
        ...error.metadata,
      });
    } catch (e) {
      console.error('Failed to log error to monitoring services:', e);
    }
  }

  /**
   * Notify registered callbacks
   */
  private static notifyCallbacks(error: AppError): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (e) {
        console.error('Error in error callback:', e);
      }
    });
  }

  /**
   * Show critical error alert
   */
  private static showCriticalError(error: AppError): void {
    Alert.alert(
      'Error',
      error.userMessage,
      [
        {
          text: 'OK',
          style: 'default',
        },
      ],
      { cancelable: false },
    );
  }

  /**
   * Show non-critical error (to be handled by Toast component)
   */
  private static showError(error: AppError): void {
    // This will be handled by the Toast component via callbacks
    console.warn('Error:', error.userMessage);
  }

  /**
   * Attempt to recover from error
   */
  private static async attemptRecovery(error: AppError): Promise<void> {
    if (!error.retryable) {
      return;
    }

    const attemptKey = error.code;
    const currentAttempts = this.retryAttempts.get(attemptKey) || 0;

    if (currentAttempts >= this.DEFAULT_RETRY_CONFIG.maxAttempts) {
      this.retryAttempts.delete(attemptKey);
      return;
    }

    this.retryAttempts.set(attemptKey, currentAttempts + 1);

    const delay =
      this.DEFAULT_RETRY_CONFIG.delayMs *
      Math.pow(this.DEFAULT_RETRY_CONFIG.backoffMultiplier, currentAttempts);

    await new Promise(resolve => setTimeout(resolve, delay));

    // Recovery logic would be implemented by the caller via metadata
    console.log(`Retry attempt ${currentAttempts + 1} for ${error.code}`);
  }

  /**
   * Reset retry attempts for a specific error code
   */
  static resetRetryAttempts(errorCode: string): void {
    this.retryAttempts.delete(errorCode);
  }

  /**
   * Create a custom error
   */
  static createError(
    code: string,
    message: string,
    userMessage: string,
    severity: ErrorSeverity = 'error',
    category: ErrorCategory = 'unknown',
    recoverable: boolean = false,
    retryable: boolean = false,
    metadata?: Record<string, any>,
  ): AppError {
    return {
      code,
      message,
      userMessage,
      severity,
      category,
      recoverable,
      retryable,
      metadata,
    };
  }

  // Error type detection methods
  private static isAuthError(code: string, message: string): boolean {
    const authCodes = [
      'auth/invalid-email',
      'auth/user-disabled',
      'auth/user-not-found',
      'auth/wrong-password',
      'auth/email-already-in-use',
      'auth/weak-password',
      'auth/operation-not-allowed',
      'auth/account-exists-with-different-credential',
      'auth/invalid-credential',
      'auth/invalid-verification-code',
      'auth/invalid-verification-id',
      'auth/session-expired',
    ];
    return authCodes.some(c => code.includes(c)) || message.includes('auth');
  }

  private static isNetworkError(code: string, message: string): boolean {
    const networkIndicators = [
      'network',
      'timeout',
      'connection',
      'offline',
      'unavailable',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
    ];
    return networkIndicators.some(
      indicator =>
        code.toLowerCase().includes(indicator) ||
        message.toLowerCase().includes(indicator),
    );
  }

  private static isValidationError(code: string, message: string): boolean {
    const validationIndicators = [
      'validation',
      'invalid',
      'required',
      'format',
      'missing',
    ];
    return validationIndicators.some(
      indicator =>
        code.toLowerCase().includes(indicator) ||
        message.toLowerCase().includes(indicator),
    );
  }

  private static isPermissionError(code: string, message: string): boolean {
    const permissionIndicators = [
      'permission',
      'denied',
      'unauthorized',
      'forbidden',
      'access',
    ];
    return permissionIndicators.some(
      indicator =>
        code.toLowerCase().includes(indicator) ||
        message.toLowerCase().includes(indicator),
    );
  }

  private static isDataError(code: string, message: string): boolean {
    const dataIndicators = ['not-found', 'exists', 'duplicate', 'firestore'];
    return dataIndicators.some(
      indicator =>
        code.toLowerCase().includes(indicator) ||
        message.toLowerCase().includes(indicator),
    );
  }

  // Error creation methods with user-friendly messages
  private static createAuthError(code: string, message: string): AppError {
    const errorMap: Record<string, string> = {
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/account-exists-with-different-credential':
        'An account already exists with this email.',
      'auth/invalid-credential': 'Invalid credentials. Please try again.',
      'auth/invalid-verification-code': 'Invalid verification code.',
      'auth/invalid-verification-id': 'Verification failed. Please try again.',
      'auth/session-expired': 'Your session has expired. Please sign in again.',
    };

    const userMessage =
      errorMap[code] || 'Authentication failed. Please try again.';

    return {
      code,
      message,
      userMessage,
      severity: 'error',
      category: 'authentication',
      recoverable: false,
      retryable: false,
    };
  }

  private static createNetworkError(code: string, message: string): AppError {
    return {
      code,
      message,
      userMessage:
        'Network connection issue. Please check your internet and try again.',
      severity: 'warning',
      category: 'network',
      recoverable: true,
      retryable: true,
    };
  }

  private static createValidationError(
    code: string,
    message: string,
  ): AppError {
    return {
      code,
      message,
      userMessage: 'Please check your input and try again.',
      severity: 'warning',
      category: 'validation',
      recoverable: false,
      retryable: false,
    };
  }

  private static createPermissionError(
    code: string,
    message: string,
  ): AppError {
    return {
      code,
      message,
      userMessage: "You don't have permission to perform this action.",
      severity: 'error',
      category: 'permission',
      recoverable: false,
      retryable: false,
    };
  }

  private static createDataError(code: string, message: string): AppError {
    const userMessage = code.includes('not-found')
      ? 'The requested data could not be found.'
      : 'There was an issue with your request. Please try again.';

    return {
      code,
      message,
      userMessage,
      severity: 'error',
      category: 'data',
      recoverable: false,
      retryable: true,
    };
  }

  private static createSystemError(
    code: string,
    message: string,
    context?: string,
  ): AppError {
    return {
      code,
      message,
      userMessage: 'Something went wrong. Please try again later.',
      severity: 'error',
      category: 'system',
      recoverable: true,
      retryable: true,
      metadata: { context },
    };
  }
}
