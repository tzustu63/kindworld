import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Offline storage utility for persisting critical app data
 * Uses AsyncStorage for persistent storage across app sessions
 */

const STORAGE_KEYS = {
  USER_DATA: '@kindworld:user',
  POINTS_HISTORY: '@kindworld:points_history',
  LEADERBOARD: '@kindworld:leaderboard',
  MISSIONS: '@kindworld:missions',
  VOUCHERS: '@kindworld:vouchers',
  REDEMPTIONS: '@kindworld:redemptions',
  LAST_SYNC: '@kindworld:last_sync',
};

export class OfflineStorage {
  /**
   * Save data to offline storage
   */
  static async save<T>(key: string, data: T): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
    } catch (error) {
      console.error(`Error saving to offline storage (${key}):`, error);
      throw error;
    }
  }

  /**
   * Load data from offline storage
   */
  static async load<T>(key: string): Promise<T | null> {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      if (jsonData === null) {
        return null;
      }
      return JSON.parse(jsonData) as T;
    } catch (error) {
      console.error(`Error loading from offline storage (${key}):`, error);
      return null;
    }
  }

  /**
   * Remove data from offline storage
   */
  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from offline storage (${key}):`, error);
      throw error;
    }
  }

  /**
   * Clear all offline storage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing offline storage:', error);
      throw error;
    }
  }

  /**
   * Save user data
   */
  static async saveUserData(userData: any): Promise<void> {
    return this.save(STORAGE_KEYS.USER_DATA, userData);
  }

  /**
   * Load user data
   */
  static async loadUserData(): Promise<any | null> {
    return this.load(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Save points history
   */
  static async savePointsHistory(pointsHistory: any[]): Promise<void> {
    return this.save(STORAGE_KEYS.POINTS_HISTORY, pointsHistory);
  }

  /**
   * Load points history
   */
  static async loadPointsHistory(): Promise<any[] | null> {
    return this.load(STORAGE_KEYS.POINTS_HISTORY);
  }

  /**
   * Save leaderboard data
   */
  static async saveLeaderboard(leaderboard: any[]): Promise<void> {
    return this.save(STORAGE_KEYS.LEADERBOARD, leaderboard);
  }

  /**
   * Load leaderboard data
   */
  static async loadLeaderboard(): Promise<any[] | null> {
    return this.load(STORAGE_KEYS.LEADERBOARD);
  }

  /**
   * Save missions data
   */
  static async saveMissions(missions: any[]): Promise<void> {
    return this.save(STORAGE_KEYS.MISSIONS, missions);
  }

  /**
   * Load missions data
   */
  static async loadMissions(): Promise<any[] | null> {
    return this.load(STORAGE_KEYS.MISSIONS);
  }

  /**
   * Save vouchers data
   */
  static async saveVouchers(vouchers: any[]): Promise<void> {
    return this.save(STORAGE_KEYS.VOUCHERS, vouchers);
  }

  /**
   * Load vouchers data
   */
  static async loadVouchers(): Promise<any[] | null> {
    return this.load(STORAGE_KEYS.VOUCHERS);
  }

  /**
   * Save redemptions data
   */
  static async saveRedemptions(redemptions: any[]): Promise<void> {
    return this.save(STORAGE_KEYS.REDEMPTIONS, redemptions);
  }

  /**
   * Load redemptions data
   */
  static async loadRedemptions(): Promise<any[] | null> {
    return this.load(STORAGE_KEYS.REDEMPTIONS);
  }

  /**
   * Save last sync timestamp
   */
  static async saveLastSync(timestamp: number): Promise<void> {
    return this.save(STORAGE_KEYS.LAST_SYNC, timestamp);
  }

  /**
   * Load last sync timestamp
   */
  static async loadLastSync(): Promise<number | null> {
    return this.load(STORAGE_KEYS.LAST_SYNC);
  }
}
