import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Voucher, User, Redemption, PointsTransaction } from './types';

const db = admin.firestore();

/**
 * Generate a unique redemption code
 * Format: XXXX-XXXX-XXXX (12 alphanumeric characters)
 */
function generateRedemptionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 3;
  const segmentLength = 4;
  
  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () => {
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');
  }).join('-');
  
  return code;
}

/**
 * Placeholder function to integrate with partner APIs
 * In production, this would make actual API calls to partner systems
 */
async function integrateWithPartnerAPI(
  voucher: Voucher,
  redemptionCode: string,
  userId: string
): Promise<{ success: boolean; partnerReference?: string }> {
  // Placeholder for partner API integration
  // In production, this would:
  // 1. Call the partner's API endpoint
  // 2. Register the voucher redemption
  // 3. Get confirmation and reference number
  // 4. Handle partner-specific logic
  
  functions.logger.info('Partner API integration placeholder', {
    voucherId: voucher.id,
    brandName: voucher.brandName,
    redemptionCode,
    userId,
    endpoint: voucher.partnerApiEndpoint,
  });

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Return mock success response
  return {
    success: true,
    partnerReference: `PARTNER-${Date.now()}`,
  };
}

/**
 * Cloud Function to process voucher redemptions
 * Validates points, deducts from user balance, and generates redemption code
 */
export const redeemVoucher = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to redeem vouchers'
    );
  }

  const { voucherId } = data;
  const userId = context.auth.uid;

  if (!voucherId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Voucher ID is required'
    );
  }

  try {
    // Use transaction to ensure atomic operations
    const result = await db.runTransaction(async (transaction) => {
      const voucherRef = db.collection('vouchers').doc(voucherId);
      const userRef = db.collection('users').doc(userId);

      const [voucherDoc, userDoc] = await Promise.all([
        transaction.get(voucherRef),
        transaction.get(userRef),
      ]);

      if (!voucherDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Voucher not found');
      }

      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found');
      }

      const voucher = voucherDoc.data() as Voucher;
      const user = userDoc.data() as User;

      // Validate voucher is active
      if (!voucher.isActive) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Voucher is not currently available'
        );
      }

      // Check if voucher has expired
      if (voucher.expiryDate && voucher.expiryDate < admin.firestore.Timestamp.now()) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Voucher has expired'
        );
      }

      // Check stock availability
      if (voucher.stock <= 0) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Voucher is out of stock'
        );
      }

      // Validate user has sufficient points
      if (user.compassionPoints < voucher.pointsCost) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `Insufficient points. Required: ${voucher.pointsCost}, Available: ${user.compassionPoints}`
        );
      }

      // Generate unique redemption code
      const redemptionCode = generateRedemptionCode();

      // Calculate expiry date (30 days from redemption)
      const expiresAt = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );

      // Deduct points from user
      const newPointsBalance = user.compassionPoints - voucher.pointsCost;
      transaction.update(userRef, {
        compassionPoints: newPointsBalance,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update voucher stock
      transaction.update(voucherRef, {
        stock: voucher.stock - 1,
      });

      // Create redemption record
      const redemptionRef = db.collection('redemptions').doc();
      const redemption: Omit<Redemption, 'id'> = {
        userId,
        voucherId,
        pointsSpent: voucher.pointsCost,
        redemptionCode,
        status: 'pending',
        redeemedAt: admin.firestore.Timestamp.now(),
        expiresAt,
      };
      transaction.set(redemptionRef, redemption);

      // Create points transaction record
      const transactionRef = db.collection('pointsTransactions').doc();
      const pointsTransaction: Omit<PointsTransaction, 'id'> = {
        userId,
        amount: -voucher.pointsCost,
        type: 'voucher_redemption',
        relatedId: voucherId,
        description: `Redeemed voucher: ${voucher.title}`,
        timestamp: admin.firestore.Timestamp.now(),
      };
      transaction.set(transactionRef, pointsTransaction);

      return {
        redemptionId: redemptionRef.id,
        redemptionCode,
        voucher,
        newPointsBalance,
      };
    });

    // After transaction completes, integrate with partner API
    // This is done outside the transaction to avoid holding locks during external API calls
    try {
      const partnerResult = await integrateWithPartnerAPI(
        result.voucher,
        result.redemptionCode,
        userId
      );

      if (partnerResult.success) {
        // Update redemption status to 'issued'
        await db.collection('redemptions').doc(result.redemptionId).update({
          status: 'issued',
          partnerReference: partnerResult.partnerReference,
        });
      }
    } catch (partnerError) {
      // Log partner API error but don't fail the redemption
      // The redemption is already recorded and points deducted
      functions.logger.error('Partner API integration failed:', partnerError);
      // In production, you might want to implement retry logic or manual reconciliation
    }

    return {
      success: true,
      redemptionCode: result.redemptionCode,
      pointsSpent: result.voucher.pointsCost,
      newBalance: result.newPointsBalance,
      expiresAt: result.voucher.expiryDate,
      message: 'Voucher redeemed successfully',
    };
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    functions.logger.error('Error redeeming voucher:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to redeem voucher'
    );
  }
});

/**
 * Cloud Function to mark a voucher as used
 * Called when user actually uses the voucher at partner location
 */
export const markVoucherAsUsed = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { redemptionId } = data;
  const userId = context.auth.uid;

  if (!redemptionId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Redemption ID is required'
    );
  }

  try {
    const redemptionRef = db.collection('redemptions').doc(redemptionId);
    const redemptionDoc = await redemptionRef.get();

    if (!redemptionDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Redemption not found');
    }

    const redemption = redemptionDoc.data() as Redemption;

    // Verify ownership
    if (redemption.userId !== userId) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'You do not have permission to use this voucher'
      );
    }

    // Check if already used
    if (redemption.status === 'used') {
      throw new functions.https.HttpsError(
        'already-exists',
        'Voucher has already been used'
      );
    }

    // Check if expired
    if (redemption.status === 'expired' || redemption.expiresAt < admin.firestore.Timestamp.now()) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Voucher has expired'
      );
    }

    // Mark as used
    await redemptionRef.update({
      status: 'used',
      usedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: 'Voucher marked as used',
    };
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    functions.logger.error('Error marking voucher as used:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to mark voucher as used'
    );
  }
});

/**
 * Scheduled function to expire old redemptions
 * Runs daily to check and mark expired vouchers
 */
export const expireOldRedemptions = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    try {
      // Query redemptions that are expired but not marked as such
      const expiredRedemptions = await db
        .collection('redemptions')
        .where('status', 'in', ['pending', 'issued'])
        .where('expiresAt', '<', now)
        .get();

      if (expiredRedemptions.empty) {
        functions.logger.info('No expired redemptions found');
        return null;
      }

      // Batch update expired redemptions
      const batch = db.batch();
      expiredRedemptions.docs.forEach((doc) => {
        batch.update(doc.ref, { status: 'expired' });
      });

      await batch.commit();

      functions.logger.info(`Expired ${expiredRedemptions.size} redemptions`);
      return null;
    } catch (error) {
      functions.logger.error('Error expiring redemptions:', error);
      throw error;
    }
  });
