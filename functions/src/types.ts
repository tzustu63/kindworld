import { Timestamp } from 'firebase-admin/firestore';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  compassionPoints: number;
  totalVolunteerHours: number;
  badges: string[];
  followers: string[];
  following: string[];
  role: 'user' | 'company' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  date: Timestamp;
  location: {
    address: string;
    city: string;
    coordinates: admin.firestore.GeoPoint;
  };
  pointsReward: number;
  category: 'volunteer' | 'donation' | 'charity' | 'blood_drive' | 'other';
  sponsorId?: string;
  maxParticipants?: number;
  currentParticipants: number;
  participants: string[];
  completedParticipants: string[];
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'mission_completion' | 'voucher_redemption' | 'bonus' | 'adjustment';
  relatedId?: string;
  description: string;
  timestamp: Timestamp;
}

export interface Voucher {
  id: string;
  brandName: string;
  brandLogo: string;
  title: string;
  description: string;
  pointsCost: number;
  monetaryValue: number;
  category: '7-eleven' | 'familymart' | 'px-mart' | 'other';
  stock: number;
  expiryDate?: Timestamp;
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
  status: 'pending' | 'issued' | 'used' | 'expired';
  redeemedAt: Timestamp;
  usedAt?: Timestamp;
  expiresAt: Timestamp;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: {
    type: 'hours' | 'missions' | 'points' | 'streak';
    threshold: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  compassionPoints: number;
  rank: number;
  change: number;
  period: string;
}
