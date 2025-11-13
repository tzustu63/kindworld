import { store } from '../store';
import { OfflineStorage } from './offlineStorage';

/**
 * Sync Manager for handling data synchronization when coming back online
 */
export class SyncManager {
  private static isSyncing = false;
  private static syncQueue: Array<() => Promise<void>> = [];

  /**
   * Sync all data when coming back online
   */
  static async syncAll(): Promise<void> {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    this.isSyncing = true;

    try {
      console.log('Starting data synchronization...');

      const state = store.getState();
      const lastSync = await OfflineStorage.loadLastSync();
      const now = Date.now();

      // Only sync if last sync was more than 5 minutes ago
      if (lastSync && now - lastSync < 5 * 60 * 1000) {
        console.log('Data is recent, skipping sync');
        this.isSyncing = false;
        return;
      }

      // Process sync queue
      await this.processSyncQueue();

      // Refresh critical data from server
      await this.refreshData();

      // Update last sync timestamp
      await OfflineStorage.saveLastSync(now);

      console.log('Data synchronization completed');
    } catch (error) {
      console.error('Error during synchronization:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Add a sync task to the queue
   */
  static addToSyncQueue(task: () => Promise<void>): void {
    this.syncQueue.push(task);
  }

  /**
   * Process all queued sync tasks
   */
  private static async processSyncQueue(): Promise<void> {
    while (this.syncQueue.length > 0) {
      const task = this.syncQueue.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error('Error processing sync task:', error);
        }
      }
    }
  }

  /**
   * Refresh data from server
   */
  private static async refreshData(): Promise<void> {
    const state = store.getState();

    // Dispatch refresh actions for critical data
    // Note: These would be actual thunks in production
    try {
      // Refresh user data
      if (state.auth.user) {
        // store.dispatch(refreshUserData());
      }

      // Refresh dashboard data
      // store.dispatch(refreshDashboard());

      // Refresh missions
      // store.dispatch(refreshMissions());

      // Refresh vouchers
      // store.dispatch(refreshVouchers());
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }

  /**
   * Check if sync is needed
   */
  static async needsSync(): Promise<boolean> {
    const lastSync = await OfflineStorage.loadLastSync();
    if (!lastSync) return true;

    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return now - lastSync > fiveMinutes;
  }

  /**
   * Clear sync queue
   */
  static clearSyncQueue(): void {
    this.syncQueue = [];
  }
}
