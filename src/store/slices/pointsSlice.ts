import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { PointsTransaction } from '../../types/points';
import {
  getTransactionHistory,
  getCurrentBalance,
  awardPointsForMission,
  deductPointsForVoucher,
  awardBonusPoints,
  adjustPoints,
} from '../../services/pointsService';

interface PointsState {
  currentBalance: number;
  transactions: PointsTransaction[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  lastUpdated: number | null;
  monthlyGrowth: number; // Percentage growth month over month
}

const initialState: PointsState = {
  currentBalance: 0,
  transactions: [],
  isLoading: false,
  isProcessing: false,
  error: null,
  lastUpdated: null,
  monthlyGrowth: 0,
};

/**
 * Fetch user's current points balance
 */
export const fetchCurrentBalance = createAsyncThunk(
  'points/fetchCurrentBalance',
  async (userId: string, { rejectWithValue }) => {
    try {
      const balance = await getCurrentBalance(userId);
      return balance;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch balance');
    }
  }
);

/**
 * Fetch transaction history for a user
 */
export const fetchTransactionHistory = createAsyncThunk(
  'points/fetchTransactionHistory',
  async (
    { userId, limit = 50 }: { userId: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const transactions = await getTransactionHistory(userId, limit);
      return transactions;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch transaction history'
      );
    }
  }
);

/**
 * Award points for mission completion
 */
export const awardMissionPoints = createAsyncThunk(
  'points/awardMissionPoints',
  async (
    {
      userId,
      missionId,
      points,
      description,
    }: {
      userId: string;
      missionId: string;
      points: number;
      description: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const transaction = await awardPointsForMission(
        userId,
        missionId,
        points,
        description
      );
      // Refresh balance after awarding points
      await dispatch(fetchCurrentBalance(userId));
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to award points');
    }
  }
);

/**
 * Deduct points for voucher redemption
 */
export const redeemVoucherPoints = createAsyncThunk(
  'points/redeemVoucherPoints',
  async (
    {
      userId,
      voucherId,
      points,
      description,
    }: {
      userId: string;
      voucherId: string;
      points: number;
      description: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const transaction = await deductPointsForVoucher(
        userId,
        voucherId,
        points,
        description
      );
      // Refresh balance after deducting points
      await dispatch(fetchCurrentBalance(userId));
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to redeem voucher');
    }
  }
);

/**
 * Award bonus points
 */
export const awardBonus = createAsyncThunk(
  'points/awardBonus',
  async (
    {
      userId,
      points,
      description,
    }: {
      userId: string;
      points: number;
      description: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const transaction = await awardBonusPoints(userId, points, description);
      await dispatch(fetchCurrentBalance(userId));
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to award bonus');
    }
  }
);

/**
 * Make points adjustment (admin only)
 */
export const makeAdjustment = createAsyncThunk(
  'points/makeAdjustment',
  async (
    {
      userId,
      points,
      description,
    }: {
      userId: string;
      points: number;
      description: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const transaction = await adjustPoints(userId, points, description);
      await dispatch(fetchCurrentBalance(userId));
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to adjust points');
    }
  }
);

/**
 * Calculate monthly growth percentage
 */
const calculateMonthlyGrowth = (transactions: PointsTransaction[]): number => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let currentMonthPoints = 0;
  let lastMonthPoints = 0;

  transactions.forEach(transaction => {
    const transactionDate = transaction.timestamp.toDate();
    const transactionMonth = transactionDate.getMonth();
    const transactionYear = transactionDate.getFullYear();

    if (
      transactionMonth === currentMonth &&
      transactionYear === currentYear &&
      transaction.amount > 0
    ) {
      currentMonthPoints += transaction.amount;
    } else if (
      transactionMonth === lastMonth &&
      transactionYear === lastMonthYear &&
      transaction.amount > 0
    ) {
      lastMonthPoints += transaction.amount;
    }
  });

  if (lastMonthPoints === 0) {
    return currentMonthPoints > 0 ? 100 : 0;
  }

  return ((currentMonthPoints - lastMonthPoints) / lastMonthPoints) * 100;
};

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    clearPointsError: state => {
      state.error = null;
    },
    setCurrentBalance: (state, action: PayloadAction<number>) => {
      state.currentBalance = action.payload;
    },
    setTransactions: (state, action: PayloadAction<PointsTransaction[]>) => {
      state.transactions = action.payload;
      state.monthlyGrowth = calculateMonthlyGrowth(action.payload);
    },
    resetPointsState: () => initialState,
  },
  extraReducers: builder => {
    // Fetch Current Balance
    builder
      .addCase(fetchCurrentBalance.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBalance = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCurrentBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Transaction History
    builder
      .addCase(fetchTransactionHistory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.monthlyGrowth = calculateMonthlyGrowth(action.payload);
        state.lastUpdated = Date.now();
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Award Mission Points
    builder
      .addCase(awardMissionPoints.pending, state => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(awardMissionPoints.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.transactions = [action.payload, ...state.transactions];
        state.monthlyGrowth = calculateMonthlyGrowth(state.transactions);
      })
      .addCase(awardMissionPoints.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });

    // Redeem Voucher Points
    builder
      .addCase(redeemVoucherPoints.pending, state => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(redeemVoucherPoints.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.transactions = [action.payload, ...state.transactions];
        state.monthlyGrowth = calculateMonthlyGrowth(state.transactions);
      })
      .addCase(redeemVoucherPoints.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });

    // Award Bonus
    builder
      .addCase(awardBonus.pending, state => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(awardBonus.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.transactions = [action.payload, ...state.transactions];
        state.monthlyGrowth = calculateMonthlyGrowth(state.transactions);
      })
      .addCase(awardBonus.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });

    // Make Adjustment
    builder
      .addCase(makeAdjustment.pending, state => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(makeAdjustment.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.transactions = [action.payload, ...state.transactions];
        state.monthlyGrowth = calculateMonthlyGrowth(state.transactions);
      })
      .addCase(makeAdjustment.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearPointsError,
  setCurrentBalance,
  setTransactions,
  resetPointsState,
} = pointsSlice.actions;

// Selectors
export const selectCurrentBalance = (state: RootState) =>
  state.points.currentBalance;

export const selectTransactions = (state: RootState) =>
  state.points.transactions;

export const selectMonthlyGrowth = (state: RootState) =>
  state.points.monthlyGrowth;

export const selectPointsLoading = (state: RootState) =>
  state.points.isLoading;

export const selectPointsProcessing = (state: RootState) =>
  state.points.isProcessing;

export const selectPointsError = (state: RootState) => state.points.error;

export const selectLastUpdated = (state: RootState) =>
  state.points.lastUpdated;

// Derived selectors
export const selectRecentTransactions = (state: RootState, limit: number = 10) =>
  state.points.transactions.slice(0, limit);

export const selectTransactionsByType = (
  state: RootState,
  type: PointsTransaction['type']
) => state.points.transactions.filter(t => t.type === type);

export const selectTotalEarned = (state: RootState) =>
  state.points.transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

export const selectTotalSpent = (state: RootState) =>
  Math.abs(
    state.points.transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

export default pointsSlice.reducer;
