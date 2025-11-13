import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface CSRGoals {
  targetParticipants?: number;
  targetPoints?: number;
  targetMissions?: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  contactEmail: string;
  sponsoredMissions: string[];
  totalPointsSponsored: number;
  csrGoals: CSRGoals;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}
