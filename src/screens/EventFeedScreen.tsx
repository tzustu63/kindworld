import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MissionCard } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Mission } from '../types';

export interface FilterOptions {
  category?: string;
  dateRange?: string;
  distance?: number;
}

export type SortOption = 'date' | 'relevance' | 'distance';

interface EventFeedScreenProps {
  missions?: Mission[];
  loading?: boolean;
  onFilterPress?: () => void;
  onSortPress?: () => void;
  onLocationEdit?: () => void;
  onMissionPress?: (missionId: string) => void;
  onFavoriteToggle?: (missionId: string) => void;
  favorites?: Set<string>;
}

const EventFeedScreen: React.FC<EventFeedScreenProps> = ({
  missions = [],
  loading = false,
  onFilterPress,
  onSortPress,
  onLocationEdit,
  onMissionPress,
  onFavoriteToggle,
  favorites = new Set(),
}) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Taipei City');

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleMissionPress = (missionId: string) => {
    if (onMissionPress) {
      onMissionPress(missionId);
    }
  };

  const renderMissionCard = React.useCallback(
    ({ item }: { item: Mission }) => (
      <MissionCard
        mission={item}
        onPress={() => handleMissionPress(item.id)}
        onFavoriteToggle={onFavoriteToggle}
        isFavorite={favorites.has(item.id)}
      />
    ),
    [handleMissionPress, onFavoriteToggle, favorites]
  );

  const keyExtractor = React.useCallback((item: Mission) => item.id, []);

  const getItemLayout = React.useCallback(
    (_: any, index: number) => ({
      length: 400, // Approximate height of MissionCard
      offset: 400 * index,
      index,
    }),
    []
  );

  const renderHeader = () => (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={onLocationEdit}
        >
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{location}</Text>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Filter and Sort */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Text style={styles.filterIcon}>⚙️</Text>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
          <Text style={styles.sortIcon}>↕️</Text>
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>

        <Text style={styles.resultCount}>{missions.length} results</Text>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ongoing Events</Text>
      </View>
    </>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No events found</Text>
      <Text style={styles.emptySubtext}>
        Try adjusting your filters or check back later
      </Text>
    </View>
  );

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
        <Text style={styles.title}>Events</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Mission List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={missions}
          renderItem={renderMissionCard}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Performance optimizations
          windowSize={5}
          maxToRenderPerBatch={3}
          initialNumToRender={5}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          getItemLayout={getItemLayout}
        />
      )}
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body1,
    color: colors.textPrimary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  locationText: {
    flex: 1,
    ...typography.body2,
    color: colors.textPrimary,
  },
  editIcon: {
    fontSize: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  filterIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  filterText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  sortIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  sortText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
  resultCount: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default EventFeedScreen;
