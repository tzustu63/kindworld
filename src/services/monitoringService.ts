import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';

/**
 * MonitoringService
 * 
 * Centralized service for Firebase Analytics, Crashlytics, and Performance Monitoring
 * Tracks user behavior, errors, and performance metrics across the app
 */

// Analytics Event Names
export enum AnalyticsEvent {
  // Authentication Events
  SIGN_IN = 'sign_in',
  SIGN_UP = 'sign_up',
  SIGN_OUT = 'sign_out',
  
  // Mission Events
  MISSION_VIEW = 'mission_view',
  MISSION_JOIN = 'mission_join',
  MISSION_COMPLETE = 'mission_complete',
  MISSION_FILTER = 'mission_filter',
  MISSION_SORT = 'mission_sort',
  MISSION_SEARCH = 'mission_search',
  
  // Voucher Events
  VOUCHER_VIEW = 'voucher_view',
  VOUCHER_REDEEM = 'voucher_redeem',
  VOUCHER_REDEEM_SUCCESS = 'voucher_redeem_success',
  VOUCHER_REDEEM_FAILED = 'voucher_redeem_failed',
  
  // Points Events
  POINTS_EARNED = 'points_earned',
  POINTS_SPENT = 'points_spent',
  POINTS_VIEW_HISTORY = 'points_view_history',
  
  // Profile Events
  PROFILE_VIEW = 'profile_view',
  PROFILE_EDIT = 'profile_edit',
  BADGE_EARNED = 'badge_earned',
  
  // Dashboard Events
  DASHBOARD_VIEW = 'dashboard_view',
  LEADERBOARD_VIEW = 'leaderboard_view',
  
  // Admin Events
  ADMIN_MISSION_CREATE = 'admin_mission_create',
  ADMIN_MISSION_UPDATE = 'admin_mission_update',
  ADMIN_MISSION_DELETE = 'admin_mission_delete',
  
  // CSR Events
  CSR_DASHBOARD_VIEW = 'csr_dashboard_view',
  CSR_EXPORT_DATA = 'csr_export_data',
  
  // Error Events
  ERROR_OCCURRED = 'error_occurred',
  API_ERROR = 'api_error',
}

// Performance Trace Names
export enum PerformanceTrace {
  APP_START = 'app_start',
  SCREEN_LOAD = 'screen_load',
  API_CALL = 'api_call',
  IMAGE_LOAD = 'image_load',
  DATA_FETCH = 'data_fetch',
}

// Error Severity Levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal',
}

interface AnalyticsParams {
  [key: string]: string | number | boolean | undefined;
}

interface ErrorContext {
  screen?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

class MonitoringService {
  private isInitialized = false;
  private performanceTraces: Map<string, any> = new Map();

  /**
   * Initialize monitoring services
   */
  async initialize(): Promise<void> {
    try {
      // Enable Crashlytics collection
      await crashlytics().setCrashlyticsCollectionEnabled(true);
      
      // Enable Analytics collection
      await analytics().setAnalyticsCollectionEnabled(true);
      
      // Enable Performance Monitoring
      await perf().setPerformanceCollectionEnabled(true);
      
      this.isInitialized = true;
      console.log('Monitoring services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize monitoring services:', error);
    }
  }

  /**
   * Set user ID for tracking across all services
   */
  async setUserId(userId: string): Promise<void> {
    try {
      await Promise.all([
        analytics().setUserId(userId),
        crashlytics().setUserId(userId),
      ]);
    } catch (error) {
      console.error('Failed to set user ID:', error);
    }
  }

  /**
   * Set user properties for analytics
   */
  async setUserProperties(properties: { [key: string]: string }): Promise<void> {
    try {
      await analytics().setUserProperties(properties);
    } catch (error) {
      console.error('Failed to set user properties:', error);
    }
  }

  /**
   * Clear user data (on logout)
   */
  async clearUserData(): Promise<void> {
    try {
      await Promise.all([
        analytics().setUserId(null),
        crashlytics().setUserId(''),
      ]);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  // ==================== Analytics Methods ====================

  /**
   * Log a custom analytics event
   */
  async logEvent(eventName: AnalyticsEvent | string, params?: AnalyticsParams): Promise<void> {
    try {
      await analytics().logEvent(eventName, params);
    } catch (error) {
      console.error(`Failed to log event ${eventName}:`, error);
    }
  }

  /**
   * Log screen view
   */
  async logScreenView(screenName: string, screenClass?: string): Promise<void> {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      console.error(`Failed to log screen view ${screenName}:`, error);
    }
  }

  /**
   * Log mission join event
   */
  async logMissionJoin(missionId: string, missionTitle: string, pointsReward: number): Promise<void> {
    await this.logEvent(AnalyticsEvent.MISSION_JOIN, {
      mission_id: missionId,
      mission_title: missionTitle,
      points_reward: pointsReward,
    });
  }

  /**
   * Log mission completion event
   */
  async logMissionComplete(missionId: string, missionTitle: string, pointsEarned: number): Promise<void> {
    await this.logEvent(AnalyticsEvent.MISSION_COMPLETE, {
      mission_id: missionId,
      mission_title: missionTitle,
      points_earned: pointsEarned,
    });
  }

  /**
   * Log voucher redemption event
   */
  async logVoucherRedeem(
    voucherId: string,
    voucherTitle: string,
    pointsCost: number,
    success: boolean
  ): Promise<void> {
    const eventName = success 
      ? AnalyticsEvent.VOUCHER_REDEEM_SUCCESS 
      : AnalyticsEvent.VOUCHER_REDEEM_FAILED;
    
    await this.logEvent(eventName, {
      voucher_id: voucherId,
      voucher_title: voucherTitle,
      points_cost: pointsCost,
      value: pointsCost, // For e-commerce tracking
      currency: 'POINTS',
    });
  }

  /**
   * Log points earned event
   */
  async logPointsEarned(amount: number, source: string): Promise<void> {
    await this.logEvent(AnalyticsEvent.POINTS_EARNED, {
      amount,
      source,
      value: amount,
    });
  }

  /**
   * Log points spent event
   */
  async logPointsSpent(amount: number, purpose: string): Promise<void> {
    await this.logEvent(AnalyticsEvent.POINTS_SPENT, {
      amount,
      purpose,
      value: amount,
    });
  }

  /**
   * Log sign in event
   */
  async logSignIn(method: 'email' | 'google' | 'apple'): Promise<void> {
    await this.logEvent(AnalyticsEvent.SIGN_IN, {
      method,
    });
  }

  /**
   * Log sign up event
   */
  async logSignUp(method: 'email' | 'google' | 'apple'): Promise<void> {
    await this.logEvent(AnalyticsEvent.SIGN_UP, {
      method,
    });
  }

  // ==================== Crashlytics Methods ====================

  /**
   * Log a non-fatal error
   */
  async logError(error: Error, context?: ErrorContext): Promise<void> {
    try {
      // Set context attributes
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          crashlytics().setAttribute(key, String(value));
        });
      }

      // Record the error
      await crashlytics().recordError(error);

      // Also log to analytics for tracking
      await this.logEvent(AnalyticsEvent.ERROR_OCCURRED, {
        error_message: error.message,
        error_name: error.name,
        screen: context?.screen,
      });
    } catch (err) {
      console.error('Failed to log error to Crashlytics:', err);
    }
  }

  /**
   * Log a custom message to Crashlytics
   */
  async log(message: string): Promise<void> {
    try {
      await crashlytics().log(message);
    } catch (error) {
      console.error('Failed to log message to Crashlytics:', error);
    }
  }

  /**
   * Set custom attributes for crash reports
   */
  async setAttribute(key: string, value: string): Promise<void> {
    try {
      await crashlytics().setAttribute(key, value);
    } catch (error) {
      console.error('Failed to set attribute:', error);
    }
  }

  /**
   * Set multiple custom attributes
   */
  async setAttributes(attributes: { [key: string]: string }): Promise<void> {
    try {
      await crashlytics().setAttributes(attributes);
    } catch (error) {
      console.error('Failed to set attributes:', error);
    }
  }

  /**
   * Log API error
   */
  async logApiError(
    endpoint: string,
    statusCode: number,
    errorMessage: string,
    context?: ErrorContext
  ): Promise<void> {
    const error = new Error(`API Error: ${endpoint} - ${statusCode} - ${errorMessage}`);
    error.name = 'APIError';
    
    await this.logError(error, {
      ...context,
      endpoint,
      status_code: statusCode,
      error_type: 'api',
    });

    // Also log to analytics
    await this.logEvent(AnalyticsEvent.API_ERROR, {
      endpoint,
      status_code: statusCode,
      error_message: errorMessage,
    });
  }

  // ==================== Performance Monitoring Methods ====================

  /**
   * Start a performance trace
   */
  async startTrace(traceName: string): Promise<void> {
    try {
      const trace = await perf().startTrace(traceName);
      this.performanceTraces.set(traceName, trace);
    } catch (error) {
      console.error(`Failed to start trace ${traceName}:`, error);
    }
  }

  /**
   * Stop a performance trace
   */
  async stopTrace(traceName: string): Promise<void> {
    try {
      const trace = this.performanceTraces.get(traceName);
      if (trace) {
        await trace.stop();
        this.performanceTraces.delete(traceName);
      }
    } catch (error) {
      console.error(`Failed to stop trace ${traceName}:`, error);
    }
  }

  /**
   * Add metric to a trace
   */
  async putTraceMetric(traceName: string, metricName: string, value: number): Promise<void> {
    try {
      const trace = this.performanceTraces.get(traceName);
      if (trace) {
        await trace.putMetric(metricName, value);
      }
    } catch (error) {
      console.error(`Failed to put metric ${metricName} on trace ${traceName}:`, error);
    }
  }

  /**
   * Add attribute to a trace
   */
  async putTraceAttribute(traceName: string, attribute: string, value: string): Promise<void> {
    try {
      const trace = this.performanceTraces.get(traceName);
      if (trace) {
        await trace.putAttribute(attribute, value);
      }
    } catch (error) {
      console.error(`Failed to put attribute ${attribute} on trace ${traceName}:`, error);
    }
  }

  /**
   * Measure screen load time
   */
  async measureScreenLoad(screenName: string, startTime: number): Promise<void> {
    const loadTime = Date.now() - startTime;
    const traceName = `${PerformanceTrace.SCREEN_LOAD}_${screenName}`;
    
    try {
      const trace = await perf().startTrace(traceName);
      await trace.putMetric('load_time_ms', loadTime);
      await trace.putAttribute('screen_name', screenName);
      await trace.stop();

      // Log to analytics as well
      await this.logEvent('screen_load_time', {
        screen_name: screenName,
        load_time_ms: loadTime,
      });
    } catch (error) {
      console.error(`Failed to measure screen load for ${screenName}:`, error);
    }
  }

  /**
   * Measure API call performance
   */
  async measureApiCall(
    endpoint: string,
    method: string,
    startTime: number,
    statusCode?: number
  ): Promise<void> {
    const responseTime = Date.now() - startTime;
    const traceName = `${PerformanceTrace.API_CALL}_${method}_${endpoint.replace(/\//g, '_')}`;
    
    try {
      const trace = await perf().startTrace(traceName);
      await trace.putMetric('response_time_ms', responseTime);
      await trace.putAttribute('endpoint', endpoint);
      await trace.putAttribute('method', method);
      if (statusCode) {
        await trace.putAttribute('status_code', String(statusCode));
      }
      await trace.stop();

      // Log to analytics
      await this.logEvent('api_response_time', {
        endpoint,
        method,
        response_time_ms: responseTime,
        status_code: statusCode,
      });
    } catch (error) {
      console.error(`Failed to measure API call for ${endpoint}:`, error);
    }
  }

  /**
   * Create an HTTP metric for network requests
   */
  async createHttpMetric(url: string, httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE'): Promise<any> {
    try {
      return await perf().newHttpMetric(url, httpMethod);
    } catch (error) {
      console.error('Failed to create HTTP metric:', error);
      return null;
    }
  }

  /**
   * Measure data fetch performance
   */
  async measureDataFetch(
    dataType: string,
    startTime: number,
    itemCount?: number
  ): Promise<void> {
    const fetchTime = Date.now() - startTime;
    const traceName = `${PerformanceTrace.DATA_FETCH}_${dataType}`;
    
    try {
      const trace = await perf().startTrace(traceName);
      await trace.putMetric('fetch_time_ms', fetchTime);
      await trace.putAttribute('data_type', dataType);
      if (itemCount !== undefined) {
        await trace.putMetric('item_count', itemCount);
      }
      await trace.stop();
    } catch (error) {
      console.error(`Failed to measure data fetch for ${dataType}:`, error);
    }
  }

  // ==================== Utility Methods ====================

  /**
   * Check if monitoring is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Force crash (for testing only - DO NOT USE IN PRODUCTION)
   */
  async testCrash(): Promise<void> {
    if (__DEV__) {
      crashlytics().crash();
    }
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService();

export default monitoringService;
