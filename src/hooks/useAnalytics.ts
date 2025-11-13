import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGetCSRMetricsQuery } from '../services/analyticsService';
import { setMetrics, setDateRange, setLoading, setError } from '../store/slices/analyticsSlice';
import { DateRange } from '../types';

export const useAnalytics = (companyId: string) => {
  const dispatch = useDispatch();
  const { metrics, dateRange, isLoading, error, lastUpdated } = useSelector(
    (state: RootState) => state.analytics
  );

  // Fetch CSR metrics with RTK Query
  const {
    data: fetchedMetrics,
    error: queryError,
    isLoading: isQueryLoading,
    refetch,
  } = useGetCSRMetricsQuery(
    { companyId, dateRange },
    {
      // Refetch every 5 minutes for real-time updates
      pollingInterval: 5 * 60 * 1000,
      // Skip if no companyId
      skip: !companyId,
    }
  );

  // Update Redux state when data is fetched
  useEffect(() => {
    if (fetchedMetrics) {
      dispatch(setMetrics(fetchedMetrics));
    }
  }, [fetchedMetrics, dispatch]);

  // Update loading state
  useEffect(() => {
    dispatch(setLoading(isQueryLoading));
  }, [isQueryLoading, dispatch]);

  // Update error state
  useEffect(() => {
    if (queryError) {
      const errorMessage =
        'error' in queryError
          ? String(queryError.error)
          : 'Failed to load analytics data';
      dispatch(setError(errorMessage));
    }
  }, [queryError, dispatch]);

  // Handle date range change
  const handleDateRangeChange = useCallback(
    (newDateRange: DateRange) => {
      dispatch(setDateRange(newDateRange));
    },
    [dispatch]
  );

  // Manual refresh
  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (err) {
      console.error('Error refreshing analytics:', err);
    }
  }, [refetch]);

  // Check if data is stale (older than 5 minutes)
  const isStale = lastUpdated
    ? Date.now() - lastUpdated > 5 * 60 * 1000
    : true;

  return {
    metrics,
    dateRange,
    isLoading,
    error,
    isStale,
    handleDateRangeChange,
    refresh,
  };
};
