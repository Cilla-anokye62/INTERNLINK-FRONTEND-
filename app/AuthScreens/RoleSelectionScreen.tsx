
import React, { useState } from 'react';

// These are the built-in React Native building blocks:
//  View             → like a <div> — a container for other elements
//  Text             → renders text on screen
//  TouchableOpacity → a pressable area that fades slightly when tapped
//  StyleSheet       → lets us write CSS-like styles in JavaScript
//  SafeAreaView     → keeps content away from notches / status bars
//  StatusBar        → controls the top status bar (time, battery, etc.)
//  Dimensions       → gives us the screen width/height in pixels
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';


// ─── 2. TYPE DEFINITIONS ─────────────────────────────────────────
// TypeScript uses "types" to describe the shape of data.
// Here we define what a valid role string looks like.
// This means selectedRole can only ever be one of these three values (or null).
type Role = 'student' | 'employer' | 'university';

// This describes the structure of each role card's data.
// Think of it as a contract: every role object MUST have these fields.
interface RoleOption {
  id: Role;            // unique identifier, e.g. 'student'
  title: string;       // big bold text on the card
  description: string; // smaller text below the title
  icon: string;        // placeholder emoji — swap for a real icon later
}


// ─── 3. DATA ─────────────────────────────────────────────────────
// Instead of hard-coding three separate card components,
// we store the data in an array and loop over it.
// To add a 4th role later, just add an object here — no other changes needed.
const ROLES: RoleOption[] = [
  {
    id: 'student',
    title: ' I\'m a Student',
    description: 'I\'m looking for internships and opportunities.',
    icon: '🎓', // TODO: replace with <Ionicons name="swho are you?l-outline" />
  },
  {
    id: 'employer',
    title: ' I\'m an Employer',
    description: 'I\'m hiring interns and managing programs.',
    icon: '🏢', // TODO: replace with <Ionicons name="business-outline" />
  },
  {
    id: 'university',
    title: ' I\'m a University',
    description: 'I\'m managing student placements and partner relations.',
    icon: '🏛️', // TODO: replace with <Ionicons name="library-outline" />
  },
];


// ─── 4. COLOR PALETTE ────────────────────────────────────────────
// Centralising all colors here means: if you want to change the teal,
// you change it in ONE place and it updates everywhere automatically.
const COLORS = {
  background: '#D9F2EE', // light mint — the screen background
  card:  '#FFFFFF', // dark teal — unselected card background
  cardBorderIdle: 'transparent', // no border when card is not selected
  cardBorderActive: '#329891', // bright teal border when card IS selected
  iconCircle: 'rgba(46,196,182,0.18)', // dim circle behind icon (unselected)
  iconCircleActive: '#2EC4B6', // solid teal circle when card is selected
  titleText: '#0D3B47', // dark teal — page heading
  subtitleText: '#4A7C75', // muted teal — page sub-heading
  cardTitle: '#0D3B47', // white text on dark card
  cardDescription: '#4A7C75', // muted light teal description text
  checkmark: '#FFFFFF', // white tick inside selected badge
  buttonActive: '#329891', // Continue button when a role is chosen
  buttonInactive: 'rgba(13,59,71,0.20)', // Continue button before any choice
  buttonTextActive: '#FFFFFF',
  buttonTextInact: '#6B9E99',
  backButton: '#FFFFFF', // back arrow circle
  backArrow: '#0D3B47',
};


// ─── 5. MAIN SCREEN COMPONENT ────────────────────────────────────
// In React Native, a "component" is a function that returns UI.
// export default means other files can import this screen.
export default function RoleSelectionScreen({ navigation }: any) {

  // useState gives us:
  //   selectedRole     → the current value (starts as null — nothing chosen)
  //   setSelectedRole  → the function we call to update it
  // Whenever setSelectedRole is called, React re-renders the screen automatically.
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // This runs when the user taps Continue.
  // Right now it just logs to the console so you can see it works.
  // Later: replace console.log with navigation.navigate('Home', { role: selectedRole })
  const handleContinue = () => {
    if (!selectedRole) return; // safety check — button should already be disabled
    navigation.navigate('SignUp');
    // TODO: navigation.navigate('Home', { role: selectedRole });
  };

  // ── RENDER ─────────────────────────────────────────────────────
  // Everything inside return ( ... ) is what gets drawn on screen.
  return (

    // SafeAreaView makes sure nothing hides behind the phone's notch or home bar
    <SafeAreaView style={styles.safeArea}>

      {/* StatusBar controls the bar at the very top of the phone */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* The main column — everything lives inside here */}
      <View style={styles.screen}>


        {/* ── HEADER SECTION ──────────────────────────────────── */}
        {/* A horizontal row: [back button]  [title + subtitle]  [spacer] */}
        <View style={styles.header}>

          {/* Back button — white circle with a left arrow inside */}
          {/* TODO: add onPress={() => navigation.goBack()} */}
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrowText}>‹</Text>
          </TouchableOpacity>

          {/* Title block — centred between the two circle-sized elements */}
          <View style={styles.headerCenter}>
            <Text style={styles.pageTitle}>Who are you?</Text>
            <Text style={styles.pageSubtitle}>Select your role to get started.</Text>
          </View>

          {/* This invisible View has the same size as the back button.
              It pushes the title block into the true visual centre of the row. */}
          <View style={styles.backBtn} />

        </View>
        {/* ── END HEADER ──────────────────────────────────────── */}


        {/* ── ROLE CARDS SECTION ──────────────────────────────── */}
        <View style={styles.cardsWrapper}>

          {/*
            .map() loops over the ROLES array.
            For every role object it returns a TouchableOpacity card.
            key={role.id} is required by React so it can track each card.
          */}
          {ROLES.map((role) => {

            // Is THIS card the one the user tapped?
            // This boolean is used below to switch styles and show the checkmark.
            const isSelected = selectedRole === role.id;

            return (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.card,
                  // Array styles are merged left-to-right.
                  // When isSelected is true, cardSelected overrides the border color.
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => setSelectedRole(role.id)}
                activeOpacity={0.85}
              >

                {/* ── Card Left: icon circle ─────────────────── */}
                <View style={[
                  styles.iconCircle,
                  isSelected && styles.iconCircleSelected,
                ]}>
                  {/* Emoji placeholder — swap for a real icon component later */}
                  <Text style={styles.iconEmoji}>{role.icon}</Text>
                </View>

                {/* ── Card Middle: title + description ──────── */}
                {/* flex: 1 makes this stretch to fill available horizontal space */}
                <View style={styles.cardTextBlock}>
                  <Text style={styles.cardTitle}>{role.title}</Text>
                  <Text style={styles.cardDescription}>{role.description}</Text>
                </View>

                {/* ── Card Right: checkmark badge ────────────── */}
                {/* The && operator means: only render this if isSelected is true */}
                {isSelected && (
                  <View style={styles.checkmarkBadge}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}

              </TouchableOpacity>
            );
          })}

        </View>
        {/* ── END ROLE CARDS ──────────────────────────────────── */}


        {/* ── CONTINUE BUTTON ─────────────────────────────────── */}
        {/* disabled={!selectedRole} prevents tapping before anything is chosen */}
        <TouchableOpacity
          style={[
            styles.continueBtn,
            selectedRole ? styles.continueBtnActive : styles.continueBtnInactive,
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
          activeOpacity={0.85}
        >
          <Text style={[
            styles.continueBtnText,
            selectedRole ? styles.continueBtnTextActive : styles.continueBtnTextInactive,
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
        {/* ── END CONTINUE BUTTON ─────────────────────────────── */}


      </View>
    </SafeAreaView>
  );
}


// ─── 6. STYLES ───────────────────────────────────────────────────
// StyleSheet.create() works like CSS but in JavaScript objects.
// All numbers are density-independent pixels (dp) — React Native scales
// them automatically across different phone screen sizes.

const { width } = Dimensions.get('window'); // total screen width in dp

const styles = StyleSheet.create({

  // ── Outermost safe container ──────────────────────────────────
  safeArea: {
    flex: 1,                          // fill the entire screen height
    backgroundColor: COLORS.background,
  },

  // ── Main column layout ────────────────────────────────────────
  screen: {
    flex: 1,
    paddingHorizontal: 24,            // breathing room left and right
    paddingTop: 20,
    paddingBottom: 36,
    justifyContent: 'space-between',  // pushes Continue button to the very bottom
  },

  // ── Header row ───────────────────────────────────────────────
  header: {
    flexDirection: 'row',             // lay children left → right
    alignItems: 'center',             // vertically centre them
    marginBottom: 36,
    marginTop: 36,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,                 // exactly half of width/height = perfect circle
    backgroundColor: COLORS.backButton,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow (iOS uses these four properties)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,                     // elevation is the Android equivalent of shadow
  },
  backArrowText: {
    fontSize: 28,
    color: COLORS.backArrow,
    lineHeight: 32,
    marginRight: 2,                   // tiny nudge so the chevron looks visually centred
  },
  headerCenter: {
    flex: 1,                          // fills the space between the two circle-sized elements
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.titleText,
    letterSpacing: 0.2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.subtitleText,
    marginTop: 3,
  },

  // ── Cards stack ───────────────────────────────────────────────
  cardsWrapper: {
    flex: 1,
    justifyContent: 'center',         // vertically centres the three cards on screen
    gap: 25,                           // space between cards
    // Note: gap requires React Native 0.71+
    // For older versions, use marginBottom: 16 on each card
  },

  // ── Individual card ───────────────────────────────────────────
  card: {
    flexDirection: 'row',             // icon | text | checkmark left to right
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    // borderWidth is always 2 so the card doesn't resize when selected.
    // We just change the borderColor from transparent to teal.
    borderWidth: 2,
    borderColor: COLORS.cardBorderIdle,
    // Drop shadow
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  // Merged with `card` when the card is selected — only overrides borderColor
  cardSelected: {
    borderColor: COLORS.cardBorderActive,
  },

  // ── Icon circle (left side of card) ──────────────────────────
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.iconCircle,   // dim teal tint when idle
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  // Merged with iconCircle when the parent card is selected
  iconCircleSelected: {
    backgroundColor: COLORS.iconCircleActive, // solid teal
  },
  iconEmoji: {
    fontSize: 22,
    // TODO: replace this entire View + Text combo with:
    // <Ionicons name="swho are you?l-outline" size={24} color="white" />
    // Run: npx expo install @expo/vector-icons   to enable this
  },

  // ── Card text block (middle of card) ─────────────────────────
  cardTextBlock: {
    flex: 1,  // stretches to fill horizontal space between icon and checkmark
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cardTitle,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.cardDescription,
    lineHeight: 19,
  },

  // ── Checkmark badge (right side of selected card) ─────────────
  checkmarkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.cardBorderActive,  // same teal as the card border
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    color: COLORS.checkmark,
    fontSize: 14,
    fontWeight: '700',
  },

  // ── Continue button ───────────────────────────────────────────
  continueBtn: {
    borderRadius: 50,              // extremely high value = pill / capsule shape
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  continueBtnActive: {
    backgroundColor: COLORS.buttonActive,
    // Teal glow shadow when active
    shadowColor: COLORS.buttonActive,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  continueBtnInactive: {
    backgroundColor: COLORS.buttonInactive,  // greyed out before selection
  },
  continueBtnText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  continueBtnTextActive: {
    color: COLORS.buttonTextActive,
  },
  continueBtnTextInactive: {
    color: COLORS.buttonTextInact,
  },

});