import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import { Button, Input } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { monitoringService } from '../services/monitoringService';

export const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const emailInputRef = useRef<RNTextInput>(null);
  
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    isLoading,
    error,
    clearAuthError,
  } = useAuth();

  // Auto-focus on email input when screen loads
  useEffect(() => {
    const timer = setTimeout(() => {
      emailInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      clearAuthError();
    }
  }, [email]);

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailValue.trim()) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!emailRegex.test(emailValue)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleContinueWithEmail = async () => {
    if (!validateEmail(email)) {
      return;
    }

    try {
      // For simplicity, we'll use a default password for email sign-in
      // In a real app, you'd have a separate password input or magic link
      await signUpWithEmail(email, 'defaultPassword123');
      await monitoringService.logSignUp('email');
    } catch (err) {
      // Error is handled by Redux and displayed via error state
      console.error('Email sign-in error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      await monitoringService.logSignIn('google');
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      await monitoringService.logSignIn('apple');
    } catch (err) {
      console.error('Apple sign-in error:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View 
          style={styles.logoContainer}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel="KindWorld logo"
        >
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText} accessible={false}>
              KindWorld
            </Text>
          </View>
        </View>

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text 
            style={styles.title}
            accessible={true}
            accessibilityRole="header"
          >
            Create an account
          </Text>
          <Text 
            style={styles.subtitle}
            accessible={true}
            accessibilityRole="text"
          >
            Enter your email to sign up for this app
          </Text>
        </View>

        {/* Email Input Section */}
        <View style={styles.formContainer}>
          <Input
            ref={emailInputRef}
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            error={emailError || (error ? error.userMessage : '')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="done"
            onSubmitEditing={handleContinueWithEmail}
            accessibilityLabel="Email address"
            required={true}
          />

          <Button
            title="Continue"
            onPress={handleContinueWithEmail}
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
            style={styles.continueButton}
            accessibilityLabel="Continue with email"
            accessibilityHint="Sign up or sign in with your email address"
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Sign-In Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            accessibilityHint="Sign in using your Google account"
            accessibilityState={{ disabled: isLoading }}
          >
            <View style={styles.socialButtonContent}>
              <View style={styles.socialIconPlaceholder}>
                <Text style={styles.socialIconText} accessible={false}>G</Text>
              </View>
              <Text style={styles.socialButtonText} accessible={false}>
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleSignIn}
              disabled={isLoading}
              activeOpacity={0.7}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              accessibilityHint="Sign in using your Apple ID"
              accessibilityState={{ disabled: isLoading }}
            >
              <View style={styles.socialButtonContent}>
                <View style={styles.socialIconPlaceholder}>
                  <Text style={styles.socialIconText} accessible={false}>🍎</Text>
                </View>
                <Text style={styles.socialButtonText} accessible={false}>
                  Continue with Apple
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '700',
  },
  headerContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: spacing.lg,
  },
  continueButton: {
    marginTop: spacing.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray300,
  },
  dividerText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  socialButtonsContainer: {
    marginBottom: spacing.xl,
  },
  socialButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    minHeight: 44, // WCAG 2.1 AA compliant touch target
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  socialIconText: {
    fontSize: 14,
    fontWeight: '600',
  },
  socialButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: colors.accent,
    fontWeight: '600',
  },
});
