import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@types/user';
import { AuthService, AuthError } from '@services/authService';
import { firebaseFirestore } from '@services/firebase';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  sessionToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,
  sessionToken: null,
};

// Async thunk for email sign-in
export const signInWithEmail = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>('auth/signInWithEmail', async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await AuthService.signInWithEmail(email, password);
    const user = await fetchUserData(userCredential.user.uid);
    return user;
  } catch (error: any) {
    const authError = error as AuthError;
    return rejectWithValue(authError.userMessage);
  }
});

// Async thunk for email sign-up
export const signUpWithEmail = createAsyncThunk<
  User,
  { email: string; password: string; displayName?: string },
  { rejectValue: string }
>(
  'auth/signUpWithEmail',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const userCredential = await AuthService.signUpWithEmail(
        email,
        password,
        displayName,
      );
      const user = await fetchUserData(userCredential.user.uid);
      return user;
    } catch (error: any) {
      const authError = error as AuthError;
      return rejectWithValue(authError.userMessage);
    }
  },
);

// Async thunk for Google sign-in
export const signInWithGoogle = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/signInWithGoogle', async (_, { rejectWithValue }) => {
  try {
    const userCredential = await AuthService.signInWithGoogle();
    const user = await fetchUserData(userCredential.user.uid);
    return user;
  } catch (error: any) {
    const authError = error as AuthError;
    return rejectWithValue(authError.userMessage);
  }
});

// Async thunk for Apple sign-in
export const signInWithApple = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/signInWithApple', async (_, { rejectWithValue }) => {
  try {
    const userCredential = await AuthService.signInWithApple();
    const user = await fetchUserData(userCredential.user.uid);
    return user;
  } catch (error: any) {
    const authError = error as AuthError;
    return rejectWithValue(authError.userMessage);
  }
});

// Async thunk for sign-out
export const signOut = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.signOut();
    } catch (error: any) {
      const authError = error as AuthError;
      return rejectWithValue(authError.userMessage);
    }
  },
);

// Async thunk for refreshing session token
export const refreshSessionToken = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>('auth/refreshSessionToken', async (_, { rejectWithValue }) => {
  try {
    const token = await AuthService.refreshToken();
    return token;
  } catch (error: any) {
    return rejectWithValue('Failed to refresh session');
  }
});

// Async thunk for initializing auth state from Firebase
export const initializeAuth = createAsyncThunk<
  User | null,
  FirebaseAuthTypes.User | null,
  { rejectValue: string }
>('auth/initializeAuth', async (firebaseUser, { rejectWithValue }) => {
  try {
    if (!firebaseUser) {
      return null;
    }
    const user = await fetchUserData(firebaseUser.uid);
    return user;
  } catch (error: any) {
    return rejectWithValue('Failed to initialize authentication');
  }
});

// Helper function to fetch user data from Firestore
async function fetchUserData(userId: string): Promise<User> {
  const userDoc = await firebaseFirestore().collection('users').doc(userId).get();

  if (!userDoc.exists) {
    throw new Error('User document not found');
  }

  return userDoc.data() as User;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: state => {
      state.error = null;
    },
    setSessionToken: (state, action: PayloadAction<string | null>) => {
      state.sessionToken = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: builder => {
    // Sign in with email
    builder
      .addCase(signInWithEmail.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Sign in failed';
      });

    // Sign up with email
    builder
      .addCase(signUpWithEmail.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Sign up failed';
      });

    // Sign in with Google
    builder
      .addCase(signInWithGoogle.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Google sign in failed';
      });

    // Sign in with Apple
    builder
      .addCase(signInWithApple.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithApple.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithApple.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Apple sign in failed';
      });

    // Sign out
    builder
      .addCase(signOut.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.sessionToken = null;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Sign out failed';
      });

    // Refresh session token
    builder
      .addCase(refreshSessionToken.fulfilled, (state, action) => {
        state.sessionToken = action.payload;
      })
      .addCase(refreshSessionToken.rejected, state => {
        state.sessionToken = null;
      });

    // Initialize auth
    builder
      .addCase(initializeAuth.pending, state => {
        state.isInitializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isInitializing = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(initializeAuth.rejected, state => {
        state.isInitializing = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectIsInitializing = (state: { auth: AuthState }) =>
  state.auth.isInitializing;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectSessionToken = (state: { auth: AuthState }) =>
  state.auth.sessionToken;

export const {
  setUser,
  setLoading,
  setError,
  clearError,
  setSessionToken,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
