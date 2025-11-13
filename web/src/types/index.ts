export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  bio?: string
  compassionPoints: number
  totalVolunteerHours: number
  badges: Badge[]
  followers: string[]
  following: string[]
  role: 'user' | 'company' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface Mission {
  id: string
  title: string
  description: string
  imageUrls: string[]
  date: string
  location: {
    address: string
    city: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  pointsReward: number
  category: MissionCategory
  sponsorId?: string
  maxParticipants?: number
  currentParticipants: number
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type MissionCategory = 'volunteer' | 'donation' | 'charity' | 'blood_drive' | 'other'

export interface PointsTransaction {
  id: string
  userId: string
  amount: number
  type: 'mission_completion' | 'voucher_redemption' | 'bonus' | 'adjustment'
  relatedId?: string
  description: string
  timestamp: string
}

export interface Voucher {
  id: string
  brandName: string
  brandLogo: string
  title: string
  description: string
  pointsCost: number
  monetaryValue: number
  category: VoucherCategory
  stock: number
  expiryDate?: string
  termsAndConditions: string
  isActive: boolean
}

export type VoucherCategory = '7-eleven' | 'familymart' | 'px-mart' | 'other'

export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
  criteria: {
    type: 'hours' | 'missions' | 'points' | 'streak'
    threshold: number
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface LeaderboardEntry {
  userId: string
  displayName: string
  photoURL?: string
  compassionPoints: number
  rank: number
  change: number
}

export interface PointsHistory {
  date: string
  points: number
}
