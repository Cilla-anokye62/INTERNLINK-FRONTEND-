/**
 * NoConnectionScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — No Connection / Error State ("Oops! Something went wrong")
 *
 * Content (from design):
 *  - Centered white card sitting on a plain white page background
 *    (no mint background, no header/back arrow in this design)
 *  - Soft pink circle icon with a red "no cloud/no connection" icon
 *  - Headline: "Oops! Something went wrong" (can wrap to 2 lines)
 *  - Subtext: explains it's likely a connection issue
 *  - Two buttons: "Retry" (filled dark teal, with a refresh icon) and
 *    "Go Back" (outlined teal)
 *
 * NOTE ON STYLE — this is a DIFFERENT visual system than the
 * ErrorStateScreen / EmptyStateScreen you built earlier (those used
 * a mint full-screen background with no card, this one uses a white
 * page with a centered white card with a border and shadow). Built
 * as its own standalone component rather than forcing it into the
 * shared StateScreen, since the surrounding layout differs (card vs.
 * full-bleed) even though the icon+headline+subtext+buttons pattern
 * is conceptually similar. Let me know if you'd like one shared
 * component that supports both visual styles via a `variant` prop.
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import NoConnectionScreen from './app/NoConnectionScreen';
 *     <Stack.Screen name="NoConnection" component={NoConnectionScreen} />
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
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function NoConnectionScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // Called when "Retry" is tapped — should re-attempt whatever failed
  const handleRetry = () => {
    if (typeof route.params?.onRetry === 'function') {
      route.params.onRetry();
      return;
    }

    navigation.goBack();
  };

  // Called when "Go Back" is tapped
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/*
        This outer View centers the card both vertically and
        horizontally on the page, using flex: 1 + justifyContent +
        alignItems — same centering technique as the mint-background
        state screens, just applied to a card instead of bare content.
      */}
      <View style={styles.pageContainer}>

        <View style={styles.card}>

          <Ionicons name="cloud-offline-outline" size={36} color={colors.iconColor} style={{ marginBottom: 24 }} />

          {/* Headline — allowed to wrap onto 2 lines, matching the design */}
          <Text style={styles.headline}>Oops! Something went wrong</Text>

          {/* Supporting subtext */}
          <Text style={styles.subtext}>
            We're having trouble loading this page. Please check your connection and try again.
          </Text>

          {/* Retry button — filled dark teal, with a refresh icon + label */}
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={handleRetry}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh-outline" size={16} color={colors.retryBtnText} style={{ marginRight: 8 }} />
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>

          {/* Go Back button — outlined */}
          <TouchableOpacity
            style={styles.goBackBtn}
            onPress={handleGoBack}
            activeOpacity={0.85}
          >
            <Text style={styles.goBackBtnText}>Go Back</Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const createStyles = (colors: any) => StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Centers the card both vertically and horizontally on the screen
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  // The white card itself
  card: {
    width: '100%',
    maxWidth: 380, // keeps the card from stretching too wide on tablets
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
    // Soft shadow so the card lifts slightly off the page background
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  // ── Icon ──────────────────────────────────────────────────────
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.iconCircleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative', // lets the slash overlay position itself on top
  },
  iconText: {
    fontSize: 30,
  },
  // A simple diagonal line overlaid on the cloud emoji to approximate
  // the "no connection" slash from the design. This is a rough stand-in —
  // swapping in a real icon (see TODO above) will look cleaner than
  // this emoji + manual slash combo.
  iconSlash: {
    position: 'absolute',
    width: 50,
    height: 3,
    backgroundColor: colors.iconColor,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },

  // ── Text ──────────────────────────────────────────────────────
  headline: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.headline,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  subtext: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
  },

  // ── Buttons ───────────────────────────────────────────────────
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.retryBtnBg,
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    marginBottom: 12,
  },
  retryIcon: {
    fontSize: 15,
    color: colors.retryBtnText,
    marginRight: 8,
    fontWeight: '700',
  },
  retryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.retryBtnText,
  },
  goBackBtn: {
    backgroundColor: colors.goBackBtnBg,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.goBackBtnBorder,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  goBackBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.goBackBtnText,
  },

});
