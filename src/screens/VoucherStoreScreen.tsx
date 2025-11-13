import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchVouchers,
  fetchRedemptions,
  redeemVoucher,
  setSelectedCategory,
  selectFilteredVouchers,
  clearRedemptionError,
} from '../store/slices/vouchersSlice';
import { Voucher, VoucherCategory, Redemption } from '../types';
import { colors, typography, borderRadius, spacing } from '../theme';
import {
  VoucherCard,
  RedemptionModal,
  RedemptionSuccessModal,
} from '../components';
import { useMonitoring } from '../hooks/useMonitoring';

const CATEGORIES: Array<{ id: VoucherCategory | 'all'; label: string; icon: string }> = [
  { id: 'all', label: 'All', icon: '🏪' },
  { id: '7-eleven', label: '7-Eleven', icon: '🏪' },
  { id: 'familymart', label: 'FamilyMart', icon: '🏪' },
  { id: 'px-mart', label: 'PX Mart', icon: '🛒' },
  { id: 'other', label: 'Other', icon: '🎁' },
];

const QUICK_LINKS = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'activity', label: 'Activity History', icon: '📊' },
  { id: 'friends', label: 'Friends', icon: '👥' },
];

const SECONDARY_LINKS = [
  { id: 'orders', label: 'Orders' },
  { id: 'points', label: 'Points' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

const VoucherStoreScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector(state => state.auth);
  const {
    selectedCategory,
    loading,
    error,
    redeeming,
    redemptionError,
  } = useAppSelector(state => state.vouchers);
  const vouchers = useAppSelector(selectFilteredVouchers);
  
  // Add monitoring
  const { logVoucherRedeem, logEvent } = useMonitoring({
    screenName: 'VoucherStore',
    trackScreenView: true,
    measureLoadTime: true,
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastRedemption, setLastRedemption] = useState<{
    redemption: Redemption;
    voucher: Voucher;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const userPoints = user?.compassionPoints || 0;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (redemptionError) {
      Alert.alert('Redemption Failed', redemptionError, [
        { text: 'OK', onPress: () => dispatch(clearRedemptionError()) },
      ]);
    }
  }, [redemptionError]);

  const loadData = async () => {
    if (user) {
      await Promise.all([
        dispatch(fetchVouchers()),
        dispatch(fetchRedemptions(user.id)),
      ]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCategorySelect = (category: VoucherCategory | 'all') => {
    dispatch(setSelectedCategory(category));
  };

  const handleVoucherPress = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowRedemptionModal(true);
  };

  const handleRedemptionConfirm = async () => {
    if (!selectedVoucher || !user) return;

    const result = await dispatch(
      redeemVoucher({
        voucherId: selectedVoucher.id,
        userId: user.id,
        userPoints,
      })
    );

    if (redeemVoucher.fulfilled.match(result)) {
      // Log successful redemption
      await logVoucherRedeem(
        selectedVoucher.id,
        selectedVoucher.title,
        selectedVoucher.pointsCost,
        true
      );
      
      setShowRedemptionModal(false);
      setLastRedemption(result.payload);
      setShowSuccessModal(true);
    } else {
      // Log failed redemption
      await logVoucherRedeem(
        selectedVoucher.id,
        selectedVoucher.title,
        selectedVoucher.pointsCost,
        false
      );
    }
  };

  const handleRedemptionCancel = () => {
    setShowRedemptionModal(false);
    setSelectedVoucher(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setLastRedemption(null);
    setSelectedVoucher(null);
  };

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVoucherCard = ({ item }: { item: Voucher }) => (
    <View style={styles.voucherCardWrapper}>
      <VoucherCard voucher={item} onPress={() => handleVoucherPress(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Voucher Store</Text>
          <Text style={styles.pointsBalance}>{userPoints} points</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search vouchers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinks}>
          {QUICK_LINKS.map(link => (
            <TouchableOpacity
              key={link.id}
              style={styles.quickLink}
              onPress={() => {
                if (link.id === 'profile') {
                  navigation.navigate('Profile' as never);
                } else if (link.id === 'activity') {
                  navigation.navigate('Activity' as never);
                }
              }}
            >
              <Text style={styles.quickLinkIcon}>{link.icon}</Text>
              <Text style={styles.quickLinkLabel}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Secondary Links */}
        <View style={styles.secondaryLinks}>
          {SECONDARY_LINKS.map(link => (
            <TouchableOpacity key={link.id} style={styles.secondaryLink}>
              <Text style={styles.secondaryLinkText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.secondaryLink}
            onPress={() => navigation.navigate('EventFeed' as never)}
          >
            <Text style={styles.secondaryLinkText}>Events</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Event Card */}
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => navigation.navigate('EventFeed' as never)}
        >
          <Image
            source={{ uri: 'https://via.placeholder.com/400x200' }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredTitle}>Join Our Events</Text>
            <Text style={styles.featuredSubtitle}>Earn more points!</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.donateButton}>
          <Text style={styles.donateButtonText}>Donate now!</Text>
        </TouchableOpacity>

        {/* Category Icons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.categoryItemActive,
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vouchers Section */}
        <View style={styles.vouchersSection}>
          <Text style={styles.sectionTitle}>Exchange your Points for Vouchers</Text>
          
          {loading && !refreshing ? (
            <Text style={styles.loadingText}>Loading vouchers...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : filteredVouchers.length === 0 ? (
            <Text style={styles.emptyText}>
              {searchQuery ? 'No vouchers found' : 'No vouchers available'}
            </Text>
          ) : (
            <FlatList
              data={filteredVouchers}
              renderItem={renderVoucherCard}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.voucherRow}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Redemption Modal */}
      <RedemptionModal
        visible={showRedemptionModal}
        voucher={selectedVoucher}
        userPoints={userPoints}
        loading={redeeming}
        onConfirm={handleRedemptionConfirm}
        onCancel={handleRedemptionCancel}
      />

      {/* Success Modal */}
      <RedemptionSuccessModal
        visible={showSuccessModal}
        redemption={lastRedemption?.redemption || null}
        voucher={lastRedemption?.voucher || null}
        onClose={handleSuccessClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 28,
    color: colors.textPrimary,
  },
  pointsBalance: {
    ...typography.h3,
    fontSize: 18,
    color: colors.accent,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    ...typography.body1,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
  },
  quickLinks: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  quickLink: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
  },
  quickLinkIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  quickLinkLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  secondaryLinks: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  secondaryLink: {
    paddingVertical: spacing.xs,
  },
  secondaryLinkText: {
    ...typography.body2,
    color: colors.accent,
  },
  featuredCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    height: 150,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredTitle: {
    ...typography.h2,
    fontSize: 24,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  featuredSubtitle: {
    ...typography.body1,
    color: colors.white,
  },
  donateButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  donateButtonText: {
    ...typography.button,
    color: colors.white,
  },
  categoriesContainer: {
    marginBottom: spacing.lg,
  },
  categoriesContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  categoryItemActive: {
    opacity: 1,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  vouchersSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  voucherRow: {
    gap: spacing.md,
  },
  voucherCardWrapper: {
    flex: 1,
  },
  loadingText: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  errorText: {
    ...typography.body1,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  emptyText: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default VoucherStoreScreen;
