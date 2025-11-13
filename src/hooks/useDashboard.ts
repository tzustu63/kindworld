import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchPointsHistory,
  fetchLeaderboard,
  refreshDashboard,
  clearDashboardError,
  selectPointsHistory,
  selectLeaderboard,
  selectDashboardLoading,
  selectDashboardRefreshing,
  selectDashboardError,
  selectLastUpdated,
} from '../store/slices/dashboardSlice';
import { selectUser } from '../store/slices/authSlice';

/**
 * Custom hook for dashboard data management
 * Provides easy access to dashboard state and actions
 */
export const useDashboard = () => {
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(selectUser);
  const pointsHistory = useAppSelector(selectPointsHistory);
  const leaderboard = useAppSelector(selectLeaderboard);
  const isLoading = useAppSelector(selectDashboardLoading);
  const isRefreshing = useAppSelector(selectDashboardRefreshing);
  const error = useAppSelector(selectDashboardError);
  const lastUpdated = useAppSelector(selectLastUpdated);

  // Load dashboard data on mount
  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = useCallback(() => {
    if (user?.id) {
      dispatch(fetchPointsHistory(user.id));
      dispatch(fetchLeaderboard());
    }
  }, [dispatch, user?.id]);

  const refresh = useCallback(() => {
    if (user?.id) {
      return dispatch(refreshDashboard(user.id));
    }
  }, [dispatch, user?.id]);

  const clearError = useCallback(() => {
    dispatch(clearDashboardError());
  }, [dispatch]);

  return {
    // State
    pointsHistory,
    leaderboard,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    
    // Actions
    loadDashboardData,
    refresh,
    clearError,
  };
};
