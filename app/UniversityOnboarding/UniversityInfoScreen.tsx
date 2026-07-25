import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuthErrorMessage, signOut, universityApi } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import type { RootStackParamList } from '../../types/navigation';

type Props = {
  navigation?: StackNavigationProp<RootStackParamList, 'UniversityInfo'>;
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  website: string;
};

type EditableField = Exclude<keyof FormValues, 'email'>;
type ValidationErrors = Partial<Record<EditableField, string>>;

const EMPTY_FORM: FormValues = {
  name: '',
  email: '',
  phone: '',
  website: '',
};

const PHONE_PATTERN = /^\+?[0-9][0-9() .-]{6,24}$/;
const WEBSITE_PATTERN = /^https?:\/\/\S+$/;

const validate = (values: FormValues): ValidationErrors => {
  const errors: ValidationErrors = {};
  const name = values.name.trim();
  const phone = values.phone.trim();
  const website = values.website.trim();

  if (!name) errors.name = 'University name is required.';
  else if (name.length > 255) errors.name = 'University name must be 255 characters or fewer.';

  if (!phone) errors.phone = 'Contact phone is required.';
  else if (phone.length > 50 || !PHONE_PATTERN.test(phone)) {
    errors.phone = 'Enter a valid phone number, such as +233 24 123 4567.';
  }

  if (!website) errors.website = 'Website is required.';
  else if (website.length > 255 || !WEBSITE_PATTERN.test(website)) {
    errors.website = 'Enter a complete http:// or https:// website address.';
  }

  return errors;
};

export default function UniversityInfoScreen({ navigation }: Props) {
  const { colors, theme } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [formValues, setFormValues] = useState<FormValues>(EMPTY_FORM);
  const [focusedInput, setFocusedInput] = useState<keyof FormValues | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const profile = await universityApi.getMe();
      setFormValues({
        name: profile.name ?? '',
        email: profile.contactEmail ?? '',
        phone: profile.phoneNumber ?? '',
        website: profile.website ?? '',
      });
      setHasLoadedProfile(true);
    } catch (error) {
      setLoadError(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleChange = (field: EditableField, value: string) => {
    setFormValues((previous) => ({ ...previous, [field]: value }));
    setValidationErrors((previous) => ({ ...previous, [field]: undefined }));
    setRequestError('');
  };

  const handleNext = async () => {
    if (isSubmitting || isSigningOut) return;

    const errors = validate(formValues);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setRequestError('');

    try {
      const updatedProfile = await universityApi.updateMe({
        name: formValues.name.trim(),
        phoneNumber: formValues.phone.trim(),
        website: formValues.website.trim(),
      });
      setFormValues({
        name: updatedProfile.name,
        email: updatedProfile.contactEmail,
        phone: updatedProfile.phoneNumber ?? '',
        website: updatedProfile.website ?? '',
      });
      navigation?.navigate('InstitutionDetails');
    } catch (error) {
      setRequestError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (isSigningOut || isSubmitting) return;
    setIsSigningOut(true);
    setRequestError('');

    try {
      await signOut();
    } catch (error) {
      setRequestError(getAuthErrorMessage(error));
      setIsSigningOut(false);
    }
  };

  const disabled = isSubmitting || isSigningOut;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topRow}>
            <Text style={styles.stepLabel}>University Setup · Step 1 of 4</Text>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={() => void handleSignOut()}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              {isSigningOut ? (
                <ActivityIndicator size="small" color={colors.stepPercent} />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={16} color={colors.stepPercent} />
                  <Text style={styles.signOutText}>Sign out</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.stepRow}>
            <Text style={styles.stepHint}>University information</Text>
            <Text style={styles.stepPercent}>25%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>University information</Text>
            <Text style={styles.subtitle}>Add the official details students can use to recognize your institution.</Text>

            {isLoading ? (
              <View style={styles.stateContainer}>
                <ActivityIndicator size="large" color={colors.progressFill} />
                <Text style={styles.stateText}>Loading your university profile…</Text>
              </View>
            ) : loadError && !hasLoadedProfile ? (
              <View style={styles.stateContainer}>
                <Ionicons name="cloud-offline-outline" size={34} color={colors.error} />
                <Text style={styles.errorText}>{loadError}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => void loadProfile()}
                  accessibilityRole="button"
                >
                  <Ionicons name="refresh-outline" size={17} color={colors.nextBtnText} />
                  <Text style={styles.retryButtonText}>Try again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>University Name</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'name' && styles.inputContainerFocused,
                    validationErrors.name && styles.inputContainerError,
                  ]}>
                    <Ionicons name="school-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Kwame Nkrumah University of Science and Technology"
                      placeholderTextColor={colors.placeholder}
                      value={formValues.name}
                      onChangeText={(value) => handleChange('name', value)}
                      autoCapitalize="words"
                      maxLength={255}
                      editable={!disabled}
                      onFocus={() => setFocusedInput('name')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                  {validationErrors.name ? <Text style={styles.fieldError}>{validationErrors.name}</Text> : null}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Official Email</Text>
                  <View style={[styles.inputContainer, styles.readOnlyInput]}>
                    <Ionicons name="mail-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={formValues.email}
                      editable={false}
                      selectTextOnFocus={false}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      accessibilityLabel="Official university email, read only"
                    />
                    <Ionicons name="lock-closed-outline" size={16} color={colors.inputIcon} />
                  </View>
                  <Text style={styles.helperText}>This is the verified email for your account and cannot be changed here.</Text>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Contact Phone</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'phone' && styles.inputContainerFocused,
                    validationErrors.phone && styles.inputContainerError,
                  ]}>
                    <Ionicons name="call-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="+233 24 123 4567"
                      placeholderTextColor={colors.placeholder}
                      value={formValues.phone}
                      onChangeText={(value) => handleChange('phone', value)}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      maxLength={50}
                      editable={!disabled}
                      onFocus={() => setFocusedInput('phone')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                  {validationErrors.phone ? <Text style={styles.fieldError}>{validationErrors.phone}</Text> : null}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Website</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'website' && styles.inputContainerFocused,
                    validationErrors.website && styles.inputContainerError,
                  ]}>
                    <Ionicons name="globe-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="https://www.knust.edu.gh"
                      placeholderTextColor={colors.placeholder}
                      value={formValues.website}
                      onChangeText={(value) => handleChange('website', value)}
                      keyboardType="url"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={255}
                      editable={!disabled}
                      onFocus={() => setFocusedInput('website')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                  {validationErrors.website ? <Text style={styles.fieldError}>{validationErrors.website}</Text> : null}
                </View>

                <View style={styles.logoNotice}>
                  <Ionicons name="information-circle-outline" size={18} color={colors.inputIcon} />
                  <Text style={styles.logoNoticeText}>University logo upload will be available when secure file storage is connected.</Text>
                </View>

                {requestError ? <Text style={styles.errorText}>{requestError}</Text> : null}

                <TouchableOpacity
                  style={[styles.nextBtn, disabled && styles.disabledButton]}
                  onPress={() => void handleNext()}
                  activeOpacity={0.85}
                  disabled={disabled}
                  accessibilityRole="button"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={colors.nextBtnText} />
                  ) : (
                    <>
                      <Text style={styles.nextBtnText}>Save and continue</Text>
                      <Ionicons name="arrow-forward-outline" size={18} color={colors.nextBtnText} style={styles.nextIcon} />
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    flex: 1,
    fontSize: 12,
    color: colors.stepLabel,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  stepHint: {
    fontSize: 12,
    color: colors.stepLabel,
    fontWeight: '500',
  },
  stepPercent: {
    fontSize: 12,
    color: colors.stepPercent,
    fontWeight: '700',
  },
  signOutButton: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 10,
  },
  signOutText: {
    fontSize: 12,
    color: colors.stepPercent,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: colors.progressTrack,
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    width: '25%',
    height: '100%',
    backgroundColor: colors.progressFill,
    borderRadius: 3,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    lineHeight: 20,
    marginBottom: 24,
  },
  stateContainer: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  stateText: {
    color: colors.subtitle,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: colors.nextBtn,
    borderRadius: 24,
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  retryButtonText: {
    color: colors.nextBtnText,
    fontSize: 14,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: 17,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.label,
    marginBottom: 7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    minHeight: 52,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: colors.inputBorderFocus,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  readOnlyInput: {
    opacity: 0.78,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    minHeight: 50,
    fontSize: 14,
    color: colors.inputText,
  },
  helperText: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 16,
    color: colors.subtitle,
  },
  fieldError: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    color: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  logoNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    marginBottom: 18,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
  },
  logoNoticeText: {
    flex: 1,
    color: colors.subtitle,
    fontSize: 12,
    lineHeight: 17,
  },
  nextBtn: {
    minHeight: 52,
    flexDirection: 'row',
    backgroundColor: colors.nextBtn,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  disabledButton: {
    opacity: 0.6,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.nextBtnText,
  },
  nextIcon: {
    marginLeft: 6,
  },
});
