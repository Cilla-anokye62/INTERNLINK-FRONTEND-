/**
 * ReviewCompleteScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — University Onboarding: Step 4 of 4
 * "Review & Complete"
 *
 * Content (from design):
 *  - Progress header: step label + 100% progress bar (mint background)
 *  - White card containing:
 *      - Title + subtitle
 *      - University summary card (avatar, name, location, completeness %)
 *      - Four review rows (University info, Institution details,
 *        Career services, Coordinator) each with an edit icon
 *      - Info banner about review time
 *      - "Complete Setup" button (filled teal)
 *      - "Save & finish later" button (outlined)
 *
 * HOW TO USE:
 *  1. Drop inside your "University Onboarding" folder
 *  2. Add to App.tsx:
 *     import ReviewCompleteScreen from './app/University Onboarding/ReviewCompleteScreen';
 *     <Stack.Screen name="ReviewComplete" component={ReviewCompleteScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';


// ─── COLOR PALETTE ───────────────────────────────────────────────
// Same teal/mint family used across the onboarding flow.
const COLORS = {
  background: '#F5FBFA', // mint — full screen background
  card: 'transparent', // transparent card
  progressTrack: '#B2DDD8', // unfilled part of progress bar
  progressFill: '#2CACAD', // filled part of progress bar
  stepLabel: '#64748B', // "University setup · Step 4 of 4"
  stepPercent: '#2CACAD', // "100%" text
  title: '#024D60', // "Review & complete"
  subtitle: '#64748B', // subtitle text

  // University summary card (inside the white card)
  summaryCardBg: '#FFFFFF', // white background for contrast on teal
  summaryCardBorder: '#C5E8E3',
  avatarBg: '#024D60', // dark teal circle behind "M"
  avatarText: '#FFFFFF',
  summaryName: '#024D60',
  summaryDetail: '#64748B',
  completenessBg: '#D6F2E3', // light green pill behind "95%"
  completenessText: '#1E8E5A', // green text inside the pill
  summaryBarTrack: '#E0F0EE',
  summaryBarFill: '#2CACAD',

  // Review rows
  rowBorder: '#E8F4F2',
  rowIconBg: '#E8F8F5', // light teal circle behind each row icon
  rowIcon: '#2CACAD',
  rowTitle: '#024D60',
  rowSubtitle: '#7A9D98',
  editBtnBg: '#F0F4F3', // grey circle behind the pencil icon
  editIcon: '#5C7D78',

  // Info banner
  bannerBg: '#E3F6F1',
  bannerIconBg: '#2CACAD',
  bannerIcon: '#FFFFFF',
  bannerText: '#1F5C52',

  // Buttons
  completeBtnBg: '#2CACAD',
  completeBtnText: '#FFFFFF',
  saveLaterBtnBg: '#FFFFFF',
  saveLaterBtnBorder: '#D5EAE7',
  saveLaterBtnText: '#64748B',
};


// ─── DATA ─────────────────────────────────────────────────────────
// Each review row's content lives in this array.
// To add another reviewable section later, just add an object here —
// the .map() below will render it automatically.
const REVIEW_ROWS = [
  {
    id: 'universityInfo',
    icon: '🎓',
    title: 'University info',
    detail: 'MIT · careers@mit.edu',
  },
  {
    id: 'institutionDetails',
    icon: '🏢',
    title: 'Institution details',
    detail: 'Private · 5 programs',
  },
  {
    id: 'careerServices',
    icon: '👤',
    title: 'Career services',
    detail: 'Dr. Sarah Whitman',
  },
  {
    id: 'coordinator',
    icon: '💼',
    title: 'Coordinator',
    detail: 'Marcus Liu',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function ReviewCompleteScreen({ navigation }: any) {

  // Step 4 of 4 is fully complete, so progress is 100%
  const PROGRESS = 1;

  // Placeholder values for the university summary card.
  // Later these will come from the data collected in steps 1-3
  // (probably passed in via navigation params or a shared context/state).
  const university = {
    initial: 'M',                 // first letter shown in the avatar circle
    name: 'MIT',
    location: 'Cambridge, MA · 11,520 students',
    completeness: 95,             // percentage shown in the green pill + bar
  };

  // Called when the user taps "Complete Setup"
  const handleCompleteSetup = () => {
    console.log('Completing university setup...');
    navigation.reset({
      index: 0,
      routes: [{ name: 'UniversityTabs' }],
    });
  };

  // Called when the user taps "Save & finish later"
  const handleSaveForLater = () => {
    console.log('Saving progress for later...');
    navigation.reset({
      index: 0,
      routes: [{ name: 'RoleSelection' }],
    });
  };

  // Called when the pencil icon on a review row is tapped
  const handleEditRow = (rowId: string) => {
    console.log('Editing:', rowId);
    // TODO: navigate back to the specific onboarding step for this row, e.g.:
    // if (rowId === 'universityInfo') navigation.navigate('UniversityInfo');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* No KeyboardAvoidingView needed here — there are no text inputs on this screen */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── PROGRESS HEADER — sits on mint background, outside the card ── */}
        <View style={styles.stepRow}>
          <Text style={styles.stepLabel}>University setup · Step 4 of 4</Text>
          <Text style={styles.stepPercent}>100%</Text>
        </View>

        <View style={styles.progressTrack}>
          {/* width is set inline as a percentage so it matches PROGRESS exactly */}
          <View style={[styles.progressFill, { width: `${PROGRESS * 100}%` }]} />
        </View>
        {/* ── END PROGRESS HEADER ─────────────────────────────────── */}


        {/* ── WHITE CARD — contains everything else on this screen ── */}
        <View style={styles.card}>

          {/* ── Title ─────────────────────────────────────────────── */}
          <Text style={styles.title}>Review & complete</Text>
          <Text style={styles.subtitle}>
            Confirm your details to publish your university profile.
          </Text>


          {/* ── UNIVERSITY SUMMARY CARD ─────────────────────────────
              Shows the university's avatar letter, name, location,
              a completeness percentage pill, and a progress bar.
          */}
          <View style={styles.summaryCard}>

            {/* Top row: avatar + name/location + completeness pill */}
            <View style={styles.summaryTopRow}>

              {/* Avatar circle with first letter of university name */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{university.initial}</Text>
              </View>

              {/* Name + location, stacked vertically, fills remaining space */}
              <View style={styles.summaryTextBlock}>
                <Text style={styles.summaryName}>{university.name}</Text>
                <Text style={styles.summaryDetail}>{university.location}</Text>
              </View>

              {/* Green pill showing the completeness percentage */}
              <View style={styles.completenessPill}>
                <Text style={styles.completenessText}>
                  {university.completeness}%
                </Text>
              </View>

            </View>

            {/* Bottom: thin progress bar showing the same percentage visually */}
            <View style={styles.summaryBarTrack}>
              <View
                style={[
                  styles.summaryBarFill,
                  { width: `${university.completeness}%` },
                ]}
              />
            </View>

          </View>
          {/* ── END UNIVERSITY SUMMARY CARD ─────────────────────────── */}


          {/* ── REVIEW ROWS ──────────────────────────────────────────
              .map() loops over REVIEW_ROWS and renders one row per item.
              Each row has: icon circle | title + detail | edit pencil button
          */}
          <View style={styles.rowsContainer}>
            {REVIEW_ROWS.map((row) => (
              <View key={row.id} style={styles.row}>

                {/* Left: icon circle */}
                <View style={styles.rowIconCircle}>
                  {/* Emoji placeholder — swap for <Ionicons /> later */}
                  <Text style={styles.rowIconText}>{row.icon}</Text>
                </View>

                {/* Middle: title + detail text, fills remaining space */}
                <View style={styles.rowTextBlock}>
                  <Text style={styles.rowTitle}>{row.title}</Text>
                  <Text style={styles.rowSubtitle}>{row.detail}</Text>
                </View>

                {/* Right: circular edit button */}
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleEditRow(row.id)}
                  activeOpacity={0.7}
                >
                  {/* Pencil emoji placeholder — swap for <Ionicons name="pencil-outline" /> */}
                  <Text style={styles.editIconText}>✎</Text>
                </TouchableOpacity>

              </View>
            ))}
          </View>
          {/* ── END REVIEW ROWS ──────────────────────────────────────── */}


          {/* ── INFO BANNER ──────────────────────────────────────────
              Light teal banner reminding the user about the review wait time.
          */}
          <View style={styles.banner}>
            <View style={styles.bannerIconCircle}>
              {/* Shield emoji placeholder — swap for <Ionicons name="shield-checkmark-outline" /> */}
              <Text style={styles.bannerIconText}>🛡</Text>
            </View>
            <Text style={styles.bannerText}>
              Your profile will be reviewed within 24 hours before going live.
            </Text>
          </View>
          {/* ── END INFO BANNER ──────────────────────────────────────── */}


          {/* ── COMPLETE SETUP BUTTON (filled teal) ─────────────────── */}
          <TouchableOpacity
            style={styles.completeBtn}
            onPress={handleCompleteSetup}
            activeOpacity={0.85}
          >
            <Text style={styles.completeBtnText}>Complete Setup</Text>
          </TouchableOpacity>


          {/* ── SAVE & FINISH LATER BUTTON (outlined) ───────────────── */}
          <TouchableOpacity
            style={styles.saveLaterBtn}
            onPress={handleSaveForLater}
            activeOpacity={0.85}
          >
            <Text style={styles.saveLaterBtnText}>Save & finish later</Text>
          </TouchableOpacity>

        </View>
        {/* ── END WHITE CARD ─────────────────────────────────────────── */}

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // Full mint background, fills the entire screen
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ScrollView inner padding — keeps mint visible around the card
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: COLORS.background,
  },

  // ── Progress header (outside card, sits directly on mint) ────────
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // label on the left, % on the right
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
    marginBottom: 20, // space between progress bar and the white card below
    overflow: 'hidden', // keeps the fill's corners clipped to match the track
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.progressFill,
    borderRadius: 3,
  },

  // ── Card wrapping all main content ──────────────────────────
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 0,
  },

  // ── Title section (inside card) ───────────────────────────────────
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
    marginBottom: 20,
  },

  // ── University summary card (inside the white card) ───────────────
  summaryCard: {
    backgroundColor: COLORS.summaryCardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.summaryCardBorder,
    padding: 16,
    marginBottom: 20,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14, // space before the progress bar underneath
  },
  // Dark teal circle showing the first letter of the university name
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.avatarText,
  },
  // Name + location column — flex: 1 makes it fill remaining space
  summaryTextBlock: {
    flex: 1,
  },
  summaryName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.summaryName,
    marginBottom: 2,
  },
  summaryDetail: {
    fontSize: 12,
    color: COLORS.summaryDetail,
  },
  // Green rounded pill showing the completeness percentage (e.g. "95%")
  completenessPill: {
    backgroundColor: COLORS.completenessBg,
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 8,
  },
  completenessText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.completenessText,
  },
  // Thin progress bar underneath the avatar row, mirrors completeness %
  summaryBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.summaryBarTrack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  summaryBarFill: {
    height: '100%',
    backgroundColor: COLORS.summaryBarFill,
    borderRadius: 3,
  },

  // ── Review rows (inside white card, below summary card) ────────────
  rowsContainer: {
    marginBottom: 20,
  },
  // Each row is its own bordered "pill" container
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.rowBorder,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10, // space between stacked rows
  },
  // Light teal circle on the left of each row
  rowIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.rowIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIconText: {
    fontSize: 18,
    color: COLORS.rowIcon,
  },
  // Title + subtitle column — flex: 1 fills the space between icon and edit button
  rowTextBlock: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.rowTitle,
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
    color: COLORS.rowSubtitle,
  },
  // Small grey circular button containing the pencil/edit icon
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.editBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  editIconText: {
    fontSize: 14,
    color: COLORS.editIcon,
  },

  // ── Info banner (inside white card) ─────────────────────────────────
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bannerBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  // Small solid teal circle holding the shield icon
  bannerIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.bannerIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerIconText: {
    fontSize: 14,
    color: COLORS.bannerIcon,
  },
  // flex: 1 lets the banner text wrap onto a second line instead of overflowing
  bannerText: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.bannerText,
    lineHeight: 18,
  },

  // ── Complete Setup button (filled teal, primary action) ───────────────
  completeBtn: {
    backgroundColor: COLORS.completeBtnBg,
    borderRadius: 30, // pill shape
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12, // space before the second button below
  },
  completeBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.completeBtnText,
  },

  // ── Save & finish later button (outlined, secondary action) ────────────
  saveLaterBtn: {
    backgroundColor: COLORS.saveLaterBtnBg,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: COLORS.saveLaterBtnBorder,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveLaterBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.saveLaterBtnText,
  },

});