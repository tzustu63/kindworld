# KindWorld Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **npm** or **yarn**
   - npm comes with Node.js
   - Yarn: `npm install -g yarn`

3. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

4. **iOS Development** (macOS only)
   - Xcode (latest version from App Store)
   - CocoaPods: `sudo gem install cocoapods`

5. **Android Development**
   - Android Studio
   - Java Development Kit (JDK 11)
   - Android SDK

## Installation Steps

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable the following services:
   - Authentication (Email, Google, Apple)
   - Firestore Database
   - Cloud Storage
   - Analytics

3. Download configuration files:
   - **iOS**: Download `GoogleService-Info.plist` and place in `ios/KindWorld/`
   - **Android**: Download `google-services.json` and place in `android/app/`

4. Copy `.env.example` to `.env` and fill in your Firebase credentials

### 3. Configure Google Sign-In

1. In Firebase Console, enable Google Sign-In
2. Get your Web Client ID from Firebase Console > Authentication > Sign-in method > Google
3. Add the Web Client ID to your `.env` file

**iOS Additional Steps:**
1. Open `ios/KindWorld.xcworkspace` in Xcode
2. Add URL scheme from `GoogleService-Info.plist` to Info.plist

**Android Additional Steps:**
1. Ensure `google-services.json` is in `android/app/`
2. The plugin will handle the rest

### 4. Configure Apple Sign-In (iOS only)

1. Enable Apple Sign-In in your Apple Developer account
2. Add Sign In with Apple capability in Xcode
3. Configure in Firebase Console

### 5. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

### 6. Run the App

**iOS:**
```bash
npm run ios
# or for specific simulator
npx react-native run-ios --simulator="iPhone 14 Pro"
```

**Android:**
```bash
npm run android
# Make sure you have an emulator running or device connected
```

## Development Workflow

### Start Metro Bundler
```bash
npm start
```

### Run Linter
```bash
npm run lint
```

### Run Tests
```bash
npm test
```

### Clear Cache (if needed)
```bash
npm start -- --reset-cache
```

## Troubleshooting

### iOS Build Issues
- Clean build: `cd ios && xcodebuild clean && cd ..`
- Reinstall pods: `cd ios && pod deintegrate && pod install && cd ..`

### Android Build Issues
- Clean gradle: `cd android && ./gradlew clean && cd ..`
- Clear cache: `cd android && ./gradlew cleanBuildCache && cd ..`

### Metro Bundler Issues
- Clear cache: `npm start -- --reset-cache`
- Clear watchman: `watchman watch-del-all`

## Project Structure

```
KindWorld/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation setup
│   ├── services/         # API and Firebase services
│   ├── store/            # Redux store and slices
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utility functions
│   └── theme/            # Design system
├── ios/                  # iOS native code
├── android/              # Android native code
├── App.tsx               # Root component
└── index.js              # Entry point
```

## Next Steps

After setup is complete, you can:
1. Review the design document at `.kiro/specs/kindworld-mobile-app/design.md`
2. Check the implementation tasks at `.kiro/specs/kindworld-mobile-app/tasks.md`
3. Start implementing features according to the task list

## Support

For issues or questions, refer to:
- React Native docs: https://reactnative.dev/
- Firebase docs: https://firebase.google.com/docs
- React Navigation docs: https://reactnavigation.org/
