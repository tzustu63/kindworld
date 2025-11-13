import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';
import { A11Y_ROLES, getAccessibilityHint, MIN_TOUCH_TARGET_SIZE } from '../utils/accessibility';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        isDisabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole={A11Y_ROLES.BUTTON}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint || (loading ? 'Loading' : getAccessibilityHint(title.toLowerCase()))}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.white : colors.primary}
          size="small"
          accessibilityLabel="Loading"
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
            isDisabled && styles.disabledButtonText,
            textStyle,
          ]}
          accessible={false}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET_SIZE, // WCAG 2.1 AA compliant touch target
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.button,
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  disabledButtonText: {
    color: colors.textDisabled,
  },
});
