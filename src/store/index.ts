import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import missionsReducer from './slices/missionsSlice';
import pointsReducer from './slices/pointsSlice';
import vouchersReducer from './slices/vouchersSlice';
import analyticsReducer from './slices/analyticsSlice';
import adminReducer from './slices/adminSlice';
import { analyticsApi } from '../services/analyticsService';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    missions: missionsReducer,
    points: pointsReducer,
    vouchers: vouchersReducer,
    analytics: analyticsReducer,
    admin: adminReducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'auth/setUser',
          'missions/fetchMissions/fulfilled',
          'missions/fetchMissionById/fulfilled',
          'points/fetchTransactionHistory/fulfilled',
          'points/awardMissionPoints/fulfilled',
          'points/redeemVoucherPoints/fulfilled',
          'points/awardBonus/fulfilled',
          'points/makeAdjustment/fulfilled',
          'vouchers/fetchVouchers/fulfilled',
          'vouchers/fetchRedemptions/fulfilled',
          'vouchers/redeemVoucher/fulfilled',
          'analytics/setDateRange',
          'admin/fetchAllMissions/fulfilled',
          'admin/createMission/fulfilled',
          'admin/updateMission/fulfilled',
          'admin/fetchMissionParticipants/fulfilled',
          'admin/fetchMissionAnalytics/fulfilled',
        ],
        ignoredPaths: [
          'auth.user.createdAt',
          'auth.user.updatedAt',
          'missions.missions',
          'missions.lastDoc',
          'points.transactions',
          'vouchers.vouchers',
          'vouchers.redemptions',
          'analytics.dateRange',
          'admin.missions',
          'admin.selectedMission',
          'admin.participants',
        ],
      },
    })
      .concat(analyticsApi.middleware)
      .concat(persistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
