import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, spacing, typography } from '../theme';

interface TabIconProps {
  focused: boolean;
  label: string;
  badgeCount?: number;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, label, badgeCount }) => {
  const iconMap: Record<string, string> = {
    Home: '🏠',
    Search: '🔍',
    Activity: '📊',
    Profile: '👤',
  };

  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {iconMap[label] || '•'}
      </Text>
      {badgeCount !== undefined && badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const BottomNav: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        // Get badge count from options if provided
        const badgeCount = options.tabBarBadge as number | undefined;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const tabAccessibilityLabel = 
          options.tabBarAccessibilityLabel || 
          `${String(label)} tab${isFocused ? ', selected' : ''}${badgeCount ? `, ${badgeCount} notifications` : ''}`;

        return (
          <TouchableOpacity
            key={route.key}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={tabAccessibilityLabel}
            accessibilityHint={`Navigate to ${String(label)}`}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
            activeOpacity={0.7}>
            <Animated.View style={styles.tabContent}>
              <TabIcon
                focused={isFocused}
                label={String(label)}
                badgeCount={badgeCount}
              />
              <Text
                style={[
                  styles.label,
                  isFocused ? styles.labelFocused : styles.labelUnfocused,
                ]}
                accessible={false}>
                {String(label)}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56, // Exceeds 44pt minimum touch target
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  icon: {
    fontSize: 24,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
  },
  labelFocused: {
    color: colors.primary,
    fontWeight: '600',
  },
  labelUnfocused: {
    color: colors.textSecondary,
    fontWeight: '400',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -12,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
});

export default BottomNav;
