import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchCurrentBalance,
  fetchTransactionHistory,
  awardMissionPoints,
  redeemVoucherPoints,
  awardBonus,
  makeAdjustment,
  selectCurrentBalance,
  selectTransactions,
  selectMonthlyGrowth,
  selectPointsLoading,
  selectPointsProcessing,
  selectPointsError,
  selectRecentTransactions,
  selectTotalEarned,
  selectTotalSpent,
  clearPointsError,
} from '../store/slices/pointsSlice';
import { PointsTransaction } from '../types/points';

/**
 * Custom hook for managing points operations
 */
export const usePoints = (userId?: string) => {
  const dispatch = useAppDispatch();

  // Selectors
  const currentBalance = useAppSelector(selectCurrentBalance);
  const transactions = useAppSelector(selectTransactions);
  const monthlyGrowth = useAppSelector(selectMonthlyGrowth);
  const isLoading = useAppSelector(selectPointsLoading);
  const isProcessing = useAppSelector(selectPointsProcessing);
  const error = useAppSelector(selectPointsError);
  const totalEarned = useAppSelector(selectTotalEarned);
  const totalSpent = useAppSelector(selectTotalSpent);

  // Fetch balance
  const fetchBalance = useCallback(
    async (id?: string) => {
      const targetUserId = id || userId;
      if (!targetUserId) {
        throw new Error('User ID is required');
      }
      return dispatch(fetchCurrentBalance(targetUserId));
    },
    [dispatch, userId]
  );

  // Fetch transaction history
  const fetchHistory = useCallback(
    async (id?: string, limit?: number) => {
      const targetUserId = id || userId;
      if (!targetUserId) {
        throw new Error('User ID is required');
      }
      return dispatch(
        fetchTransactionHistory({ userId: targetUserId, limit })
      );
    },
    [dispatch, userId]
  );

  // Award points for mission
  const awardForMission = useCallback(
    async (missionId: string, points: number, description: string) => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return dispatch(
        awardMissionPoints({ userId, missionId, points, description })
      );
    },
    [dispatch, userId]
  );

  // Redeem voucher
  const redeemVoucher = useCallback(
    async (voucherId: string, points: number, description: string) => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return dispatch(
        redeemVoucherPoints({ userId, voucherId, points, description })
      );
    },
    [dispatch, userId]
  );

  // Award bonus points
  const giveBonus = useCallback(
    async (points: number, description: string) => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return dispatch(awardBonus({ userId, points, description }));
    },
    [dispatch, userId]
  );

  // Make adjustment (admin)
  const adjustBalance = useCallback(
    async (points: number, description: string) => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return dispatch(makeAdjustment({ userId, points, description }));
    },
    [dispatch, userId]
  );

  // Clear error
  const clearError = useCallback(() => {
    dispatch(clearPointsError());
  }, [dispatch]);

  // Get recent transactions
  const getRecentTransactions = useCallback(
    (limit: number = 10): PointsTransaction[] => {
      return transactions.slice(0, limit);
    },
    [transactions]
  );

  // Auto-fetch on mount if userId is provided
  useEffect(() => {
    if (userId) {
      fetchBalance();
      fetchHistory();
    }
  }, [userId]); // Only run on userId change

  return {
    // State
    currentBalance,
    transactions,
    monthlyGrowth,
    isLoading,
    isProcessing,
    error,
    totalEarned,
    totalSpent,

    // Actions
    fetchBalance,
    fetchHistory,
    awardForMission,
    redeemVoucher,
    giveBonus,
    adjustBalance,
    clearError,
    getRecentTransactions,
  };
};

export default usePoints;
