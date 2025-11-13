import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';

export interface BadgeProps {
  count?: number;
  text?: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  text,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const displayText = text || (count !== undefined ? String(count) : '');
  const isSmall = size === 'small';

  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const defaultAccessibilityLabel = count !== undefined 
    ? `${count} notification${count !== 1 ? 's' : ''}`
    : displayText;

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.badgeSmall : styles.badgeMedium,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
    >
      <Text
        style={[
          styles.badgeText,
          isSmall ? styles.badgeTextSmall : styles.badgeTextMedium,
          textStyle,
        ]}
        accessible={false}
      >
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
  },
  badgeSmall: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minHeight: 16,
  },
  badgeMedium: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 24,
  },
  badgeText: {
    color: colors.white,
    fontWeight: '600',
  },
  badgeTextSmall: {
    fontSize: 10,
    lineHeight: 12,
  },
  badgeTextMedium: {
    ...typography.caption,
    color: colors.white,
  },
});
