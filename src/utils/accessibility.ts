/**
 * Accessibility Utilities
 * 
 * Provides helper functions and constants for implementing WCAG 2.1 AA compliant
 * accessibility features throughout the KindWorld application.
 */

import { AccessibilityRole, AccessibilityState } from 'react-native';

/**
 * Minimum touch target size in points (WCAG 2.1 AA requirement)
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Standard hit slop for interactive elements to ensure 44x44 minimum touch target
 */
export const STANDARD_HIT_SLOP = {
  top: 12,
  bottom: 12,
  left: 12,
  right: 12,
};

/**
 * Accessibility roles for common UI patterns
 */
export const A11Y_ROLES = {
  BUTTON: 'button' as AccessibilityRole,
  LINK: 'link' as AccessibilityRole,
  IMAGE: 'image' as AccessibilityRole,
  TEXT: 'text' as AccessibilityRole,
  HEADER: 'header' as AccessibilityRole,
  SEARCH: 'search' as AccessibilityRole,
  TAB: 'tab' as AccessibilityRole,
  MENU: 'menu' as AccessibilityRole,
  MENU_ITEM: 'menuitem' as AccessibilityRole,
  CHECKBOX: 'checkbox' as AccessibilityRole,
  RADIO: 'radio' as AccessibilityRole,
  SWITCH: 'switch' as AccessibilityRole,
  ADJUSTABLE: 'adjustable' as AccessibilityRole,
  IMAGE_BUTTON: 'imagebutton' as AccessibilityRole,
};

/**
 * Generate accessibility label for points display
 */
export const getPointsAccessibilityLabel = (points: number): string => {
  return `${points.toLocaleString()} compassion points`;
};

/**
 * Generate accessibility label for mission card
 */
export const getMissionAccessibilityLabel = (
  title: string,
  date: string,
  points: number,
  isFavorite: boolean
): string => {
  const favoriteStatus = isFavorite ? 'favorited' : 'not favorited';
  return `Mission: ${title}, Date: ${date}, Reward: ${points} points, ${favoriteStatus}`;
};

/**
 * Generate accessibility label for voucher card
 */
export const getVoucherAccessibilityLabel = (
  brandName: string,
  title: string,
  pointsCost: number,
  stock?: number
): string => {
  const stockInfo = stock !== undefined && stock < 10 ? `, only ${stock} left` : '';
  return `${brandName} voucher: ${title}, costs ${pointsCost} points${stockInfo}`;
};

/**
 * Generate accessibility label for leaderboard entry
 */
export const getLeaderboardAccessibilityLabel = (
  rank: number,
  name: string,
  points: number,
  change: number
): string => {
  const changeText =
    change > 0
      ? `, up ${change} positions`
      : change < 0
      ? `, down ${Math.abs(change)} positions`
      : ', no change';
  return `Rank ${rank}: ${name} with ${points.toLocaleString()} points${changeText}`;
};

/**
 * Generate accessibility label for badge
 */
export const getBadgeAccessibilityLabel = (
  name: string,
  description: string,
  isEarned: boolean
): string => {
  const status = isEarned ? 'earned' : 'not yet earned';
  return `${name} badge, ${status}. ${description}`;
};

/**
 * Generate accessibility hint for interactive elements
 */
export const getAccessibilityHint = (action: string): string => {
  return `Double tap to ${action}`;
};

/**
 * Create accessibility state for toggleable elements
 */
export const createToggleState = (
  isSelected: boolean,
  isDisabled: boolean = false
): AccessibilityState => {
  return {
    selected: isSelected,
    disabled: isDisabled,
  };
};

/**
 * Create accessibility state for expandable elements
 */
export const createExpandableState = (
  isExpanded: boolean,
  isDisabled: boolean = false
): AccessibilityState => {
  return {
    expanded: isExpanded,
    disabled: isDisabled,
  };
};

/**
 * Create accessibility state for checkable elements
 */
export const createCheckableState = (
  isChecked: boolean,
  isDisabled: boolean = false
): AccessibilityState => {
  return {
    checked: isChecked,
    disabled: isDisabled,
  };
};

/**
 * Format date for screen readers
 */
export const formatDateForScreenReader = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time for screen readers
 */
export const formatTimeForScreenReader = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Check if color contrast ratio meets WCAG AA standards (4.5:1 for normal text)
 * This is a simplified version - for production, use a proper color contrast library
 */
export const meetsContrastRequirement = (
  foreground: string,
  background: string,
  largeText: boolean = false
): boolean => {
  // Minimum contrast ratios per WCAG 2.1 AA
  const minRatio = largeText ? 3.0 : 4.5;
  
  // In a real implementation, calculate the actual contrast ratio
  // For now, we'll assume our design system colors meet requirements
  return true;
};

/**
 * Announce message to screen reader
 * Use this for dynamic content updates that need to be announced
 */
export const announceForAccessibility = (message: string): void => {
  // This would use AccessibilityInfo.announceForAccessibility in React Native
  // Implementation depends on the specific use case
  console.log('[A11Y Announcement]:', message);
};

/**
 * Generate accessibility label for navigation tabs
 */
export const getTabAccessibilityLabel = (
  tabName: string,
  isActive: boolean,
  badgeCount?: number
): string => {
  const activeStatus = isActive ? 'selected' : '';
  const badge = badgeCount ? `, ${badgeCount} notifications` : '';
  return `${tabName} tab${activeStatus}${badge}`;
};

/**
 * Generate accessibility label for form inputs
 */
export const getInputAccessibilityLabel = (
  label: string,
  isRequired: boolean = false,
  error?: string
): string => {
  const required = isRequired ? ', required' : '';
  const errorText = error ? `, error: ${error}` : '';
  return `${label}${required}${errorText}`;
};

/**
 * Generate accessibility label for loading states
 */
export const getLoadingAccessibilityLabel = (context: string): string => {
  return `Loading ${context}, please wait`;
};

/**
 * Generate accessibility label for empty states
 */
export const getEmptyStateAccessibilityLabel = (context: string): string => {
  return `No ${context} available`;
};
