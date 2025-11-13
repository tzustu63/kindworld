import { useEffect } from 'react';
import { ErrorHandler, AppError } from '@/utils/errorHandler';
import { useToast } from '@/components/ToastProvider';

/**
 * Hook to integrate ErrorHandler with Toast notifications
 */
export const useErrorHandler = () => {
  const { showToast } = useToast();

  useEffect(() => {
    // Register callback to show toasts for non-critical errors
    const unregister = ErrorHandler.registerCallback((error: AppError) => {
      if (error.severity !== 'critical') {
        const toastType =
          error.severity === 'error'
            ? 'error'
            : error.severity === 'warning'
            ? 'warning'
            : 'info';
        
        showToast(error.userMessage, toastType);
      }
    });

    return unregister;
  }, [showToast]);

  return {
    handleError: ErrorHandler.handleException.bind(ErrorHandler),
    createError: ErrorHandler.createError.bind(ErrorHandler),
    resetRetryAttempts: ErrorHandler.resetRetryAttempts.bind(ErrorHandler),
  };
};
