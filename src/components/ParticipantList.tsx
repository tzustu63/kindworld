import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Avatar, Card } from './';
import { colors, spacing, typography } from '../theme';

export interface Participant {
  userId: string;
  displayName: string;
  photoURL?: string;
  joinedAt: Date;
  completedAt?: Date;
  status: 'joined' | 'completed' | 'cancelled';
}

export interface ParticipantListProps {
  participants: Participant[];
  onParticipantPress?: (participant: Participant) => void;
  loading?: boolean;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  onParticipantPress,
  loading = false,
}) => {
  const getStatusColor = (status: Participant['status']) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'joined':
        return colors.info;
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray500;
    }
  };

  const getStatusLabel = (status: Participant['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'joined':
        return 'Joined';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const renderParticipant = ({ item }: { item: Participant }) => (
    <TouchableOpacity
      onPress={() => onParticipantPress?.(item)}
      disabled={!onParticipantPress}
      activeOpacity={0.7}
    >
      <Card style={styles.participantCard}>
        <View style={styles.participantContent}>
          <Avatar
            uri={item.photoURL}
            name={item.displayName}
            size={48}
          />
          <View style={styles.participantInfo}>
            <Text style={styles.participantName}>{item.displayName}</Text>
            <Text style={styles.participantDate}>
              Joined: {item.joinedAt.toLocaleDateString()}
            </Text>
            {item.completedAt && (
              <Text style={styles.participantDate}>
                Completed: {item.completedAt.toLocaleDateString()}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No participants yet</Text>
    </View>
  );

  return (
    <FlatList
      data={participants}
      renderItem={renderParticipant}
      keyExtractor={item => item.userId}
      ListEmptyComponent={renderEmptyState}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.md,
  },
  participantCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  participantContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  participantName: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  participantDate: {
    ...typography.caption,
    color: colors.textSecondary,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
});
