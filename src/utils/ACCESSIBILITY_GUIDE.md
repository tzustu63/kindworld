# Accessibility Implementation Guide

## Overview

This document outlines the accessibility features implemented in the KindWorld mobile application to ensure WCAG 2.1 AA compliance and provide an inclusive experience for all users.

## Key Accessibility Features

### 1. Screen Reader Support

All interactive elements include proper accessibility labels and hints for VoiceOver (iOS) and TalkBack (Android).

#### Implementation Examples:

```typescript
// Button with accessibility
<Button
  title="Continue"
  onPress={handlePress}
  accessibilityLabel="Continue with email"
  accessibilityHint="Sign up or sign in with your email address"
/>

// Mission card with comprehensive label
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Mission: Beach Cleanup, Date: October 20, 2025, Reward: 100 points, favorited"
  accessibilityHint="Double tap to view mission details"
>
  {/* Card content */}
</TouchableOpacity>
```

### 2. Touch Target Sizes

All interactive elements meet the WCAG 2.1 AA minimum touch target size of 44x44 points.

#### Implementation:

- Buttons: `minHeight: 44` (MIN_TOUCH_TARGET_SIZE constant)
- Tab navigation items: `minHeight: 56`
- Icon buttons: `width: 44, height: 44`
- Hit slop added where needed: `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}`

### 3. Color Contrast Ratios

All text and interactive elements maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (WCAG 2.1 AA).

#### Color Combinations:

- Primary text on white: `#000000` on `#FFFFFF` (21:1 ratio)
- Secondary text on white: `#757575` on `#FFFFFF` (4.6:1 ratio)
- White text on primary: `#FFFFFF` on `#000000` (21:1 ratio)
- Accent text: `#4A90E2` on `#FFFFFF` (4.7:1 ratio)

### 4. Keyboard Navigation

The application supports keyboard navigation through proper focus management and tab order.

#### Implementation:

- Auto-focus on primary input fields
- Proper `returnKeyType` for form navigation
- `onSubmitEditing` handlers for form submission
- Logical tab order through component structure

### 5. Accessibility Roles

Proper semantic roles are assigned to all UI elements:

```typescript
// Common roles used
accessibilityRole="button"      // Interactive buttons
accessibilityRole="text"        // Static text content
accessibilityRole="header"      // Section headers
accessibilityRole="image"       // Images and avatars
accessibilityRole="tab"         // Navigation tabs
accessibilityRole="search"      // Search inputs
accessibilityRole="alert"       // Error messages
```

### 6. Accessibility States

Dynamic states are communicated to assistive technologies:

```typescript
// Button states
accessibilityState={{
  disabled: isDisabled,
  busy: isLoading,
}}

// Toggle states
accessibilityState={{
  selected: isSelected,
}}

// Expandable states
accessibilityState={{
  expanded: isExpanded,
}}
```

### 7. Live Regions

Dynamic content updates are announced to screen readers:

```typescript
// Error messages
<Text
  accessibilityRole="alert"
  accessibilityLiveRegion="polite"
>
  {errorMessage}
</Text>
```

## Component-Specific Accessibility

### Button Component

- Minimum 44pt touch target
- Clear accessibility labels
- Loading state announcements
- Disabled state communication

### Input Component

- Label association
- Error announcements via live regions
- Required field indication
- Helper text as accessibility hints

### Mission Card

- Comprehensive accessibility label including title, date, points, and favorite status
- Separate accessible favorite button
- Child elements marked as `accessible={false}` to prevent redundant announcements

### Voucher Card

- Full voucher details in accessibility label
- Stock warnings included
- Point cost clearly announced

### Leaderboard List

- Each entry announces rank, name, points, and position change
- Medal indicators for top 3
- Optimized for screen reader navigation

### Bottom Navigation

- Tab role for each navigation item
- Selected state indication
- Badge count announcements
- Clear navigation hints

### Avatar Component

- Descriptive labels (e.g., "John Doe's profile picture")
- Fallback for missing images

## Testing Guidelines

### VoiceOver (iOS) Testing

1. Enable VoiceOver: Settings > Accessibility > VoiceOver
2. Test navigation:
   - Swipe right/left to navigate between elements
   - Double-tap to activate
   - Three-finger swipe to scroll
3. Verify all interactive elements are announced correctly
4. Check that disabled elements are identified
5. Ensure loading states are announced

### TalkBack (Android) Testing

1. Enable TalkBack: Settings > Accessibility > TalkBack
2. Test navigation:
   - Swipe right/left to navigate
   - Double-tap to activate
   - Two-finger swipe to scroll
3. Verify element announcements
4. Check focus indicators
5. Test with different TalkBack verbosity levels

### Manual Testing Checklist

- [ ] All buttons have minimum 44x44pt touch targets
- [ ] All interactive elements have accessibility labels
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Loading states are communicated
- [ ] Tab navigation works correctly
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Text scales properly with system font size
- [ ] Focus indicators are visible
- [ ] Keyboard navigation is logical

## Utility Functions

The `src/utils/accessibility.ts` file provides helper functions:

- `getPointsAccessibilityLabel()` - Format points for screen readers
- `getMissionAccessibilityLabel()` - Generate mission card labels
- `getVoucherAccessibilityLabel()` - Generate voucher card labels
- `getLeaderboardAccessibilityLabel()` - Generate leaderboard entry labels
- `getAccessibilityHint()` - Create consistent hints
- `formatDateForScreenReader()` - Format dates for screen readers
- `MIN_TOUCH_TARGET_SIZE` - Constant for minimum touch target (44pt)
- `STANDARD_HIT_SLOP` - Standard hit slop values

## Best Practices

### DO:

✅ Use semantic accessibility roles
✅ Provide clear, concise labels
✅ Include helpful hints for complex interactions
✅ Maintain minimum 44pt touch targets
✅ Test with actual screen readers
✅ Group related content with `accessible={true}` on parent
✅ Mark decorative elements as `accessible={false}`
✅ Announce dynamic content changes
✅ Use proper color contrast

### DON'T:

❌ Rely solely on color to convey information
❌ Use vague labels like "Click here"
❌ Nest multiple accessible elements unnecessarily
❌ Forget to test with screen readers
❌ Use touch targets smaller than 44pt
❌ Ignore keyboard navigation
❌ Use low contrast text
❌ Forget to announce loading states

## Resources

- [React Native Accessibility API](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [iOS VoiceOver Guide](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios)
- [Android TalkBack Guide](https://support.google.com/accessibility/android/answer/6283677)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Continuous Improvement

Accessibility is an ongoing process. Regular testing with real users who rely on assistive technologies is essential. Consider:

- User testing with screen reader users
- Automated accessibility testing tools
- Regular audits of new features
- Feedback mechanisms for accessibility issues
- Training for development team on accessibility best practices
