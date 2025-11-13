import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Mission, User, PointsTransaction } from './types';

const db = admin.firestore();

/**
 * Cloud Function to handle mission join requests
 * Validates mission availability and adds user to participants list
 */
export const joinMission = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to join a mission'
    );
  }

  const { missionId } = data;
  const userId = context.auth.uid;

  if (!missionId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Mission ID is required'
    );
  }

  try {
    // Use transaction to ensure data consistency
    const result = await db.runTransaction(async (transaction) => {
      const missionRef = db.collection('missions').doc(missionId);
      const missionDoc = await transaction.get(missionRef);

      if (!missionDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Mission not found'
        );
      }

      const mission = missionDoc.data() as Mission;

      // Validate mission status
      if (mission.status !== 'published' && mission.status !== 'ongoing') {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Mission is not available for participation'
        );
      }

      // Check if user already joined
      if (mission.participants && mission.participants.includes(userId)) {
        throw new functions.https.HttpsError(
          'already-exists',
          'User has already joined this mission'
        );
      }

      // Check if mission is full
      if (mission.maxParticipants && mission.currentParticipants >= mission.maxParticipants) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Mission has reached maximum participants'
        );
      }

      // Add user to participants
      const participants = mission.participants || [];
      participants.push(userId);

      transaction.update(missionRef, {
        participants,
        currentParticipants: participants.length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, message: 'Successfully joined mission' };
    });

    return result;
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    functions.logger.error('Error joining mission:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to join mission'
    );
  }
});

/**
 * Cloud Function to verify and complete a mission
 * Awards points to user upon successful completion
 */
export const completeMission = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to complete a mission'
    );
  }

  const { missionId, verificationData } = data;
  const userId = context.auth.uid;

  if (!missionId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Mission ID is required'
    );
  }

  try {
    // Use transaction to ensure atomic updates
    const result = await db.runTransaction(async (transaction) => {
      const missionRef = db.collection('missions').doc(missionId);
      const userRef = db.collection('users').doc(userId);

      const [missionDoc, userDoc] = await Promise.all([
        transaction.get(missionRef),
        transaction.get(userRef),
      ]);

      if (!missionDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Mission not found');
      }

      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found');
      }

      const mission = missionDoc.data() as Mission;
      const user = userDoc.data() as User;

      // Verify user is a participant
      if (!mission.participants || !mission.participants.includes(userId)) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'User has not joined this mission'
        );
      }

      // Check if already completed
      const completedParticipants = mission.completedParticipants || [];
      if (completedParticipants.includes(userId)) {
        throw new functions.https.HttpsError(
          'already-exists',
          'Mission already completed by user'
        );
      }

      // Verify mission completion (basic verification)
      // In production, this would include more sophisticated verification
      // such as location check, photo verification, admin approval, etc.
      const isVerified = verifyMissionCompletion(mission, verificationData);
      if (!isVerified) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Mission completion verification failed'
        );
      }

      // Award points to user
      const pointsToAward = mission.pointsReward;
      const newPointsBalance = user.compassionPoints + pointsToAward;

      // Update user points
      transaction.update(userRef, {
        compassionPoints: newPointsBalance,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Mark mission as completed for this user
      completedParticipants.push(userId);
      transaction.update(missionRef, {
        completedParticipants,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create points transaction record
      const transactionRef = db.collection('pointsTransactions').doc();
      const pointsTransaction: Omit<PointsTransaction, 'id'> = {
        userId,
        amount: pointsToAward,
        type: 'mission_completion',
        relatedId: missionId,
        description: `Completed mission: ${mission.title}`,
        timestamp: admin.firestore.Timestamp.now(),
      };
      transaction.set(transactionRef, pointsTransaction);

      return {
        success: true,
        pointsAwarded: pointsToAward,
        newBalance: newPointsBalance,
        message: 'Mission completed successfully',
      };
    });

    return result;
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    functions.logger.error('Error completing mission:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to complete mission'
    );
  }
});

/**
 * Helper function to verify mission completion
 * This is a placeholder for more sophisticated verification logic
 */
function verifyMissionCompletion(
  mission: Mission,
  verificationData: any
): boolean {
  // Basic verification - in production this would be more sophisticated
  // Could include: location verification, photo upload, time verification, etc.
  
  // For now, we'll do basic checks
  if (!verificationData) {
    return false;
  }

  // Check if mission date has passed (can't complete future missions)
  const now = admin.firestore.Timestamp.now();
  if (mission.date > now) {
    return false;
  }

  // Additional verification logic would go here
  // For example:
  // - Check if user was at the location
  // - Verify uploaded photos
  // - Check time spent at mission
  // - Require admin approval for certain mission types

  return true;
}

/**
 * Cloud Function to award points manually (admin only)
 * Used for bonuses, adjustments, or special rewards
 */
export const awardPoints = functions.https.onCall(async (data, context) => {
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
      'Only administrators can award points manually'
    );
  }

  const { userId, amount, description, type = 'bonus' } = data;

  if (!userId || !amount || !description) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'User ID, amount, and description are required'
    );
  }

  if (amount <= 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Amount must be positive'
    );
  }

  try {
    const result = await db.runTransaction(async (transaction) => {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found');
      }

      const user = userDoc.data() as User;
      const newBalance = user.compassionPoints + amount;

      // Update user points
      transaction.update(userRef, {
        compassionPoints: newBalance,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create transaction record
      const transactionRef = db.collection('pointsTransactions').doc();
      const pointsTransaction: Omit<PointsTransaction, 'id'> = {
        userId,
        amount,
        type,
        description,
        timestamp: admin.firestore.Timestamp.now(),
      };
      transaction.set(transactionRef, pointsTransaction);

      return {
        success: true,
        pointsAwarded: amount,
        newBalance,
        message: 'Points awarded successfully',
      };
    });

    return result;
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    functions.logger.error('Error awarding points:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to award points'
    );
  }
});
