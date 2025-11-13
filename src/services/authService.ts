import { firebaseAuth, firebaseFirestore } from './firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import type { User } from '@types/user';

export interface AuthError {
  code: string;
  message: string;
  userMessage: string;
}

export class AuthService {
  /**
   * Sign in with email and password
   * @param email User email address
   * @param password User password
   * @returns Firebase user credential
   */
  static async signInWithEmail(
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      const userCredential = await firebaseAuth().signInWithEmailAndPassword(
        email,
        password,
      );
      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign up with email and password
   * Creates a new user account and initializes user document in Firestore
   * @param email User email address
   * @param password User password
   * @param displayName Optional display name
   * @returns Firebase user credential
   */
  static async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      const userCredential =
        await firebaseAuth().createUserWithEmailAndPassword(email, password);

      // Update profile with display name if provided
      if (displayName && userCredential.user) {
        await userCredential.user.updateProfile({ displayName });
      }

      // Initialize user document in Firestore
      if (userCredential.user) {
        await this.initializeUserDocument(userCredential.user);
      }

      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with Google OAuth
   * @returns Firebase user credential
   */
  static async signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      // Check if device supports Google Play Services (Android)
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get user info and ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create Firebase credential with the token
      const googleCredential = firebaseAuth.GoogleAuthProvider.credential(
        idToken,
      );

      // Sign in with credential
      const userCredential = await firebaseAuth().signInWithCredential(
        googleCredential,
      );

      // Initialize user document if this is a new user
      if (userCredential.additionalUserInfo?.isNewUser && userCredential.user) {
        await this.initializeUserDocument(userCredential.user);
      }

      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with Apple (iOS only)
   * @returns Firebase user credential
   */
  static async signInWithApple(): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      // Check if Apple Sign-In is available (iOS 13+)
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Sign-In is only available on iOS');
      }

      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identity token
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = firebaseAuth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // Sign in with credential
      const userCredential = await firebaseAuth().signInWithCredential(
        appleCredential,
      );

      // Initialize user document if this is a new user
      if (userCredential.additionalUserInfo?.isNewUser && userCredential.user) {
        // Use Apple's full name if available
        const fullName = appleAuthRequestResponse.fullName;
        const displayName = fullName
          ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
          : undefined;

        if (displayName) {
          await userCredential.user.updateProfile({ displayName });
        }

        await this.initializeUserDocument(userCredential.user);
      }

      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out the current user
   * Clears session from Firebase and OAuth providers
   */
  static async signOut(): Promise<void> {
    try {
      // Sign out from Google if signed in
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }

      // Sign out from Firebase
      await firebaseAuth().signOut();
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get the current authenticated user
   * @returns Current Firebase user or null
   */
  static getCurrentUser(): FirebaseAuthTypes.User | null {
    return firebaseAuth().currentUser;
  }

  /**
   * Get the current user's session token
   * @returns ID token string or null
   */
  static async getIdToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) {
      return null;
    }
    return await user.getIdToken();
  }

  /**
   * Refresh the current user's session token
   * @returns Refreshed ID token string
   */
  static async refreshToken(): Promise<string> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    return await user.getIdToken(true);
  }

  /**
   * Check if user session is valid
   * @returns True if user is authenticated with valid session
   */
  static async isSessionValid(): Promise<boolean> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        return false;
      }
      // Try to get token to verify session is valid
      await user.getIdToken();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Subscribe to authentication state changes
   * @param callback Function to call when auth state changes
   * @returns Unsubscribe function
   */
  static onAuthStateChanged(
    callback: (user: FirebaseAuthTypes.User | null) => void,
  ): () => void {
    return firebaseAuth().onAuthStateChanged(callback);
  }

  /**
   * Send password reset email
   * @param email User email address
   */
  static async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await firebaseAuth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user email
   * @param newEmail New email address
   */
  static async updateEmail(newEmail: string): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await user.updateEmail(newEmail);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user password
   * @param newPassword New password
   */
  static async updatePassword(newPassword: string): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await user.updatePassword(newPassword);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Initialize user document in Firestore for new users
   * @param firebaseUser Firebase user object
   */
  private static async initializeUserDocument(
    firebaseUser: FirebaseAuthTypes.User,
  ): Promise<void> {
    const userDoc: Omit<User, 'createdAt' | 'updatedAt'> = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || 'User',
      photoURL: firebaseUser.photoURL || undefined,
      bio: '',
      compassionPoints: 0,
      totalVolunteerHours: 0,
      badges: [],
      followers: [],
      following: [],
      role: 'user',
    };

    await firebaseFirestore()
      .collection('users')
      .doc(firebaseUser.uid)
      .set({
        ...userDoc,
        createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });
  }

  /**
   * Handle Firebase Auth errors and convert to user-friendly messages
   * @param error Firebase error object
   * @returns Formatted auth error
   */
  private static handleAuthError(error: any): AuthError {
    let userMessage = 'An error occurred during authentication';

    switch (error.code) {
      case 'auth/email-already-in-use':
        userMessage = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        userMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        userMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        userMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        userMessage = 'Incorrect password';
        break;
      case 'auth/weak-password':
        userMessage = 'Password should be at least 6 characters';
        break;
      case 'auth/network-request-failed':
        userMessage = 'Network error. Please check your connection';
        break;
      case 'auth/too-many-requests':
        userMessage = 'Too many attempts. Please try again later';
        break;
      case 'auth/operation-not-allowed':
        userMessage = 'This sign-in method is not enabled';
        break;
      default:
        userMessage = error.message || 'Authentication failed';
    }

    return {
      code: error.code || 'auth/unknown',
      message: error.message || 'Unknown error',
      userMessage,
    };
  }
}
