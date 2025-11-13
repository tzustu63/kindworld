import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import { colors, typography, spacing } from '@/theme';

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity }]}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.primary} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </Animated.View>
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
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 150,
  },
  message: {
    ...typography.body2,
    color: colors.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
