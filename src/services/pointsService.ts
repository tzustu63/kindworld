import { firebaseFirestore } from './firebase';
import { PointsTransaction, PointsTransactionType } from '../types/points';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/**
 * Points Service Layer
 * Handles all points-related operations including awarding, deducting, and tracking transactions
 */

const COLLECTIONS = {
  USERS: 'users',
  TRANSACTIONS: 'pointsTransactions',
};

/**
 * Award points to a user for mission completion
 * @param userId - The user's ID
 * @param missionId - The mission ID
 * @param points - Number of points to award
 * @param description - Description of the transaction
 * @returns The created transaction
 */
export const awardPointsForMission = async (
  userId: string,
  missionId: string,
  points: number,
  description: string,
): Promise<PointsTransaction> => {
  if (points <= 0) {
    throw new Error('Points must be greater than 0');
  }

  const batch = firebaseFirestore().batch();
  const userRef = firebaseFirestore().collection(COLLECTIONS.USERS).doc(userId);
  const transactionRef = firebaseFirestore()
    .collection(COLLECTIONS.TRANSACTIONS)
    .doc();

  // Create transaction record
  const transaction: Omit<PointsTransaction, 'id'> = {
    userId,
    amount: points,
    type: 'mission_completion',
    relatedId: missionId,
    description,
    timestamp: firebaseFirestore.Timestamp.now(),
  };

  batch.set(transactionRef, transaction);

  // Update user's points
  batch.update(userRef, {
    compassionPoints: firebaseFirestore.FieldValue.increment(points),
    updatedAt: firebaseFirestore.Timestamp.now(),
  });

  await batch.commit();

  return {
    id: transactionRef.id,
    ...transaction,
  };
};

/**
 * Deduct points from a user for voucher redemption
 * @param userId - The user's ID
 * @param voucherId - The voucher ID
 * @param points - Number of points to deduct
 * @param description - Description of the transaction
 * @returns The created transaction
 */
export const deductPointsForVoucher = async (
  userId: string,
  voucherId: string,
  points: number,
  description: string,
): Promise<PointsTransaction> => {
  if (points <= 0) {
    throw new Error('Points must be greater than 0');
  }

  // First, check if user has enough points
  const userDoc = await firebaseFirestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .get();

  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  const userData = userDoc.data();
  const currentPoints = userData?.compassionPoints || 0;

  if (currentPoints < points) {
    throw new Error('Insufficient points');
  }

  const batch = firebaseFirestore().batch();
  const userRef = firebaseFirestore().collection(COLLECTIONS.USERS).doc(userId);
  const transactionRef = firebaseFirestore()
    .collection(COLLECTIONS.TRANSACTIONS)
    .doc();

  // Create transaction record (negative amount for deduction)
  const transaction: Omit<PointsTransaction, 'id'> = {
    userId,
    amount: -points,
    type: 'voucher_redemption',
    relatedId: voucherId,
    description,
    timestamp: firebaseFirestore.Timestamp.now(),
  };

  batch.set(transactionRef, transaction);

  // Update user's points
  batch.update(userRef, {
    compassionPoints: firebaseFirestore.FieldValue.increment(-points),
    updatedAt: firebaseFirestore.Timestamp.now(),
  });

  await batch.commit();

  return {
    id: transactionRef.id,
    ...transaction,
  };
};

/**
 * Get transaction history for a user
 * @param userId - The user's ID
 * @param limit - Maximum number of transactions to retrieve (default: 50)
 * @returns Array of transactions
 */
export const getTransactionHistory = async (
  userId: string,
  limit: number = 50,
): Promise<PointsTransaction[]> => {
  const snapshot = await firebaseFirestore()
    .collection(COLLECTIONS.TRANSACTIONS)
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as PointsTransaction[];
};

/**
 * Get user's current points balance
 * @param userId - The user's ID
 * @returns Current points balance
 */
export const getCurrentBalance = async (userId: string): Promise<number> => {
  const userDoc = await firebaseFirestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .get();

  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  return userDoc.data()?.compassionPoints || 0;
};

/**
 * Award bonus points to a user
 * @param userId - The user's ID
 * @param points - Number of points to award
 * @param description - Description of the bonus
 * @returns The created transaction
 */
export const awardBonusPoints = async (
  userId: string,
  points: number,
  description: string,
): Promise<PointsTransaction> => {
  if (points <= 0) {
    throw new Error('Points must be greater than 0');
  }

  const batch = firebaseFirestore().batch();
  const userRef = firebaseFirestore().collection(COLLECTIONS.USERS).doc(userId);
  const transactionRef = firebaseFirestore()
    .collection(COLLECTIONS.TRANSACTIONS)
    .doc();

  const transaction: Omit<PointsTransaction, 'id'> = {
    userId,
    amount: points,
    type: 'bonus',
    description,
    timestamp: firebaseFirestore.Timestamp.now(),
  };

  batch.set(transactionRef, transaction);
  batch.update(userRef, {
    compassionPoints: firebaseFirestore.FieldValue.increment(points),
    updatedAt: firebaseFirestore.Timestamp.now(),
  });

  await batch.commit();

  return {
    id: transactionRef.id,
    ...transaction,
  };
};

/**
 * Make a points adjustment (admin only)
 * @param userId - The user's ID
 * @param points - Number of points to adjust (positive or negative)
 * @param description - Description of the adjustment
 * @returns The created transaction
 */
export const adjustPoints = async (
  userId: string,
  points: number,
  description: string,
): Promise<PointsTransaction> => {
  if (points === 0) {
    throw new Error('Adjustment amount cannot be zero');
  }

  const batch = firebaseFirestore().batch();
  const userRef = firebaseFirestore().collection(COLLECTIONS.USERS).doc(userId);
  const transactionRef = firebaseFirestore()
    .collection(COLLECTIONS.TRANSACTIONS)
    .doc();

  const transaction: Omit<PointsTransaction, 'id'> = {
    userId,
    amount: points,
    type: 'adjustment',
    description,
    timestamp: firebaseFirestore.Timestamp.now(),
  };

  batch.set(transactionRef, transaction);
  batch.update(userRef, {
    compassionPoints: firebaseFirestore.FieldValue.increment(points),
    updatedAt: firebaseFirestore.Timestamp.now(),
  });

  await batch.commit();

  return {
    id: transactionRef.id,
    ...transaction,
  };
};

export default {
  awardPointsForMission,
  deductPointsForVoucher,
  getTransactionHistory,
  getCurrentBalance,
  awardBonusPoints,
  adjustPoints,
};
