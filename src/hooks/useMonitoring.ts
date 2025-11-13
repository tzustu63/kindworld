import { useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { monitoringService, AnalyticsEvent } from '../services/monitoringService';

/**
 * useMonitoring Hook
 * 
 * Provides easy access to monitoring functionality in React components
 * Automatically tracks screen views and provides methods for logging events
 */

interface UseMonitoringOptions {
  screenName?: string;
  trackScreenView?: boolean;
  measureLoadTime?: boolean;
}

export const useMonitoring = (options: UseMonitoringOptions = {}) => {
  const { screenName, trackScreenView = true, measureLoadTime = true } = options;
  const user = useSelector((state: RootState) => state.auth.user);
  const screenLoadStartTime = useRef(Date.now());

  // Track screen view on mount
  useEffect(() => {
    if (screenName && trackScreenView) {
      monitoringService.logScreenView(screenName);
    }
  }, [screenName, trackScreenView]);

  // Measure screen load time
  useEffect(() => {
    if (screenName && measureLoadTime) {
      const loadTime = Date.now() - screenLoadStartTime.current;
      
      // Only measure if load time is reasonable (not from cached state)
      if (loadTime < 10000) {
        monitoringService.measureScreenLoad(screenName, screenLoadStartTime.current);
      }
    }
  }, [screenName, measureLoadTime]);

  // Update user context when user changes
  useEffect(() => {
    if (user?.id) {
      monitoringService.setUserId(user.id);
      monitoringService.setUserProperties({
        user_role: user.role || 'user',
        has_profile: user.displayName ? 'true' : 'false',
      });
    }
  }, [user]);

  // Memoized logging functions
  const logEvent = useCallback(
    (eventName: AnalyticsEvent | string, params?: any) => {
      return monitoringService.logEvent(eventName, params);
    },
    []
  );

  const logError = useCallback(
    (error: Error, context?: any) => {
      return monitoringService.logError(error, {
        ...context,
        screen: screenName,
        userId: user?.id,
      });
    },
    [screenName, user?.id]
  );

  const logMissionJoin = useCallback(
    (missionId: string, missionTitle: string, pointsReward: number) => {
      return monitoringService.logMissionJoin(missionId, missionTitle, pointsReward);
    },
    []
  );

  const logMissionComplete = useCallback(
    (missionId: string, missionTitle: string, pointsEarned: number) => {
      return monitoringService.logMissionComplete(missionId, missionTitle, pointsEarned);
    },
    []
  );

  const logVoucherRedeem = useCallback(
    (voucherId: string, voucherTitle: string, pointsCost: number, success: boolean) => {
      return monitoringService.logVoucherRedeem(voucherId, voucherTitle, pointsCost, success);
    },
    []
  );

  const logPointsEarned = useCallback(
    (amount: number, source: string) => {
      return monitoringService.logPointsEarned(amount, source);
    },
    []
  );

  const logPointsSpent = useCallback(
    (amount: number, purpose: string) => {
      return monitoringService.logPointsSpent(amount, purpose);
    },
    []
  );

  const startTrace = useCallback(
    (traceName: string) => {
      return monitoringService.startTrace(traceName);
    },
    []
  );

  const stopTrace = useCallback(
    (traceName: string) => {
      return monitoringService.stopTrace(traceName);
    },
    []
  );

  const measureApiCall = useCallback(
    (endpoint: string, method: string, startTime: number, statusCode?: number) => {
      return monitoringService.measureApiCall(endpoint, method, startTime, statusCode);
    },
    []
  );

  return {
    logEvent,
    logError,
    logMissionJoin,
    logMissionComplete,
    logVoucherRedeem,
    logPointsEarned,
    logPointsSpent,
    startTrace,
    stopTrace,
    measureApiCall,
  };
};

/**
 * usePerformanceTrace Hook
 * 
 * Automatically starts and stops a performance trace for a component lifecycle
 */
export const usePerformanceTrace = (traceName: string) => {
  useEffect(() => {
    monitoringService.startTrace(traceName);
    
    return () => {
      monitoringService.stopTrace(traceName);
    };
  }, [traceName]);
};

/**
 * useApiPerformance Hook
 * 
 * Provides utilities for measuring API call performance
 */
export const useApiPerformance = () => {
  const measureApiCall = useCallback(
    async <T,>(
      apiCall: () => Promise<T>,
      endpoint: string,
      method: string = 'GET'
    ): Promise<T> => {
      const startTime = Date.now();
      let statusCode: number | undefined;
      
      try {
        const result = await apiCall();
        statusCode = 200; // Assume success
        return result;
      } catch (error: any) {
        statusCode = error.statusCode || error.status || 500;
        throw error;
      } finally {
        await monitoringService.measureApiCall(endpoint, method, startTime, statusCode);
      }
    },
    []
  );

  return { measureApiCall };
};

export default useMonitoring;
