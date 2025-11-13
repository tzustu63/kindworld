import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing } from '@/theme';

export interface SuccessAnimationProps {
  visible: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

const { width } = Dimensions.get('window');

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  visible,
  message = 'Success!',
  onComplete,
  duration = 2000,
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Container animation
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Checkmark animation with delay
      Animated.sequence([
        Animated.delay(200),
        Animated.spring(checkmarkScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          checkmarkScale.setValue(0);
          if (onComplete) {
            onComplete();
          }
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}>
          <View style={styles.circle}>
            <Animated.Text
              style={[
                styles.checkmark,
                {
                  transform: [{ scale: checkmarkScale }],
                },
              ]}>
              ✓
            </Animated.Text>
          </View>
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: width * 0.6,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkmark: {
    fontSize: 48,
    color: colors.white,
    fontWeight: 'bold',
  },
  message: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
