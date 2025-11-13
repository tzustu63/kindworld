import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

export interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius: radius = borderRadius.sm,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Top bar skeleton */}
      <View style={styles.topBar}>
        <SkeletonLoader width={24} height={24} />
        <SkeletonLoader width={120} height={24} />
        <SkeletonLoader width={32} height={32} borderRadius={16} />
      </View>

      {/* Month selector skeleton */}
      <View style={styles.monthSelector}>
        <SkeletonLoader width={100} height={32} borderRadius={16} style={styles.pill} />
        <SkeletonLoader width={100} height={32} borderRadius={16} style={styles.pill} />
        <SkeletonLoader width={100} height={32} borderRadius={16} />
      </View>

      {/* Points card skeleton */}
      <View style={styles.pointsCard}>
        <SkeletonLoader width={200} height={48} style={styles.centered} />
        <SkeletonLoader width={60} height={20} style={styles.centered} />
        <SkeletonLoader width={180} height={16} style={styles.centered} />
        <SkeletonLoader width={120} height={20} style={styles.centered} />
      </View>

      {/* Chart skeleton */}
      <View style={styles.section}>
        <SkeletonLoader width={150} height={24} />
        <SkeletonLoader width="100%" height={200} style={styles.chart} />
      </View>

      {/* Leaderboard skeleton */}
      <View style={styles.section}>
        <SkeletonLoader width={120} height={24} />
        <View style={styles.leaderboardItems}>
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i} style={styles.leaderboardItem}>
              <SkeletonLoader width={32} height={32} borderRadius={16} />
              <SkeletonLoader width={32} height={32} borderRadius={16} style={styles.avatar} />
              <View style={styles.leaderboardInfo}>
                <SkeletonLoader width="60%" height={16} />
                <SkeletonLoader width="40%" height={14} style={styles.points} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.gray200,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  monthSelector: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  pill: {
    marginRight: spacing.sm,
  },
  pointsCard: {
    padding: spacing.lg,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  centered: {
    marginVertical: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  chart: {
    marginTop: spacing.md,
  },
  leaderboardItems: {
    marginTop: spacing.md,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    marginLeft: spacing.sm,
  },
  leaderboardInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  points: {
    marginTop: spacing.xs,
  },
});
