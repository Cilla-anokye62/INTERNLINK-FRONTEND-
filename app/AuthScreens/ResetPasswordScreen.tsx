import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import { authApi, getAuthErrorMessage, signOut } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'ResetPassword'>;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const extractResetToken = (value: string) => {
  const trimmedValue = value.trim();
  const tokenMatch = trimmedValue.match(/[?&]token=([^&#\s]+)/i);

  if (!tokenMatch) return trimmedValue;

  try {
    return decodeURIComponent(tokenMatch[1]);
  } catch {
    return tokenMatch[1];
  }
};

export default function ResetPasswordScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [token, setToken] = useState(route.params?.token ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const returnToLogin = () => {
    const currentSession = useAppStore.getState();
    const shouldReplaceCurrentScreen = !currentSession.isAuthenticated
      && currentSession.authEntryRoute === 'login';
    void signOut().then(() => {
      if (shouldReplaceCurrentScreen) navigation.replace('Login');
    });
  };

  useEffect(() => {
    const linkedToken = route.params?.token;
    if (linkedToken) setToken(linkedToken);
  }, [route.params?.token]);

  const tokenError = submitted && !token.trim()
    ? 'Paste the reset token from your email link.'
    : '';
  const passwordError = submitted
    ? !newPassword.trim()
      ? 'Enter a new password.'
      : newPassword.length < MIN_PASSWORD_LENGTH || newPassword.length > MAX_PASSWORD_LENGTH
        ? `Password must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_LENGTH} characters.`
        : ''
    : '';
  const confirmError = submitted
    ? !confirmPassword
      ? 'Confirm your new password.'
      : confirmPassword !== newPassword
        ? 'The passwords do not match.'
        : ''
    : '';

  const clearRequestError = () => {
    if (requestError) setRequestError('');
  };

  const handleResetPassword = async () => {
    if (isSubmitting) return;

    setSubmitted(true);
    setRequestError('');

    const cleanToken = extractResetToken(token);
    const passwordIsValid = Boolean(newPassword.trim())
      && newPassword.length >= MIN_PASSWORD_LENGTH
      && newPassword.length <= MAX_PASSWORD_LENGTH;
    if (!cleanToken || !passwordIsValid || confirmPassword !== newPassword) return;

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ token: cleanToken, newPassword });
      setNewPassword('');
      setConfirmPassword('');
      setIsComplete(true);
    } catch (error) {
      setRequestError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={64} color={colors.successIcon} />
          </View>
          <Text style={styles.successTitle}>Password updated</Text>
          <Text style={styles.successMessage}>
            Your password has been reset. You can now sign in with your new password.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={returnToLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Go to sign in</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.canGoBack() ? navigation.goBack() : returnToLogin()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={colors.title} />
          </TouchableOpacity>

          <View style={styles.headerIcon}>
            <Ionicons name="lock-open-outline" size={30} color={colors.accent} />
          </View>
          <Text style={styles.title}>Choose a new password</Text>
          <Text style={styles.subtitle}>
            Open the link in your reset email, or paste its token below.
          </Text>

          <Text style={styles.label}>RESET TOKEN</Text>
          <View style={[styles.inputContainer, tokenError ? styles.inputContainerError : null]}>
            <Ionicons name="key-outline" size={18} color={colors.inputIcon} />
            <TextInput
              style={[styles.input, styles.tokenInput]}
              value={token}
              onChangeText={(value) => {
                setToken(value);
                clearRequestError();
              }}
              placeholder="Paste the token from your reset link"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              textAlignVertical="center"
              selectTextOnFocus={!route.params?.token}
              editable={!isSubmitting}
            />
          </View>
          {tokenError ? <Text style={styles.fieldError}>{tokenError}</Text> : null}

          <Text style={styles.label}>NEW PASSWORD</Text>
          <View style={[styles.inputContainer, passwordError ? styles.inputContainerError : null]}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.inputIcon} />
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={(value) => {
                setNewPassword(value);
                clearRequestError();
              }}
              placeholder="8-128 characters"
              placeholderTextColor={colors.placeholder}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={MAX_PASSWORD_LENGTH}
              editable={!isSubmitting}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword((visible) => !visible)}
              accessibilityRole="button"
              accessibilityLabel={showNewPassword ? 'Hide new password' : 'Show new password'}
              hitSlop={8}
            >
              <Ionicons
                name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.inputIcon}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}

          <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
          <View style={[styles.inputContainer, confirmError ? styles.inputContainerError : null]}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.inputIcon} />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                clearRequestError();
              }}
              placeholder="Enter the same password again"
              placeholderTextColor={colors.placeholder}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={MAX_PASSWORD_LENGTH}
              editable={!isSubmitting}
              returnKeyType="done"
              onSubmitEditing={() => void handleResetPassword()}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((visible) => !visible)}
              accessibilityRole="button"
              accessibilityLabel={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
              hitSlop={8}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.inputIcon}
              />
            </TouchableOpacity>
          </View>
          {confirmError ? <Text style={styles.fieldError}>{confirmError}</Text> : null}

          {requestError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
              <Text style={styles.errorBannerText}>{requestError}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
            onPress={() => void handleResetPassword()}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <Text style={styles.primaryButtonText}>Reset password</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={returnToLogin} disabled={isSubmitting}>
            <Text style={styles.secondaryAction}>Back to sign in</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 21,
    marginBottom: 32,
  },
  headerIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 29,
    marginBottom: 18,
  },
  title: {
    color: colors.title,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    color: colors.subtitle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 7,
  },
  inputContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.inputBg,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  inputContainerError: {
    borderColor: colors.error,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    color: colors.inputText,
    fontSize: 14,
    paddingVertical: 14,
  },
  tokenInput: {
    minHeight: 54,
    maxHeight: 92,
  },
  fieldError: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
    marginLeft: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    color: colors.error,
    fontSize: 12,
    lineHeight: 17,
  },
  primaryButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 27,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 18,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryAction: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  successIconContainer: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successBg,
    borderRadius: 46,
    marginBottom: 22,
  },
  successTitle: {
    color: colors.title,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 24,
  },
});
