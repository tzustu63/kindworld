# Monitoring and Analytics Implementation

This document describes the monitoring and analytics implementation for the KindWorld mobile application.

## Overview

The monitoring system integrates three Firebase services:
- **Firebase Analytics**: User behavior tracking and custom events
- **Firebase Crashlytics**: Error tracking and crash reporting
- **Firebase Performance Monitoring**: Performance metrics and traces

## Architecture

### Core Service: `monitoringService.ts`

The `monitoringService` is a singleton that provides a unified interface for all monitoring operations.

#### Key Features:
- Automatic initialization on app start
- User identification across all services
- Custom event logging
- Error tracking with context
- Performance tracing
- API call monitoring
- Screen load time measurement

### React Hook: `useMonitoring.ts`

The `useMonitoring` hook provides easy integration with React components.

#### Features:
- Automatic screen view tracking
- Screen load time measurement
- User context management
- Memoized logging functions

## Usage

### 1. Basic Screen Monitoring

```typescript
import { useMonitoring } from '../hooks/useMonitoring';

const MyScreen: React.FC = () => {
  useMonitoring({
    screenName: 'MyScreen',
    trackScreenView: true,
    measureLoadTime: true,
  });

  // Your component code
};
```

### 2. Custom Event Logging

```typescript
const { logEvent } = useMonitoring({ screenName: 'MyScreen' });

// Log a custom event
await logEvent(AnalyticsEvent.MISSION_JOIN, {
  mission_id: 'abc123',
  mission_title: 'Beach Cleanup',
  points_reward: 100,
});
```

### 3. Mission Tracking

```typescript
const { logMissionJoin, logMissionComplete } = useMonitoring();

// When user joins a mission
await logMissionJoin(missionId, missionTitle, pointsReward);

// When user completes a mission
await logMissionComplete(missionId, missionTitle, pointsEarned);
```

### 4. Voucher Redemption Tracking

```typescript
const { logVoucherRedeem } = useMonitoring();

// Track redemption attempt
await logVoucherRedeem(voucherId, voucherTitle, pointsCost, success);
```

### 5. Error Tracking

```typescript
const { logError } = useMonitoring({ screenName: 'MyScreen' });

try {
  // Some operation
} catch (error) {
  await logError(error, {
    action: 'fetchData',
    additionalContext: 'value',
  });
}
```

### 6. Performance Tracing

```typescript
const { startTrace, stopTrace } = useMonitoring();

// Start a trace
await startTrace('data_processing');

// Do some work
processData();

// Stop the trace
await stopTrace('data_processing');
```

### 7. API Performance Monitoring

```typescript
import { useApiPerformance } from '../hooks/useMonitoring';

const { measureApiCall } = useApiPerformance();

// Wrap API calls to measure performance
const data = await measureApiCall(
  () => fetchMissions(),
  '/api/missions',
  'GET'
);
```

## Analytics Events

### Predefined Events

The following events are tracked automatically:

#### Authentication
- `sign_in` - User signs in (with method: email, google, apple)
- `sign_up` - User creates account
- `sign_out` - User signs out

#### Missions
- `mission_view` - User views mission details
- `mission_join` - User joins a mission
- `mission_complete` - User completes a mission
- `mission_filter` - User applies filters
- `mission_sort` - User changes sort order
- `mission_search` - User searches missions

#### Vouchers
- `voucher_view` - User views voucher details
- `voucher_redeem` - User attempts redemption
- `voucher_redeem_success` - Redemption succeeds
- `voucher_redeem_failed` - Redemption fails

#### Points
- `points_earned` - User earns points
- `points_spent` - User spends points
- `points_view_history` - User views transaction history

#### Profile
- `profile_view` - User views profile
- `profile_edit` - User edits profile
- `badge_earned` - User earns a badge

#### Dashboard
- `dashboard_view` - User views dashboard
- `leaderboard_view` - User views leaderboard

#### Admin
- `admin_mission_create` - Admin creates mission
- `admin_mission_update` - Admin updates mission
- `admin_mission_delete` - Admin deletes mission

#### CSR
- `csr_dashboard_view` - Company views CSR dashboard
- `csr_export_data` - Company exports analytics data

#### Errors
- `error_occurred` - General error
- `api_error` - API request error

## Performance Metrics

### Automatic Metrics

The following metrics are tracked automatically:

1. **Screen Load Time**: Time from component mount to render
2. **API Response Time**: Time for API calls to complete
3. **Data Fetch Time**: Time to fetch and process data

### Custom Metrics

You can add custom metrics to traces:

```typescript
await monitoringService.startTrace('custom_operation');
await monitoringService.putTraceMetric('custom_operation', 'items_processed', 100);
await monitoringService.putTraceAttribute('custom_operation', 'operation_type', 'batch');
await monitoringService.stopTrace('custom_operation');
```

## Error Tracking

### Error Context

All errors are logged with context:
- Screen name
- User ID
- Action being performed
- Custom metadata

### Error Severity Levels

- `info`: Informational messages
- `warning`: Non-critical issues
- `error`: Errors that affect functionality
- `fatal`: Critical errors that crash the app

### Integration with ErrorHandler

The `ErrorHandler` utility automatically logs errors to Crashlytics:

```typescript
import { ErrorHandler } from '../utils/errorHandler';

try {
  // Some operation
} catch (error) {
  ErrorHandler.handleException(error, 'MyScreen');
}
```

## User Identification

User identification is handled automatically:

```typescript
// Set user ID (called automatically on login)
await monitoringService.setUserId(userId);

// Set user properties
await monitoringService.setUserProperties({
  user_role: 'admin',
  has_profile: 'true',
});

// Clear user data (called automatically on logout)
await monitoringService.clearUserData();
```

## Configuration

### Firebase Setup

1. **Install Dependencies**:
```bash
npm install @react-native-firebase/crashlytics @react-native-firebase/perf
```

2. **iOS Configuration** (`ios/Podfile`):
```ruby
pod 'Firebase/Crashlytics'
pod 'Firebase/Performance'
```

3. **Android Configuration** (`android/app/build.gradle`):
```gradle
apply plugin: 'com.google.firebase.crashlytics'
apply plugin: 'com.google.firebase.firebase-perf'
```

4. **Enable Services in Firebase Console**:
   - Navigate to Firebase Console
   - Enable Crashlytics
   - Enable Performance Monitoring
   - Configure data retention settings

### Environment Variables

No additional environment variables are required. The monitoring services use the existing Firebase configuration.

## Best Practices

### 1. Event Naming
- Use snake_case for event names
- Keep names descriptive but concise
- Use predefined events when possible

### 2. Event Parameters
- Limit to 25 parameters per event
- Keep parameter names under 40 characters
- Use consistent naming across events

### 3. Performance Traces
- Keep trace names descriptive
- Stop traces as soon as possible
- Don't create too many concurrent traces

### 4. Error Logging
- Always include context with errors
- Use appropriate severity levels
- Don't log sensitive information

### 5. User Privacy
- Never log PII (personally identifiable information)
- Respect user privacy settings
- Follow GDPR/privacy regulations

## Testing

### Development Mode

In development, monitoring is enabled but you can test specific features:

```typescript
// Test crash reporting (development only)
if (__DEV__) {
  monitoringService.testCrash();
}
```

### Viewing Data

1. **Analytics**: Firebase Console > Analytics > Events
2. **Crashlytics**: Firebase Console > Crashlytics > Dashboard
3. **Performance**: Firebase Console > Performance > Dashboard

## Troubleshooting

### Events Not Appearing

- Check Firebase Console for data processing delays (up to 24 hours)
- Verify Firebase configuration is correct
- Check network connectivity
- Ensure analytics collection is enabled

### Crashes Not Reported

- Verify Crashlytics is initialized
- Check that crash reporting is enabled
- Ensure app has internet connectivity
- Wait for next app launch (crashes are reported on next start)

### Performance Data Missing

- Verify Performance Monitoring is enabled
- Check that traces are properly stopped
- Ensure sufficient data has been collected
- Wait for data processing (up to 12 hours)

## Requirements Addressed

This implementation addresses the following requirements:

- **2.5**: Dashboard data loads within 2 seconds (performance monitoring)
- **4.5**: Voucher redemption completes within 3 seconds (performance monitoring)
- **6.5**: CSR analytics loads within 3 seconds (performance monitoring)
- **7.5**: Published missions appear in feed within 1 minute (performance monitoring)

## Future Enhancements

1. **A/B Testing**: Integrate Firebase Remote Config for feature flags
2. **Predictive Analytics**: Use ML Kit for user behavior prediction
3. **Custom Dashboards**: Build internal analytics dashboards
4. **Real-time Monitoring**: Add real-time alerts for critical errors
5. **User Segmentation**: Advanced user cohort analysis
