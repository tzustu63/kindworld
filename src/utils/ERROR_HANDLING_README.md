# Error Handling and User Feedback System

This document describes the error handling and user feedback system implemented in the KindWorld application.

## Overview

The system provides a comprehensive approach to handling errors and providing user feedback through:

1. **ErrorHandler Utility**: Centralized error categorization, logging, and recovery
2. **Toast Notifications**: Non-intrusive feedback for errors and success messages
3. **Loading States**: Skeleton screens and loading overlays
4. **Empty States**: Friendly messages when no data is available
5. **Offline Detection**: Banner notification for network issues
6. **Success Animations**: Delightful feedback for successful actions

## Components

### 1. ErrorHandler Utility

Located in `src/utils/errorHandler.ts`

#### Features

- **Error Categorization**: Automatically categorizes errors into authentication, network, validation, permission, data, and system errors
- **User-Friendly Messages**: Maps technical error codes to user-friendly messages
- **Firebase Analytics Integration**: Logs all errors to Firebase Analytics
- **Recovery Mechanisms**: Automatic retry with exponential backoff for retryable errors
- **Callback System**: Register callbacks to be notified when errors occur

#### Usage

```typescript
import { ErrorHandler } from '@/utils/errorHandler';

// Handle an exception
try {
  await someAsyncOperation();
} catch (error) {
  ErrorHandler.handleException(error, 'Context description');
}

// Create a custom error
const customError = ErrorHandler.createError(
  'CUSTOM_ERROR',
  'Technical message',
  'User-friendly message',
  'error',
  'validation',
  false,
  false
);
ErrorHandler.handle(customError);

// Register a callback
const unregister = ErrorHandler.registerCallback((error) => {
  console.log('Error occurred:', error);
});
```

### 2. Toast Notifications

Located in `src/components/Toast.tsx` and `src/components/ToastProvider.tsx`

#### Features

- **Multiple Types**: Success, error, warning, and info toasts
- **Auto-dismiss**: Configurable duration with smooth animations
- **Manual Dismiss**: Tap to dismiss
- **Queue Support**: Multiple toasts can be shown sequentially

#### Usage

```typescript
import { useToast } from '@/components';

const MyComponent = () => {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast('Operation completed!', 'success', 3000);
  };

  const handleError = () => {
    showToast('Something went wrong', 'error');
  };

  return (
    <Button title="Show Toast" onPress={handleSuccess} />
  );
};
```

#### Setup

Wrap your app with `ToastProvider`:

```typescript
import { ToastProvider } from '@/components';

const App = () => (
  <ToastProvider>
    <YourApp />
  </ToastProvider>
);
```

### 3. EmptyState Component

Located in `src/components/EmptyState.tsx`

#### Features

- **Customizable Icon**: Use emoji or custom icons
- **Optional Action**: Add a button for user action
- **Centered Layout**: Automatically centers content

#### Usage

```typescript
import { EmptyState } from '@/components';

<EmptyState
  title="No missions available"
  description="Check back later for new opportunities"
  icon="🎯"
  actionLabel="Refresh"
  onAction={handleRefresh}
/>
```

### 4. OfflineBanner Component

Located in `src/components/OfflineBanner.tsx`

#### Features

- **Automatic Detection**: Shows when offline, hides when online
- **Retry Action**: Optional retry button
- **Smooth Animations**: Slides in/out from top

#### Usage

```typescript
import { OfflineBanner } from '@/components';
import { useNetworkStatus } from '@/hooks';

const MyComponent = () => {
  const { isOffline, checkConnection } = useNetworkStatus();

  return (
    <>
      <OfflineBanner isOffline={isOffline} onRetry={checkConnection} />
      {/* Your content */}
    </>
  );
};
```

### 5. LoadingOverlay Component

Located in `src/components/LoadingOverlay.tsx`

#### Features

- **Full-screen Overlay**: Blocks interaction during loading
- **Optional Message**: Show loading message
- **Smooth Fade**: Fade in/out animation

#### Usage

```typescript
import { LoadingOverlay } from '@/components';

const MyComponent = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingOverlay visible={loading} message="Processing..." />
      {/* Your content */}
    </>
  );
};
```

### 6. SuccessAnimation Component

Located in `src/components/SuccessAnimation.tsx`

#### Features

- **Animated Checkmark**: Spring animation with checkmark
- **Auto-dismiss**: Configurable duration
- **Completion Callback**: Execute code after animation

#### Usage

```typescript
import { SuccessAnimation } from '@/components';

const MyComponent = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <SuccessAnimation
      visible={showSuccess}
      message="Voucher redeemed!"
      onComplete={() => setShowSuccess(false)}
      duration={2000}
    />
  );
};
```

### 7. SkeletonLoader Component

Located in `src/components/SkeletonLoader.tsx`

#### Features

- **Customizable Size**: Width, height, and border radius
- **Pulsing Animation**: Smooth opacity animation
- **Pre-built Layouts**: DashboardSkeleton for common screens

#### Usage

```typescript
import { SkeletonLoader, DashboardSkeleton } from '@/components';

// Custom skeleton
<SkeletonLoader width={200} height={20} />

// Pre-built dashboard skeleton
<DashboardSkeleton />
```

## Hooks

### useErrorHandler

Located in `src/hooks/useErrorHandler.ts`

Integrates ErrorHandler with Toast notifications automatically.

```typescript
import { useErrorHandler } from '@/hooks';

const MyComponent = () => {
  const { handleError } = useErrorHandler();

  const fetchData = async () => {
    try {
      await api.getData();
    } catch (error) {
      handleError(error, 'Fetching data');
      // Toast will be shown automatically
    }
  };
};
```

### useNetworkStatus

Located in `src/hooks/useNetworkStatus.ts`

Monitors network connectivity status.

```typescript
import { useNetworkStatus } from '@/hooks';

const MyComponent = () => {
  const { isOffline, checkConnection } = useNetworkStatus();

  return (
    <OfflineBanner isOffline={isOffline} onRetry={checkConnection} />
  );
};
```

## Error Categories

The system automatically categorizes errors:

1. **Authentication**: Login failures, invalid credentials, session expiration
2. **Network**: Connection issues, timeouts, offline state
3. **Validation**: Invalid input, missing required fields
4. **Permission**: Unauthorized access, forbidden actions
5. **Data**: Not found, duplicate entries, database errors
6. **System**: Unknown errors, server errors

## Best Practices

### 1. Always Use ErrorHandler for Exceptions

```typescript
// ✅ Good
try {
  await operation();
} catch (error) {
  ErrorHandler.handleException(error, 'Operation context');
}

// ❌ Bad
try {
  await operation();
} catch (error) {
  console.error(error);
}
```

### 2. Use Appropriate Feedback Components

- **Toast**: Quick feedback for actions (save, delete, update)
- **LoadingOverlay**: Long-running operations (API calls, file uploads)
- **SuccessAnimation**: Important successful actions (redemption, completion)
- **EmptyState**: No data scenarios
- **SkeletonLoader**: Initial data loading

### 3. Provide Context in Error Messages

```typescript
// ✅ Good
ErrorHandler.handleException(error, 'Redeeming voucher');

// ❌ Bad
ErrorHandler.handleException(error);
```

### 4. Use Loading States

```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await operation();
    showToast('Success!', 'success');
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
};
```

### 5. Handle Offline State

```typescript
const { isOffline } = useNetworkStatus();

if (isOffline) {
  showToast('You are offline', 'warning');
  return;
}

await performNetworkOperation();
```

## Integration Example

Complete example showing all components working together:

```typescript
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import {
  useToast,
  LoadingOverlay,
  SuccessAnimation,
  OfflineBanner,
  EmptyState,
} from '@/components';
import { useErrorHandler, useNetworkStatus } from '@/hooks';

const MyScreen = () => {
  const { showToast } = useToast();
  const { handleError } = useErrorHandler();
  const { isOffline, checkConnection } = useNetworkStatus();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    if (isOffline) {
      showToast('You are offline', 'warning');
      return;
    }

    setLoading(true);
    try {
      const result = await api.getData();
      setData(result);
      showToast('Data loaded', 'success');
    } catch (error) {
      handleError(error, 'Fetching data');
    } finally {
      setLoading(false);
    }
  };

  const performAction = async () => {
    setLoading(true);
    try {
      await api.performAction();
      setLoading(false);
      setShowSuccess(true);
    } catch (error) {
      setLoading(false);
      handleError(error, 'Performing action');
    }
  };

  return (
    <View>
      <OfflineBanner isOffline={isOffline} onRetry={checkConnection} />
      
      {data.length === 0 ? (
        <EmptyState
          title="No data available"
          description="Try refreshing to load data"
          icon="📭"
          actionLabel="Refresh"
          onAction={fetchData}
        />
      ) : (
        <DataList data={data} />
      )}

      <Button title="Perform Action" onPress={performAction} />

      <LoadingOverlay visible={loading} message="Processing..." />
      
      <SuccessAnimation
        visible={showSuccess}
        message="Success!"
        onComplete={() => setShowSuccess(false)}
      />
    </View>
  );
};
```

## Testing

When testing components that use error handling:

```typescript
import { ErrorHandler } from '@/utils/errorHandler';

// Mock ErrorHandler in tests
jest.mock('@/utils/errorHandler', () => ({
  ErrorHandler: {
    handleException: jest.fn(),
    createError: jest.fn(),
  },
}));

// Test error handling
it('handles errors correctly', async () => {
  const error = new Error('Test error');
  await component.performAction();
  expect(ErrorHandler.handleException).toHaveBeenCalledWith(error, expect.any(String));
});
```

## Performance Considerations

1. **Toast Queue**: Toasts are queued and shown sequentially to avoid overwhelming the user
2. **Skeleton Loading**: Use skeleton screens for perceived performance improvement
3. **Error Logging**: Errors are logged asynchronously to avoid blocking the UI
4. **Retry Mechanism**: Exponential backoff prevents overwhelming the server

## Future Enhancements

- Integration with Sentry or other error tracking services
- Offline queue for failed requests
- More sophisticated retry strategies
- Custom error boundaries for React components
- Haptic feedback for errors and success
