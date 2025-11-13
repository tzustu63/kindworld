import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Badge } from './badge';

export type UserRole = 'user' | 'company' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  compassionPoints: number;
  totalVolunteerHours: number;
  badges: Badge[];
  followers: string[];
  following: string[];
  role: UserRole;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}
