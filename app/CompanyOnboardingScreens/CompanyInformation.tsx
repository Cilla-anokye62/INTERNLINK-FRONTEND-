import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { companyApi, getAuthErrorMessage, signOut } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'CompanyInformation'>;
type EditableField = 'companyName' | 'contactPhone' | 'website';
type FieldErrors = Partial<Record<EditableField, string>>;

interface FormField {
  id: EditableField | 'companyEmail';
  label: string;
  value: string;
  placeholder: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
  editable?: boolean;
  maxLength?: number;
  helperText?: string;
  error?: string;
  onChangeText?: (text: string) => void;
}

const CompanyInformationScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const setUserName = useAppStore((state) => state.setUserName);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const profileRequestId = useRef(0);

  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [logoName, setLogoName] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const hydrateProfile = useCallback(async () => {
    const requestId = ++profileRequestId.current;
    setIsLoadingProfile(true);
    setLoadFailed(false);
    setRequestError('');

    try {
      const profile = await companyApi.getMe();
      if (requestId !== profileRequestId.current) return;

      setCompanyName(profile.companyName ?? '');
      setCompanyEmail(profile.email ?? '');
      setContactPhone(profile.phoneNumber ?? '');
      setWebsite(profile.website ?? '');
      setUserName(profile.companyName);
      updateProfile({
        email: profile.email,
        phone: profile.phoneNumber ?? '',
      });
    } catch (error) {
      if (requestId !== profileRequestId.current) return;
      setLoadFailed(true);
      setRequestError(getAuthErrorMessage(error));
    } finally {
      if (requestId === profileRequestId.current) {
        setIsLoadingProfile(false);
      }
    }
  }, [setUserName, updateProfile]);

  useEffect(() => {
    void hydrateProfile();
    return () => {
      profileRequestId.current += 1;
    };
  }, [hydrateProfile]);

  const handleUploadLogo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/png', 'image/svg+xml'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        setLogoName(result.assets[0].name);
      }
    } catch {
      Alert.alert('Selection failed', 'Could not pick the file. Please try again.');
    }
  };

  const updateField = (
    field: EditableField,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => (value: string) => {
    setter(value);
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setRequestError('');
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    const normalizedName = companyName.trim();
    const normalizedPhone = contactPhone.trim();
    const normalizedWebsite = website.trim();

    if (!normalizedName) {
      errors.companyName = 'Company name is required.';
    } else if (normalizedName.length > 255) {
      errors.companyName = 'Company name must be 255 characters or fewer.';
    }

    if (!normalizedPhone) {
      errors.contactPhone = 'Contact phone is required.';
    } else if (
      normalizedPhone.length > 50
      || !/^\+?[0-9][0-9() .-]{6,24}$/.test(normalizedPhone)
    ) {
      errors.contactPhone = 'Enter a valid phone number, for example +233 55 123 4567.';
    }

    if (!normalizedWebsite) {
      errors.website = 'Website is required.';
    } else if (
      normalizedWebsite.length > 255
      || !/^https?:\/\/\S+$/.test(normalizedWebsite)
    ) {
      errors.website = 'Enter a full URL beginning with http:// or https://.';
    }

    return errors;
  };

  const fields: FormField[] = [
    {
      id: 'companyName',
      label: 'COMPANY NAME *',
      value: companyName,
      placeholder: 'Your company name',
      icon: 'business-outline',
      maxLength: 255,
      error: fieldErrors.companyName,
      onChangeText: updateField('companyName', setCompanyName),
    },
    {
      id: 'companyEmail',
      label: 'COMPANY EMAIL',
      value: companyEmail,
      placeholder: 'Your account email',
      icon: 'mail-outline',
      keyboardType: 'email-address',
      editable: false,
      helperText: 'This is your verified sign-in email and cannot be changed here.',
    },
    {
      id: 'contactPhone',
      label: 'CONTACT PHONE *',
      value: contactPhone,
      placeholder: '+233 XX XXX XXXX',
      icon: 'call-outline',
      keyboardType: 'phone-pad',
      maxLength: 50,
      error: fieldErrors.contactPhone,
      onChangeText: updateField('contactPhone', setContactPhone),
    },
    {
      id: 'website',
      label: 'WEBSITE *',
      value: website,
      placeholder: 'https://yourcompany.com',
      icon: 'globe-outline',
      keyboardType: 'url',
      maxLength: 255,
      error: fieldErrors.website,
      onChangeText: updateField('website', setWebsite),
    },
  ];

  const handleContinue = async (): Promise<void> => {
    if (isLoadingProfile || isSaving || isSigningOut) return;

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setRequestError('Please correct the highlighted fields before continuing.');
      return;
    }

    setIsSaving(true);
    setLoadFailed(false);
    setRequestError('');

    try {
      const profile = await companyApi.updateMe({
        companyName: companyName.trim(),
        phoneNumber: contactPhone.trim(),
        website: website.trim(),
      });

      setCompanyName(profile.companyName);
      setCompanyEmail(profile.email);
      setContactPhone(profile.phoneNumber ?? '');
      setWebsite(profile.website ?? '');
      setUserName(profile.companyName);
      updateProfile({
        email: profile.email,
        phone: profile.phoneNumber ?? '',
      });
      navigation.navigate('CompanyDetails');
    } catch (error) {
      setRequestError(getAuthErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    if (isSaving || isSigningOut) return;

    profileRequestId.current += 1;
    setIsSigningOut(true);
    setIsLoadingProfile(false);
    setRequestError('');

    try {
      await signOut();
    } catch (error) {
      setRequestError(getAuthErrorMessage(error));
      setIsSigningOut(false);
    }
  };

  const isBusy = isLoadingProfile || isSaving || isSigningOut;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            disabled={isSaving || isSigningOut}
            activeOpacity={0.7}
          >
            {isSigningOut ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={16} color={colors.accent} />
                <Text style={styles.signOutText}>Sign out</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Company setup · Step 1 of 4</Text>
          <Text style={styles.progressPercent}>25%</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '25%' }]} />
        </View>

        <Text style={styles.title}>Company information</Text>
        <Text style={styles.subtitle}>Make a great first impression on candidates.</Text>

        {requestError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
            <Text style={styles.errorBannerText}>{requestError}</Text>
            {loadFailed && !isLoadingProfile ? (
              <TouchableOpacity onPress={hydrateProfile} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {isLoadingProfile ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Loading your company profile...</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.logoUploadBox}
              activeOpacity={0.7}
              onPress={handleUploadLogo}
              disabled={isBusy}
            >
              <Ionicons name="cloud-upload-outline" size={18} color={colors.subtitle} style={{ marginRight: 10 }} />
              <View style={styles.logoTextBlock}>
                <Text style={styles.logoMainText}>{logoName || 'Choose a company logo'}</Text>
                <Text style={styles.logoSubText}>Device preview only · logo upload is not connected yet</Text>
              </View>
              <View style={styles.uploadBadge}>
                <Text style={styles.uploadBadgeText}>Choose</Text>
              </View>
            </TouchableOpacity>

            {fields.map((field) => (
              <View key={field.id} style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <View style={[
                  styles.inputRow,
                  field.editable === false && styles.inputRowReadOnly,
                  field.error && styles.inputRowError,
                ]}>
                  <Ionicons name={field.icon} size={16} color={colors.subtitle} style={{ marginRight: 8 }} />
                  <TextInput
                    style={[styles.textInput, field.editable === false && styles.textInputReadOnly]}
                    value={field.value}
                    onChangeText={field.onChangeText}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.placeholder}
                    keyboardType={field.keyboardType ?? 'default'}
                    autoCapitalize={field.keyboardType === 'email-address' || field.keyboardType === 'url' ? 'none' : 'words'}
                    autoCorrect={false}
                    editable={field.editable !== false && !isBusy}
                    maxLength={field.maxLength}
                  />
                  {field.editable === false ? (
                    <Ionicons name="lock-closed-outline" size={14} color={colors.subtitle} />
                  ) : null}
                </View>
                {field.error ? <Text style={styles.fieldError}>{field.error}</Text> : null}
                {field.helperText ? <Text style={styles.helperText}>{field.helperText}</Text> : null}
              </View>
            ))}

            <TouchableOpacity
              style={[styles.continueButton, isBusy && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={isBusy}
              activeOpacity={0.85}
            >
              {isSaving ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color={colors.onPrimary} />
                  <Text style={styles.continueButtonText}>Saving...</Text>
                </View>
              ) : (
                <Text style={styles.continueButtonText}>Next →</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: 24 },
  topActions: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  signOutButton: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 10 },
  signOutText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: colors.subtitle },
  progressPercent: { fontSize: 12, color: colors.accent, fontWeight: '600' },
  progressBarTrack: { height: 4, backgroundColor: colors.inputBorder, borderRadius: 2, marginBottom: 20, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 2 },
  title: { fontSize: 22, fontWeight: '700', color: colors.title, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.subtitle, marginBottom: 20 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.card, borderColor: colors.error, borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 16 },
  errorBannerText: { flex: 1, color: colors.error, fontSize: 12, lineHeight: 17 },
  retryButton: { paddingVertical: 5, paddingHorizontal: 8 },
  retryButtonText: { color: colors.error, fontSize: 12, fontWeight: '700' },
  loadingContainer: { flex: 1, minHeight: 260, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: colors.subtitle, fontSize: 13 },
  logoUploadBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.inputBorder, borderRadius: 12, padding: 12, marginBottom: 24, backgroundColor: colors.card },
  logoTextBlock: { flex: 1 },
  logoMainText: { fontSize: 13, fontWeight: '600', color: colors.title },
  logoSubText: { fontSize: 11, color: colors.subtitle, marginTop: 2 },
  uploadBadge: { backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  uploadBadgeText: { color: colors.onPrimary, fontSize: 12, fontWeight: '700' },
  fieldWrapper: { marginBottom: 24 },
  fieldLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: colors.subtitle, marginBottom: 6, textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.inputBorder, borderRadius: 10, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, backgroundColor: colors.inputBg },
  inputRowReadOnly: { backgroundColor: colors.card },
  inputRowError: { borderColor: colors.error },
  textInput: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },
  textInputReadOnly: { color: colors.subtitle },
  fieldError: { color: colors.error, fontSize: 11, marginTop: 5 },
  helperText: { color: colors.subtitle, fontSize: 11, marginTop: 5 },
  continueButton: { marginTop: 8, backgroundColor: colors.accent, borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  buttonDisabled: { opacity: 0.65 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  continueButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: 'bold' },
});

export default CompanyInformationScreen as React.ComponentType<any>;
