/**
 * UniversityInfoScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — University Onboarding: Step 1 of 4
 * "University Information"
 *
 * Design: Mint background + white card containing all form content.
 * The progress header sits OUTSIDE the card (on the mint background).
 * Everything else (title, upload, fields, button) is INSIDE the card.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
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


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:       '#D9F2EE', // mint — full screen background
  card:             '#FFFFFF', // white card behind form content
  progressTrack:    '#B2DDD8', // unfilled part of progress bar
  progressFill:     '#2EC4B6', // filled part of progress bar
  stepLabel:        '#4A7C75', // "University Setup · Step 1 of 4"
  stepPercent:      '#2EC4B6', // "25%" text
  title:            '#0D3B47', // "University information"
  subtitle:         '#4A7C75', // "Help students recognize..."
  uploadCard:       '#F4FCFB', // slightly tinted upload box (sits inside white card)
  uploadCardBorder: '#C5E8E3', // upload box border
  uploadIconCircle: '#E8F8F5', // circle behind upload arrow
  uploadIconBorder: '#2EC4B6', // dashed border on icon circle
  uploadIcon:       '#2EC4B6', // the upload arrow icon
  uploadTitle:      '#0D3B47', // "Upload university logo"
  uploadSubtitle:   '#9BB8B4', // "PNG or SVG · max 2MB · square"
  uploadBtn:        '#2EC4B6', // "Upload" pill button
  uploadBtnText:    '#FFFFFF',
  label:            '#0D3B47', // field labels (ALL CAPS)
  inputBg:          '#FFFFFF', // input box background
  inputBorder:      '#C5E8E3', // idle border
  inputBorderFocus: '#2EC4B6', // focused border
  inputText:        '#0D3B47', // text user types
  placeholder:      '#9BB8B4', // placeholder text
  inputIcon:        '#9BB8B4', // icon inside input
  nextBtn:          '#2EC4B6', // Next button
  nextBtnText:      '#FFFFFF',
};


// ─── FIELD DATA ──────────────────────────────────────────────────
const FIELDS = [
  {
    id: 'name',
    label: 'UNIVERSITY NAME',
    placeholder: 'Massachusetts Institute of Technology',
    icon: '🎓',
    keyboardType: 'default' as const,
  },
  {
    id: 'email',
    label: 'OFFICIAL EMAIL',
    placeholder: 'careers@mit.edu',
    icon: '✉',
    keyboardType: 'email-address' as const,
  },
  {
    id: 'phone',
    label: 'CONTACT PHONE',
    placeholder: '+1 (617) 253-1000',
    icon: '📞',
    keyboardType: 'phone-pad' as const,
  },
  {
    id: 'website',
    label: 'WEBSITE',
    placeholder: 'https://www.mit.edu',
    icon: '🌐',
    keyboardType: 'url' as const,
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function UniversityInfoScreen({ navigation }: any) {

  const [formValues, setFormValues] = useState<Record<string, string>>({
    name: '',
    email: '',
    phone: '',
    website: '',
  });

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [logoUploaded, setLogoUploaded] = useState(false);

  const handleChange = (id: string, value: string) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    console.log('University info submitted:', formValues);
    // TODO: navigation.navigate('UniversityStep2');
  };

  const PROGRESS = 0.25; // step 1 of 4 = 25%

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

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
            <Text style={styles.stepLabel}>University Setup · Step 1 of 4</Text>
            <Text style={styles.stepPercent}>25%</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${PROGRESS * 100}%` }]} />
          </View>
          {/* ── END PROGRESS HEADER ─────────────────────────── */}


          {/* ── WHITE CARD — contains all form content ──────── */}
          <View style={styles.card}>

            {/* ── Title ───────────────────────────────────────── */}
            <Text style={styles.title}>University information</Text>
            <Text style={styles.subtitle}>
              Help students recognize your institution.
            </Text>

            {/* ── Upload logo row ─────────────────────────────── */}
            <View style={styles.uploadCard}>

              {/* Dashed circle icon */}
              <View style={styles.uploadIconCircle}>
                {/* TODO: replace with <Ionicons name="cloud-upload-outline" size={22} color={COLORS.uploadIcon} /> */}
                <Text style={styles.uploadIconText}>⬆</Text>
              </View>

              {/* Title + subtitle */}
              <View style={styles.uploadTextBlock}>
                <Text style={styles.uploadTitle}>Upload university logo</Text>
                <Text style={styles.uploadSubtitle}>PNG or SVG · max 2MB · square</Text>
              </View>

              {/* Upload pill button */}
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={() => {
                  setLogoUploaded(true);
                  console.log('Upload logo tapped');
                  // TODO: open image picker with expo-image-picker
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.uploadBtnText}>
                  {logoUploaded ? 'Change' : 'Upload'}
                </Text>
              </TouchableOpacity>

            </View>
            {/* ── End upload row ───────────────────────────────── */}


            {/* ── Input fields ────────────────────────────────── */}
            <View style={styles.fieldsContainer}>
              {FIELDS.map((field) => (
                <View key={field.id} style={styles.fieldGroup}>

                  {/* ALL CAPS label */}
                  <Text style={styles.label}>{field.label}</Text>

                  {/* Icon + TextInput row */}
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === field.id && styles.inputWrapperFocused,
                  ]}>
                    {/* TODO: swap emoji for <Ionicons /> later */}
                    <Text style={styles.inputIcon}>{field.icon}</Text>

                    <TextInput
                      style={styles.input}
                      placeholder={field.placeholder}
                      placeholderTextColor={COLORS.placeholder}
                      value={formValues[field.id]}
                      onChangeText={(value) => handleChange(field.id, value)}
                      keyboardType={field.keyboardType}
                      autoCapitalize={field.keyboardType === 'default' ? 'words' : 'none'}
                      onFocus={() => setFocusedInput(field.id)}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>

                </View>
              ))}
            </View>
            {/* ── End input fields ─────────────────────────────── */}


            {/* ── Next button ─────────────────────────────────── */}
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>Next  →</Text>
            </TouchableOpacity>

          </View>
          {/* ── END WHITE CARD ──────────────────────────────── */}


        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({

  flex: {
    flex: 1,
  },

  // Full mint background
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ScrollView keeps mint background all the way to edges
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: COLORS.background,
  },

  // ── Progress header (outside card, on mint) ───────────────────
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: COLORS.stepLabel,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  stepPercent: {
    fontSize: 12,
    color: COLORS.stepPercent,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: COLORS.progressTrack,
    borderRadius: 3,
    marginBottom: 20,   // space between progress bar and the white card
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.progressFill,
    borderRadius: 3,
  },

  // ── White card ────────────────────────────────────────────────
  // This wraps the title, upload row, fields, and button
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    // Shadow so it lifts off the mint background
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  // ── Title (inside card) ───────────────────────────────────────
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.title,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtitle,
    lineHeight: 20,
    marginBottom: 22,
  },

  // ── Upload row (inside card) ──────────────────────────────────
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.uploadCard,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.uploadCardBorder,
    padding: 14,
    marginBottom: 24,
  },
  uploadIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.uploadIconCircle,
    borderWidth: 1.5,
    borderColor: COLORS.uploadIconBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  uploadIconText: {
    fontSize: 20,
    color: COLORS.uploadIcon,
  },
  uploadTextBlock: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.uploadTitle,
    marginBottom: 3,
  },
  uploadSubtitle: {
    fontSize: 11,
    color: COLORS.uploadSubtitle,
    lineHeight: 16,
  },
  uploadBtn: {
    backgroundColor: COLORS.uploadBtn,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.uploadBtnText,
  },

  // ── Input fields (inside card) ────────────────────────────────
  fieldsContainer: {
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.label,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 14,
    height: 52,
    // Subtle shadow on each input box
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: COLORS.inputBorderFocus,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    color: COLORS.inputIcon,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.inputText,
  },

  // ── Next button (inside card) ─────────────────────────────────
  nextBtn: {
    backgroundColor: COLORS.nextBtn,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.nextBtn,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.nextBtnText,
    letterSpacing: 0.5,
  },

});