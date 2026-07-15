/**
 * PlacementAnalyticsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Placement Analytics (Analytics tab for university users)
 *
 * Content (from design):
 *  - Header: "Analytics" title + "Real-time insights" subtitle + "···" menu
 *  - "Offers accepted" card: big number, "+18%" green pill, and a filled
 *    line chart trending upward
 *  - Two small side-by-side cards: "Top skill in demand" (React) and
 *    "Hottest sector" (FinTech)
 *  - "Top hiring partners" card: 4 rows, each with a company name,
 *    a count, and a horizontal progress bar
 *  - Bottom tab bar with "Analytics" highlighted as active
 *
 * REQUIRED PACKAGE FOR THE CHART:
 *  This screen uses a real line chart (not a placeholder box) since the
 *  curve shape is the focal point of the design. Install these first:
 *
 *    npx expo install react-native-svg
 *    npm install react-native-chart-kit
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import PlacementAnalyticsScreen from './app/PlacementAnalyticsScreen';
 *     <Stack.Screen name="PlacementAnalytics" component={PlacementAnalyticsScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // non-deprecated version
import { LineChart } from 'react-native-chart-kit'; // renders the filled trend line
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";


// ─── DATA ─────────────────────────────────────────────────────────

// The trend line's data points. In the real app these would come from
// your backend (e.g. monthly offers-accepted counts). Values are just
// relative numbers used to draw the curve shape from the design —
// only the overall upward trend matters here, not exact figures.
const OFFERS_TREND_DATA = [40, 48, 60, 65, 72, 70, 85, 95, 100];

// The two small side-by-side insight cards.
// Storing them in an array keeps the JSX below simple (one .map() instead
// of writing each card out by hand).
const INSIGHT_CARDS = [
  {
    id: 'topSkill',
    label: 'Top skill in demand',
    value: 'React',
    detail: '182 openings',
  },
  {
    id: 'hottestSector',
    label: 'Hottest sector',
    value: 'FinTech',
    detail: '+34% growth',
  },
];

// "Top hiring partners" — each row shows a company name, a count, and
// a progress bar. barPercent controls how full each bar appears relative
// to the highest count (Google's 48 = 100% in this example).
const HIRING_PARTNERS = [
  { id: 'google', name: 'Google', count: 48, barPercent: 100 },
  { id: 'meta', name: 'Meta', count: 32, barPercent: 67 },
  { id: 'stripe', name: 'Stripe', count: 21, barPercent: 44 },
  { id: 'openai', name: 'OpenAI', count: 16, barPercent: 33 },
];


// Screen width, used to size the chart so it fills the card correctly
const SCREEN_WIDTH = Dimensions.get('window').width;


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function PlacementAnalyticsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // This screen lives on the "Analytics" tab, so it starts active
  const [ setActiveTab] = useState('analytics');

  // Placeholder data for the Offers Accepted card.
  // Later this will likely come from your backend/API.
  const offersAccepted = {
    total: 412,
    growthPercent: '+18%',
  };

  const handleMenuPress = () => {
    console.log('Menu (···) tapped');
    // TODO: open an options menu/sheet
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Main scrollable content sits above the fixed bottom tab bar */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ROW: title/subtitle + menu button ────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Analytics</Text>
            <Text style={styles.headerSubtitle}>Real-time insights</Text>
          </View>

          <TouchableOpacity
            style={styles.menuBtn}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={18}
              color={colors.menuBtnIcon}
            />
          </TouchableOpacity>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── OFFERS ACCEPTED CARD (with line chart) ──────────────── */}
        <View style={styles.offersCard}>

          {/* Top row: label + big number on the left, green pill on the right */}
          <View style={styles.offersTopRow}>
            <View>
              <Text style={styles.offersLabel}>Offers accepted</Text>
              <Text style={styles.offersValue}>{offersAccepted.total}</Text>
            </View>

            {/* Green growth pill */}
            <View style={styles.growthPill}>
              <Text style={styles.growthPillText}>
                {offersAccepted.growthPercent}
              </Text>
            </View>
          </View>

          {/*
            LineChart from react-native-chart-kit draws the filled curve.
            - withDots/withVerticalLabels/etc are all turned off so it
              renders as a clean curve with no axis clutter, matching
              the minimal look in the design.
            - The "fillShadowGradient" props create the teal fade-to-
              transparent fill underneath the line.
          */}
          <LineChart
            data={{
              // labels are required by the library but we hide them
              // visually below, so empty strings work fine here
              labels: OFFERS_TREND_DATA.map(() => ''),
              datasets: [{ data: OFFERS_TREND_DATA }],
            }}
            width={SCREEN_WIDTH - 76} // accounts for card padding + screen padding
            height={120}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLabels={false}
            withHorizontalLabels={false}
            withShadow={false}
            bezier // smooths the line into curves instead of sharp angles
            chartConfig={{
              backgroundColor: colors.offersCardBg,
              backgroundGradientFrom: colors.offersCardBg,
              backgroundGradientTo: colors.offersCardBg,
              decimalPlaces: 0,
              color: () => colors.chartLine, // line + fill color
              fillShadowGradient: colors.chartLine,
              fillShadowGradientOpacity: 0.25,
              propsForBackgroundLines: {
                stroke: 'transparent', // hides the default grid lines
              },
            }}
            style={styles.chart}
          />

        </View>
        {/* ── END OFFERS ACCEPTED CARD ────────────────────────────── */}


        {/* ── TWO SMALL INSIGHT CARDS SIDE BY SIDE ─────────────────── */}
        <View style={styles.insightsRow}>
          {/*
            .map() loops over INSIGHT_CARDS so both small cards come
            from one block of JSX instead of being written out twice.
          */}
          {INSIGHT_CARDS.map((card) => (
            <View key={card.id} style={styles.insightCard}>
              <Text style={styles.smallCardLabel}>{card.label}</Text>
              <Text style={styles.smallCardValue}>{card.value}</Text>
              <Text style={styles.smallCardDetail}>{card.detail}</Text>
            </View>
          ))}
        </View>
        {/* ── END INSIGHT CARDS ───────────────────────────────────── */}


        {/* ── "TOP HIRING PARTNERS" CARD ──────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Top hiring partners</Text>

          {/*
            .map() loops over HIRING_PARTNERS and renders one row per
            company: name + count on top, progress bar underneath.
          */}
          {HIRING_PARTNERS.map((partner, index) => (
            <View
              key={partner.id}
              style={[
                styles.partnerRow,
                // Remove bottom margin on the last row for even spacing
                index === HIRING_PARTNERS.length - 1 && styles.partnerRowLast,
              ]}
            >
              {/* Name on the left, count on the right */}
              <View style={styles.partnerLabelRow}>
                <Text style={styles.partnerName}>{partner.name}</Text>
                <Text style={styles.partnerCount}>{partner.count}</Text>
              </View>

              {/* Progress bar — fill width matches barPercent exactly */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${partner.barPercent}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
        {/* ── END "TOP HIRING PARTNERS" CARD ──────────────────────── */}

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

  // Scrollable content — leaves room at the bottom so the tab bar
  // doesn't cover the last items
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 100, // extra space so content isn't hidden behind tab bar
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  headerTextBlock: {
    flex: 1, // fills space to the left of the menu button
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.headerTitle,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.headerSubtitle,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.menuBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // ── Offers accepted card ──────────────────────────────────────
  offersCard: {
    backgroundColor: colors.offersCardBg,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  offersTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  offersLabel: {
    fontSize: 13,
    color: colors.offersLabel,
    marginBottom: 4,
  },
  offersValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.offersValue,
  },
  growthPill: {
    backgroundColor: colors.growthPillBg,
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  growthPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.growthPillText,
  },
  // The chart itself — negative left margin trims react-native-chart-kit's
  // default internal left padding so the curve sits flush with the card
  chart: {
    marginLeft: -16,
    marginTop: 8,
  },

  // ── Insight cards (side by side) ──────────────────────────────
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  insightCard: {
    width: '48%', // two cards side by side with a small gap between them
    backgroundColor: colors.smallCardBg,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  smallCardLabel: {
    fontSize: 11,
    color: colors.smallCardLabel,
    marginBottom: 6,
  },
  smallCardValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.smallCardValue,
    marginBottom: 4,
  },
  smallCardDetail: {
    fontSize: 11,
    color: colors.smallCardDetail,
  },

  // ── "Top hiring partners" card ─────────────────────────────────
  sectionCard: {
    backgroundColor: colors.sectionCardBg,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.sectionTitle,
    marginBottom: 16,
  },
  partnerRow: {
    marginBottom: 16, // space between each partner's row
  },
  partnerRowLast: {
    marginBottom: 0, // no extra space after the final row
  },
  partnerLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.partnerName,
  },
  partnerCount: {
    fontSize: 13,
    color: colors.partnerCount,
  },
  barTrack: {
    width: '100%',
    height: 7,
    backgroundColor: colors.barTrack,
    borderRadius: 4,
    overflow: 'hidden', // clips the fill's corners to match the track
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.barFill,
    borderRadius: 4,
  },

  // ── Bottom tab bar (identical to other university screens) ────────
 

});