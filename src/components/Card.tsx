import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../theme';

export interface CardProps {
  children: React.ReactNode;
  shadow?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityRole?: 'none' | 'button' | 'link' | 'text';
}

export const Card: React.FC<CardProps> = ({
  children,
  shadow = 'md',
  style,
  accessibilityLabel,
  accessibilityRole = 'none',
}) => {
  return (
    <View 
      style={[styles.card, shadows[shadow], style]}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
});
