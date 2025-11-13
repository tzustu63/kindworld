import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type VoucherCategory = '7-eleven' | 'familymart' | 'px-mart' | 'other';

export type RedemptionStatus = 'pending' | 'issued' | 'used' | 'expired';

export interface Voucher {
  id: string;
  brandName: string;
  brandLogo: string;
  title: string;
  description: string;
  pointsCost: number;
  monetaryValue: number;
  category: VoucherCategory;
  stock: number;
  expiryDate?: FirebaseFirestoreTypes.Timestamp;
  termsAndConditions: string;
  partnerApiEndpoint?: string;
  isActive: boolean;
}

export interface Redemption {
  id: string;
  userId: string;
  voucherId: string;
  pointsSpent: number;
  redemptionCode: string;
  status: RedemptionStatus;
  redeemedAt: FirebaseFirestoreTypes.Timestamp;
  usedAt?: FirebaseFirestoreTypes.Timestamp;
  expiresAt: FirebaseFirestoreTypes.Timestamp;
}
