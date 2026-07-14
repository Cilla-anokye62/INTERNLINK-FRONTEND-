/**
 * ActionSuccessfulScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Generic success confirmation ("Action Successful!")
 *
 * Content (from design):
 *  - Centered white card on a soft light gradient page background
 *  - Concentric teal circles (pale outer ring, solid teal inner
 *    circle) with a dark checkmark in the middle
 *  - Headline: "Action Successful!"
 *  - Subtext: "Everything is up to date and ready to go."
 *  - One full-width "Done →" button (filled dark teal)
 *
 * SAME VISUAL FAMILY AS NoConnectionScreen.tsx — both use a centered
 * white card with border/shadow on a light page background, rather
 * than the mint full-bleed style used elsewhere in the app. Built to
 * match that file's structure/colors so the two feel consistent with
 * each other.
 *
 * This screen is intentionally generic ("Action Successful" rather
 * than something specific like "Profile Saved") — it's meant to be
 * reused for any one-off confirmation (saved, updated, submitted,
 * etc.) by just changing the headline/subtext via props if needed.
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import ActionSuccessfulScreen from './app/ActionSuccessfulScreen';
 *     <Stack.Screen name="ActionSuccessful" component={ActionSuccessfulScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from "../../src/hooks/useAppTheme";


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function ActionSuccessfulScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // Called when "Done" is tapped — should close this confirmation
  // and return the user to wherever makes sense after success.
  const handleDone = () => {
    console.log('Done tapped');
    // TODO: navigate away from this confirmation screen, e.g.:
    // navigation.goBack();
    // or, if this was shown after completing a flow:
    // navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/*
        Centers the card both vertically and horizontally on the
        screen — same technique used in NoConnectionScreen.tsx.
      */}
      <View style={styles.pageContainer}>

        <View style={styles.card}>

          {/*
            Concentric circle icon: a pale outer ring (bigger, more
            transparent-looking teal) with a solid darker teal circle
            centered inside it, and a checkmark on top of that.
            Built from 3 stacked Views using position: 'absolute' +
            alignItems/justifyContent: 'center', same overlapping-
            circles technique as the spinning ring in
            LoadingStateScreen.tsx — just static instead of animated.
          */}
          <View style={styles.iconWrapper}>
            <View style={styles.outerRing} />
            <View style={styles.innerCircle}>
              {/* TODO: replace with <Ionicons name="checkmark" size={32} color={colors.checkmarkColor} /> */}
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </View>

          {/* Headline */}
          <Text style={styles.headline}>Action Successful!</Text>

          {/* Subtext */}
          <Text style={styles.subtext}>
            Everything is up to date and ready to go.
          </Text>

          {/* Done button */}
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={handleDone}
            activeOpacity={0.85}
          >
            <Text style={styles.doneBtnText}>Done</Text>
            {/* TODO: replace with <Ionicons name="arrow-forward" size={16} color="#FFFFFF" /> */}
            <Text style={styles.doneBtnArrow}>→</Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const ICON_SIZE = 110;       // outer ring diameter
const INNER_CIRCLE_SIZE = 76; // inner solid circle diameter

const createStyles = (colors: any) => StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Centers the card both vertically and horizontally
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  // The white card itself
  card: {
    width: '100%',
    maxWidth: 380, // prevents the card from stretching too wide on tablets
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  // ── Concentric circle icon ───────────────────────────────────
  // Wraps both circles so they can overlap exactly using
  // position: 'absolute' on the children
  iconWrapper: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  // The pale, larger outer ring — sits behind the inner circle
  outerRing: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: colors.outerRing,
  },
  // The solid, smaller inner circle — sits on top of the outer ring,
  // centered automatically since both share the same parent's
  // alignItems/justifyContent: 'center'
  innerCircle: {
    width: INNER_CIRCLE_SIZE,
    height: INNER_CIRCLE_SIZE,
    borderRadius: INNER_CIRCLE_SIZE / 2,
    backgroundColor: colors.innerCircle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.checkmarkColor,
  },

  // ── Text ──────────────────────────────────────────────────────
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.headline,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  subtext: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
  },

  // ── Done button ───────────────────────────────────────────────
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.doneBtnBg,
    borderRadius: 10,
    paddingVertical: 16,
    width: '100%',
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.doneBtnText,
    marginRight: 8,
  },
  doneBtnArrow: {
    fontSize: 16,
    color: colors.doneBtnText,
    fontWeight: '700',
  },

});