import React, { useState, useCallback } from 'react';
import {
  Image,
  ImageProps,
  View,
  StyleSheet,
  ActivityIndicator,
  ImageURISource,
} from 'react-native';
import { colors } from '../theme';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: ImageURISource | string;
  placeholderColor?: string;
  showLoadingIndicator?: boolean;
  cachePolicy?: 'memory' | 'disk' | 'memory-disk';
}

/**
 * OptimizedImage component with progressive loading and caching
 * Features:
 * - Progressive image loading with placeholder
 * - Loading indicator
 * - Error handling with fallback
 * - Automatic cache control headers
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  placeholderColor = colors.gray200,
  showLoadingIndicator = true,
  cachePolicy = 'memory-disk',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Prepare image source with cache control
  const imageSource: ImageURISource = typeof source === 'string'
    ? {
        uri: source,
        cache: cachePolicy === 'memory' ? 'default' : 'force-cache',
      }
    : {
        ...source,
        cache: source.cache || (cachePolicy === 'memory' ? 'default' : 'force-cache'),
      };

  return (
    <View style={[styles.container, style]}>
      {/* Placeholder background */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: placeholderColor },
        ]}
      />

      {/* Image */}
      {!hasError && (
        <Image
          {...props}
          source={imageSource}
          style={[StyleSheet.absoluteFill, style]}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          resizeMode={props.resizeMode || 'cover'}
        />
      )}

      {/* Loading indicator */}
      {isLoading && showLoadingIndicator && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      )}

      {/* Error fallback */}
      {hasError && (
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <View style={styles.errorIconBar} />
            <View style={[styles.errorIconBar, styles.errorIconBarRotated]} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray100,
  },
  errorIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconBar: {
    position: 'absolute',
    width: 24,
    height: 2,
    backgroundColor: colors.gray400,
    transform: [{ rotate: '45deg' }],
  },
  errorIconBarRotated: {
    transform: [{ rotate: '-45deg' }],
  },
});
