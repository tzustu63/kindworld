import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing } from '../theme';

export type PointsDisplaySize = 'small' | 'medium' | 'large';

export interface PointsDisplayProps {
  points: number;
  size?: PointsDisplaySize;
  showGrowth?: boolean;
  growthPercentage?: number;
  label?: string;
}

/**
 * PointsDisplay Component
 * Displays points with optional growth indicator and animated transitions
 */
export const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
  size = 'medium',
  showGrowth = false,
  growthPercentage = 0,
  label = 'Points',
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const previousPoints = useRef(points);

  useEffect(() => {
    // Animate number transition when points change
    if (previousPoints.current !== points) {
      animatedValue.setValue(previousPoints.current);
      Animated.timing(animatedValue, {
        toValue: points,
        duration: 800,
        useNativeDriver: false,
      }).start();
      previousPoints.current = points;
    }
  }, [points, animatedValue]);

  const animatedPoints = animatedValue.interpolate({
    inputRange: [0, points || 1],
    outputRange: [0, points || 1],
  });

  const styles = getStyles(size);
  const isPositiveGrowth = growthPercentage > 0;
  const isNegativeGrowth = growthPercentage < 0;

  return (
    <View style={styles.container}>
      <Animated.Text style={styles.pointsText}>
        {animatedPoints.__getValue().toFixed(0)}
      </Animated.Text>
      <Text style={styles.labelText}>{label}</Text>
      {showGrowth && growthPercentage !== 0 && (
        <View style={styles.growthContainer}>
          <Text
            style={[
              styles.growthText,
              isPositiveGrowth && styles.growthPositive,
              isNegativeGrowth && styles.growthNegative,
            ]}>
            {isPositiveGrowth ? '+' : ''}
            {growthPercentage.toFixed(1)}%
          </Text>
          <Text style={styles.growthLabel}>month over month</Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (size: PointsDisplaySize) => {
  const pointsFontSize = {
    small: 24,
    medium: 34,
    large: 48,
  }[size];

  const labelFontSize = {
    small: 13,
    medium: 15,
    large: 17,
  }[size];

  const growthFontSize = {
    small: 11,
    medium: 13,
    large: 15,
  }[size];

  return StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    pointsText: {
      fontSize: pointsFontSize,
      fontWeight: '700',
      color: colors.textPrimary,
      fontFamily: typography.h1.fontFamily,
    },
    labelText: {
      fontSize: labelFontSize,
      fontWeight: '400',
      color: colors.textSecondary,
      marginTop: spacing.xs,
      fontFamily: typography.body2.fontFamily,
    },
    growthContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
      gap: spacing.xs,
    },
    growthText: {
      fontSize: growthFontSize,
      fontWeight: '600',
      fontFamily: typography.caption.fontFamily,
    },
    growthPositive: {
      color: colors.success,
    },
    growthNegative: {
      color: colors.error,
    },
    growthLabel: {
      fontSize: growthFontSize,
      fontWeight: '400',
      color: colors.textSecondary,
      fontFamily: typography.caption.fontFamily,
    },
  });
};

export default PointsDisplay;
