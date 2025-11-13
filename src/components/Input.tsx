import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';
import { getInputAccessibilityLabel, MIN_TOUCH_TARGET_SIZE } from '../utils/accessibility';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  style,
  required = false,
  accessibilityLabel,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;

  const inputAccessibilityLabel = accessibilityLabel || 
    (label ? getInputAccessibilityLabel(label, required, error) : undefined);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text 
          style={styles.label}
          accessible={true}
          accessibilityRole="text"
        >
          {label}{required && ' *'}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.gray400}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessible={true}
        accessibilityLabel={inputAccessibilityLabel}
        accessibilityState={{
          disabled: textInputProps.editable === false,
        }}
        accessibilityHint={helperText}
        {...textInputProps}
      />
      {error && (
        <Text 
          style={styles.errorText}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
      {!error && helperText && (
        <Text 
          style={styles.helperText}
          accessible={true}
          accessibilityRole="text"
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  input: {
    ...typography.body1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    minHeight: MIN_TOUCH_TARGET_SIZE, // WCAG 2.1 AA compliant touch target
  },
  inputFocused: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  helperText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
