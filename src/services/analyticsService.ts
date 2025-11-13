import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import firestore from '@react-native-firebase/firestore';
import { CSRMetrics, DateRange, ParticipationData, CategoryData, GeographicData, SponsoredMissionMetrics } from '../types';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getCSRMetrics: builder.query<CSRMetrics, { companyId: string; dateRange: DateRange }>({
      async queryFn({ companyId, dateRange }) {
        try {
          const startTimestamp = firestore.Timestamp.fromDate(dateRange.startDate);
          const endTimestamp = firestore.Timestamp.fromDate(dateRange.endDate);

          // Fetch sponsored missions for the company
          const missionsSnapshot = await firestore()
            .collection('missions')
            .where('sponsorId', '==', companyId)
            .where('createdAt', '>=', startTimestamp)
            .where('createdAt', '<=', endTimestamp)
            .get();

          const missions = missionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Calculate total participants
          let totalParticipants = 0;
          let totalPointsDistributed = 0;
          const categoryMap = new Map<string, number>();
          const cityMap = new Map<string, number>();
          const participationByDate = new Map<string, number>();

          const sponsoredMissions: SponsoredMissionMetrics[] = [];

          for (const mission of missions) {
            // Fetch participants for each mission
            const participantsSnapshot = await firestore()
              .collection('missions')
              .doc(mission.id)
              .collection('participants')
              .get();

            const participantCount = participantsSnapshot.size;
            totalParticipants += participantCount;

            const pointsForMission = mission.pointsReward * participantCount;
            totalPointsDistributed += pointsForMission;

            // Track categories
            const category = mission.category || 'other';
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);

            // Track cities
            const city = mission.location?.city || 'Unknown';
            cityMap.set(city, (cityMap.get(city) || 0) + participantCount);

            // Track participation by date
            const dateStr = mission.date?.toDate?.()?.toLocaleDateString() || 'Unknown';
            participationByDate.set(dateStr, (participationByDate.get(dateStr) || 0) + participantCount);

            // Calculate engagement metrics
            const completionRate = participantCount > 0 
              ? Math.min(100, (participantCount / (mission.maxParticipants || participantCount)) * 100)
              : 0;
            
            const engagementScore = calculateEngagementScore(
              participantCount,
              completionRate,
              pointsForMission
            );

            sponsoredMissions.push({
              id: mission.id,
              title: mission.title,
              date: dateStr,
              participants: participantCount,
              pointsDistributed: pointsForMission,
              completionRate: Math.round(completionRate),
              engagementScore,
            });
          }

          // Calculate impact score (0-10 scale)
          const impactScore = calculateImpactScore(
            totalParticipants,
            totalPointsDistributed,
            missions.length
          );

          // Format participation over time
          const participationOverTime: ParticipationData[] = Array.from(participationByDate.entries())
            .map(([date, participants]) => ({ date, participants }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          // Format mission categories
          const totalMissions = missions.length;
          const missionCategories: CategoryData[] = Array.from(categoryMap.entries())
            .map(([category, count]) => ({
              category: formatCategoryName(category),
              count,
              percentage: (count / totalMissions) * 100,
            }))
            .sort((a, b) => b.count - a.count);

          // Format geographic distribution
          const geographicDistribution: GeographicData[] = Array.from(cityMap.entries())
            .map(([city, participants]) => ({ city, participants }))
            .sort((a, b) => b.participants - a.participants);

          const metrics: CSRMetrics = {
            totalParticipants,
            totalPointsDistributed,
            totalMissionsSponsored: missions.length,
            impactScore,
            participationOverTime,
            missionCategories,
            geographicDistribution,
            sponsoredMissions,
          };

          return { data: metrics };
        } catch (error) {
          console.error('Error fetching CSR metrics:', error);
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to fetch analytics data',
            },
          };
        }
      },
      providesTags: ['Analytics'],
    }),

    getMissionAnalytics: builder.query<SponsoredMissionMetrics, string>({
      async queryFn(missionId) {
        try {
          const missionDoc = await firestore()
            .collection('missions')
            .doc(missionId)
            .get();

          if (!missionDoc.exists) {
            throw new Error('Mission not found');
          }

          const mission = missionDoc.data();
          
          const participantsSnapshot = await firestore()
            .collection('missions')
            .doc(missionId)
            .collection('participants')
            .get();

          const participantCount = participantsSnapshot.size;
          const pointsDistributed = (mission?.pointsReward || 0) * participantCount;
          
          const completionRate = participantCount > 0 
            ? Math.min(100, (participantCount / (mission?.maxParticipants || participantCount)) * 100)
            : 0;
          
          const engagementScore = calculateEngagementScore(
            participantCount,
            completionRate,
            pointsDistributed
          );

          const metrics: SponsoredMissionMetrics = {
            id: missionId,
            title: mission?.title || 'Unknown Mission',
            date: mission?.date?.toDate?.()?.toLocaleDateString() || 'Unknown',
            participants: participantCount,
            pointsDistributed,
            completionRate: Math.round(completionRate),
            engagementScore,
          };

          return { data: metrics };
        } catch (error) {
          console.error('Error fetching mission analytics:', error);
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to fetch mission analytics',
            },
          };
        }
      },
    }),
  }),
});

// Helper function to calculate engagement score (0-10 scale)
function calculateEngagementScore(
  participants: number,
  completionRate: number,
  pointsDistributed: number
): number {
  // Weighted formula: 40% participants, 30% completion rate, 30% points
  const participantScore = Math.min(10, (participants / 100) * 10);
  const completionScore = (completionRate / 100) * 10;
  const pointsScore = Math.min(10, (pointsDistributed / 10000) * 10);
  
  return (participantScore * 0.4 + completionScore * 0.3 + pointsScore * 0.3);
}

// Helper function to calculate overall impact score (0-10 scale)
function calculateImpactScore(
  totalParticipants: number,
  totalPoints: number,
  totalMissions: number
): number {
  // Weighted formula based on scale and reach
  const participantScore = Math.min(10, (totalParticipants / 500) * 10);
  const pointsScore = Math.min(10, (totalPoints / 50000) * 10);
  const missionScore = Math.min(10, (totalMissions / 20) * 10);
  
  return (participantScore * 0.4 + pointsScore * 0.3 + missionScore * 0.3);
}

// Helper function to format category names
function formatCategoryName(category: string): string {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const {
  useGetCSRMetricsQuery,
  useGetMissionAnalyticsQuery,
  useLazyGetCSRMetricsQuery,
} = analyticsApi;
