/**
 * InstitutionDetailsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — University Onboarding: Step 2 of 4
 * "Institution details"
 *
 * Content (from design):
 *  - Progress header: step label + 50% progress bar (mint background)
 *  - White card containing:
 *      - Title + subtitle
 *      - Institution Type (3 selectable pill buttons: Public/Private/Hybrid)
 *      - Country + City (two inputs side by side)
 *      - Number of Students (single input with icon)
 *      - Academic Programs Offered (multi-select chip grid inside a box)
 *      - Continue button
 *
 * HOW TO USE:
 *  1. Drop inside your "University Onboarding" folder
 *  2. Add to App.tsx:
 *     import InstitutionDetailsScreen from './app/University Onboarding/InstitutionDetailsScreen';
 *     <Stack.Screen name="InstitutionDetails" component={InstitutionDetailsScreen} />
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
const COLORS = {
  background:        '#F5FBFA', // mint — full screen background
  card:              'transparent', // transparent card
  progressTrack:     '#B2DDD8', // unfilled part of progress bar
  progressFill:      '#2CACAD', // filled part of progress bar
  stepLabel:         '#64748B', // "University setup · Step 2 of 4"
  stepPercent:       '#2CACAD', // "50%" text
  title:             '#024D60', // "Institution details"
  subtitle:          '#64748B', // "Tell employers about your campus."

  label:             '#024D60', // field labels

  // Institution Type pill buttons (Public / Private / Hybrid)
  typeIdleBg:        '#FFFFFF',
  typeIdleBorder:    '#C5E8E3',
  typeIdleText:      '#4A7C75',
  typeActiveBg:      '#2CACAD', // selected pill (e.g. "Private")
  typeActiveText:    '#FFFFFF',

  // Regular text inputs (Country, City, Number of Students)
  inputBg:           '#FFFFFF',
  inputBorder:       'transparent',
  inputBorderFocus:  '#2CACAD',
  inputText:         '#024D60',
  placeholder:       '#94A3B8',
  inputIcon:         '#94A3B8',

  // Academic Programs box + chips
  programsBoxBg:     '#FFFFFF',
  programsBoxBorder: '#C5E8E3',
  programsHint:      '#94A3B8', // "Select all that apply"
  chipIdleBg:        '#FFFFFF',
  chipIdleBorder:    '#D8E8E5',
  chipIdleText:      '#4A7C75',
  chipActiveBg:      '#2CACAD', // selected chip (e.g. "Computer Science")
  chipActiveText:    '#FFFFFF',

  continueBtn:       '#2CACAD',
  continueBtnText:   '#FFFFFF',
};


// ─── DATA ─────────────────────────────────────────────────────────

// The three Institution Type options. Stored as an array so adding a
// 4th option later (e.g. "Online") is a one-line change.
const INSTITUTION_TYPES = ['Public', 'Private', 'Hybrid'];

// All available academic programs shown as selectable chips.
// Looping over this array avoids writing 7 nearly-identical chip elements.
const ACADEMIC_PROGRAMS = [
  'Computer Science',
  'Engineering',
  'Business',
  'Design',
  'Data Science',
  'Medicine',
  'Liberal Arts',
  'Architecture',
  'Law',
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function InstitutionDetailsScreen({ navigation }: any) {

  // Which Institution Type pill is currently selected (starts as 'Private'
  // to match the design's example — change to null if you want nothing
  // selected by default).
  const [institutionType, setInstitutionType] = useState<string>('Private');

  // Plain text field values
  const [country, setCountry] = useState('Ghana');
  const [city, setCity] = useState('Ashanti Region, Kumasi');
  const [studentCount, setStudentCount] = useState('11,520 students');

  // Tracks which text input is focused, for border highlighting
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Which academic program chips are currently selected.
  // Stored as an array of strings; starts with the same 3 selected
  // chips shown in the design (Computer Science, Engineering, Data Science).
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([
    'Computer Science',
    'Engineering',
    'Data Science',
  ]);

  // Toggles a single program chip on/off when tapped
  const toggleProgram = (program: string) => {
    setSelectedPrograms(prev =>
      prev.includes(program)
        ? prev.filter(p => p !== program) // already selected → remove it
        : [...prev, program]              // not selected → add it
    );
  };

  // Called when Continue is tapped
  const handleContinue = () => {
    console.log('Institution details submitted:', {
      institutionType,
      country,
      city,
      studentCount,
      selectedPrograms,
    });
    navigation.navigate('CareerServicesSetup'); // step 3 of 4
  };

  // Step 2 of 4 = 50%
  const PROGRESS = 0.5;

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
            <Text style={styles.stepLabel}>University setup · Step 2 of 4</Text>
            <Text style={styles.stepPercent}>50%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${PROGRESS * 100}%` }]} />
          </View>
          {/* ── END PROGRESS HEADER ─────────────────────────────────── */}


          {/* ── WHITE CARD — contains all form content ──────────────── */}
          <View style={styles.card}>

            {/* ── Title ───────────────────────────────────────────── */}
            <Text style={styles.title}>Institution details</Text>
            <Text style={styles.subtitle}>Tell employers about your campus.</Text>


            {/* ── INSTITUTION TYPE — 3 selectable pill buttons ──────── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>INSTITUTION TYPE</Text>

              {/* Row holding the three pill buttons side by side */}
              <View style={styles.typeRow}>
                {/*
                  .map() loops over INSTITUTION_TYPES and renders one
                  pill per type. isSelected decides which style to use.
                */}
                {INSTITUTION_TYPES.map((type) => {
                  const isSelected = institutionType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typePill,
                        isSelected && styles.typePillActive,
                      ]}
                      onPress={() => setInstitutionType(type)}
                      activeOpacity={0.85}
                    >
                      <Text style={[
                        styles.typePillText,
                        isSelected && styles.typePillTextActive,
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {/* ── END INSTITUTION TYPE ──────────────────────────────── */}


            {/* ── COUNTRY + CITY — two inputs side by side ──────────── */}
            <View style={styles.sideBySideRow}>

              {/* Country field — flex: 1 makes each half take equal width */}
              <View style={styles.sideBySideField}>
                <Text style={styles.label}>COUNTRY</Text>
                <View style={[
                  styles.inputWrapper,
                  focusedInput === 'country' && styles.inputWrapperFocused,
                ]}>
                  {/* TODO: swap for <Ionicons name="location-outline" /> */}
                  <Text style={styles.inputIcon}>📍</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="United States"
                    placeholderTextColor={COLORS.placeholder}
                    value={country}
                    onChangeText={setCountry}
                    onFocus={() => setFocusedInput('country')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Small gap between the two fields */}
              <View style={styles.sideBySideGap} />

              {/* City field */}
              <View style={styles.sideBySideField}>
                <Text style={styles.label}>CITY</Text>
                <View style={[
                  styles.inputWrapper,
                  focusedInput === 'city' && styles.inputWrapperFocused,
                ]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Cambridge, MA"
                    placeholderTextColor={COLORS.placeholder}
                    value={city}
                    onChangeText={setCity}
                    onFocus={() => setFocusedInput('city')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

            </View>
            {/* ── END COUNTRY + CITY ────────────────────────────────── */}


            {/* ── NUMBER OF STUDENTS ─────────────────────────────────── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>NUMBER OF STUDENTS</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'students' && styles.inputWrapperFocused,
              ]}>
                {/* TODO: swap for <Ionicons name="people-outline" /> */}
                <Text style={styles.inputIcon}>👥</Text>
                <TextInput
                  style={styles.input}
                  placeholder="11,520 students"
                  placeholderTextColor={COLORS.placeholder}
                  value={studentCount}
                  onChangeText={setStudentCount}
                  keyboardType="default"
                  onFocus={() => setFocusedInput('students')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>
            {/* ── END NUMBER OF STUDENTS ────────────────────────────── */}


            {/* ── ACADEMIC PROGRAMS OFFERED — multi-select chips ─────── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>ACADEMIC PROGRAMS OFFERED</Text>

              <View style={styles.programsBox}>
                <Text style={styles.programsHint}>Select all that apply</Text>

                {/*
                  flexWrap: 'wrap' on chipsWrapper lets chips flow onto
                  multiple lines automatically, like text wrapping.
                  We don't need to manually calculate rows.
                */}
                <View style={styles.chipsWrapper}>
                  {ACADEMIC_PROGRAMS.map((program) => {
                    const isSelected = selectedPrograms.includes(program);
                    return (
                      <TouchableOpacity
                        key={program}
                        style={[
                          styles.chip,
                          isSelected && styles.chipActive,
                        ]}
                        onPress={() => toggleProgram(program)}
                        activeOpacity={0.8}
                      >
                        {/* Checkmark only shows on selected chips */}
                        {isSelected && (
                          <Text style={styles.chipCheck}>✓ </Text>
                        )}
                        <Text style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}>
                          {program}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
            {/* ── END ACADEMIC PROGRAMS ─────────────────────────────── */}


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

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: COLORS.background,
  },

  // ── Progress header ────────────────────────────────────────────
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

  // ── Card ──────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 0,
  },

  // ── Title ───────────────────────────────────────────────────────
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.title,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtitle,
    lineHeight: 20,
    marginBottom: 22,
  },

  // ── Shared field group + label (used by every section below) ──────
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.label,
    marginBottom: 6,
  },

  // ── Institution Type pills ─────────────────────────────────────
  typeRow: {
    flexDirection: 'row',
    gap: 10, // space between the three pills (RN 0.71+; use marginRight on older RN)
  },
  typePill: {
    flex: 1, // all three pills share equal width
    backgroundColor: COLORS.typeIdleBg,
    borderWidth: 1.5,
    borderColor: COLORS.typeIdleBorder,
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },
  typePillActive: {
    backgroundColor: COLORS.typeActiveBg,
    borderColor: COLORS.typeActiveBg,
  },
  typePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.typeIdleText,
  },
  typePillTextActive: {
    color: COLORS.typeActiveText,
    fontWeight: '700',
  },

  // ── Side-by-side fields (Country / City) ───────────────────────
  sideBySideRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  sideBySideField: {
    flex: 1, // each field takes up half the row width
  },
  sideBySideGap: {
    width: 12, // fixed gap between the two fields
  },

  // ── Standard text input wrapper (shared by all single-line fields) ──
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
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
    borderColor: COLORS.inputBorderFocus,
  },
  inputIcon: {
    fontSize: 15,
    marginRight: 10,
    color: COLORS.inputIcon,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.inputText,
  },

  // ── Academic Programs box ──────────────────────────────────────
  programsBox: {
    backgroundColor: COLORS.programsBoxBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.programsBoxBorder,
    padding: 14,
  },
  programsHint: {
    fontSize: 12,
    color: COLORS.programsHint,
    marginBottom: 10,
  },
  // flexWrap lets chips automatically flow onto new lines as needed
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // space between chips, both horizontally and vertically
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chipIdleBg,
    borderWidth: 1.5,
    borderColor: COLORS.chipIdleBorder,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipActive: {
    backgroundColor: COLORS.chipActiveBg,
    borderColor: COLORS.chipActiveBg,
  },
  chipCheck: {
    fontSize: 12,
    color: COLORS.chipActiveText,
    fontWeight: '700',
  },
  chipText: {
    fontSize: 13,
    color: COLORS.chipIdleText,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.chipActiveText,
    fontWeight: '700',
  },

  // ── Continue button ────────────────────────────────────────────
  continueBtn: {
    backgroundColor: COLORS.continueBtn,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.continueBtnText,
  },

});