import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, typography, spacing } from '../theme';
import { SyncManager } from '../utils/syncManager';

export interface OfflineBannerProps {
  isOffline: boolean;
  onRetry?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  onRetry,
}) => {
  const [visible, setVisible] = useState(isOffline);
  const [isSyncing, setIsSyncing] = useState(false);
  const translateY = useRef(new Animated.Value(-100)).current;
  const wasOffline = useRef(isOffline);

  useEffect(() => {
    if (isOffline) {
      setVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      wasOffline.current = true;
    } else {
      // If we just came back online, trigger sync
      if (wasOffline.current) {
        handleSync();
        wasOffline.current = false;
      }
      
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }
  }, [isOffline]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await SyncManager.syncAll();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRetry = async () => {
    if (onRetry) {
      onRetry();
    }
    if (!isOffline) {
      await handleSync();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}>
      <View style={styles.content}>
        <Text style={styles.icon}>📡</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.subtitle}>
            Please check your connection and try again
          </Text>
        </View>
        {onRetry && (
          <TouchableOpacity 
            onPress={handleRetry} 
            style={styles.retryButton}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.retryText}>Retry</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9998,
    backgroundColor: colors.warning,
    paddingTop: 40, // Account for status bar
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.white,
  },
  subtitle: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.9,
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  retryText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.white,
  },
});
