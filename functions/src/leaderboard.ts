import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { User, LeaderboardEntry } from './types';

const db = admin.firestore();

/**
 * Get current period identifier (e.g., "2025-11" for November 2025)
 */
function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get previous period identifier
 */
function getPreviousPeriod(): string {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Scheduled function to update leaderboard rankings
 * Runs every hour to keep leaderboard fresh
 * Optimized for performance with large user base
 */
export const updateLeaderboard = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const currentPeriod = getCurrentPeriod();
    const previousPeriod = getPreviousPeriod();

    try {
      functions.logger.info('Starting leaderboard update', { currentPeriod });

      // Fetch all users sorted by compassion points (descending)
      // Use pagination for large datasets
      const batchSize = 1000;
      let lastDoc: admin.firestore.QueryDocumentSnapshot | null = null;
      let allUsers: User[] = [];
      let hasMore = true;

      // Fetch users in batches to handle large user base
      while (hasMore) {
        let query = db
          .collection('users')
          .where('role', '==', 'user')
          .orderBy('compassionPoints', 'desc')
          .limit(batchSize);

        if (lastDoc) {
          query = query.startAfter(lastDoc);
        }

        const snapshot = await query.get();
        
        if (snapshot.empty) {
          hasMore = false;
          break;
        }

        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as User));

        allUsers = allUsers.concat(users);
        lastDoc = snapshot.docs[snapshot.docs.length - 1];

        // If we got fewer docs than batch size, we're done
        if (snapshot.docs.length < batchSize) {
          hasMore = false;
        }
      }

      functions.logger.info(`Fetched ${allUsers.length} users for leaderboard`);

      // Get previous leaderboard for rank change calculation
      const previousLeaderboardSnapshot = await db
        .collection('leaderboards')
        .doc(previousPeriod)
        .get();

      const previousRankings = new Map<string, number>();
      if (previousLeaderboardSnapshot.exists) {
        const previousData = previousLeaderboardSnapshot.data();
        if (previousData && previousData.entries) {
          previousData.entries.forEach((entry: LeaderboardEntry) => {
            previousRankings.set(entry.userId, entry.rank);
          });
        }
      }

      // Calculate new rankings
      const leaderboardEntries: LeaderboardEntry[] = allUsers.map((user, index) => {
        const currentRank = index + 1;
        const previousRank = previousRankings.get(user.id) || 0;
        const rankChange = previousRank > 0 ? previousRank - currentRank : 0;

        return {
          userId: user.id,
          displayName: user.displayName,
          photoURL: user.photoURL,
          compassionPoints: user.compassionPoints,
          rank: currentRank,
          change: rankChange,
          period: currentPeriod,
        };
      });

      // Store leaderboard in batches (Firestore has 500 operations per batch limit)
      const leaderboardRef = db.collection('leaderboards').doc(currentPeriod);
      
      // For very large leaderboards, we might want to store only top N users
      // and use a separate collection for full rankings
      const topN = 1000; // Store top 1000 users in main leaderboard
      const topEntries = leaderboardEntries.slice(0, topN);

      await leaderboardRef.set({
        period: currentPeriod,
        entries: topEntries,
        totalUsers: allUsers.length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Store full rankings in a subcollection for scalability
      // This allows us to query specific user rankings without loading entire leaderboard
      const batch = db.batch();
      let batchCount = 0;
      const maxBatchSize = 500;

      for (const entry of leaderboardEntries) {
        const entryRef = leaderboardRef
          .collection('rankings')
          .doc(entry.userId);
        
        batch.set(entryRef, entry);
        batchCount++;

        // Commit batch when it reaches max size
        if (batchCount >= maxBatchSize) {
          await batch.commit();
          batchCount = 0;
        }
      }

      // Commit remaining operations
      if (batchCount > 0) {
        await batch.commit();
      }

      functions.logger.info('Leaderboard update completed', {
        period: currentPeriod,
        totalUsers: allUsers.length,
        topUsers: topEntries.length,
      });

      return null;
    } catch (error) {
      functions.logger.error('Error updating leaderboard:', error);
      throw error;
    }
  });

/**
 * Cloud Function to get user's leaderboard position
 * Optimized to avoid loading entire leaderboard
 */
export const getUserLeaderboardPosition = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const userId = data.userId || context.auth.uid;
    const period = data.period || getCurrentPeriod();

    try {
      // Get user's ranking from the rankings subcollection
      const rankingDoc = await db
        .collection('leaderboards')
        .doc(period)
        .collection('rankings')
        .doc(userId)
        .get();

      if (!rankingDoc.exists) {
        // User not in leaderboard yet
        return {
          rank: null,
          change: 0,
          message: 'User not ranked yet',
        };
      }

      const ranking = rankingDoc.data() as LeaderboardEntry;

      return {
        rank: ranking.rank,
        change: ranking.change,
        compassionPoints: ranking.compassionPoints,
        period: ranking.period,
      };
    } catch (error) {
      functions.logger.error('Error getting user leaderboard position:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to get leaderboard position'
      );
    }
  }
);

/**
 * Cloud Function to get top N users from leaderboard
 * Efficient for displaying leaderboard in app
 */
export const getTopLeaderboard = functions.https.onCall(async (data, context) => {
  const limit = data.limit || 100;
  const period = data.period || getCurrentPeriod();

  if (limit > 1000) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Limit cannot exceed 1000'
    );
  }

  try {
    const leaderboardDoc = await db
      .collection('leaderboards')
      .doc(period)
      .get();

    if (!leaderboardDoc.exists) {
      return {
        entries: [],
        period,
        totalUsers: 0,
      };
    }

    const leaderboardData = leaderboardDoc.data();
    const entries = leaderboardData?.entries || [];

    return {
      entries: entries.slice(0, limit),
      period,
      totalUsers: leaderboardData?.totalUsers || 0,
      updatedAt: leaderboardData?.updatedAt,
    };
  } catch (error) {
    functions.logger.error('Error getting top leaderboard:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to get leaderboard'
    );
  }
});

/**
 * Cloud Function to get leaderboard around a specific user
 * Shows users ranked above and below the specified user
 */
export const getLeaderboardAroundUser = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const userId = data.userId || context.auth.uid;
    const period = data.period || getCurrentPeriod();
    const range = data.range || 5; // Show 5 users above and below

    try {
      // Get user's ranking
      const userRankingDoc = await db
        .collection('leaderboards')
        .doc(period)
        .collection('rankings')
        .doc(userId)
        .get();

      if (!userRankingDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'User not found in leaderboard'
        );
      }

      const userRanking = userRankingDoc.data() as LeaderboardEntry;
      const userRank = userRanking.rank;

      // Calculate range
      const startRank = Math.max(1, userRank - range);
      const endRank = userRank + range;

      // Get leaderboard entries in range
      const rankingsSnapshot = await db
        .collection('leaderboards')
        .doc(period)
        .collection('rankings')
        .where('rank', '>=', startRank)
        .where('rank', '<=', endRank)
        .orderBy('rank', 'asc')
        .get();

      const entries = rankingsSnapshot.docs.map(
        doc => doc.data() as LeaderboardEntry
      );

      return {
        entries,
        userRank,
        period,
      };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      functions.logger.error('Error getting leaderboard around user:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to get leaderboard'
      );
    }
  }
);

/**
 * Trigger function to update leaderboard when user points change
 * This provides near real-time leaderboard updates
 */
export const onUserPointsChange = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() as User;
    const after = change.after.data() as User;

    // Only process if points changed
    if (before.compassionPoints === after.compassionPoints) {
      return null;
    }

    const userId = context.params.userId;
    const currentPeriod = getCurrentPeriod();

    try {
      // Update user's ranking in the current period
      const leaderboardRef = db.collection('leaderboards').doc(currentPeriod);
      const rankingRef = leaderboardRef.collection('rankings').doc(userId);

      // Get current ranking
      const rankingDoc = await rankingRef.get();
      
      if (rankingDoc.exists) {
        // Update existing ranking
        await rankingRef.update({
          compassionPoints: after.compassionPoints,
          displayName: after.displayName,
          photoURL: after.photoURL || null,
        });
      } else {
        // Create new ranking entry
        // Rank will be recalculated in the scheduled function
        await rankingRef.set({
          userId,
          displayName: after.displayName,
          photoURL: after.photoURL || null,
          compassionPoints: after.compassionPoints,
          rank: 0, // Temporary, will be updated by scheduled function
          change: 0,
          period: currentPeriod,
        });
      }

      functions.logger.info('Updated user ranking', {
        userId,
        oldPoints: before.compassionPoints,
        newPoints: after.compassionPoints,
      });

      return null;
    } catch (error) {
      functions.logger.error('Error updating user ranking:', error);
      // Don't throw error to avoid blocking user updates
      return null;
    }
  });
