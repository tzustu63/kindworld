import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useMissions } from '../hooks';
import { Button } from '../components';

const MissionDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { missionId } = route.params as { missionId: string };
  const { missions, loading, getMissionById } = useMissions();

  const mission = missions.find(m => m.id === missionId);

  useEffect(() => {
    if (!mission) {
      getMissionById(missionId);
    }
  }, [missionId]);

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleJoinMission = () => {
    // TODO: Implement join mission logic
    console.log('Join mission:', missionId);
  };

  if (loading || !mission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mission Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        {mission.imageUrls.length > 0 && (
          <Image
            source={{ uri: mission.imageUrls[0] }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View style={styles.detailsContainer}>
          {/* Title */}
          <Text style={styles.missionTitle}>{mission.title}</Text>

          {/* Date and Location */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>{formatDate(mission.date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{mission.location.address}</Text>
          </View>

          {/* Points Badge */}
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>
              +{mission.pointsReward} Compassion Points
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>About this Mission</Text>
          <Text style={styles.description}>{mission.description}</Text>

          {/* Participants */}
          <Text style={styles.sectionTitle}>Participants</Text>
          <Text style={styles.participantsText}>
            {mission.currentParticipants}
            {mission.maxParticipants && ` / ${mission.maxParticipants}`} joined
          </Text>
        </View>
      </ScrollView>

      {/* Join Button */}
      <View style={styles.footer}>
        <Button
          title="Join Mission"
          onPress={handleJoinMission}
          disabled={
            mission.maxParticipants
              ? mission.currentParticipants >= mission.maxParticipants
              : false
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  detailsContainer: {
    padding: spacing.lg,
  },
  missionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  infoText: {
    ...typography.body1,
    color: colors.textSecondary,
    flex: 1,
  },
  pointsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
  },
  pointsText: {
    ...typography.button,
    fontSize: 14,
    color: colors.white,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  participantsText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});

export default MissionDetailScreen;
