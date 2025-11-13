import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CSRMetrics, DateRange } from '../../types';

interface AnalyticsState {
  metrics: CSRMetrics | null;
  dateRange: DateRange;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: AnalyticsState = {
  metrics: null,
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<CSRMetrics>) => {
      state.metrics = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAnalytics: (state) => {
      state.metrics = null;
      state.error = null;
      state.lastUpdated = null;
    },
  },
});

export const {
  setMetrics,
  setDateRange,
  setLoading,
  setError,
  clearError,
  resetAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
