import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type PointsTransactionType =
  | 'mission_completion'
  | 'voucher_redemption'
  | 'bonus'
  | 'adjustment';

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  type: PointsTransactionType;
  relatedId?: string;
  description: string;
  timestamp: FirebaseFirestoreTypes.Timestamp;
}

export interface PointsHistory {
  date: string;
  points: number;
}
