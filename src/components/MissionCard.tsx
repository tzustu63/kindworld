import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Mission } from '../types';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';
import { OptimizedImage } from './OptimizedImage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const IMAGE_HEIGHT = 200;

export interface MissionCardProps {
  mission: Mission;
  onPress: () => void;
  onFavoriteToggle?: (missionId: string) => void;
  isFavorite?: boolean;
}

const MissionCardComponent: React.FC<MissionCardProps> = ({
  mission,
  onPress,
  onFavoriteToggle,
  isFavorite = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleScroll = useCallback((event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CARD_WIDTH);
    setCurrentImageIndex(index);
  }, []);

  const handleFavoritePress = useCallback(() => {
    if (onFavoriteToggle) {
      onFavoriteToggle(mission.id);
    }
  }, [onFavoriteToggle, mission.id]);

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    const month = date.toLocaleDateString('zh-TW', { month: 'long' });
    const day = date.getDate();
    return `${month.replace('月', '')}月${day}日`;
  };

  const formatDateForAccessibility = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const accessibilityLabel = `Mission: ${mission.title}, Date: ${formatDateForAccessibility(mission.date)}, Reward: ${mission.pointsReward} points${isFavorite ? ', favorited' : ''}`;

  return (
    <TouchableOpacity
      style={[styles.card, shadows.lg]}
      onPress={onPress}
      activeOpacity={0.9}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Double tap to view mission details"
    >
      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
        >
          {mission.imageUrls.map((imageUrl, index) => (
            <OptimizedImage
              key={index}
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
              cachePolicy="memory-disk"
            />
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        {mission.imageUrls.length > 1 && (
          <View style={styles.paginationContainer}>
            {mission.imageUrls.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}

        {/* Favorite Toggle */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          accessibilityHint={`Double tap to ${isFavorite ? 'unfavorite' : 'favorite'} this mission`}
          accessibilityState={{ selected: isFavorite }}
        >
          <Text style={styles.favoriteIcon} accessible={false}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content} accessible={false}>
        {/* Date */}
        <Text style={styles.date} accessible={false}>
          {formatDate(mission.date)}
        </Text>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2} accessible={false}>
          {mission.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3} accessible={false}>
          {mission.description}
        </Text>

        {/* Points Badge */}
        <View style={styles.pointsBadge} accessible={false}>
          <Text style={styles.pointsText} accessible={false}>
            +{mission.pointsReward} points
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: IMAGE_HEIGHT,
  },
  image: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: spacing.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    opacity: 0.5,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    opacity: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 44, // WCAG 2.1 AA compliant touch target
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  content: {
    padding: spacing.md,
  },
  date: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  pointsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  pointsText: {
    ...typography.button,
    fontSize: 14,
    color: colors.white,
  },
});

// Memoize component to prevent unnecessary re-renders
export const MissionCard = React.memo(MissionCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.mission.id === nextProps.mission.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.mission.imageUrls.length === nextProps.mission.imageUrls.length
  );
});
