# Firebase Monitoring Setup Guide

This guide walks you through setting up Firebase Analytics, Crashlytics, and Performance Monitoring for the KindWorld mobile application.

## Prerequisites

- Firebase project already created
- React Native Firebase core package installed (`@react-native-firebase/app`)
- Firebase configuration files added to iOS and Android projects

## Installation Steps

### 1. Install Required Packages

The following packages have been added to `package.json`:

```json
{
  "dependencies": {
    "@react-native-firebase/analytics": "^18.6.1",
    "@react-native-firebase/crashlytics": "^18.6.1",
    "@react-native-firebase/perf": "^18.6.1"
  }
}
```

Install them by running:

```bash
npm install
# or
yarn install
```

### 2. iOS Configuration

#### 2.1 Update Podfile

Add the following to your `ios/Podfile`:

```ruby
# Add inside the target block
pod 'Firebase/Crashlytics'
pod 'Firebase/Performance'
```

#### 2.2 Install Pods

```bash
cd ios
pod install
cd ..
```

#### 2.3 Add Build Phase Script (Crashlytics)

1. Open your project in Xcode
2. Select your project in the Project Navigator
3. Select your app target
4. Go to "Build Phases" tab
5. Click "+" and select "New Run Script Phase"
6. Add the following script:

```bash
"${PODS_ROOT}/FirebaseCrashlytics/run"
```

7. Add input files:
```
${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}/Contents/Resources/DWARF/${TARGET_NAME}
${BUILT_PRODUCTS_DIR}/${INFOPLIST_PATH}
```

#### 2.4 Enable Debug Symbols

1. In Xcode, go to Build Settings
2. Search for "Debug Information Format"
3. Set to "DWARF with dSYM File" for both Debug and Release

### 3. Android Configuration

#### 3.1 Update Project-level build.gradle

Add the following to `android/build.gradle`:

```gradle
buildscript {
    dependencies {
        // ... other dependencies
        classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'
        classpath 'com.google.firebase:perf-plugin:1.4.2'
    }
}
```

#### 3.2 Update App-level build.gradle

Add the following to `android/app/build.gradle`:

```gradle
// At the top, after other apply plugin statements
apply plugin: 'com.google.firebase.crashlytics'
apply plugin: 'com.google.firebase.firebase-perf'

android {
    // ... existing configuration
    
    buildTypes {
        release {
            // Enable Crashlytics mapping file upload
            firebaseCrashlytics {
                mappingFileUploadEnabled true
            }
        }
    }
}
```

### 4. Firebase Console Configuration

#### 4.1 Enable Crashlytics

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Crashlytics" in the left menu
4. Click "Enable Crashlytics"
5. Follow the setup wizard

#### 4.2 Enable Performance Monitoring

1. In Firebase Console, navigate to "Performance"
2. Click "Get Started"
3. Performance Monitoring will be automatically enabled

#### 4.3 Configure Analytics

1. Navigate to "Analytics" > "Events"
2. Review the automatically tracked events
3. (Optional) Set up custom event parameters
4. (Optional) Configure data retention settings:
   - Go to "Analytics" > "Settings" > "Data Settings"
   - Set retention period (default: 14 months)

#### 4.4 Set Up Data Streams

1. Go to "Analytics" > "Data Streams"
2. Verify iOS and Android streams are configured
3. Note the Measurement IDs for reference

### 5. Verify Installation

#### 5.1 Test Crashlytics

Add a test crash button in development:

```typescript
import { monitoringService } from './src/services/monitoringService';

// In a development screen
<Button 
  title="Test Crash" 
  onPress={() => {
    if (__DEV__) {
      monitoringService.testCrash();
    }
  }}
/>
```

Run the app, trigger the crash, restart the app, and check Firebase Console.

#### 5.2 Test Analytics

Events should appear in Firebase Console within 24 hours. To verify immediately:

1. Enable debug mode:

**iOS:**
```bash
# In Xcode, edit scheme
# Add argument: -FIRDebugEnabled
```

**Android:**
```bash
adb shell setprop debug.firebase.analytics.app <package_name>
```

2. Use DebugView in Firebase Console:
   - Go to "Analytics" > "DebugView"
   - Perform actions in the app
   - See events in real-time

#### 5.3 Test Performance Monitoring

1. Run the app and navigate through screens
2. Wait 12-24 hours for data to appear
3. Check Firebase Console > Performance

### 6. Production Configuration

#### 6.1 Disable Debug Logging

Ensure debug logging is disabled in production:

```typescript
// In monitoringService.ts
async initialize(): Promise<void> {
  try {
    await crashlytics().setCrashlyticsCollectionEnabled(!__DEV__);
    await analytics().setAnalyticsCollectionEnabled(true);
    await perf().setPerformanceCollectionEnabled(true);
    
    this.isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize monitoring services:', error);
  }
}
```

#### 6.2 Configure ProGuard (Android)

Add to `android/app/proguard-rules.pro`:

```proguard
# Firebase Crashlytics
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# Firebase Performance
-keep class com.google.firebase.perf.** { *; }
```

#### 6.3 Upload dSYM Files (iOS)

For release builds, upload dSYM files to Crashlytics:

```bash
# Automatic upload via build phase script (already configured)
# Or manual upload:
/path/to/pods/directory/FirebaseCrashlytics/upload-symbols \
  -gsp /path/to/GoogleService-Info.plist \
  -p ios /path/to/dSYMs
```

### 7. Privacy and Compliance

#### 7.1 Update Privacy Policy

Ensure your privacy policy mentions:
- Firebase Analytics data collection
- Crashlytics crash reporting
- Performance monitoring

#### 7.2 iOS App Tracking Transparency

Add to `ios/Info.plist`:

```xml
<key>NSUserTrackingUsageDescription</key>
<string>We use analytics to improve your experience and app performance.</string>
```

#### 7.3 GDPR Compliance

Implement user consent if required:

```typescript
// Allow users to opt out
await analytics().setAnalyticsCollectionEnabled(userConsent);
await crashlytics().setCrashlyticsCollectionEnabled(userConsent);
await perf().setPerformanceCollectionEnabled(userConsent);
```

### 8. Monitoring Dashboard Access

#### 8.1 Add Team Members

1. Go to Firebase Console > Project Settings
2. Click "Users and permissions"
3. Add team members with appropriate roles:
   - **Viewer**: Can view all data
   - **Editor**: Can modify configuration
   - **Owner**: Full access

#### 8.2 Set Up Alerts

1. Go to Crashlytics > Settings
2. Configure email alerts for:
   - New issues
   - Regressed issues
   - Velocity alerts

### 9. Troubleshooting

#### Issue: Events not appearing in Analytics

**Solutions:**
- Wait 24 hours for data processing
- Enable DebugView to see real-time events
- Check that Analytics is enabled in Firebase Console
- Verify app is connected to internet

#### Issue: Crashes not reported

**Solutions:**
- Ensure app restarts after crash (crashes are reported on next launch)
- Check Crashlytics is enabled in Firebase Console
- Verify dSYM files are uploaded (iOS)
- Check ProGuard configuration (Android)

#### Issue: Performance data missing

**Solutions:**
- Wait 12-24 hours for initial data
- Ensure Performance Monitoring is enabled
- Check that traces are properly stopped
- Verify network connectivity

#### Issue: Build errors after installation

**Solutions:**
- Clean build folders: `cd ios && pod deintegrate && pod install`
- Clean Android: `cd android && ./gradlew clean`
- Rebuild the app
- Check Firebase configuration files are present

### 10. Best Practices

1. **Test in Development**: Always test monitoring features before releasing
2. **Monitor Quotas**: Check Firebase quotas and limits regularly
3. **Review Data**: Regularly review analytics, crashes, and performance data
4. **Set Up Alerts**: Configure alerts for critical issues
5. **Document Events**: Keep track of custom events and their purposes
6. **Privacy First**: Always respect user privacy and comply with regulations

### 11. Useful Commands

```bash
# iOS: Clean and rebuild
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios

# Android: Clean and rebuild
cd android
./gradlew clean
cd ..
npx react-native run-android

# Enable Analytics debug mode (Android)
adb shell setprop debug.firebase.analytics.app com.kindworld

# Disable Analytics debug mode (Android)
adb shell setprop debug.firebase.analytics.app .none.

# View Android logs
adb logcat | grep -i firebase
```

### 12. Resources

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [Firebase Crashlytics Documentation](https://firebase.google.com/docs/crashlytics)
- [Firebase Performance Monitoring Documentation](https://firebase.google.com/docs/perf-mon)
- [React Native Firebase Documentation](https://rnfirebase.io/)

## Next Steps

After completing this setup:

1. Run the app and verify monitoring is working
2. Review the monitoring dashboard in Firebase Console
3. Set up alerts for critical issues
4. Document any custom events specific to your app
5. Train team members on using the monitoring tools

## Support

For issues or questions:
- Check the [React Native Firebase documentation](https://rnfirebase.io/)
- Review Firebase Console for error messages
- Check the troubleshooting section above
- Contact the development team
