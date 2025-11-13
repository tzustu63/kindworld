import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Avatar } from './Avatar';
import { LeaderboardEntry } from '../types';

export interface LeaderboardListProps {
  data: LeaderboardEntry[];
  maxItems?: number;
}

export const LeaderboardList: React.FC<LeaderboardListProps> = ({
  data,
  maxItems = 10,
}) => {
  const displayData = React.useMemo(() => data.slice(0, maxItems), [data, maxItems]);

  const renderItem = React.useCallback(({ item }: { item: LeaderboardEntry }) => {
    const isTopThree = item.rank <= 3;
    const changeIcon = item.change > 0 ? '↑' : item.change < 0 ? '↓' : '−';
    const changeColor =
      item.change > 0
        ? colors.success
        : item.change < 0
        ? colors.error
        : colors.textSecondary;

    const changeText = item.change > 0 
      ? `up ${item.change} positions` 
      : item.change < 0 
      ? `down ${Math.abs(item.change)} positions` 
      : 'no change';

    const accessibilityLabel = `Rank ${item.rank}: ${item.displayName} with ${item.compassionPoints.toLocaleString()} points, ${changeText}`;

    return (
      <View 
        style={styles.itemContainer}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={accessibilityLabel}
      >
        {/* Rank */}
        <View 
          style={[styles.rankContainer, isTopThree && styles.rankTopThree]}
          accessible={false}
        >
          <Text 
            style={[styles.rankText, isTopThree && styles.rankTextTopThree]}
            accessible={false}
          >
            {item.rank}
          </Text>
        </View>

        {/* Avatar */}
        <Avatar
          imageUrl={item.photoURL}
          name={item.displayName}
          size="small"
          style={styles.avatar}
        />

        {/* User Info */}
        <View style={styles.userInfo} accessible={false}>
          <Text style={styles.userName} numberOfLines={1} accessible={false}>
            {item.displayName}
          </Text>
          <View style={styles.pointsContainer} accessible={false}>
            <Text style={styles.pointsText} accessible={false}>
              {item.compassionPoints.toLocaleString()} pts
            </Text>
            {item.change !== 0 && (
              <Text 
                style={[styles.changeText, { color: changeColor }]}
                accessible={false}
              >
                {changeIcon} {Math.abs(item.change)}
              </Text>
            )}
          </View>
        </View>

        {/* Medal for top 3 */}
        {isTopThree && (
          <View style={styles.medalContainer} accessible={false}>
            <Text style={styles.medalEmoji} accessible={false}>
              {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
            </Text>
          </View>
        )}
      </View>
    );
  }, []);

  const keyExtractor = React.useCallback((item: LeaderboardEntry) => item.userId, []);

  const renderEmptyState = React.useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No leaderboard data available</Text>
    </View>
  ), []);

  const ItemSeparator = React.useCallback(() => <View style={styles.separator} />, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={displayData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
        getItemLayout={(_, index) => ({
          length: 56,
          offset: 56 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rankTopThree: {
    backgroundColor: colors.accent,
  },
  rankText: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  rankTextTopThree: {
    color: colors.white,
  },
  avatar: {
    marginRight: spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.body1,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  changeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  medalContainer: {
    marginLeft: spacing.xs,
  },
  medalEmoji: {
    fontSize: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.xs,
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
});
