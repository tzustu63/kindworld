# KindWorld App Icons

This directory contains app icons for iOS and Android platforms.

## iOS Icon Requirements

iOS requires icons in the following sizes (all in PNG format):
- 20x20 (@1x, @2x, @3x) - iPhone Notification
- 29x29 (@1x, @2x, @3x) - iPhone Settings
- 40x40 (@1x, @2x, @3x) - iPhone Spotlight
- 60x60 (@2x, @3x) - iPhone App
- 76x76 (@1x, @2x) - iPad App
- 83.5x83.5 (@2x) - iPad Pro App
- 1024x1024 - App Store

## Android Icon Requirements

Android requires icons in the following densities:
- mdpi: 48x48
- hdpi: 72x72
- xhdpi: 96x96
- xxhdpi: 144x144
- xxxhdpi: 192x192

## Design Specifications

### Brand Colors
- Primary: #000000 (Black)
- Accent: #4A90E2 (Blue)
- Background: #FFFFFF (White)

### Icon Design
The KindWorld icon features:
- A minimalist heart symbol representing compassion
- Clean, modern design following iOS Human Interface Guidelines
- Rounded corners (iOS automatically applies corner radius)
- No transparency in the background

## Generation Instructions

1. Create a master icon at 1024x1024 resolution
2. Use an icon generator tool like:
   - https://appicon.co/
   - https://www.appicon.build/
   - Xcode Asset Catalog (iOS)
   - Android Studio Image Asset Studio (Android)

3. Export all required sizes
4. Place iOS icons in `ios/KindWorld/Images.xcassets/AppIcon.appiconset/`
5. Place Android icons in `android/app/src/main/res/mipmap-*/`

## Icon Concept

The KindWorld icon uses a heart shape with a subtle world/globe element integrated into the design, symbolizing global compassion and kindness. The design is simple, recognizable, and works well at all sizes.
