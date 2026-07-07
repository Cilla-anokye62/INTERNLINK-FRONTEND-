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


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:    '#F5FBFA',
  card:          '#FFFFFF',
  cardBorder:    '#C5E8E3',
  title:         '#0D3B47',
  subtitle:      '#4A7C75',
  label:         '#0D3B47',
  inputBg:       '#FFFFFF',
  inputBorder:   'transparent',
  inputFocus:    '#2CACAD',
  placeholder:   '#94A3B8',
  accent:        '#2CACAD',
  accentText:    '#FFFFFF',
  danger:        '#E0524C',
  chevron:       '#C7DAD7',
  rowBorder:     '#F0F6F5',
  pillIdle:      '#F0F6F5',
  pillIdleText:  '#4A7C75',
  pillActive:    '#2CACAD',
  pillActiveText: '#FFFFFF',
  successBg:     '#E8F8F5',
  successText:   '#10B981',
  successIcon:   '#10B981',
};


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
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

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
                color={COLORS.title}
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
                color={COLORS.successIcon}
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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

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
              color={COLORS.title}
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
              placeholderTextColor={COLORS.placeholder}
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
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.card,
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
    color: COLORS.title,
  },

  // ── Field Group ───────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.label,
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
    backgroundColor: COLORS.pillIdle,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.pillIdle,
  },
  typePillActive: {
    backgroundColor: COLORS.pillActive,
    borderColor: COLORS.pillActive,
  },
  typePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.pillIdleText,
  },
  typePillTextActive: {
    color: COLORS.pillActiveText,
  },

  // ── Input Container ───────────────────────────────────────────
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: COLORS.inputFocus,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.title,
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
    backgroundColor: COLORS.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accentText,
  },
  submitBtnTextDisabled: {
    color: COLORS.placeholder,
  },

  // ── Confirmation Card ─────────────────────────────────────────
  confirmationCard: {
    backgroundColor: COLORS.card,
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
    backgroundColor: COLORS.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.title,
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 14,
    color: COLORS.subtitle,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  doneBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accentText,
  },
  anotherBtn: {
    paddingVertical: 12,
  },
  anotherBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
  },

});
