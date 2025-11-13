import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { SponsoredMissionMetrics } from '../types';

export interface MissionPerformanceTableProps {
  missions: SponsoredMissionMetrics[];
  onMissionPress?: (mission: SponsoredMissionMetrics) => void;
}

export const MissionPerformanceTable: React.FC<MissionPerformanceTableProps> = ({
  missions,
  onMissionPress,
}) => {
  const [selectedMission, setSelectedMission] = useState<SponsoredMissionMetrics | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'participants' | 'points' | 'engagement'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedMissions = [...missions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'participants':
        comparison = a.participants - b.participants;
        break;
      case 'points':
        comparison = a.pointsDistributed - b.pointsDistributed;
        break;
      case 'engagement':
        comparison = a.engagementScore - b.engagementScore;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleMissionPress = (mission: SponsoredMissionMetrics) => {
    setSelectedMission(mission);
    onMissionPress?.(mission);
  };

  const renderMissionRow = ({ item }: { item: SponsoredMissionMetrics }) => (
    <TouchableOpacity
      style={styles.missionRow}
      onPress={() => handleMissionPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.missionMainInfo}>
        <Text style={styles.missionTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.missionDate}>{item.date}</Text>
      </View>
      
      <View style={styles.missionMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Participants</Text>
          <Text style={styles.metricValue}>{item.participants}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Points</Text>
          <Text style={styles.metricValue}>{item.pointsDistributed}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Completion</Text>
          <Text style={styles.metricValue}>{item.completionRate}%</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Engagement</Text>
          <View style={styles.engagementBadge}>
            <Text style={styles.engagementText}>
              {item.engagementScore.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Sort Controls */}
      <View style={styles.sortControls}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
          onPress={() => handleSort('date')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'participants' && styles.sortButtonActive]}
          onPress={() => handleSort('participants')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'participants' && styles.sortButtonTextActive]}>
            Participants {sortBy === 'participants' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'engagement' && styles.sortButtonActive]}
          onPress={() => handleSort('engagement')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'engagement' && styles.sortButtonTextActive]}>
            Engagement {sortBy === 'engagement' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mission List */}
      <FlatList
        data={sortedMissions}
        renderItem={renderMissionRow}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Mission Detail Modal */}
      <Modal
        visible={selectedMission !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedMission(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMission && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Mission Details</Text>
                  <TouchableOpacity
                    onPress={() => setSelectedMission(null)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <Text style={styles.detailTitle}>{selectedMission.title}</Text>
                  <Text style={styles.detailDate}>{selectedMission.date}</Text>
                  
                  <View style={styles.detailMetrics}>
                    <View style={styles.detailMetricCard}>
                      <Text style={styles.detailMetricValue}>
                        {selectedMission.participants}
                      </Text>
                      <Text style={styles.detailMetricLabel}>Participants</Text>
                    </View>
                    
                    <View style={styles.detailMetricCard}>
                      <Text style={styles.detailMetricValue}>
                        {selectedMission.pointsDistributed}
                      </Text>
                      <Text style={styles.detailMetricLabel}>Points Distributed</Text>
                    </View>
                    
                    <View style={styles.detailMetricCard}>
                      <Text style={styles.detailMetricValue}>
                        {selectedMission.completionRate}%
                      </Text>
                      <Text style={styles.detailMetricLabel}>Completion Rate</Text>
                    </View>
                    
                    <View style={styles.detailMetricCard}>
                      <Text style={styles.detailMetricValue}>
                        {selectedMission.engagementScore.toFixed(1)}
                      </Text>
                      <Text style={styles.detailMetricLabel}>Engagement Score</Text>
                    </View>
                  </View>
                  
                  <View style={styles.comparisonSection}>
                    <Text style={styles.comparisonTitle}>Performance Analysis</Text>
                    <Text style={styles.comparisonText}>
                      This mission had {selectedMission.participants} participants, which is{' '}
                      {selectedMission.participants > 50 ? 'above' : 'below'} average.
                    </Text>
                    <Text style={styles.comparisonText}>
                      Engagement score of {selectedMission.engagementScore.toFixed(1)} indicates{' '}
                      {selectedMission.engagementScore > 7 ? 'high' : selectedMission.engagementScore > 5 ? 'moderate' : 'low'}{' '}
                      participant engagement.
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sortControls: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sortButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray100,
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
  },
  sortButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: colors.white,
  },
  missionRow: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  missionMainInfo: {
    marginBottom: spacing.md,
  },
  missionTitle: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  missionDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  missionMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metricValue: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  engagementBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  engagementText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  separator: {
    height: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  modalBody: {
    padding: spacing.md,
  },
  detailTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  detailDate: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  detailMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  detailMetricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  detailMetricValue: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  detailMetricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  comparisonSection: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  comparisonTitle: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  comparisonText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
});
