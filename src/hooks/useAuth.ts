import { useEffect } from 'react';
import {
  signInWithEmail as signInWithEmailAction,
  signUpWithEmail as signUpWithEmailAction,
  signInWithGoogle as signInWithGoogleAction,
  signInWithApple as signInWithAppleAction,
  signOut as signOutAction,
  initializeAuth,
  clearError,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsInitializing,
  selectAuthError,
} from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store';
import { AuthService } from '@services/authService';

/**
 * Custom hook for authentication operations
 * Provides easy access to auth state and actions
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const isInitializing = useAppSelector(selectIsInitializing);
  const error = useAppSelector(selectAuthError);

  // Initialize auth state on mount
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((firebaseUser) => {
      dispatch(initializeAuth(firebaseUser));
    });

    return unsubscribe;
  }, [dispatch]);

  const signInWithEmail = (email: string, password: string) => {
    return dispatch(signInWithEmailAction({ email, password }));
  };

  const signUpWithEmail = (
    email: string,
    password: string,
    displayName?: string,
  ) => {
    return dispatch(signUpWithEmailAction({ email, password, displayName }));
  };

  const signInWithGoogle = () => {
    return dispatch(signInWithGoogleAction());
  };

  const signInWithApple = () => {
    return dispatch(signInWithAppleAction());
  };

  const signOut = () => {
    return dispatch(signOutAction());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    error,
    
    // Actions
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    signOut,
    clearAuthError,
  };
};
