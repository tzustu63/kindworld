import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Avatar } from '../components/Avatar';
import { LeaderboardList } from '../components/LeaderboardList';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { LeaderboardEntry } from '../types/leaderboard';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({
    displayName: '',
    bio: '',
  });

  // Mock leaderboard data - in production, this would come from a hook or API
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      userId: user?.id || '1',
      displayName: user?.displayName || 'You',
      photoURL: user?.photoURL,
      compassionPoints: user?.compassionPoints || 28760,
      rank: 1,
      change: 2,
    },
    {
      userId: '2',
      displayName: 'Sarah Chen',
      photoURL: undefined,
      compassionPoints: 27500,
      rank: 2,
      change: -1,
    },
    {
      userId: '3',
      displayName: 'Michael Johnson',
      photoURL: undefined,
      compassionPoints: 26800,
      rank: 3,
      change: 1,
    },
    {
      userId: '4',
      displayName: 'Emily Rodriguez',
      photoURL: undefined,
      compassionPoints: 25200,
      rank: 4,
      change: 0,
    },
    {
      userId: '5',
      displayName: 'David Kim',
      photoURL: undefined,
      compassionPoints: 24100,
      rank: 5,
      change: 3,
    },
  ];

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please sign in to view your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleEditProfile = () => {
    setEditForm({
      displayName: user?.displayName || '',
      bio: user?.bio || '',
    });
    setErrors({ displayName: '', bio: '' });
    setIsEditModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsEditModalVisible(false);
    setErrors({ displayName: '', bio: '' });
  };

  const validateForm = (): boolean => {
    const newErrors = { displayName: '', bio: '' };
    let isValid = true;

    if (!editForm.displayName.trim()) {
      newErrors.displayName = 'Name is required';
      isValid = false;
    } else if (editForm.displayName.trim().length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters';
      isValid = false;
    } else if (editForm.displayName.trim().length > 50) {
      newErrors.displayName = 'Name must be less than 50 characters';
      isValid = false;
    }

    if (editForm.bio.length > 200) {
      newErrors.bio = 'Bio must be less than 200 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Update user profile in Firestore
      await firestore()
        .collection('users')
        .doc(user.id)
        .update({
          displayName: editForm.displayName.trim(),
          bio: editForm.bio.trim(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert('Success', 'Profile updated successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async () => {
    // Placeholder for photo upload functionality
    // In production, this would use react-native-image-picker or similar
    Alert.alert(
      'Photo Upload',
      'Photo upload functionality will be implemented with image picker integration'
    );
  };

  const userRank = mockLeaderboard.find(entry => entry.userId === user.id)?.rank || 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.title}>KindWorld</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.displayName}</Text>
              <Text style={styles.userBio} numberOfLines={2}>
                {user.bio || 'No bio yet'}
              </Text>
              
              {/* Points and Social Stats */}
              <View style={styles.statsContainer}>
                <Text style={styles.pointsText}>
                  {user.compassionPoints.toLocaleString()} points
                </Text>
              </View>
              
              <View style={styles.socialStats}>
                <Text style={styles.statText}>
                  {user.followers.length} followers
                </Text>
                <Text style={styles.statDivider}>•</Text>
                <Text style={styles.statText}>
                  {user.following.length} following
                </Text>
              </View>

              {/* Edit Profile Link */}
              <TouchableOpacity onPress={handleEditProfile}>
                <Text style={styles.editLink}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Photo */}
            <Avatar
              imageUrl={user.photoURL}
              name={user.displayName}
              size="large"
              style={styles.profileAvatar}
            />
          </View>
        </View>

        {/* Badges Card */}
        <View style={styles.badgesCard}>
          <Text style={styles.sectionTitle}>Your Badges</Text>
          
          {/* Volunteer Hours */}
          <View style={styles.hoursContainer}>
            <Text style={styles.hoursText}>
              Completed {user.totalVolunteerHours} hours of volunteering
            </Text>
          </View>

          {/* Badges Grid */}
          {user.badges.length > 0 ? (
            <View style={styles.badgesGrid}>
              {user.badges.map((badge) => (
                <TouchableOpacity
                  key={badge.id}
                  style={styles.badgeItem}
                  onLongPress={() => {
                    // Show tooltip with badge criteria
                  }}
                >
                  <View style={[styles.badgeIcon, styles[`badge${badge.rarity}`]]}>
                    <Text style={styles.badgeEmoji}>🏆</Text>
                  </View>
                  <Text style={styles.badgeName} numberOfLines={2}>
                    {badge.name}
                  </Text>
                  <Text style={styles.badgeDescription} numberOfLines={1}>
                    {badge.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noBadgesContainer}>
              <Text style={styles.noBadgesText}>
                Complete missions to earn badges!
              </Text>
            </View>
          )}
        </View>

        {/* Leaderboard Card */}
        <View style={styles.leaderboardCard}>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <View style={styles.userRankBadge}>
              <Text style={styles.userRankText}>Your Rank: #{userRank}</Text>
            </View>
          </View>
          <LeaderboardList data={mockLeaderboard} maxItems={5} />
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCloseModal}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Profile Photo Section */}
              <View style={styles.photoSection}>
                <Avatar
                  imageUrl={user?.photoURL}
                  name={editForm.displayName}
                  size="large"
                />
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={handlePhotoUpload}
                >
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
                <Input
                  label="Name"
                  value={editForm.displayName}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, displayName: text })
                  }
                  error={errors.displayName}
                  placeholder="Enter your name"
                  maxLength={50}
                  autoCapitalize="words"
                />

                <Input
                  label="Bio"
                  value={editForm.bio}
                  onChangeText={(text) => setEditForm({ ...editForm, bio: text })}
                  error={errors.bio}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                  style={styles.bioInput}
                  helperText={`${editForm.bio.length}/200 characters`}
                />
              </View>

              {/* Save Button */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Save Changes"
                  onPress={handleSaveProfile}
                  loading={isSaving}
                  disabled={isSaving}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
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
  profileCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  userName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userBio: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  statsContainer: {
    marginBottom: spacing.sm,
  },
  pointsText: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.accent,
  },
  socialStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  statDivider: {
    ...typography.body2,
    color: colors.textSecondary,
    marginHorizontal: spacing.sm,
  },
  editLink: {
    ...typography.body2,
    color: colors.accent,
    fontWeight: '600',
  },
  profileAvatar: {
    alignSelf: 'flex-start',
  },
  badgesCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  hoursContainer: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  hoursText: {
    ...typography.body1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  badgeItem: {
    width: '33.33%',
    padding: spacing.xs,
    alignItems: 'center',
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  badgecommon: {
    backgroundColor: colors.gray200,
  },
  badgerare: {
    backgroundColor: colors.info,
  },
  badgeepic: {
    backgroundColor: colors.warning,
  },
  badgelegendary: {
    backgroundColor: colors.accent,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeName: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeDescription: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  noBadgesContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  noBadgesText: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  leaderboardCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userRankBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  userRankText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  cancelButton: {
    ...typography.body1,
    color: colors.accent,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: spacing.lg,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  changePhotoButton: {
    marginTop: spacing.md,
  },
  changePhotoText: {
    ...typography.body1,
    color: colors.accent,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});

export default ProfileScreen;
