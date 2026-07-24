/**
 * CareerServicesSetupScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — University Onboarding: Step 3 of 4
 * "Career services setup"
 *
 * Content (from design):
 *  - Progress header: step label + 75% progress bar (mint background)
 *  - White card containing:
 *      - Title + subtitle
 *      - Career Services Contact (single-line input)
 *      - Department Email (single-line input)
 *      - Internship Coordinator name (single-line input)
 *      - Internship Coordinator email (single-line input)
 *      - Continue button
 *
 * HOW TO USE:
 *  1. Drop inside your "University Onboarding" folder
 *  2. Add to App.tsx:
 *     import CareerServicesSetupScreen from './app/University Onboarding/CareerServicesSetupScreen';
 *     <Stack.Screen name="CareerServicesSetup" component={CareerServicesSetupScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuthErrorMessage, universityApi } from '../../src/api';
import { useAppTheme } from "../../src/hooks/useAppTheme";


// ─── DATA: simple text fields ────────────────────────────────────
// These four fields each render as a single labeled input box.
// Storing them in an array means adding a 5th field later is a one-line change.
const SIMPLE_FIELDS = [
  {
    id: 'contactName',
    label: 'CAREER SERVICES CONTACT',
    placeholder: 'e.g. Career Services Director',
    icon: 'person-outline',
    keyboardType: 'default' as const,
  },
  {
    id: 'departmentEmail',
    label: 'DEPARTMENT EMAIL',
    placeholder: 'careers@university.edu',
    icon: 'mail-outline',
    keyboardType: 'email-address' as const,
  },
];

// Coordinator fields stay in a separate group to preserve the design's spacing.
const COORDINATOR_FIELDS = [
  {
    id: 'coordinatorName',
    label: 'INTERNSHIP COORDINATOR',
    placeholder: 'e.g. Internship Coordinator',
    icon: 'person-outline',
    keyboardType: 'default' as const,
  },
  {
    id: 'coordinatorEmail',
    label: '', // no label shown above this one in the design — it sits right under the name field
    placeholder: 'coordinator@university.edu',
    icon: 'mail-outline',
    keyboardType: 'email-address' as const,
  },
];

type FormValues = {
  contactName: string;
  departmentEmail: string;
  coordinatorName: string;
  coordinatorEmail: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function CareerServicesSetupScreen({ navigation }: any) {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // Single state object holding every text field's value.
  // The key is the field's id (e.g. 'contactName', 'departmentEmail').
  const [formValues, setFormValues] = useState<FormValues>({
    contactName: '',
    departmentEmail: '',
    coordinatorName: '',
    coordinatorEmail: '',
  });

  // Tracks which input is currently focused, so we can highlight its border
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setLoadError(null);
    universityApi.getMe()
      .then((profile) => {
        if (!active) return;
        setFormValues({
          contactName: profile.careerServicesContactName ?? '',
          departmentEmail: profile.departmentEmail ?? '',
          coordinatorName: profile.internshipCoordinatorName ?? '',
          coordinatorEmail: profile.internshipCoordinatorEmail ?? '',
        });
      })
      .catch((error: unknown) => {
        if (active) setLoadError(getAuthErrorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadAttempt]);

  // Updates just one field in formValues without touching the others
  const handleChange = (id: keyof FormValues, value: string) => {
    setSubmitError(null);
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  // Called when the Continue button is tapped
  const handleContinue = async (): Promise<void> => {
    if (isSubmitting) return;

    const contactName = formValues.contactName.trim();
    const departmentEmail = formValues.departmentEmail.trim().toLowerCase();
    const coordinatorName = formValues.coordinatorName.trim();
    const coordinatorEmail = formValues.coordinatorEmail.trim().toLowerCase();

    if (!contactName || !departmentEmail || !coordinatorName || !coordinatorEmail) {
      setSubmitError('Complete all four career services fields.');
      return;
    }
    if (contactName.length > 255 || coordinatorName.length > 255) {
      setSubmitError('Contact names must be 255 characters or fewer.');
      return;
    }
    if (departmentEmail.length > 320 || coordinatorEmail.length > 320) {
      setSubmitError('Email addresses must be 320 characters or fewer.');
      return;
    }
    if (!EMAIL_PATTERN.test(departmentEmail) || !EMAIL_PATTERN.test(coordinatorEmail)) {
      setSubmitError('Enter valid email addresses for both contacts.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await universityApi.updateMe({
        careerServicesContactName: contactName,
        departmentEmail,
        internshipCoordinatorName: coordinatorName,
        internshipCoordinatorEmail: coordinatorEmail,
      });
      navigation.navigate('ReviewComplete');
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3 of 4 = 75%
  const PROGRESS = 0.75;

  // Small reusable piece of UI: renders one labeled input box.
  // Defined inside the component so it has access to formValues, focusedInput, etc.
  // without needing to pass everything down as props.
  const renderField = (field: typeof SIMPLE_FIELDS[number]) => (
    <View key={field.id} style={styles.fieldGroup}>

      {/* Only show the label if one was provided — coordinatorEmail has none */}
      {field.label ? <Text style={styles.label}>{field.label}</Text> : null}

      <View style={[
        styles.inputWrapper,
        focusedInput === field.id && styles.inputWrapperFocused,
      ]}>
        <Ionicons
          name={field.icon as any}
          size={18}
          color={colors.inputIcon}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={field.placeholder}
          placeholderTextColor={colors.placeholder}
          value={formValues[field.id as keyof FormValues]}
          onChangeText={(value) => handleChange(field.id as keyof FormValues, value)}
          keyboardType={field.keyboardType}
          autoCapitalize={field.keyboardType === 'default' ? 'words' : 'none'}
          autoCorrect={false}
          maxLength={field.keyboardType === 'email-address' ? 320 : 255}
          editable={!isSubmitting}
          onFocus={() => setFocusedInput(field.id)}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.stateText}>Loading career services details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <Text style={styles.errorText}>{loadError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setLoadAttempt((attempt) => attempt + 1)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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

          {/* ── PROGRESS HEADER — sits on mint background, outside the card ── */}
          <View style={styles.stepRow}>
            <Text style={styles.stepLabel}>University setup · Step 3 of 4</Text>
            <Text style={styles.stepPercent}>75%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${PROGRESS * 100}%` }]} />
          </View>
          {/* ── END PROGRESS HEADER ─────────────────────────────────── */}


          {/* ── WHITE CARD — contains all form content ──────────────── */}
          <View style={styles.card}>

            {/* ── Title ───────────────────────────────────────────── */}
            <Text style={styles.title}>Career services setup</Text>
            <Text style={styles.subtitle}>Who do employers reach out to?</Text>


            {/* ── Simple fields: Contact name + Department email ───── */}
            {SIMPLE_FIELDS.map(renderField)}


            {/* ── Coordinator fields: Name + Email ──────────────────── */}
            {COORDINATOR_FIELDS.map(renderField)}

            {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

            {/* ── CONTINUE BUTTON ────────────────────────────────────── */}
            <TouchableOpacity
              style={[styles.continueBtn, isSubmitting && styles.continueBtnDisabled]}
              onPress={handleContinue}
              activeOpacity={0.85}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.continueBtnText} />
              ) : (
                <Text style={styles.continueBtnText}>Continue</Text>
              )}
            </TouchableOpacity>

          </View>
          {/* ── END WHITE CARD ───────────────────────────────────────── */}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const createStyles = (colors: any) => StyleSheet.create({

  flex: {
    flex: 1,
  },

  // Full mint background
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  stateText: {
    color: colors.subtitle,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  retryButtonText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },

  // ScrollView keeps mint visible around the white card
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },

  // ── Progress header (outside card, on mint) ───────────────────────
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.stepLabel,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  stepPercent: {
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
    height: '100%',
    backgroundColor: colors.progressFill,
    borderRadius: 3,
  },

  // ── Card ──────────────────────────────────────────────────
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 0,
  },

  // ── Title ───────────────────────────────────────────────────────
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
    marginBottom: 22,
  },

  // ── Input fields (shared by all single-line fields) ───────────────
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.label,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: colors.inputBorderFocus,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.inputText,
  },

  // ── Continue button ────────────────────────────────────────────
  continueBtn: {
    backgroundColor: colors.continueBtn,
    borderRadius: 30, // pill shape
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  continueBtnDisabled: {
    opacity: 0.6,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.continueBtnText,
  },

});
