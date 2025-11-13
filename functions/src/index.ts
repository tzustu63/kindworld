import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Export all function modules
export * from './missions';
export * from './vouchers';
export * from './leaderboard';
export * from './badges';
