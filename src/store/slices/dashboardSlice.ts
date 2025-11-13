import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { PointsHistory, LeaderboardEntry } from '../../types';
import firestore from '@react-native-firebase/firestore';

interface DashboardState {
  pointsHistory: PointsHistory[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: DashboardState = {
  pointsHistory: [],
  leaderboard: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
};

// Async thunk to fetch points history
export const fetchPointsHistory = createAsyncThunk(
  'dashboard/fetchPointsHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const snapshot = await firestore()
        .collection('pointsTransactions')
        .where('userId', '==', userId)
        .where('timestamp', '>=', firestore.Timestamp.fromDate(thirtyDaysAgo))
        .orderBy('timestamp', 'asc')
        .get();

      // Aggregate points by date
      const pointsByDate: { [key: string]: number } = {};
      let runningTotal = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        const date = data.timestamp.toDate();
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        
        runningTotal += data.amount;
        pointsByDate[dateStr] = runningTotal;
      });

      // Convert to array format
      const history: PointsHistory[] = Object.entries(pointsByDate).map(
        ([date, points]) => ({
          date,
          points,
        })
      );

      // If no data, generate placeholder
      if (history.length === 0) {
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
          history.push({ date: dateStr, points: 0 });
        }
      }

      return history;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch points history');
    }
  }
);

// Async thunk to fetch leaderboard
export const fetchLeaderboard = createAsyncThunk(
  'dashboard/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .orderBy('compassionPoints', 'desc')
        .limit(50)
        .get();

      const leaderboard: LeaderboardEntry[] = [];
      
      snapshot.forEach((doc, index) => {
        const data = doc.data();
        leaderboard.push({
          userId: doc.id,
          displayName: data.displayName || 'Anonymous',
          photoURL: data.photoURL,
          compassionPoints: data.compassionPoints || 0,
          rank: index + 1,
          change: 0, // TODO: Calculate from previous period
        });
      });

      return leaderboard;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch leaderboard');
    }
  }
);

// Async thunk to refresh all dashboard data
export const refreshDashboard = createAsyncThunk(
  'dashboard/refresh',
  async (userId: string, { dispatch }) => {
    await Promise.all([
      dispatch(fetchPointsHistory(userId)),
      dispatch(fetchLeaderboard()),
    ]);
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: state => {
      state.error = null;
    },
    setPointsHistory: (state, action: PayloadAction<PointsHistory[]>) => {
      state.pointsHistory = action.payload;
    },
    setLeaderboard: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.leaderboard = action.payload;
    },
  },
  extraReducers: builder => {
    // Fetch Points History
    builder
      .addCase(fetchPointsHistory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPointsHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pointsHistory = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchPointsHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Leaderboard
    builder
      .addCase(fetchLeaderboard.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboard = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh Dashboard
    builder
      .addCase(refreshDashboard.pending, state => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshDashboard.fulfilled, state => {
        state.isRefreshing = false;
        state.lastUpdated = Date.now();
      })
      .addCase(refreshDashboard.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error = action.error.message || 'Failed to refresh dashboard';
      });
  },
});

export const { clearDashboardError, setPointsHistory, setLeaderboard } =
  dashboardSlice.actions;

// Selectors
export const selectPointsHistory = (state: RootState) =>
  state.dashboard.pointsHistory;
export const selectLeaderboard = (state: RootState) =>
  state.dashboard.leaderboard;
export const selectDashboardLoading = (state: RootState) =>
  state.dashboard.isLoading;
export const selectDashboardRefreshing = (state: RootState) =>
  state.dashboard.isRefreshing;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
export const selectLastUpdated = (state: RootState) =>
  state.dashboard.lastUpdated;

export default dashboardSlice.reducer;
