# KindWorld Mobile App

KindWorld is a mobile application that transforms everyday acts of kindness into measurable social impact through gamification.

## Features

- Earn Compassion Points by participating in volunteer missions
- Redeem points for vouchers from partner retailers
- Track your progress with leaderboards and badges
- Browse and join missions aligned with your interests
- CSR analytics for company sponsors
- Admin tools for mission management

## Tech Stack

- **Framework**: React Native 0.72+ with TypeScript
- **Navigation**: React Navigation 6.x
- **State Management**: Redux Toolkit with RTK Query
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions, Storage)
- **Authentication**: Firebase Auth with Google OAuth and Apple Sign-In

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/          # Screen components
├── navigation/       # Navigation configuration
├── services/         # API and Firebase services
├── store/            # Redux store and slices
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── theme/            # Design system (colors, typography, spacing)
```

## Getting Started

### Prerequisites

- Node.js >= 16
- React Native development environment set up
- iOS: Xcode and CocoaPods
- Android: Android Studio and JDK

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Install iOS dependencies:
```bash
cd ios && pod install && cd ..
```

3. Configure Firebase:
   - Create a Firebase project
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place them in the appropriate directories

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android
```

### Development

```bash
# Start Metro bundler
npm start

# Run linter
npm run lint

# Run tests
npm test
```

## CI/CD Pipeline

The project uses GitHub Actions for automated builds, testing, and deployments.

### Workflows

- **CI**: Automated testing and linting on pull requests
- **Staging**: Deploy to TestFlight (iOS) and Internal Testing (Android)
- **Production**: Deploy to App Store and Google Play

### Quick Start

```bash
# Deploy to staging
git push origin develop

# Deploy to production
git tag v1.0.0
git push origin v1.0.0
```

### Documentation

- [CI/CD Setup Guide](CI_CD_SETUP.md) - Complete setup instructions
- [Deployment Guide](.github/DEPLOYMENT_GUIDE.md) - Quick deployment reference
- [Secrets Template](.github/SECRETS_TEMPLATE.md) - Required secrets configuration
- [Workflow Status](.github/workflows/README.md) - Workflow documentation

## Design System

The app follows iOS Human Interface Guidelines with a minimalist, modern aesthetic:

- **Colors**: Clean palette with black primary, light gray backgrounds, and blue accents
- **Typography**: SF Pro Display and SF Pro Text font families
- **Spacing**: Consistent spacing scale (4, 8, 16, 24, 32, 48)
- **Shadows**: Subtle elevation for depth

## License

Private - All rights reserved
