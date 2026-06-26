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
 *      - Placement Office (multi-line info box: location, phone, hours)
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
// Same teal/mint family used across the onboarding flow for consistency.
const COLORS = {
  background:        '#F5FBFA', // mint — full screen background
  card:              '#FFFFFF', // white card behind all content
  progressTrack:     '#B2DDD8', // unfilled part of progress bar
  progressFill:      '#2EC4B6', // filled part of progress bar
  stepLabel:         '#4A7C75', // "University setup · Step 3 of 4"
  stepPercent:       '#2EC4B6', // "75%" text
  title:             '#0D3B47', // "Career services setup"
  subtitle:          '#4A7C75', // "Who do employers reach out to?"

  label:             '#0D3B47', // ALL CAPS field labels
  inputBg:           '#FFFFFF', // input box background
  inputBorder:       '#C5E8E3', // idle border
  inputBorderFocus:  '#2EC4B6', // focused border
  inputText:         '#0D3B47', // text the user types
  placeholder:       '#9BB8B4', // placeholder text
  inputIcon:         '#9BB8B4', // icon inside single-line inputs

  // The "Placement Office" multi-line info box has its own slightly
  // different styling since it shows 3 stacked rows instead of one input
  infoBoxBg:         '#FFFFFF',
  infoBoxBorder:     '#C5E8E3',
  infoBoxIcon:       '#2EC4B6', // location/phone/clock icons are teal here
  infoBoxText:       '#0D3B47',

  continueBtn:       '#2EC4B6', // Continue button
  continueBtnText:   '#FFFFFF',
};


// ─── DATA: simple text fields ────────────────────────────────────
// These four fields each render as a single labeled input box.
// Storing them in an array means adding a 5th field later is a one-line change.
const SIMPLE_FIELDS = [
  {
    id: 'contactName',
    label: 'CAREER SERVICES CONTACT',
    placeholder: 'Dr. Sarah Whitman',
    icon: '👤',
    keyboardType: 'default' as const,
  },
  {
    id: 'departmentEmail',
    label: 'DEPARTMENT EMAIL',
    placeholder: 'career.services@mit.edu',
    icon: '✉',
    keyboardType: 'email-address' as const,
  },
];

// The second group of fields (coordinator) sits AFTER the placement
// office info box, so it's kept as a separate array rather than merging
// everything into one list — this keeps the layout order easy to follow.
const COORDINATOR_FIELDS = [
  {
    id: 'coordinatorName',
    label: 'INTERNSHIP COORDINATOR',
    placeholder: 'Marcus Liu',
    icon: '👤',
    keyboardType: 'default' as const,
  },
  {
    id: 'coordinatorEmail',
    label: '', // no label shown above this one in the design — it sits right under the name field
    placeholder: 'm.liu@mit.edu',
    icon: '✉',
    keyboardType: 'email-address' as const,
  },
];

// ─── DATA: placement office info rows ────────────────────────────
// The Placement Office box shows three rows, each with a different icon.
// Looping over this array avoids writing the same row markup three times.
const PLACEMENT_INFO_ROWS = [
  { id: 'location', icon: '📍', text: 'Building E39, 2nd Floor' },
  { id: 'phone', icon: '📞', text: '+1 (617) 253-4733' },
  { id: 'hours', icon: '💼', text: 'Mon – Fri · 9:00 – 17:00' },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function CareerServicesSetupScreen({ navigation }: any) {

  // Single state object holding every text field's value.
  // The key is the field's id (e.g. 'contactName', 'departmentEmail').
  const [formValues, setFormValues] = useState<Record<string, string>>({
    contactName: '',
    departmentEmail: '',
    coordinatorName: '',
    coordinatorEmail: '',
  });

  // Tracks which input is currently focused, so we can highlight its border
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Updates just one field in formValues without touching the others
  const handleChange = (id: string, value: string) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  // Called when the Continue button is tapped
  const handleContinue = () => {
    console.log('Career services info submitted:', formValues);
    navigation.navigate('ReviewComplete'); // step 4 of 4
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
        {/* Icon placeholder — swap for <Ionicons /> later */}
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
  );

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


            {/* ── PLACEMENT OFFICE INFO BOX ─────────────────────────
                This is NOT an editable input in the design — it's a
                read-only style box showing location, phone, and hours
                as three stacked rows with icons.
                If you want this editable later, swap the Text rows
                for TextInput fields following the same pattern as above.
            */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PLACEMENT OFFICE</Text>

              <View style={styles.infoBox}>
                {/*
                  .map() loops over the three rows (location, phone, hours)
                  so we don't repeat the same icon + text markup 3 times.
                */}
                {PLACEMENT_INFO_ROWS.map((row, index) => (
                  <View
                    key={row.id}
                    style={[
                      styles.infoRow,
                      // Remove the bottom margin on the last row so spacing looks even
                      index === PLACEMENT_INFO_ROWS.length - 1 && styles.infoRowLast,
                    ]}
                  >
                    <Text style={styles.infoRowIcon}>{row.icon}</Text>
                    <Text style={styles.infoRowText}>{row.text}</Text>
                  </View>
                ))}
              </View>
            </View>
            {/* ── END PLACEMENT OFFICE BOX ──────────────────────────── */}


            {/* ── Coordinator fields: Name + Email ──────────────────── */}
            {COORDINATOR_FIELDS.map(renderField)}


            {/* ── CONTINUE BUTTON ────────────────────────────────────── */}
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>

          </View>
          {/* ── END WHITE CARD ───────────────────────────────────────── */}

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

  // ScrollView keeps mint visible around the white card
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: COLORS.background,
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
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.progressFill,
    borderRadius: 3,
  },

  // ── White card ──────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  // ── Title ───────────────────────────────────────────────────────
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

  // ── Input fields (shared by all single-line fields) ───────────────
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

  // ── Placement Office info box ──────────────────────────────────
  // A bordered box containing 3 stacked rows (location, phone, hours)
  infoBox: {
    backgroundColor: COLORS.infoBoxBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.infoBoxBorder,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  // Each row: icon on the left, text filling the rest of the space
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 0,
  },
  // Removes the divider feel on the very last row (no-op currently, kept
  // here in case you want to add a bottom border on all but the last row)
  infoRowLast: {
    marginBottom: 0,
  },
  infoRowIcon: {
    fontSize: 15,
    color: COLORS.infoBoxIcon,
    marginRight: 12,
    width: 20, // fixed width keeps all icons vertically aligned regardless of glyph width
  },
  infoRowText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.infoBoxText,
  },

  // ── Continue button ────────────────────────────────────────────
  continueBtn: {
    backgroundColor: COLORS.continueBtn,
    borderRadius: 50, // pill shape
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
    // Teal glow shadow
    shadowColor: COLORS.continueBtn,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.continueBtnText,
    letterSpacing: 0.5,
  },

});