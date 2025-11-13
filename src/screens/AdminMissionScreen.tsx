import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchAllMissions,
  fetchMissionAnalytics,
  setSelectedMission,
} from '../store/slices/adminSlice';
import { Mission, MissionStatus } from '../types';
import { colors, spacing, typography, shadows } from '../theme';
import { Card } from '../components';

interface MissionListItemProps {
  mission: Mission;
  onPress: () => void;
  analytics?: {
    totalParticipants: number;
    completedParticipants: number;
    totalPointsAwarded: number;
    engagementRate: number;
  };
}

const MissionListItem: React.FC<MissionListItemProps> = ({
  mission,
  onPress,
  analytics,
}) => {
  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case 'draft':
        return colors.gray500;
      case 'published':
        return colors.info;
      case 'ongoing':
        return colors.accent;
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray500;
    }
  };

  const getStatusLabel = (status: MissionStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.missionCard}>
        <View style={styles.missionHeader}>
          <View style={styles.missionTitleContainer}>
            <Text style={styles.missionTitle} numberOfLines={2}>
              {mission.title}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(mission.status) },
              ]}
            >
              <Text style={styles.statusText}>{getStatusLabel(mission.status)}</Text>
            </View>
          </View>
          <Text style={styles.missionDate}>
            {mission.date.toDate().toLocaleDateString()}
          </Text>
        </View>

        {analytics && (
          <View style={styles.analyticsContainer}>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticValue}>{analytics.totalParticipants}</Text>
              <Text style={styles.analyticLabel}>Participants</Text>
            </View>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticValue}>{analytics.completedParticipants}</Text>
              <Text style={styles.analyticLabel}>Completed</Text>
            </View>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticValue}>{analytics.totalPointsAwarded}</Text>
              <Text style={styles.analyticLabel}>Points Awarded</Text>
            </View>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticValue}>
                {analytics.engagementRate.toFixed(0)}%
              </Text>
              <Text style={styles.analyticLabel}>Engagement</Text>
            </View>
          </View>
        )}

        <View style={styles.missionFooter}>
          <Text style={styles.missionLocation}>{mission.location.city}</Text>
          <Text style={styles.missionPoints}>{mission.pointsReward} pts</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const AdminMissionScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { missions, analytics, loading, error } = useAppSelector(
    state => state.admin
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    await dispatch(fetchAllMissions());
    // Load analytics for each mission
    missions.forEach(mission => {
      if (!analytics[mission.id]) {
        dispatch(fetchMissionAnalytics(mission.id));
      }
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMissions();
    setRefreshing(false);
  };

  const handleMissionPress = (mission: Mission) => {
    dispatch(setSelectedMission(mission));
    // Navigation to mission detail/edit screen would go here
  };

  const handleCreateMission = () => {
    dispatch(setSelectedMission(null));
    // Navigation to mission creation screen would go here
  };

  const renderMissionItem = ({ item }: { item: Mission }) => (
    <MissionListItem
      mission={item}
      onPress={() => handleMissionPress(item)}
      analytics={analytics[item.id]}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Missions Yet</Text>
      <Text style={styles.emptyStateText}>
        Create your first mission to start engaging volunteers
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Mission Management</Text>
      <Text style={styles.headerSubtitle}>
        {missions.length} {missions.length === 1 ? 'mission' : 'missions'}
      </Text>
    </View>
  );

  if (loading && missions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        renderItem={renderMissionItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateMission}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray100,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl + spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  missionCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  missionHeader: {
    marginBottom: spacing.md,
  },
  missionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  missionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
  },
  statusText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  missionDate: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  analyticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    marginBottom: spacing.md,
  },
  analyticItem: {
    alignItems: 'center',
  },
  analyticValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  analyticLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionLocation: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  missionPoints: {
    ...typography.button,
    color: colors.accent,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyStateTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  fabIcon: {
    fontSize: 32,
    color: colors.white,
    fontWeight: '300',
  },
  errorBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.error,
    padding: spacing.md,
  },
  errorText: {
    ...typography.body2,
    color: colors.white,
    textAlign: 'center',
  },
});

export default AdminMissionScreen;
