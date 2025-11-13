/**
 * Example usage of feedback components
 * This file demonstrates how to use the error handling and feedback system
 */

import React, { useState } from 'react';
import { View, Button } from 'react-native';
import {
  useToast,
  EmptyState,
  OfflineBanner,
  LoadingOverlay,
  SuccessAnimation,
} from '@/components';
import { useErrorHandler, useNetworkStatus } from '@/hooks';
import { ErrorHandler } from '@/utils/errorHandler';

/**
 * Example: Using Toast notifications
 */
export const ToastExample: React.FC = () => {
  const { showToast } = useToast();

  return (
    <View>
      <Button
        title="Show Success Toast"
        onPress={() => showToast('Operation completed successfully!', 'success')}
      />
      <Button
        title="Show Error Toast"
        onPress={() => showToast('Something went wrong', 'error')}
      />
      <Button
        title="Show Warning Toast"
        onPress={() => showToast('Please check your input', 'warning')}
      />
      <Button
        title="Show Info Toast"
        onPress={() => showToast('New feature available', 'info')}
      />
    </View>
  );
};

/**
 * Example: Using ErrorHandler with automatic toast
 */
export const ErrorHandlerExample: React.FC = () => {
  const { handleError } = useErrorHandler();

  const simulateError = () => {
    try {
      throw new Error('Network timeout');
    } catch (error) {
      handleError(error, 'API Call');
    }
  };

  const simulateAuthError = () => {
    const authError = new Error('Invalid credentials');
    (authError as any).code = 'auth/wrong-password';
    handleError(authError, 'Authentication');
  };

  return (
    <View>
      <Button title="Simulate Network Error" onPress={simulateError} />
      <Button title="Simulate Auth Error" onPress={simulateAuthError} />
    </View>
  );
};

/**
 * Example: Using EmptyState
 */
export const EmptyStateExample: React.FC = () => {
  return (
    <EmptyState
      title="No missions available"
      description="Check back later for new volunteer opportunities"
      icon="🎯"
      actionLabel="Refresh"
      onAction={() => console.log('Refresh clicked')}
    />
  );
};

/**
 * Example: Using OfflineBanner
 */
export const OfflineBannerExample: React.FC = () => {
  const { isOffline, checkConnection } = useNetworkStatus();

  return (
    <View>
      <OfflineBanner isOffline={isOffline} onRetry={checkConnection} />
      {/* Your content here */}
    </View>
  );
};

/**
 * Example: Using LoadingOverlay
 */
export const LoadingOverlayExample: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <View>
      <Button title="Show Loading" onPress={simulateLoading} />
      <LoadingOverlay visible={loading} message="Processing..." />
    </View>
  );
};

/**
 * Example: Using SuccessAnimation
 */
export const SuccessAnimationExample: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const simulateSuccess = () => {
    setShowSuccess(true);
  };

  return (
    <View>
      <Button title="Show Success" onPress={simulateSuccess} />
      <SuccessAnimation
        visible={showSuccess}
        message="Voucher redeemed!"
        onComplete={() => setShowSuccess(false)}
      />
    </View>
  );
};

/**
 * Example: Complete error handling flow
 */
export const CompleteErrorFlowExample: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const performAction = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.5;
          if (success) {
            resolve('Success');
          } else {
            reject(new Error('Network error'));
          }
        }, 2000);
      });

      setLoading(false);
      setShowSuccess(true);
    } catch (error) {
      setLoading(false);
      const appError = ErrorHandler.handleException(error, 'API Call');
      // Toast will be shown automatically via useErrorHandler hook
    }
  };

  return (
    <View>
      <Button title="Perform Action" onPress={performAction} />
      <LoadingOverlay visible={loading} message="Processing..." />
      <SuccessAnimation
        visible={showSuccess}
        message="Success!"
        onComplete={() => setShowSuccess(false)}
      />
    </View>
  );
};
