import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { OptimizedImage } from './OptimizedImage';
import { A11Y_ROLES } from '../utils/accessibility';

export interface AvatarProps {
  imageUrl?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const SIZES = {
  small: 32,
  medium: 48,
  large: 80,
};

const FONT_SIZES = {
  small: 14,
  medium: 18,
  large: 28,
};

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 'medium',
  style,
}) => {
  const avatarSize = SIZES[size];
  const fontSize = FONT_SIZES[size];

  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  const accessibilityLabel = name ? `${name}'s profile picture` : 'Profile picture';

  return (
    <View
      style={[
        styles.container,
        { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
        style,
      ]}
      accessible={true}
      accessibilityRole={A11Y_ROLES.IMAGE}
      accessibilityLabel={accessibilityLabel}
    >
      {imageUrl ? (
        <OptimizedImage
          source={{ uri: imageUrl }}
          style={[
            styles.image,
            { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
          ]}
          cachePolicy="memory-disk"
          showLoadingIndicator={false}
          accessible={false}
        />
      ) : (
        <Text 
          style={[styles.initials, { fontSize }]}
          accessible={false}
        >
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    ...typography.button,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
