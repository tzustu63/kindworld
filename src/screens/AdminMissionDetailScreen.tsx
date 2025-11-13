import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../store';
import {
  deleteMission,
  updateMissionStatus,
  fetchMissionAnalytics,
  fetchMissionParticipants,
  setSelectedMission,
} from '../store/slices/adminSlice';
import { Mission, MissionStatus } from '../types';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { Button, Card } from '../components';

type AdminMissionDetailRouteProp = RouteProp<
  RootStackParamList & { AdminMissionDetail: { missionId: string } },
  'AdminMissionDetail'
>;

type AdminMissionDetailNavigationProp = StackNavigationProp<
  RootStackParamList & { AdminMissionDetail: { missionId: string } }
>;

const AdminMissionDetailScreen: React.FC = () => {
  const navigation = useNavigation<AdminMissionDetailNavigationProp>();
  const route = useRoute<AdminMissionDetailRouteProp>();
  const dispatch = useAppDispatch();

  const { selectedMission, analytics, participants, loading } = useAppSelector(
    state => state.admin
  );

  const missionId = route.params?.missionId;

  useEffect(() => {
    if (missionId) {
      dispatch(fetchMissionAnalytics(missionId));
      dispatch(fetchMissionParticipants(missionId));
    }
  }, [missionId]);

  if (!selectedMission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Mission not found</Text>
      </View>
    );
  }

  const missionAnalytics = analytics[selectedMission.id];
  const missionParticipants = participants[selectedMission.id] || [];

  const handleEdit = () => {
    // Navigate to edit screen
    navigation.navigate('MissionForm' as any, { missionId: selectedMission.id });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Mission',
      'Are you sure you want to delete this mission? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMission(selectedMission.id)).unwrap();
              Alert.alert('Success', 'Mission deleted successfully');
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete mission');
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = (status: MissionStatus) => {
    const statusLabels: Record<MissionStatus, string> = {
      draft: 'Draft',
      published: 'Published',
      ongoing: 'Ongoing',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };

    Alert.alert(
      'Change Status',
      `Change mission status to ${statusLabels[status]}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await dispatch(
                updateMissionStatus({
                  missionId: selectedMission.id,
                  status,
                })
              ).unwrap();

              Alert.alert('Success', `Mission status changed to ${statusLabels[status]}`);
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to update status');
            }
          },
        },
      ]
    );
  };

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Image */}
      {selectedMission.imageUrls.length > 0 && (
        <Image
          source={{ uri: selectedMission.imageUrls[0] }}
          style={styles.headerImage}
        />
      )}

      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(selectedMission.status) },
        ]}
      >
        <Text style={styles.statusText}>
          {selectedMission.status.charAt(0).toUpperCase() +
            selectedMission.status.slice(1)}
        </Text>
      </View>

      {/* Title and Description */}
      <Text style={styles.title}>{selectedMission.title}</Text>
      <Text style={styles.description}>{selectedMission.description}</Text>

      {/* Mission Details */}
      <Card style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>
            {selectedMission.date.toDate().toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>
            {selectedMission.location.address}, {selectedMission.location.city}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Points Reward:</Text>
          <Text style={styles.detailValue}>{selectedMission.pointsReward}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{selectedMission.category}</Text>
        </View>
        {selectedMission.maxParticipants && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Max Participants:</Text>
            <Text style={styles.detailValue}>
              {selectedMission.currentParticipants} / {selectedMission.maxParticipants}
            </Text>
          </View>
        )}
      </Card>

      {/* Analytics */}
      {missionAnalytics && (
        <Card style={styles.analyticsCard}>
          <Text style={styles.cardTitle}>Analytics</Text>
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticValue}>
                {missionAnalytics.totalParticipants}
              </Text>
              <Text style={styles.analyticLabel}>Total Participants</Text>
            </View>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticValue}>
                {missionAnalytics.completedParticipants}
              </Text>
              <Text style={styles.analyticLabel}>Completed</Text>
            </View>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticValue}>
                {missionAnalytics.totalPointsAwarded}
              </Text>
              <Text style={styles.analyticLabel}>Points Awarded</Text>
            </View>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticValue}>
                {missionAnalytics.engagementRate.toFixed(0)}%
              </Text>
              <Text style={styles.analyticLabel}>Engagement Rate</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Status Management */}
      <Card style={styles.statusCard}>
        <Text style={styles.cardTitle}>Status Management</Text>
        <View style={styles.statusButtons}>
          <Button
            title="Draft"
            onPress={() => handleStatusChange('draft')}
            variant={selectedMission.status === 'draft' ? 'primary' : 'secondary'}
            disabled={loading || selectedMission.status === 'draft'}
            style={styles.statusButton}
          />
          <Button
            title="Publish"
            onPress={() => handleStatusChange('published')}
            variant={selectedMission.status === 'published' ? 'primary' : 'secondary'}
            disabled={loading || selectedMission.status === 'published'}
            style={styles.statusButton}
          />
          <Button
            title="Ongoing"
            onPress={() => handleStatusChange('ongoing')}
            variant={selectedMission.status === 'ongoing' ? 'primary' : 'secondary'}
            disabled={loading || selectedMission.status === 'ongoing'}
            style={styles.statusButton}
          />
          <Button
            title="Complete"
            onPress={() => handleStatusChange('completed')}
            variant={selectedMission.status === 'completed' ? 'primary' : 'secondary'}
            disabled={loading || selectedMission.status === 'completed'}
            style={styles.statusButton}
          />
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="Edit Mission"
          onPress={handleEdit}
          variant="secondary"
          disabled={loading}
          style={styles.actionButton}
        />
        <Button
          title="Delete Mission"
          onPress={handleDelete}
          variant="secondary"
          disabled={loading}
          style={[styles.actionButton, styles.deleteButton]}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    margin: spacing.md,
  },
  statusText: {
    ...typography.body2,
    color: colors.white,
    fontWeight: '600',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  detailsCard: {
    margin: spacing.md,
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  detailValue: {
    ...typography.body2,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  analyticsCard: {
    margin: spacing.md,
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  analyticValue: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  analyticLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statusCard: {
    margin: spacing.md,
    padding: spacing.md,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  errorText: {
    ...typography.body1,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});

export default AdminMissionDetailScreen;
