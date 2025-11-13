# KindWorld Splash Screen

This directory contains splash screen assets for iOS and Android platforms.

## Design Specifications

### Visual Elements
- **Background**: White (#FFFFFF)
- **Logo**: KindWorld heart icon (centered)
- **App Name**: "KindWorld" in SF Pro Display font
- **Tagline**: "Transform Kindness into Impact" (optional, below app name)

### Layout
```
┌─────────────────────┐
│                     │
│                     │
│                     │
│      [LOGO]         │
│                     │
│     KindWorld       │
│                     │
│  Transform Kindness │
│    into Impact      │
│                     │
│                     │
└─────────────────────┘
```

## iOS Splash Screen (Launch Screen)

### Requirements
- Use LaunchScreen.storyboard or Launch Images
- Recommended: Use storyboard for dynamic sizing
- Background: White
- Center-aligned logo and text
- Safe area aware

### Sizes (if using static images)
- iPhone 14 Pro Max: 1290 x 2796
- iPhone 14 Pro: 1179 x 2556
- iPhone 14: 1170 x 2532
- iPhone SE: 750 x 1334
- iPad Pro 12.9": 2048 x 2732

## Android Splash Screen

### Requirements
- Use Android 12+ Splash Screen API
- Background: White (#FFFFFF)
- Icon: 288x288 dp (adaptive icon)
- Branding image: Optional, 200dp height max

### Implementation
1. Create `res/values/themes.xml` with splash theme
2. Add splash icon to `res/drawable/`
3. Configure in AndroidManifest.xml

## Design Assets Needed

1. **Logo SVG**: Vector format for scaling
2. **Logo PNG**: 1024x1024 for raster fallback
3. **Background**: Solid white or subtle gradient
4. **Typography**: SF Pro Display (iOS), Roboto (Android)

## Brand Guidelines

- **Minimalist**: Clean, uncluttered design
- **Fast Loading**: Simple assets for quick display
- **Consistent**: Matches app's overall design language
- **Accessible**: High contrast, readable text

## Implementation Files

### iOS
- `ios/KindWorld/LaunchScreen.storyboard`
- `ios/KindWorld/Images.xcassets/LaunchImage.imageset/`

### Android
- `android/app/src/main/res/drawable/splash_icon.xml`
- `android/app/src/main/res/values/themes.xml`
- `android/app/src/main/AndroidManifest.xml`

## Animation (Optional)

Consider adding a subtle fade-in animation:
- Logo fades in over 300ms
- App name appears 100ms after logo
- Tagline fades in last
- Total duration: < 1 second

Keep animations minimal to avoid delaying app launch.
