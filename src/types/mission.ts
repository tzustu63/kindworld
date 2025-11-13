import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type MissionCategory =
  | 'volunteer'
  | 'donation'
  | 'charity'
  | 'blood_drive'
  | 'other';

export type MissionStatus =
  | 'draft'
  | 'published'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export interface MissionLocation {
  address: string;
  city: string;
  coordinates: FirebaseFirestoreTypes.GeoPoint;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  date: FirebaseFirestoreTypes.Timestamp;
  location: MissionLocation;
  pointsReward: number;
  category: MissionCategory;
  sponsorId?: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: MissionStatus;
  createdBy: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}
