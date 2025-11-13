# App Store Screenshot Requirements

## iOS App Store Screenshots

### Required Sizes

#### iPhone
1. **6.7" Display (iPhone 14 Pro Max, 15 Pro Max)**
   - Resolution: 1290 x 2796 pixels
   - Required: Yes (primary)
   - Quantity: 3-10 screenshots

2. **6.5" Display (iPhone 11 Pro Max, XS Max)**
   - Resolution: 1242 x 2688 pixels
   - Required: Optional (if 6.7" provided)

3. **5.5" Display (iPhone 8 Plus)**
   - Resolution: 1242 x 2208 pixels
   - Required: Optional

#### iPad
1. **12.9" Display (iPad Pro 12.9")**
   - Resolution: 2048 x 2732 pixels
   - Required: Yes (if iPad supported)
   - Quantity: 3-10 screenshots

2. **11" Display (iPad Pro 11")**
   - Resolution: 1668 x 2388 pixels
   - Required: Optional

### Screenshot Specifications
- Format: PNG or JPEG
- Color space: RGB
- No transparency
- Maximum file size: 500 MB per screenshot
- Orientation: Portrait or Landscape (consistent per device)

---

## Google Play Store Screenshots

### Required Sizes

#### Phone
- **Minimum**: 320 x 640 pixels
- **Maximum**: 3840 x 3840 pixels
- **Recommended**: 1080 x 1920 pixels (16:9 ratio)
- **Required**: 2-8 screenshots

#### 7" Tablet
- Resolution: 1200 x 1920 pixels
- Required: Optional but recommended

#### 10" Tablet
- Resolution: 1600 x 2560 pixels
- Required: Optional but recommended

### Screenshot Specifications
- Format: PNG or JPEG (PNG preferred)
- Maximum file size: 8 MB per screenshot
- Minimum dimension: 320 pixels
- Maximum dimension: 3840 pixels
- Aspect ratio: Between 16:9 and 9:16

---

## Screenshot Content Strategy

### Screenshot 1: Welcome/Dashboard
**Purpose**: Show the main value proposition
**Content**:
- Dashboard with points display
- Growth chart
- Leaderboard preview
**Caption**: "Track your impact and earn Compassion Points"

### Screenshot 2: Mission Feed
**Purpose**: Showcase mission discovery
**Content**:
- Event feed with mission cards
- Beautiful mission images
- Filter and sort options
**Caption**: "Discover meaningful volunteer opportunities"

### Screenshot 3: Mission Details
**Purpose**: Show mission information
**Content**:
- Mission detail screen
- Points reward
- Date and location
- Join button
**Caption**: "Join missions that match your interests"

### Screenshot 4: Voucher Store
**Purpose**: Highlight rewards
**Content**:
- Voucher store with partner brands
- Point costs
- Category filters
**Caption**: "Redeem points for real rewards"

### Screenshot 5: Profile & Badges
**Purpose**: Show gamification
**Content**:
- User profile
- Earned badges
- Volunteer hours
- Leaderboard position
**Caption**: "Earn badges and climb the leaderboard"

### Screenshot 6: Points Growth (Optional)
**Purpose**: Demonstrate progress tracking
**Content**:
- Detailed points chart
- Month-over-month growth
- Transaction history
**Caption**: "Watch your impact grow over time"

### Screenshot 7: CSR Dashboard (Optional)
**Purpose**: Show business features
**Content**:
- Company analytics dashboard
- Participation metrics
- Impact visualization
**Caption**: "Track your company's social impact"

---

## Design Guidelines

### Visual Style
- **Background**: Use actual app screenshots with minimal editing
- **Overlays**: Optional text overlays with key features
- **Branding**: Include KindWorld logo subtly
- **Colors**: Match app's color scheme (Black, Blue, White)
- **Typography**: SF Pro Display for iOS, Roboto for Android

### Text Overlays (Optional)
- **Font Size**: Large enough to read on small thumbnails
- **Contrast**: Ensure text is readable against background
- **Language**: English (primary), localized versions for other markets
- **Length**: Keep captions short and impactful

### Best Practices
1. Show actual app UI, not mockups
2. Use real data that looks authentic
3. Highlight key features in first 3 screenshots
4. Maintain consistent style across all screenshots
5. Test readability on actual device sizes
6. Avoid showing personal information
7. Use high-quality, crisp images
8. Show the app in use, not just static screens

---

## Screenshot Checklist

### Pre-Production
- [ ] Identify key screens to showcase
- [ ] Prepare test data (realistic but not real user data)
- [ ] Clean up UI (remove debug info, test data)
- [ ] Ensure consistent time/battery/signal in status bar
- [ ] Plan screenshot order and narrative flow

### Production
- [ ] Capture screenshots on required device sizes
- [ ] Use simulator/emulator for consistent quality
- [ ] Capture in highest resolution possible
- [ ] Take multiple variations of each screen
- [ ] Ensure proper orientation (portrait/landscape)

### Post-Production
- [ ] Crop to exact required dimensions
- [ ] Add text overlays if desired
- [ ] Optimize file sizes
- [ ] Verify color accuracy
- [ ] Check for any sensitive information
- [ ] Test visibility on small thumbnails

### Quality Assurance
- [ ] Review all screenshots for clarity
- [ ] Verify dimensions and file sizes
- [ ] Check for typos in overlays
- [ ] Ensure brand consistency
- [ ] Get stakeholder approval
- [ ] Prepare localized versions if needed

---

## Tools & Resources

### Screenshot Capture
- **iOS**: Xcode Simulator (Cmd + S)
- **Android**: Android Studio Emulator
- **Physical Devices**: Device screenshot + crop

### Design Tools
- **Figma**: For adding overlays and text
- **Sketch**: For design mockups
- **Photoshop**: For advanced editing
- **Preview (Mac)**: For basic cropping

### Automation Tools
- **Fastlane Snapshot**: Automated iOS screenshots
- **Fastlane Screengrab**: Automated Android screenshots
- **App Store Screenshot Generator**: Online tools

### Screenshot Generators
- https://www.appscreenshots.io/
- https://screenshots.pro/
- https://www.applaunchpad.com/

---

## Localization Notes

For each supported language, provide:
1. Translated screenshot text overlays
2. Localized app content in screenshots
3. Culturally appropriate imagery
4. Region-specific examples (if applicable)

### Priority Languages
1. English (US)
2. Traditional Chinese (Taiwan)
3. Simplified Chinese (China)
4. Japanese
5. Korean

---

## Update Strategy

### When to Update Screenshots
- Major UI redesign
- New key features added
- Seasonal campaigns
- Competitor analysis shows better approaches
- A/B testing results indicate improvements

### A/B Testing
Consider testing:
- With vs. without text overlays
- Different feature ordering
- Various caption styles
- Light vs. dark mode screenshots
- Different user personas shown

---

## File Naming Convention

```
[platform]_[device]_[screen]_[language]_[version].png

Examples:
ios_6.7_dashboard_en_v1.png
android_phone_missions_zh-TW_v1.png
ios_ipad_vouchers_en_v2.png
```

This ensures organized asset management and easy updates.
