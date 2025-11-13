import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { User, Badge, Mission } from './types';

const db = admin.firestore();

/**
 * Check if user meets badge criteria
 */
async function checkBadgeCriteria(
  user: User,
  badge: Badge
): Promise<boolean> {
  const { type, threshold } = badge.criteria;

  switch (type) {
    case 'hours':
      // Check total volunteer hours
      return user.totalVolunteerHours >= threshold;

    case 'points':
      // Check total compassion points
      return user.compassionPoints >= threshold;

    case 'missions':
      // Count completed missions
      const missionsSnapshot = await db
        .collection('missions')
        .where('completedParticipants', 'array-contains', user.id)
        .get();
      return missionsSnapshot.size >= threshold;

    case 'streak':
      // Check consecutive days/weeks of activity
      // This would require tracking activity dates
      const streakCount = await calculateUserStreak(user.id);
      return streakCount >= threshold;

    default:
      return false;
  }
}

/**
 * Calculate user's activity streak
 * Returns number of consecutive days with activity
 */
async function calculateUserStreak(userId: string): Promise<number> {
  // Get user's point transactions ordered by date
  const transactionsSnapshot = await db
    .collection('pointsTransactions')
    .where('userId', '==', userId)
    .where('amount', '>', 0) // Only positive transactions (earning points)
    .orderBy('timestamp', 'desc')
    .limit(365) // Check last year
    .get();

  if (transactionsSnapshot.empty) {
    return 0;
  }

  // Track unique activity dates
  const activityDates = new Set<string>();
  transactionsSnapshot.docs.forEach(doc => {
    const transaction = doc.data();
    const date = transaction.timestamp.toDate();
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    activityDates.add(dateString);
  });

  // Calculate consecutive days from today
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateString = checkDate.toISOString().split('T')[0];

    if (activityDates.has(dateString)) {
      streak++;
    } else if (i > 0) {
      // Break streak if we find a gap (but allow today to be empty)
      break;
    }
  }

  return streak;
}

/**
 * Award a badge to a user
 */
async function awardBadgeToUser(
  userId: string,
  badgeId: string
): Promise<void> {
  const userRef = db.collection('users').doc(userId);
  
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const user = userDoc.data() as User;
    const currentBadges = user.badges || [];

    // Check if user already has this badge
    if (currentBadges.includes(badgeId)) {
      return; // Already has badge
    }

    // Add badge to user
    currentBadges.push(badgeId);
    transaction.update(userRef, {
      badges: currentBadges,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create badge award record
    const awardRef = db.collection('badgeAwards').doc();
    transaction.set(awardRef, {
      userId,
      badgeId,
      awardedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
}

/**
 * Send notification for new badge
 */
async function sendBadgeNotification(
  userId: string,
  badge: Badge
): Promise<void> {
  // Create notification document
  const notificationRef = db.collection('notifications').doc();
  
  await notificationRef.set({
    userId,
    type: 'badge_awarded',
    title: 'New Badge Earned!',
    message: `Congratulations! You've earned the "${badge.name}" badge.`,
    data: {
      badgeId: badge.id,
      badgeName: badge.name,
      badgeIcon: badge.iconUrl,
      rarity: badge.rarity,
    },
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // In production, this would also send push notification
  // using Firebase Cloud Messaging (FCM)
  functions.logger.info('Badge notification created', {
    userId,
    badgeId: badge.id,
    badgeName: badge.name,
  });
}

/**
 * Check and award badges for a specific user
 * Called when user completes actions that might earn badges
 */
export const checkAndAwardBadges = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const userId = data.userId || context.auth.uid;

    try {
      // Get user data
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found');
      }

      const user = { id: userDoc.id, ...userDoc.data() } as User;
      const currentBadges = user.badges || [];

      // Get all available badges
      const badgesSnapshot = await db.collection('badges').get();
      const allBadges = badgesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Badge));

      // Check each badge the user doesn't have yet
      const newBadges: Badge[] = [];
      
      for (const badge of allBadges) {
        // Skip if user already has this badge
        if (currentBadges.includes(badge.id)) {
          continue;
        }

        // Check if user meets criteria
        const meetsCriteria = await checkBadgeCriteria(user, badge);
        
        if (meetsCriteria) {
          // Award badge
          await awardBadgeToUser(userId, badge.id);
          
          // Send notification
          await sendBadgeNotification(userId, badge);
          
          newBadges.push(badge);
          
          functions.logger.info('Badge awarded', {
            userId,
            badgeId: badge.id,
            badgeName: badge.name,
          });
        }
      }

      return {
        success: true,
        newBadges: newBadges.map(b => ({
          id: b.id,
          name: b.name,
          description: b.description,
          iconUrl: b.iconUrl,
          rarity: b.rarity,
        })),
        message: newBadges.length > 0 
          ? `Earned ${newBadges.length} new badge(s)!` 
          : 'No new badges earned',
      };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      functions.logger.error('Error checking badges:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to check badges'
      );
    }
  }
);

/**
 * Trigger function to check badges when user completes a mission
 * Automatically awards badges when criteria are met
 */
export const onMissionCompleted = functions.firestore
  .document('missions/{missionId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() as Mission;
    const after = change.after.data() as Mission;

    // Check if new participants completed the mission
    const beforeCompleted = before.completedParticipants || [];
    const afterCompleted = after.completedParticipants || [];

    const newCompletions = afterCompleted.filter(
      userId => !beforeCompleted.includes(userId)
    );

    if (newCompletions.length === 0) {
      return null;
    }

    // Check badges for each user who completed the mission
    const promises = newCompletions.map(async (userId) => {
      try {
        // Get user data
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (!userDoc.exists) {
          return;
        }

        const user = { id: userDoc.id, ...userDoc.data() } as User;
        const currentBadges = user.badges || [];

        // Get all badges
        const badgesSnapshot = await db.collection('badges').get();
        const allBadges = badgesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Badge));

        // Check and award eligible badges
        for (const badge of allBadges) {
          if (currentBadges.includes(badge.id)) {
            continue;
          }

          const meetsCriteria = await checkBadgeCriteria(user, badge);
          
          if (meetsCriteria) {
            await awardBadgeToUser(userId, badge.id);
            await sendBadgeNotification(userId, badge);
            
            functions.logger.info('Auto-awarded badge on mission completion', {
              userId,
              missionId: context.params.missionId,
              badgeId: badge.id,
            });
          }
        }
      } catch (error) {
        functions.logger.error('Error auto-awarding badges:', error);
        // Don't throw to avoid blocking mission completion
      }
    });

    await Promise.all(promises);
    return null;
  });

/**
 * Trigger function to check badges when user points change
 * Automatically awards point-based badges
 */
export const onUserPointsChangeForBadges = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() as User;
    const after = change.after.data() as User;

    // Only process if points increased
    if (after.compassionPoints <= before.compassionPoints) {
      return null;
    }

    const userId = context.params.userId;

    try {
      const currentBadges = after.badges || [];

      // Get point-based badges
      const badgesSnapshot = await db
        .collection('badges')
        .where('criteria.type', '==', 'points')
        .get();

      for (const badgeDoc of badgesSnapshot.docs) {
        const badge = { id: badgeDoc.id, ...badgeDoc.data() } as Badge;

        // Skip if already has badge
        if (currentBadges.includes(badge.id)) {
          continue;
        }

        // Check if user now meets criteria
        if (after.compassionPoints >= badge.criteria.threshold) {
          await awardBadgeToUser(userId, badge.id);
          await sendBadgeNotification(userId, badge);
          
          functions.logger.info('Auto-awarded point badge', {
            userId,
            badgeId: badge.id,
            points: after.compassionPoints,
          });
        }
      }

      return null;
    } catch (error) {
      functions.logger.error('Error checking point badges:', error);
      return null;
    }
  });

/**
 * Scheduled function to check streak-based badges
 * Runs daily to check if users maintain their streaks
 */
export const checkStreakBadges = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('Asia/Taipei')
  .onRun(async (context) => {
    try {
      functions.logger.info('Starting streak badge check');

      // Get all streak-based badges
      const badgesSnapshot = await db
        .collection('badges')
        .where('criteria.type', '==', 'streak')
        .get();

      if (badgesSnapshot.empty) {
        functions.logger.info('No streak badges configured');
        return null;
      }

      const streakBadges = badgesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Badge));

      // Get all active users (users with activity in last 30 days)
      const thirtyDaysAgo = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );

      const activeUsersSnapshot = await db
        .collection('users')
        .where('updatedAt', '>', thirtyDaysAgo)
        .where('role', '==', 'user')
        .get();

      functions.logger.info(`Checking ${activeUsersSnapshot.size} active users`);

      // Check each user for streak badges
      const promises = activeUsersSnapshot.docs.map(async (userDoc) => {
        const user = { id: userDoc.id, ...userDoc.data() } as User;
        const currentBadges = user.badges || [];

        for (const badge of streakBadges) {
          // Skip if already has badge
          if (currentBadges.includes(badge.id)) {
            continue;
          }

          // Check streak
          const streak = await calculateUserStreak(user.id);
          
          if (streak >= badge.criteria.threshold) {
            await awardBadgeToUser(user.id, badge.id);
            await sendBadgeNotification(user.id, badge);
            
            functions.logger.info('Awarded streak badge', {
              userId: user.id,
              badgeId: badge.id,
              streak,
            });
          }
        }
      });

      await Promise.all(promises);

      functions.logger.info('Streak badge check completed');
      return null;
    } catch (error) {
      functions.logger.error('Error checking streak badges:', error);
      throw error;
    }
  });

/**
 * Admin function to create a new badge
 */
export const createBadge = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Verify admin role
  const adminDoc = await db.collection('users').doc(context.auth.uid).get();
  const adminUser = adminDoc.data() as User;
  
  if (!adminUser || adminUser.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can create badges'
    );
  }

  const { name, description, iconUrl, criteria, rarity } = data;

  if (!name || !description || !iconUrl || !criteria || !rarity) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'All badge fields are required'
    );
  }

  try {
    const badgeRef = db.collection('badges').doc();
    const badge: Omit<Badge, 'id'> = {
      name,
      description,
      iconUrl,
      criteria,
      rarity,
    };

    await badgeRef.set(badge);

    return {
      success: true,
      badgeId: badgeRef.id,
      message: 'Badge created successfully',
    };
  } catch (error) {
    functions.logger.error('Error creating badge:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to create badge'
    );
  }
});
