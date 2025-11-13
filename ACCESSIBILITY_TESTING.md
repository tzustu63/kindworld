# Accessibility Testing Guide for KindWorld

This document provides step-by-step instructions for testing the accessibility features of the KindWorld mobile application.

## Prerequisites

### iOS Testing
- iOS device or simulator running iOS 14.0 or later
- VoiceOver enabled
- Basic familiarity with VoiceOver gestures

### Android Testing
- Android device or emulator running Android 8.0 or later
- TalkBack enabled
- Basic familiarity with TalkBack gestures

## VoiceOver Testing (iOS)

### Enabling VoiceOver

1. **Settings Method:**
   - Open Settings app
   - Navigate to Accessibility > VoiceOver
   - Toggle VoiceOver ON

2. **Siri Method:**
   - Say "Hey Siri, turn on VoiceOver"

3. **Accessibility Shortcut:**
   - Settings > Accessibility > Accessibility Shortcut
   - Select VoiceOver
   - Triple-click side button to toggle

### Basic VoiceOver Gestures

- **Swipe Right:** Move to next element
- **Swipe Left:** Move to previous element
- **Double-Tap:** Activate selected element
- **Two-Finger Swipe Up:** Read all from current position
- **Three-Finger Swipe Left/Right:** Navigate between pages
- **Three-Finger Swipe Up/Down:** Scroll page
- **Rotor (Two-Finger Rotation):** Change navigation mode

### Test Scenarios

#### 1. Sign-In Screen

**Test Steps:**
1. Launch the app with VoiceOver enabled
2. Verify logo is announced as "KindWorld logo"
3. Navigate to header, verify "Create an account" is announced as a header
4. Navigate to email input
   - Verify it's announced as "Email address, required"
   - Verify placeholder text is read
5. Navigate to Continue button
   - Verify it's announced as "Continue with email, button"
   - Verify hint: "Sign up or sign in with your email address"
6. Navigate to social sign-in buttons
   - Verify Google button: "Continue with Google, button"
   - Verify Apple button (iOS): "Continue with Apple, button"
7. Navigate to footer text
   - Verify Terms and Privacy Policy links are identified

**Expected Results:**
- All elements are announced in logical order
- Button roles are correctly identified
- Hints provide clear action descriptions
- Required fields are indicated

#### 2. Dashboard Screen

**Test Steps:**
1. Navigate to Dashboard
2. Verify navigation bar elements:
   - Menu button is announced
   - Title "KindWorld" is announced
   - Profile avatar is announced with user name
3. Navigate to points card:
   - Verify points value is announced with "compassion points"
   - Verify growth percentage is announced
   - Verify "Exchange Now!" link is identified
4. Navigate through leaderboard:
   - Verify each entry announces rank, name, points, and position change
   - Verify top 3 medals are mentioned
5. Test bottom navigation:
   - Verify each tab announces name and selected state
   - Verify badge counts are announced

**Expected Results:**
- Points are formatted with thousands separators
- Leaderboard entries provide complete information
- Navigation state is clearly communicated
- All interactive elements are accessible

#### 3. Event Feed Screen

**Test Steps:**
1. Navigate to Event Feed
2. Verify search bar is announced with role
3. Navigate to filter and sort buttons
   - Verify result count is announced
4. Navigate through mission cards:
   - Verify full mission details are announced (title, date, points)
   - Verify favorite status is included
5. Test favorite button:
   - Verify it's announced as "Add to favorites" or "Remove from favorites"
   - Verify hint explains the action
   - Double-tap to toggle, verify state change is announced

**Expected Results:**
- Mission cards provide comprehensive information
- Favorite toggle state is clear
- Dates are formatted for screen readers
- All buttons have clear labels and hints

#### 4. Voucher Store Screen

**Test Steps:**
1. Navigate to Voucher Store
2. Navigate through voucher cards:
   - Verify brand name is announced
   - Verify voucher title is announced
   - Verify point cost is announced
   - Verify stock warnings are included (if applicable)
3. Test voucher redemption:
   - Double-tap on a voucher
   - Verify modal content is accessible
   - Verify confirmation button is clear

**Expected Results:**
- Voucher information is complete and clear
- Stock warnings are announced
- Point costs are clearly stated
- Redemption flow is accessible

#### 5. Profile Screen

**Test Steps:**
1. Navigate to Profile
2. Verify user information is announced:
   - Name, bio, points
   - Follower/following counts
3. Navigate through badges:
   - Verify badge names and descriptions
   - Verify earned status
4. Test edit profile button:
   - Verify it's announced correctly
   - Verify hint explains the action

**Expected Results:**
- All profile information is accessible
- Badges provide meaningful descriptions
- Edit functionality is clear

### VoiceOver Rotor Testing

1. Activate Rotor (two-finger rotation)
2. Select "Headings" mode
   - Verify all section headers are navigable
3. Select "Buttons" mode
   - Verify all buttons are navigable
4. Select "Links" mode
   - Verify all links are navigable

## TalkBack Testing (Android)

### Enabling TalkBack

1. **Settings Method:**
   - Open Settings app
   - Navigate to Accessibility > TalkBack
   - Toggle TalkBack ON

2. **Volume Key Method:**
   - Press and hold both volume keys for 3 seconds

### Basic TalkBack Gestures

- **Swipe Right:** Move to next element
- **Swipe Left:** Move to previous element
- **Double-Tap:** Activate selected element
- **Swipe Down then Right:** Read from top
- **Two-Finger Swipe Down/Up:** Scroll
- **Two-Finger Swipe Left/Right:** Navigate between pages

### Test Scenarios

Run the same test scenarios as VoiceOver, but verify:
- TalkBack announces elements correctly
- Navigation gestures work as expected
- Focus indicators are visible
- Haptic feedback is appropriate

## Touch Target Testing

### Manual Measurement

1. Enable Developer Options on device
2. Enable "Show layout bounds" or "Pointer location"
3. Verify all interactive elements are at least 44x44 points

### Test Cases

- [ ] All buttons meet 44pt minimum
- [ ] Tab bar items meet 44pt minimum
- [ ] Icon buttons meet 44pt minimum
- [ ] Input fields meet 44pt minimum height
- [ ] Cards and list items are easily tappable
- [ ] Hit slop is applied where needed

## Color Contrast Testing

### Tools

- Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Use iOS Accessibility Inspector
- Use Android Accessibility Scanner

### Test Cases

- [ ] Primary text on white background: 21:1 (Pass)
- [ ] Secondary text on white background: 4.6:1 (Pass)
- [ ] White text on primary background: 21:1 (Pass)
- [ ] Accent text on white background: 4.7:1 (Pass)
- [ ] Error text on white background: >4.5:1 (Pass)
- [ ] Success text on white background: >4.5:1 (Pass)

## Dynamic Type Testing (iOS)

### Test Steps

1. Go to Settings > Accessibility > Display & Text Size > Larger Text
2. Adjust text size slider to various positions
3. Return to app and verify:
   - Text scales appropriately
   - Layout doesn't break
   - All text remains readable
   - Buttons remain usable

### Test Cases

- [ ] Text scales with system settings
- [ ] Layout adapts to larger text
- [ ] No text truncation at larger sizes
- [ ] Touch targets remain adequate

## Keyboard Navigation Testing

### Test Steps (iOS with external keyboard)

1. Connect external keyboard to iOS device
2. Use Tab key to navigate between elements
3. Use Space/Enter to activate elements
4. Verify focus indicators are visible

### Test Cases

- [ ] Tab order is logical
- [ ] All interactive elements are reachable
- [ ] Focus indicators are visible
- [ ] Enter/Space activates buttons
- [ ] Form submission works with keyboard

## Automated Testing

### React Native Testing Library

```typescript
import { render, screen } from '@testing-library/react-native';

test('Button has correct accessibility properties', () => {
  render(<Button title="Continue" onPress={jest.fn()} />);
  
  const button = screen.getByRole('button', { name: 'Continue' });
  expect(button).toHaveAccessibilityState({ disabled: false });
});
```

### Accessibility Audit Checklist

- [ ] All images have alt text or are marked decorative
- [ ] All buttons have labels
- [ ] All form inputs have labels
- [ ] All links have descriptive text
- [ ] Color is not the only means of conveying information
- [ ] Error messages are associated with inputs
- [ ] Loading states are announced
- [ ] Success/error feedback is accessible

## Common Issues and Solutions

### Issue: Element not announced by screen reader
**Solution:** Ensure `accessible={true}` and `accessibilityLabel` are set

### Issue: Multiple announcements for single element
**Solution:** Set `accessible={false}` on child elements

### Issue: Touch target too small
**Solution:** Increase `minHeight`/`minWidth` or add `hitSlop`

### Issue: Poor color contrast
**Solution:** Adjust colors to meet 4.5:1 ratio

### Issue: Keyboard navigation skips elements
**Solution:** Ensure proper tab order and focusable elements

## Reporting Accessibility Issues

When reporting accessibility issues, include:

1. **Device/OS:** iOS 15.0 / Android 12
2. **Assistive Technology:** VoiceOver / TalkBack
3. **Screen:** Dashboard / Event Feed / etc.
4. **Issue:** Description of the problem
5. **Expected Behavior:** What should happen
6. **Actual Behavior:** What actually happens
7. **Steps to Reproduce:** Detailed steps
8. **Screenshots/Video:** If applicable

## Resources

- [iOS Accessibility Programming Guide](https://developer.apple.com/accessibility/ios/)
- [Android Accessibility Guide](https://developer.android.com/guide/topics/ui/accessibility)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/resources/)
- [Deque Accessibility Resources](https://www.deque.com/resources/)

## Continuous Testing

- Test with every new feature
- Include accessibility in code reviews
- Run automated tests in CI/CD
- Conduct regular manual audits
- Gather feedback from users with disabilities
