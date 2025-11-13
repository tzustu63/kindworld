import { User, UserRole } from './user';
import { Mission, MissionCategory, MissionStatus } from './mission';
import { PointsTransaction, PointsHistory } from './points';
import { Voucher, Redemption } from './voucher';
import { Badge } from './badge';
import { LeaderboardEntry } from './leaderboard';
import { Company } from './company';

// ============================================================================
// Authentication API Types
// ============================================================================

export interface EmailSignInRequest {
  email: string;
  password?: string;
}

export interface EmailSignInResponse {
  user: User;
  token: string;
}

export interface OAuthSignInRequest {
  provider: 'google' | 'apple';
  idToken: string;
}

export interface OAuthSignInResponse {
  user: User;
  token: string;
}

export interface SessionResponse {
  user: User;
  isValid: boolean;
}

// ============================================================================
// User API Types
// ============================================================================

export interface GetUserRequest {
  userId: string;
}

export interface GetUserResponse {
  user: User;
}

export interface UpdateUserRequest {
  userId: string;
  displayName?: string;
  bio?: string;
  photoURL?: string;
}

export interface UpdateUserResponse {
  user: User;
}

export interface GetUserPointsRequest {
  userId: string;
  startDate?: string;
  endDate?: string;
}

export interface GetUserPointsResponse {
  currentPoints: number;
  history: PointsHistory[];
  transactions: PointsTransaction[];
}

export interface GetUserBadgesRequest {
  userId: string;
}

export interface GetUserBadgesResponse {
  badges: Badge[];
  totalVolunteerHours: number;
}

export interface GetUserMissionsRequest {
  userId: string;
  status?: MissionStatus;
  limit?: number;
  offset?: number;
}

export interface GetUserMissionsResponse {
  missions: Mission[];
  total: number;
}

// ============================================================================
// Mission API Types
// ============================================================================

export interface ListMissionsRequest {
  category?: MissionCategory;
  status?: MissionStatus;
  city?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'relevance' | 'distance';
  limit?: number;
  offset?: number;
}

export interface ListMissionsResponse {
  missions: Mission[];
  total: number;
  hasMore: boolean;
}

export interface GetMissionRequest {
  missionId: string;
}

export interface GetMissionResponse {
  mission: Mission;
}

export interface CreateMissionRequest {
  title: string;
  description: string;
  imageUrls: string[];
  date: string;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  pointsReward: number;
  category: MissionCategory;
  sponsorId?: string;
  maxParticipants?: number;
}

export interface CreateMissionResponse {
  mission: Mission;
}

export interface UpdateMissionRequest {
  missionId: string;
  title?: string;
  description?: string;
  imageUrls?: string[];
  date?: string;
  location?: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  pointsReward?: number;
  category?: MissionCategory;
  maxParticipants?: number;
  status?: MissionStatus;
}

export interface UpdateMissionResponse {
  mission: Mission;
}

export interface DeleteMissionRequest {
  missionId: string;
}

export interface DeleteMissionResponse {
  success: boolean;
}

export interface JoinMissionRequest {
  missionId: string;
  userId: string;
}

export interface JoinMissionResponse {
  success: boolean;
  mission: Mission;
}

export interface CompleteMissionRequest {
  missionId: string;
  userId: string;
}

export interface CompleteMissionResponse {
  success: boolean;
  pointsAwarded: number;
  transaction: PointsTransaction;
}

// ============================================================================
// Points API Types
// ============================================================================

export interface GetTransactionsRequest {
  userId: string;
  type?: PointsTransaction['type'];
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface GetTransactionsResponse {
  transactions: PointsTransaction[];
  total: number;
}

export interface AwardPointsRequest {
  userId: string;
  amount: number;
  type: PointsTransaction['type'];
  relatedId?: string;
  description: string;
}

export interface AwardPointsResponse {
  transaction: PointsTransaction;
  newBalance: number;
}

export interface GetLeaderboardRequest {
  limit?: number;
  period?: 'daily' | 'weekly' | 'monthly' | 'all-time';
}

export interface GetLeaderboardResponse {
  entries: LeaderboardEntry[];
  userRank?: number;
}

// ============================================================================
// Voucher API Types
// ============================================================================

export interface ListVouchersRequest {
  category?: Voucher['category'];
  minPoints?: number;
  maxPoints?: number;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface ListVouchersResponse {
  vouchers: Voucher[];
  total: number;
}

export interface GetVoucherRequest {
  voucherId: string;
}

export interface GetVoucherResponse {
  voucher: Voucher;
}

export interface RedeemVoucherRequest {
  voucherId: string;
  userId: string;
}

export interface RedeemVoucherResponse {
  redemption: Redemption;
  remainingPoints: number;
}

export interface GetRedemptionsRequest {
  userId: string;
  status?: Redemption['status'];
  limit?: number;
  offset?: number;
}

export interface GetRedemptionsResponse {
  redemptions: Redemption[];
  total: number;
}

// ============================================================================
// Analytics API Types (Company)
// ============================================================================

export interface CSRMetrics {
  totalParticipants: number;
  totalPointsDistributed: number;
  totalMissionsSponsored: number;
  impactScore: number;
  participationOverTime: Array<{
    date: string;
    participants: number;
  }>;
  missionsByCategory: Array<{
    category: MissionCategory;
    count: number;
  }>;
  geographicDistribution: Array<{
    city: string;
    participants: number;
  }>;
}

export interface GetCompanyAnalyticsRequest {
  companyId: string;
  startDate?: string;
  endDate?: string;
}

export interface GetCompanyAnalyticsResponse {
  metrics: CSRMetrics;
  company: Company;
}

export interface GetMissionAnalyticsRequest {
  missionId: string;
}

export interface MissionAnalytics {
  missionId: string;
  totalParticipants: number;
  completionRate: number;
  pointsDistributed: number;
  averageRating?: number;
  participantDemographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
  };
}

export interface GetMissionAnalyticsResponse {
  analytics: MissionAnalytics;
}

export interface ExportAnalyticsRequest {
  companyId: string;
  format: 'csv' | 'pdf';
  startDate?: string;
  endDate?: string;
}

export interface ExportAnalyticsResponse {
  downloadUrl: string;
  expiresAt: string;
}

// ============================================================================
// Admin API Types
// ============================================================================

export interface ListAllUsersRequest {
  role?: UserRole;
  limit?: number;
  offset?: number;
  searchQuery?: string;
}

export interface ListAllUsersResponse {
  users: User[];
  total: number;
}

export interface ListAllMissionsRequest {
  status?: MissionStatus;
  sponsorId?: string;
  limit?: number;
  offset?: number;
}

export interface ListAllMissionsResponse {
  missions: Mission[];
  total: number;
}

export interface GenerateReportRequest {
  reportType: 'user-engagement' | 'mission-performance' | 'points-distribution';
  startDate?: string;
  endDate?: string;
}

export interface GenerateReportResponse {
  reportUrl: string;
  generatedAt: string;
}

export interface CreateBadgeRequest {
  name: string;
  description: string;
  iconUrl: string;
  criteria: {
    type: Badge['criteria']['type'];
    threshold: number;
  };
  rarity: Badge['rarity'];
}

export interface CreateBadgeResponse {
  badge: Badge;
}

// ============================================================================
// Common API Types
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
