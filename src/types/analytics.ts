export interface CSRMetrics {
  totalParticipants: number;
  totalPointsDistributed: number;
  totalMissionsSponsored: number;
  impactScore: number;
  participationOverTime: ParticipationData[];
  missionCategories: CategoryData[];
  geographicDistribution: GeographicData[];
  sponsoredMissions: SponsoredMissionMetrics[];
}

export interface ParticipationData {
  date: string;
  participants: number;
}

export interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

export interface GeographicData {
  city: string;
  participants: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface SponsoredMissionMetrics {
  id: string;
  title: string;
  date: string;
  participants: number;
  pointsDistributed: number;
  completionRate: number;
  engagementScore: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
