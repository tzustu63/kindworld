# Authentication Service Documentation

## Overview

The KindWorld authentication system provides a complete solution for user authentication using Firebase Authentication with support for:
- Email/Password authentication
- Google OAuth
- Apple Sign-In (iOS only)
- Session management
- User document initialization in Firestore

## Setup

### 1. Install Dependencies

The following packages are required (already included in package.json):
```bash
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore
npm install @react-native-google-signin/google-signin
npm install @invertase/react-native-apple-authentication
```

### 2. Configure Environment Variables

Create a `.env` file based on `.env.example`:
```env
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id_here
```

Get your Google Web Client ID from:
Firebase Console > Authentication > Sign-in method > Google > Web SDK configuration

### 3. Firebase Configuration

Ensure you have:
- `GoogleService-Info.plist` in `ios/KindWorld/` (iOS)
- `google-services.json` in `android/app/` (Android)

### 4. Enable Authentication Methods in Firebase

In Firebase Console > Authentication > Sign-in method, enable:
- Email/Password
- Google
- Apple (for iOS)

## Usage

### Email Authentication

#### Sign Up
```typescript
import { useDispatch } from 'react-redux';
import { signUpWithEmail } from '@store/slices/authSlice';

const dispatch = useDispatch();

// Sign up with email and password
dispatch(signUpWithEmail({
  email: 'user@example.com',
  password: 'securePassword123',
  displayName: 'John Doe' // optional
}));
```

#### Sign In
```typescript
import { signInWithEmail } from '@store/slices/authSlice';

dispatch(signInWithEmail({
  email: 'user@example.com',
  password: 'securePassword123'
}));
```

### Google OAuth

```typescript
import { signInWithGoogle } from '@store/slices/authSlice';

dispatch(signInWithGoogle());
```

### Apple Sign-In (iOS only)

```typescript
import { signInWithApple } from '@store/slices/authSlice';

dispatch(signInWithApple());
```

### Sign Out

```typescript
import { signOut } from '@store/slices/authSlice';

dispatch(signOut());
```

### Accessing Auth State

```typescript
import { useSelector } from 'react-redux';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError
} from '@store/slices/authSlice';

function MyComponent() {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  // Use the auth state...
}
```

### Initialize Auth on App Start

In your root component (e.g., App.tsx):

```typescript
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '@store/slices/authSlice';
import { AuthService } from '@services/authService';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = AuthService.onAuthStateChanged((firebaseUser) => {
      dispatch(initializeAuth(firebaseUser));
    });

    return unsubscribe;
  }, [dispatch]);

  // Rest of your app...
}
```

## AuthService API Reference

### Methods

#### `signInWithEmail(email: string, password: string)`
Sign in an existing user with email and password.

**Returns:** `Promise<FirebaseAuthTypes.UserCredential>`

**Throws:** `AuthError` with user-friendly error messages

#### `signUpWithEmail(email: string, password: string, displayName?: string)`
Create a new user account with email and password. Automatically initializes user document in Firestore.

**Returns:** `Promise<FirebaseAuthTypes.UserCredential>`

**Throws:** `AuthError` with user-friendly error messages

#### `signInWithGoogle()`
Sign in with Google OAuth. Supports both new and existing users.

**Returns:** `Promise<FirebaseAuthTypes.UserCredential>`

**Throws:** `AuthError` with user-friendly error messages

#### `signInWithApple()`
Sign in with Apple (iOS only). Supports both new and existing users.

**Returns:** `Promise<FirebaseAuthTypes.UserCredential>`

**Throws:** `AuthError` with user-friendly error messages

#### `signOut()`
Sign out the current user from Firebase and OAuth providers.

**Returns:** `Promise<void>`

**Throws:** `AuthError` with user-friendly error messages

#### `getCurrentUser()`
Get the current authenticated Firebase user.

**Returns:** `FirebaseAuthTypes.User | null`

#### `getIdToken()`
Get the current user's ID token for API authentication.

**Returns:** `Promise<string | null>`

#### `refreshToken()`
Refresh the current user's session token.

**Returns:** `Promise<string>`

**Throws:** Error if no user is signed in

#### `isSessionValid()`
Check if the current user session is valid.

**Returns:** `Promise<boolean>`

#### `onAuthStateChanged(callback)`
Subscribe to authentication state changes.

**Parameters:**
- `callback: (user: FirebaseAuthTypes.User | null) => void`

**Returns:** Unsubscribe function `() => void`

#### `sendPasswordResetEmail(email: string)`
Send a password reset email to the user.

**Returns:** `Promise<void>`

**Throws:** `AuthError` with user-friendly error messages

#### `updateEmail(newEmail: string)`
Update the current user's email address.

**Returns:** `Promise<void>`

**Throws:** `AuthError` with user-friendly error messages

#### `updatePassword(newPassword: string)`
Update the current user's password.

**Returns:** `Promise<void>`

**Throws:** `AuthError` with user-friendly error messages

## Error Handling

All authentication methods throw `AuthError` objects with the following structure:

```typescript
interface AuthError {
  code: string;        // Firebase error code (e.g., 'auth/user-not-found')
  message: string;     // Technical error message
  userMessage: string; // User-friendly error message
}
```

### Common Error Codes

- `auth/email-already-in-use` - Email is already registered
- `auth/invalid-email` - Invalid email format
- `auth/user-disabled` - Account has been disabled
- `auth/user-not-found` - No account with this email
- `auth/wrong-password` - Incorrect password
- `auth/weak-password` - Password too weak (< 6 characters)
- `auth/network-request-failed` - Network connection issue
- `auth/too-many-requests` - Too many failed attempts

## User Document Structure

When a new user signs up, a document is automatically created in Firestore at `users/{userId}`:

```typescript
{
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio: string;
  compassionPoints: number;        // Initialized to 0
  totalVolunteerHours: number;     // Initialized to 0
  badges: Badge[];                 // Initialized to []
  followers: string[];             // Initialized to []
  following: string[];             // Initialized to []
  role: 'user' | 'company' | 'admin'; // Initialized to 'user'
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Redux State Structure

```typescript
interface AuthState {
  user: User | null;              // Current user data from Firestore
  isAuthenticated: boolean;       // True if user is signed in
  isLoading: boolean;             // True during auth operations
  isInitializing: boolean;        // True during app initialization
  error: string | null;           // Error message if auth fails
  sessionToken: string | null;    // Current session token
}
```

## Best Practices

1. **Always handle errors**: Display user-friendly error messages from `AuthError.userMessage`

2. **Check authentication state**: Use `selectIsAuthenticated` before accessing protected features

3. **Handle loading states**: Show loading indicators using `selectIsLoading`

4. **Initialize auth on app start**: Set up `onAuthStateChanged` listener in your root component

5. **Secure session tokens**: Use `getIdToken()` for authenticated API requests

6. **Validate user input**: Check email format and password strength before calling auth methods

7. **Handle platform differences**: Apple Sign-In is iOS-only, check platform before showing the button

## Example: Complete Sign-In Screen

```typescript
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  selectIsLoading,
  selectAuthError,
  clearError
} from '@store/slices/authSlice';

function SignInScreen() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = () => {
    dispatch(clearError());
    dispatch(signInWithEmail({ email, password }));
  };

  const handleGoogleSignIn = () => {
    dispatch(clearError());
    dispatch(signInWithGoogle());
  };

  const handleAppleSignIn = () => {
    dispatch(clearError());
    dispatch(signInWithApple());
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      
      <Button
        title={isLoading ? 'Signing in...' : 'Sign In'}
        onPress={handleEmailSignIn}
        disabled={isLoading}
      />
      
      <Button
        title="Sign in with Google"
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      />
      
      {Platform.OS === 'ios' && (
        <Button
          title="Sign in with Apple"
          onPress={handleAppleSignIn}
          disabled={isLoading}
        />
      )}
    </View>
  );
}
```

## Testing

To test authentication in development:

1. Use Firebase Emulator Suite for local testing
2. Create test accounts in Firebase Console
3. Test all authentication flows (email, Google, Apple)
4. Verify user documents are created in Firestore
5. Test error scenarios (wrong password, network errors, etc.)

## Troubleshooting

### Google Sign-In Issues

- Verify `GOOGLE_WEB_CLIENT_ID` is set correctly in `.env`
- Check that Google Sign-In is enabled in Firebase Console
- Ensure SHA-1 fingerprint is added in Firebase (Android)

### Apple Sign-In Issues

- Verify Apple Sign-In capability is enabled in Xcode
- Check that Apple Sign-In is enabled in Firebase Console
- Ensure you're testing on a real iOS device or iOS 13+ simulator

### Session/Token Issues

- Call `refreshToken()` if API requests fail with 401
- Check `isSessionValid()` before making authenticated requests
- Re-authenticate user if session is invalid

## Security Considerations

1. Never store passwords in plain text
2. Use HTTPS for all API requests
3. Validate tokens on the backend
4. Implement rate limiting for auth attempts
5. Use Firebase Security Rules to protect user data
6. Enable multi-factor authentication for sensitive operations
