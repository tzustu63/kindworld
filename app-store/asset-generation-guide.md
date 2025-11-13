# Asset Generation Guide for KindWorld

This guide provides step-by-step instructions for generating all required visual assets for app store submission.

## Table of Contents
1. [App Icon Generation](#app-icon-generation)
2. [Splash Screen Creation](#splash-screen-creation)
3. [Screenshot Capture](#screenshot-capture)
4. [Feature Graphic Creation](#feature-graphic-creation)
5. [Tools and Resources](#tools-and-resources)

---

## App Icon Generation

### Design Specifications

**Master Icon Requirements:**
- Size: 1024x1024 pixels
- Format: PNG (no transparency)
- Color space: RGB
- Design: Heart symbol with subtle world/globe element
- Colors: Black (#000000), Blue (#4A90E2), White (#FFFFFF)

### Step 1: Create Master Icon

#### Option A: Using Figma (Recommended)
1. Create new Figma file (1024x1024)
2. Design the icon:
   ```
   - Background: White (#FFFFFF)
   - Main element: Black heart shape (#000000)
   - Accent: Blue globe element (#4A90E2) at 30% opacity
   - Ensure 10% safe area margin (no critical elements in outer 102px)
   ```
3. Export as PNG at 1x resolution
4. Save as `kindworld-icon-master.png`

#### Option B: Using Adobe Illustrator
1. Create new document (1024x1024)
2. Design vector icon
3. Export as PNG (1024x1024)
4. Save as `kindworld-icon-master.png`

#### Option C: Using Sketch
1. Create new artboard (1024x1024)
2. Design icon
3. Export as PNG @1x
4. Save as `kindworld-icon-master.png`

### Step 2: Generate iOS Icon Sizes

#### Using Xcode (Easiest)
1. Open Xcode project
2. Navigate to `ios/KindWorld/Images.xcassets/AppIcon.appiconset/`
3. Drag master icon (1024x1024) into the App Store slot
4. Xcode will automatically generate other sizes

#### Using Online Tool
1. Visit https://appicon.co/
2. Upload master icon
3. Select iOS platform
4. Download generated icon set
5. Extract and place in `ios/KindWorld/Images.xcassets/AppIcon.appiconset/`

#### Manual Generation (Advanced)
Use ImageMagick to generate all sizes:
```bash
# Install ImageMagick
brew install imagemagick

# Generate iOS icons
convert kindworld-icon-master.png -resize 20x20 icon-20@1x.png
convert kindworld-icon-master.png -resize 40x40 icon-20@2x.png
convert kindworld-icon-master.png -resize 60x60 icon-20@3x.png
convert kindworld-icon-master.png -resize 29x29 icon-29@1x.png
convert kindworld-icon-master.png -resize 58x58 icon-29@2x.png
convert kindworld-icon-master.png -resize 87x87 icon-29@3x.png
convert kindworld-icon-master.png -resize 40x40 icon-40@1x.png
convert kindworld-icon-master.png -resize 80x80 icon-40@2x.png
convert kindworld-icon-master.png -resize 120x120 icon-40@3x.png
convert kindworld-icon-master.png -resize 120x120 icon-60@2x.png
convert kindworld-icon-master.png -resize 180x180 icon-60@3x.png
convert kindworld-icon-master.png -resize 76x76 icon-76@1x.png
convert kindworld-icon-master.png -resize 152x152 icon-76@2x.png
convert kindworld-icon-master.png -resize 167x167 icon-83.5@2x.png
```

### Step 3: Generate Android Icon Sizes

#### Using Android Studio (Easiest)
1. Open Android Studio
2. Right-click `android/app/src/main/res`
3. Select New > Image Asset
4. Choose "Launcher Icons (Adaptive and Legacy)"
5. Upload master icon
6. Configure foreground and background layers
7. Click "Next" and "Finish"

#### Using Online Tool
1. Visit https://romannurik.github.io/AndroidAssetStudio/
2. Select "Launcher icon generator"
3. Upload master icon
4. Download generated icon set
5. Extract and place in appropriate `mipmap-*` folders

#### Manual Generation
```bash
# Generate Android icons
convert kindworld-icon-master.png -resize 48x48 mipmap-mdpi/ic_launcher.png
convert kindworld-icon-master.png -resize 72x72 mipmap-hdpi/ic_launcher.png
convert kindworld-icon-master.png -resize 96x96 mipmap-xhdpi/ic_launcher.png
convert kindworld-icon-master.png -resize 144x144 mipmap-xxhdpi/ic_launcher.png
convert kindworld-icon-master.png -resize 192x192 mipmap-xxxhdpi/ic_launcher.png
convert kindworld-icon-master.png -resize 512x512 playstore-icon.png
```

### Step 4: Verify Icons
- [ ] All sizes generated correctly
- [ ] No pixelation or artifacts
- [ ] Colors accurate
- [ ] Transparent background removed
- [ ] Icons placed in correct directories

---

## Splash Screen Creation

### iOS Launch Screen

#### Using Storyboard (Recommended)
The `LaunchScreen.storyboard` file is already created. To customize:

1. Open `ios/KindWorld/LaunchScreen.storyboard` in Xcode
2. Add launch icon image:
   - Create 100x100 PNG of app icon
   - Add to `Images.xcassets` as "LaunchIcon"
3. Customize text:
   - App name: "KindWorld"
   - Tagline: "Transform Kindness into Impact"
4. Test on multiple device sizes in Xcode simulator

#### Using Launch Images (Alternative)
1. Create launch images for each device size
2. Add to `Images.xcassets/LaunchImage.imageset/`
3. Configure in Xcode

### Android Splash Screen

#### Android 12+ (Splash Screen API)
Already configured in `themes.xml`. To customize:

1. Create splash icon (288x288 dp):
   ```bash
   convert kindworld-icon-master.png -resize 288x288 splash_icon.png
   ```
2. Place in `android/app/src/main/res/drawable/`
3. Update `splash_icon.xml` with actual design
4. Create branding image (optional):
   - Size: 200dp height max
   - Format: PNG
   - Content: "KindWorld" text logo

#### Android 11 and Below (Legacy)
Already configured in `splash_background.xml`. To customize:

1. Create splash background drawable
2. Update `splash_background.xml`
3. Test on Android 11 emulator

### Testing Splash Screens
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

---

## Screenshot Capture

### Preparation

1. **Clean App Data**
   - Use realistic but not real user data
   - Ensure consistent time (10:00 AM)
   - Full battery indicator
   - Strong signal strength
   - Remove debug overlays

2. **Prepare Test Account**
   - Name: "Alex Chen"
   - Points: 28,760
   - Badges: 3-4 earned
   - Missions: 5-6 available
   - Vouchers: Multiple options

### iOS Screenshots

#### Using Xcode Simulator
1. Launch simulator for iPhone 14 Pro Max (6.7")
   ```bash
   open -a Simulator
   ```
2. Run app: `npx react-native run-ios`
3. Navigate to each screen
4. Capture screenshot: `Cmd + S`
5. Screenshots saved to Desktop

#### Required Screens (iPhone 6.7")
1. **Dashboard** (1290 x 2796)
   - Show points card with growth
   - Display leaderboard
   - Show points chart

2. **Mission Feed** (1290 x 2796)
   - Show mission cards
   - Display filter options
   - Show location

3. **Mission Detail** (1290 x 2796)
   - Show mission image
   - Display points reward
   - Show join button

4. **Voucher Store** (1290 x 2796)
   - Show voucher grid
   - Display point costs
   - Show categories

5. **Profile** (1290 x 2796)
   - Show user info
   - Display badges
   - Show leaderboard position

#### iPad Screenshots (12.9")
Repeat process with iPad Pro 12.9" simulator (2048 x 2732)

### Android Screenshots

#### Using Android Emulator
1. Launch emulator (Pixel 7 Pro or similar)
   ```bash
   emulator -avd Pixel_7_Pro_API_33
   ```
2. Run app: `npx react-native run-android`
3. Navigate to each screen
4. Capture screenshot: Emulator toolbar > Camera icon
5. Screenshots saved to Desktop

#### Required Screens (1080 x 1920)
Same 5 screens as iOS, captured at 1080 x 1920 resolution

### Post-Processing Screenshots

#### Using Figma (Recommended)
1. Create frames for each device size
2. Import screenshots
3. Add text overlays (optional):
   - Font: SF Pro Display (iOS) / Roboto (Android)
   - Size: 48-64pt
   - Color: Black with white background or vice versa
   - Position: Top or bottom third
4. Export as PNG

#### Example Text Overlays
- Screenshot 1: "Track your impact and earn points"
- Screenshot 2: "Discover meaningful missions"
- Screenshot 3: "Join missions that match your interests"
- Screenshot 4: "Redeem points for real rewards"
- Screenshot 5: "Earn badges and climb the leaderboard"

#### Using Photoshop
1. Open screenshot
2. Add text layer
3. Apply effects (shadow, background)
4. Export as PNG

#### Optimization
```bash
# Optimize PNG files
pngquant --quality=80-95 screenshot.png

# Or use ImageOptim (Mac)
# Drag and drop screenshots into ImageOptim
```

---

## Feature Graphic Creation

### Google Play Feature Graphic

**Requirements:**
- Size: 1024 x 500 pixels
- Format: PNG or JPEG
- No transparency
- File size: < 1 MB

**Design Guidelines:**
1. Use brand colors (Black, Blue, White)
2. Include app icon
3. Add tagline: "Transform Kindness into Impact"
4. Show key features or screenshots
5. Ensure text is readable at small sizes

**Creation Steps:**

#### Using Figma
1. Create frame (1024 x 500)
2. Add background gradient or solid color
3. Place app icon (left side)
4. Add app name and tagline
5. Add 2-3 small screenshots (right side)
6. Export as PNG

#### Using Canva
1. Create custom size (1024 x 500)
2. Use template or start from scratch
3. Add elements and text
4. Download as PNG

#### Template Structure
```
┌─────────────────────────────────────────────────┐
│  [ICON]  KindWorld                              │
│          Transform Kindness into Impact         │
│                                    [SCREENSHOTS] │
└─────────────────────────────────────────────────┘
```

---

## Tools and Resources

### Design Tools

**Free:**
- Figma (web-based, free tier)
- GIMP (open-source Photoshop alternative)
- Inkscape (vector graphics)
- Canva (templates and easy design)

**Paid:**
- Adobe Photoshop
- Adobe Illustrator
- Sketch (Mac only)
- Affinity Designer

### Icon Generators

- **iOS**: https://appicon.co/
- **Android**: https://romannurik.github.io/AndroidAssetStudio/
- **Both**: https://www.appicon.build/
- **Both**: https://makeappicon.com/

### Screenshot Tools

- **iOS**: Xcode Simulator (built-in)
- **Android**: Android Studio Emulator (built-in)
- **Automation**: Fastlane Snapshot/Screengrab
- **Mockups**: https://www.applaunchpad.com/
- **Mockups**: https://screenshots.pro/

### Image Optimization

- **ImageOptim** (Mac): https://imageoptim.com/
- **TinyPNG** (web): https://tinypng.com/
- **pngquant** (CLI): https://pngquant.org/
- **ImageMagick** (CLI): https://imagemagick.org/

### Color Tools

- **Color Picker**: https://colorpicker.me/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Palette Generator**: https://coolors.co/

---

## Automation Scripts

### Generate All Icon Sizes (Bash)
```bash
#!/bin/bash
# generate-icons.sh

MASTER_ICON="kindworld-icon-master.png"

# iOS Icons
mkdir -p ios-icons
cd ios-icons
convert ../$MASTER_ICON -resize 20x20 icon-20@1x.png
convert ../$MASTER_ICON -resize 40x40 icon-20@2x.png
convert ../$MASTER_ICON -resize 60x60 icon-20@3x.png
# ... (add all sizes)
cd ..

# Android Icons
mkdir -p android-icons/mipmap-mdpi
mkdir -p android-icons/mipmap-hdpi
mkdir -p android-icons/mipmap-xhdpi
mkdir -p android-icons/mipmap-xxhdpi
mkdir -p android-icons/mipmap-xxxhdpi
convert $MASTER_ICON -resize 48x48 android-icons/mipmap-mdpi/ic_launcher.png
convert $MASTER_ICON -resize 72x72 android-icons/mipmap-hdpi/ic_launcher.png
convert $MASTER_ICON -resize 96x96 android-icons/mipmap-xhdpi/ic_launcher.png
convert $MASTER_ICON -resize 144x144 android-icons/mipmap-xxhdpi/ic_launcher.png
convert $MASTER_ICON -resize 192x192 android-icons/mipmap-xxxhdpi/ic_launcher.png

echo "Icons generated successfully!"
```

### Optimize Screenshots (Bash)
```bash
#!/bin/bash
# optimize-screenshots.sh

for file in screenshots/*.png; do
    pngquant --quality=80-95 --ext .png --force "$file"
    echo "Optimized: $file"
done

echo "All screenshots optimized!"
```

---

## Quality Checklist

### App Icons
- [ ] Master icon is 1024x1024
- [ ] No transparency in background
- [ ] Colors are accurate
- [ ] Design is clear at small sizes
- [ ] All required sizes generated
- [ ] Icons placed in correct directories
- [ ] Tested on actual devices

### Splash Screens
- [ ] Background is white
- [ ] Logo is centered
- [ ] Text is readable
- [ ] Loads quickly (< 1 second)
- [ ] Works on all device sizes
- [ ] No pixelation or artifacts

### Screenshots
- [ ] Correct dimensions for each platform
- [ ] High quality (no blur or pixelation)
- [ ] Consistent status bar appearance
- [ ] Realistic data shown
- [ ] No personal information visible
- [ ] Text overlays readable (if used)
- [ ] File sizes optimized
- [ ] 3-10 screenshots per device type

### Feature Graphic
- [ ] Correct size (1024 x 500)
- [ ] Brand colors used
- [ ] Text is readable
- [ ] File size < 1 MB
- [ ] Looks good at small sizes

---

## Troubleshooting

### Common Issues

**Icon looks blurry on device:**
- Ensure master icon is high resolution
- Check that correct size is being used
- Verify no upscaling is occurring

**Splash screen doesn't appear:**
- Check file paths in configuration
- Verify assets are included in build
- Clear app cache and rebuild

**Screenshots rejected:**
- Verify exact dimensions
- Check file format (PNG/JPEG)
- Ensure no prohibited content
- Remove any debug information

**Colors look different:**
- Use RGB color space
- Avoid CMYK
- Test on actual devices
- Check color profile settings

---

## Next Steps

After generating all assets:
1. Review quality on actual devices
2. Get stakeholder approval
3. Upload to app store listings
4. Complete submission checklist
5. Submit for review

---

**Last Updated**: [Date]  
**Version**: 1.0  
**Maintained By**: KindWorld Design Team
