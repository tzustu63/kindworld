import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Avatar } from '../components/Avatar';
import { PointsChart } from '../components/PointsChart';
import { LeaderboardList } from '../components/LeaderboardList';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { useMonitoring } from '../hooks/useMonitoring';
import { PointsHistory, LeaderboardEntry } from '../types';

const MONTHS = [
  'Sept 2025',
  'Aug 2025',
  'July 2025',
  'June 2025',
  'May 2025',
];

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const {
    pointsHistory,
    leaderboard,
    isLoading,
    isRefreshing,
    refresh,
  } = useDashboard();
  
  // Add monitoring
  useMonitoring({
    screenName: 'Dashboard',
    trackScreenView: true,
    measureLoadTime: true,
  });
  
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);

  const currentPoints = user?.compassionPoints || 0;
  
  // Calculate growth percentage from points history
  const calculateGrowthPercentage = (): number => {
    if (pointsHistory.length < 2) return 0;
    
    const currentMonthPoints = pointsHistory[pointsHistory.length - 1]?.points || 0;
    const previousMonthPoints = pointsHistory[0]?.points || 0;
    
    if (previousMonthPoints === 0) return 0;
    
    return Math.round(
      ((currentMonthPoints - previousMonthPoints) / previousMonthPoints) * 100
    );
  };

  const growthPercentage = calculateGrowthPercentage();

  const handleRefresh = async () => {
    await refresh();
  };

  // Show skeleton loader on initial load
  if (isLoading && pointsHistory.length === 0 && leaderboard.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <DashboardSkeleton />
      </SafeAreaView>
    );
  }

  // Use mock data as fallback if no real data is available
  const displayPointsHistory = pointsHistory.length > 0 ? pointsHistory : generateMockPointsHistory();
  const displayLeaderboard = leaderboard.length > 0 ? leaderboard : generateMockLeaderboard();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.menuButton}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
          
          <Text style={styles.title}>KindWorld</Text>
          
          <TouchableOpacity>
            <Avatar
              imageUrl={user?.photoURL}
              name={user?.displayName}
              size="small"
            />
          </TouchableOpacity>
        </View>

        {/* Month Selector Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthSelector}
          contentContainerStyle={styles.monthSelectorContent}
        >
          {MONTHS.map((month) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.monthPill,
                selectedMonth === month && styles.monthPillActive,
              ]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text
                style={[
                  styles.monthPillText,
                  selectedMonth === month && styles.monthPillTextActive,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Points Card */}
        <View style={styles.pointsCard}>
          <Text style={styles.pointsNumber}>
            {currentPoints.toLocaleString()}
          </Text>
          <Text style={styles.pointsLabel}>Points</Text>
          
          <View style={styles.growthContainer}>
            <Text style={styles.growthText}>
              +{growthPercentage}% month over month
            </Text>
          </View>
          
          <TouchableOpacity style={styles.exchangeButton}>
            <Text style={styles.exchangeButtonText}>Exchange Now!</Text>
          </TouchableOpacity>
        </View>

        {/* Points Statement Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Points Statement</Text>
          <PointsChart data={displayPointsHistory} />
        </View>

        {/* Leaderboard Section */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          <LeaderboardList data={displayLeaderboard} maxItems={10} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to generate mock 30-day points history
const generateMockPointsHistory = (): PointsHistory[] => {
  const history: PointsHistory[] = [];
  const today = new Date();
  const basePoints = 20000;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    
    // Generate increasing trend with some variation
    const progress = (29 - i) / 29;
    const variation = Math.sin(i * 0.5) * 1000;
    const points = Math.round(basePoints + progress * 8760 + variation);
    
    history.push({
      date: dateStr,
      points: points,
    });
  }
  
  return history;
};

// Helper function to generate mock leaderboard data
const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const names = [
    'Emma Johnson',
    'Michael Chen',
    'Sarah Williams',
    'David Kim',
    'Jessica Martinez',
    'James Anderson',
    'Emily Taylor',
    'Daniel Lee',
    'Olivia Brown',
    'William Garcia',
  ];

  return names.map((name, index) => ({
    userId: `user-${index + 1}`,
    displayName: name,
    photoURL: undefined,
    compassionPoints: 35000 - index * 2500,
    rank: index + 1,
    change: index % 3 === 0 ? 2 : index % 3 === 1 ? -1 : 0,
  }));
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  menuButton: {
    width: 24,
    height: 24,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  hamburgerLine: {
    width: 24,
    height: 2,
    backgroundColor: colors.textPrimary,
    borderRadius: 1,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  monthSelector: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  monthSelectorContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  monthPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.gray100,
    marginRight: spacing.sm,
  },
  monthPillActive: {
    backgroundColor: colors.primary,
  },
  monthPillText: {
    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  monthPillTextActive: {
    color: colors.white,
  },
  pointsCard: {
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    alignItems: 'center',
  },
  pointsNumber: {
    ...typography.h1,
    fontSize: 48,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  pointsLabel: {
    ...typography.body1,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  growthText: {
    ...typography.body2,
    color: colors.success,
    fontWeight: '500',
  },
  exchangeButton: {
    marginTop: spacing.sm,
  },
  exchangeButtonText: {
    ...typography.button,
    color: colors.accent,
    fontWeight: '600',
  },
  chartSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  leaderboardSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
});

export default DashboardScreen;
