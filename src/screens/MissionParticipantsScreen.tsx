import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchMissionParticipants } from '../store/slices/adminSlice';
import { ParticipantList, Participant } from '../components/ParticipantList';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { Card } from '../components';

type MissionParticipantsRouteProp = RouteProp<
  RootStackParamList & { MissionParticipants: { missionId: string } },
  'MissionParticipants'
>;

const MissionParticipantsScreen: React.FC = () => {
  const route = useRoute<MissionParticipantsRouteProp>();
  const dispatch = useAppDispatch();

  const { participants, analytics, loading } = useAppSelector(
    state => state.admin
  );

  const missionId = route.params?.missionId;
  const missionParticipants = participants[missionId] || [];
  const missionAnalytics = analytics[missionId];

  const [filter, setFilter] = useState<'all' | 'joined' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (missionId) {
      dispatch(fetchMissionParticipants(missionId));
    }
  }, [missionId]);

  const filteredParticipants = missionParticipants.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const handleParticipantPress = (participant: Participant) => {
    Alert.alert(
      participant.displayName,
      `Status: ${participant.status}\nJoined: ${participant.joinedAt.toLocaleString()}${
        participant.completedAt
          ? `\nCompleted: ${participant.completedAt.toLocaleString()}`
          : ''
      }`
    );
  };

  const handleExportParticipants = () => {
    // Export functionality would go here
    Alert.alert('Export', 'Export functionality coming soon');
  };

  if (loading && missionParticipants.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      {missionAnalytics && (
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Participant Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {missionAnalytics.totalParticipants}
              </Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {missionAnalytics.completedParticipants}
              </Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {missionAnalytics.engagementRate.toFixed(0)}%
              </Text>
              <Text style={styles.summaryLabel}>Engagement</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive,
            ]}
          >
            All ({missionParticipants.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'joined' && styles.filterButtonActive]}
          onPress={() => setFilter('joined')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'joined' && styles.filterButtonTextActive,
            ]}
          >
            Joined ({missionParticipants.filter(p => p.status === 'joined').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'completed' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'completed' && styles.filterButtonTextActive,
            ]}
          >
            Completed ({missionParticipants.filter(p => p.status === 'completed').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton} onPress={handleExportParticipants}>
        <Text style={styles.exportButtonText}>Export Participants</Text>
      </TouchableOpacity>

      {/* Participant List */}
      <ParticipantList
        participants={filteredParticipants}
        onParticipantPress={handleParticipantPress}
        loading={loading}
      />
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
  summaryCard: {
    margin: spacing.md,
    padding: spacing.md,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
  filterButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  exportButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.accent,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    ...typography.button,
    color: colors.white,
  },
});

export default MissionParticipantsScreen;
