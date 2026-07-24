/**
 * LoadingStateScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Loading State ("Finding your best matches...")
 *
 * Content (from design):
 *  - Header: back arrow only, no title
 *  - Centered icon: a circle with a spinning teal arc around it,
 *    and a small star/sparkle icon in the middle
 *  - Headline: "Finding your best matches…"
 *  - Subtext: "Our AI is reviewing 12,400 openings."
 *  - 3 skeleton placeholder cards at the bottom (avatar circle +
 *    two grey bars), representing content that's still loading
 *
 * WHY THIS ISN'T PART OF StateScreen.tsx:
 *  Empty/Error/Success states are all static — same icon, just sitting
 *  there with two buttons. This screen has TWO moving parts (the
 *  spinning ring, and could later have shimmering skeleton cards), and
 *  no buttons at all. Trying to force this into StateScreen's props
 *  would make that component way more complicated for little benefit.
 *  It's cleaner as its own small component.
 *
 * REQUIRED PACKAGE:
 *  The spinning ring uses React Native's built-in Animated API, so
 *  NO new package install is needed for the animation itself.
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import LoadingStateScreen from './app/LoadingStateScreen';
 *     <Stack.Screen name="LoadingMatches" component={LoadingStateScreen} />
 *  3. Typically you'd navigate TO this screen, wait for your API call
 *     to finish, then navigate AWAY from it (e.g. to SearchResults)
 *     once results are ready — see the handleApiCallExample function
 *     near the bottom of the component for a sketch of that flow.
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";


// ─── DATA ─────────────────────────────────────────────────────────
// Number of skeleton cards to show at the bottom. Using an array of
// simple ids (rather than hardcoding 3 separate <View> blocks) means
// changing this number later is a one-line edit.
const SKELETON_CARDS = ['1', '2', '3'];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function LoadingStateScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // useRef holds the animated value across re-renders without resetting it.
  // Animated.Value is a special number React Native can animate smoothly
  // on the native side, instead of re-rendering React on every frame.
  const spinValue = useRef(new Animated.Value(0)).current;

  // useEffect runs once when the screen mounts — this is where we kick
  // off the spinning animation and set it to repeat forever.
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,            // animate from 0 to 1
        duration: 1200,        // one full spin takes 1.2 seconds
        easing: Easing.linear, // constant speed, no speeding up/slowing down
        useNativeDriver: true, // runs the animation on the native thread (smoother, doesn't block JS)
      })
    ).start();

    // No cleanup needed here since Animated.loop runs until the
    // component unmounts on its own, but you could call
    // spinValue.stopAnimation() in a return function if needed.
  }, [spinValue]);

  // Converts the 0→1 animated value into an actual rotation in degrees.
  // interpolate() maps an input range to an output range — here,
  // 0 maps to "0deg" and 1 maps to "360deg" (one full rotation).
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

  // SKETCH of how you'd actually use this screen in a real flow:
  // navigate here right before starting an API call, then navigate
  // away once the response comes back. Not called automatically —
  // shown here just as a reference for wiring this screen up later.
  const handleApiCallExample = async () => {
    // navigation.navigate('LoadingMatches');
    // const response = await fetch('https://your-api.com/match-internships');
    // const data = await response.json();
    // navigation.replace('SearchResults', { results: data });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── HEADER: back arrow only, no title ───────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrowText}>‹</Text>
        </TouchableOpacity>
      </View>
      {/* ── END HEADER ──────────────────────────────────────────── */}


      {/* ── CENTERED LOADING CONTENT ─────────────────────────────── */}
      <View style={styles.centerContent}>

        {/*
          The spinning ring is built from TWO overlapping circles:
          1. A static light-grey full circle (the "track")
          2. An Animated.View on top with a colored border on only
             ONE side (top), which rotates continuously — creating
             the illusion of a single arc spinning around the track.
        */}
        <View style={styles.ringWrapper}>

          {/* Static background ring (the track) */}
          <View style={styles.ringTrack} />

          {/* Spinning arc — rotated via the `transform` style below */}
          <Animated.View
            style={[
              styles.ringActive,
              { transform: [{ rotate: spin }] },
            ]}
          />

          {/* Sparkle/star icon sitting in the very centre, on top of both rings */}
          {/* TODO: swap for <Ionicons name="sparkles-outline" size={22} color={colors.sparkleIcon} /> */}
          <Ionicons name="sparkles-outline" size={16} color={colors.accent} />

        </View>

        {/* Headline + subtext */}
        <Text style={styles.headline}>Finding your best matches…</Text>
        <Text style={styles.subtext}>Our AI is reviewing 12,400 openings.</Text>

      </View>
      {/* ── END CENTERED CONTENT ────────────────────────────────── */}


      {/* ── SKELETON PLACEHOLDER CARDS ───────────────────────────── */}
      {/*
        These represent content that's still loading underneath the
        main spinner — a common pattern so the screen doesn't feel
        completely empty while waiting. Currently static (no shimmer
        animation); see the note below if you want to add a shimmer
        effect later.
      */}
      <View style={styles.skeletonContainer}>
        {SKELETON_CARDS.map((cardId) => (
          <View key={cardId} style={styles.skeletonCard}>

            {/* Grey circle standing in for an avatar/logo */}
            <View style={styles.skeletonAvatar} />

            {/* Two grey bars standing in for a title + subtitle line */}
            <View style={styles.skeletonTextBlock}>
              <View style={styles.skeletonBarLong} />
              <View style={styles.skeletonBarShort} />
            </View>

          </View>
        ))}
      </View>
      {/* ── END SKELETON CARDS ──────────────────────────────────── */}

    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const RING_SIZE = 64; // controls both ring circles' width/height together

const createStyles = (colors: any) => StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.backBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  backArrowText: {
    fontSize: 22,
    color: colors.backArrow,
    lineHeight: 26,
    marginRight: 2,
  },

  // ── Centered content ──────────────────────────────────────────
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  // Wraps both ring layers + the sparkle icon so they can overlap
  // using position: 'absolute' on the children below
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  // The static, non-moving light-grey full circle underneath
  ringTrack: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.ringTrack,
  },
  // The animated arc on top. Only the TOP border is colored — the
  // other 3 sides are transparent — so as this rotates, it looks
  // like a single arc travelling around the circle rather than a
  // full ring spinning (which wouldn't look like it's moving at all).
  ringActive: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 3,
    borderTopColor: colors.ringActive,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  sparkleIconText: {
    fontSize: 20,
    color: colors.sparkleIcon,
  },

  headline: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.headline,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
  },

  // ── Skeleton placeholder cards ──────────────────────────────────
  skeletonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.skeletonCardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.skeletonAvatarBg,
    marginRight: 14,
  },
  skeletonTextBlock: {
    flex: 1, // fills remaining space next to the avatar circle
  },
  skeletonBarLong: {
    width: '70%',
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.skeletonBarBg,
    marginBottom: 8,
  },
  skeletonBarShort: {
    width: '45%',
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.skeletonBarBg,
  },

});
