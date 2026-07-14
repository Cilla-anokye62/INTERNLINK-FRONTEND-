/**
 * SendFeedbackScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Send Feedback (SUPPORT section in SettingsScreen)
 *
 * Content:
 *  - Feedback type selector (Bug report / Feature request / General feedback)
 *    as 3 pills
 *  - Multi-line TextInput for the message
 *  - Submit button
 *  - Brief thank-you confirmation state after submitting
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import SendFeedbackScreen from './app/SendFeedbackScreen';
 *     <Stack.Screen name="SendFeedback" component={SendFeedbackScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";

// ─── DATA ─────────────────────────────────────────────────────────
// Feedback type options
const FEEDBACK_TYPES = [
  {
    id: 'bug',
    label: 'Bug report',
  },
  {
    id: 'feature',
    label: 'Feature request',
  },
  {
    id: 'general',
    label: 'General feedback',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function SendFeedbackScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // Form state
  const [feedbackType, setFeedbackType] = useState('general');
  const [message, setMessage] = useState('');

  // Track which input is focused
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Confirmation state
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    console.log('Submitting feedback:', { type: feedbackType, message });
    // TODO: send to backend
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFeedbackType('general');
    setMessage('');
    setIsSubmitted(false);
  };

  // If submitted, show confirmation state
  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ── HEADER ROW: back arrow + title ──────────────────────── */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back-outline"
                size={22}
                color={colors.title}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Send Feedback</Text>
          </View>
          {/* ── END HEADER ──────────────────────────────────────────── */}


          {/* ── CONFIRMATION STATE ─────────────────────────────────── */}
          <View style={styles.confirmationCard}>
            <View style={styles.successIconCircle}>
              <Ionicons
                name="checkmark"
                size={40}
                color={colors.successIcon}
              />
            </View>
            <Text style={styles.confirmationTitle}>Thank you!</Text>
            <Text style={styles.confirmationText}>
              Your feedback has been submitted. We appreciate your input and will review it shortly.
            </Text>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={handleBackPress}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.anotherBtn}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.anotherBtnText}>Send another feedback</Text>
            </TouchableOpacity>
          </View>
          {/* ── END CONFIRMATION STATE ───────────────────────────── */}

        </ScrollView>
      </SafeAreaView>
    );
  }

  // Normal form state
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── HEADER ROW: back arrow + title ──────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-outline"
              size={22}
              color={colors.title}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Feedback</Text>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── FEEDBACK TYPE SELECTOR ───────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>FEEDBACK TYPE</Text>
          <View style={styles.pillsRow}>
            {FEEDBACK_TYPES.map((type) => {
              const isSelected = feedbackType === type.id;

              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typePill,
                    isSelected && styles.typePillActive,
                  ]}
                  onPress={() => setFeedbackType(type.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.typePillText,
                    isSelected && styles.typePillTextActive,
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* ── END FEEDBACK TYPE SELECTOR ─────────────────────────── */}


        {/* ── MESSAGE INPUT ───────────────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>MESSAGE</Text>
          <View style={[
            styles.inputContainer,
            styles.textAreaContainer,
            focusedInput === 'message' && styles.inputContainerFocused,
          ]}>
            <TextInput
              style={[styles.input, styles.textAreaInput]}
              placeholder="Tell us what's on your mind..."
              placeholderTextColor={colors.placeholder}
              value={message}
              onChangeText={setMessage}
              onFocus={() => setFocusedInput('message')}
              onBlur={() => setFocusedInput(null)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>
        {/* ── END MESSAGE INPUT ─────────────────────────────────── */}


        {/* ── SUBMIT BUTTON ───────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={message.trim().length === 0}
        >
          <Text style={[
            styles.submitBtnText,
            message.trim().length === 0 && styles.submitBtnTextDisabled,
          ]}>
            Submit Feedback
          </Text>
        </TouchableOpacity>
        {/* ── END SUBMIT BUTTON ─────────────────────────────────── */}

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const createStyles = (colors: any) => StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.title,
  },

  // ── Field Group ───────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.label,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },

  // ── Type Pills ────────────────────────────────────────────────
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typePill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.pillIdle,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.pillIdle,
  },
  typePillActive: {
    backgroundColor: colors.pillActive,
    borderColor: colors.pillActive,
  },
  typePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.pillIdleText,
  },
  typePillTextActive: {
    color: colors.pillActiveText,
  },

  // ── Input Container ───────────────────────────────────────────
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: colors.inputFocus,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.title,
  },

  // ── Text Area ─────────────────────────────────────────────────
  textAreaContainer: {
    height: 140,
    alignItems: 'flex-start',
    paddingTop: 14,
  },
  textAreaInput: {
    textAlignVertical: 'top',
  },

  // ── Submit Button ─────────────────────────────────────────────
  submitBtn: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accentText,
  },
  submitBtnTextDisabled: {
    color: colors.placeholder,
  },

  // ── Confirmation Card ─────────────────────────────────────────
  confirmationCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 14,
    color: colors.subtitle,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  doneBtn: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accentText,
  },
  anotherBtn: {
    paddingVertical: 12,
  },
  anotherBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },

});
