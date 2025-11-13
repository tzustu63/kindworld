import { Middleware } from '@reduxjs/toolkit';
import { OfflineStorage } from '../../utils/offlineStorage';
import { RootState } from '../index';

/**
 * Persistence middleware for Redux store
 * Automatically saves critical data to offline storage on state changes
 */
export const persistenceMiddleware: Middleware<{}, RootState> = store => next => action => {
  const result = next(action);
  const state = store.getState();

  // Persist critical data after specific actions
  if (action.type.includes('fulfilled') || action.type.includes('setUser')) {
    // Debounce persistence to avoid excessive writes
    setTimeout(() => {
      persistCriticalData(state);
    }, 500);
  }

  return result;
};

/**
 * Persist critical data to offline storage
 */
async function persistCriticalData(state: RootState): Promise<void> {
  try {
    // Persist user data
    if (state.auth.user) {
      await OfflineStorage.saveUserData(state.auth.user);
    }

    // Persist dashboard data
    if (state.dashboard.pointsHistory.length > 0) {
      await OfflineStorage.savePointsHistory(state.dashboard.pointsHistory);
    }

    if (state.dashboard.leaderboard.length > 0) {
      await OfflineStorage.saveLeaderboard(state.dashboard.leaderboard);
    }

    // Persist missions
    if (state.missions.missions.length > 0) {
      await OfflineStorage.saveMissions(state.missions.missions);
    }

    // Persist vouchers
    if (state.vouchers.vouchers.length > 0) {
      await OfflineStorage.saveVouchers(state.vouchers.vouchers);
    }

    // Persist redemptions
    if (state.vouchers.redemptions.length > 0) {
      await OfflineStorage.saveRedemptions(state.vouchers.redemptions);
    }

    // Save last sync timestamp
    await OfflineStorage.saveLastSync(Date.now());
  } catch (error) {
    console.error('Error persisting data:', error);
  }
}

/**
 * Load persisted data from offline storage
 */
export async function loadPersistedData(): Promise<Partial<RootState> | null> {
  try {
    const [
      userData,
      pointsHistory,
      leaderboard,
      missions,
      vouchers,
      redemptions,
    ] = await Promise.all([
      OfflineStorage.loadUserData(),
      OfflineStorage.loadPointsHistory(),
      OfflineStorage.loadLeaderboard(),
      OfflineStorage.loadMissions(),
      OfflineStorage.loadVouchers(),
      OfflineStorage.loadRedemptions(),
    ]);

    return {
      auth: userData ? { user: userData, isLoading: false, error: null } : undefined,
      dashboard: {
        pointsHistory: pointsHistory || [],
        leaderboard: leaderboard || [],
        isLoading: false,
        isRefreshing: false,
        error: null,
      },
      missions: {
        missions: missions || [],
        selectedMission: null,
        filters: {},
        sortBy: 'date' as const,
        isLoading: false,
        hasMore: true,
        lastDoc: null,
        error: null,
      },
      vouchers: {
        vouchers: vouchers || [],
        redemptions: redemptions || [],
        selectedCategory: null,
        isLoading: false,
        isRedeeming: false,
        error: null,
      },
    };
  } catch (error) {
    console.error('Error loading persisted data:', error);
    return null;
  }
}

/**
 * Clear all persisted data
 */
export async function clearPersistedData(): Promise<void> {
  try {
    await OfflineStorage.clear();
  } catch (error) {
    console.error('Error clearing persisted data:', error);
  }
}
