/**
 * CompanyEngagementScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Company Engagement / Partners (reached from the
 * "Companies" quick-access card on the University Dashboard)
 *
 * UPDATED: the bottom tab bar has been REMOVED from this file.
 * This screen is NOT one of the 5 bottom tabs (Overview, Students,
 * Analytics, Reports, Settings) — it's a regular full-screen page
 * you navigate INTO from the Dashboard, so it shouldn't show a tab
 * bar at all. Just a back arrow now, like a normal stack screen.
 *
 * HOW TO USE:
 *  This screen is registered directly in App.tsx's main Stack
 *  Navigator (NOT inside UniversityTabs.tsx), since it sits on top
 *  of the tab bar rather than being one of the tabs itself:
 *     import CompanyEngagementScreen from './app/CompanyEngagementScreen';
 *     <Stack.Screen name="CompanyEngagement" component={CompanyEngagementScreen} />
 * ─────────────────────────────────────────────────────────────────
 */


import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // non-deprecated version
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";


// ─── DATA ─────────────────────────────────────────────────────────
const STAT_CARDS = [
  {
    id: 'activePartners',
    label: 'Active partners',
    value: '238',
    change: '+12 this month',
  },
  {
    id: 'newRoles',
    label: 'New roles',
    value: '412',
    change: 'this quarter',
  },
];

const PARTNER_COMPANIES = [
  {
    id: 'google',
    logoLetter: 'G',
    logoColor: '#4285F4',
    name: 'Google',
    detail: '24 open roles · +8 this month',
    status: 'Engaged',
  },
  {
    id: 'meta',
    logoLetter: 'M',
    logoColor: '#1877F2',
    name: 'Meta',
    detail: '18 open roles · +5 this month',
    status: 'Engaged',
  },
  {
    id: 'stripe',
    logoLetter: 'S',
    logoColor: '#7C5CFC',
    name: 'Stripe',
    detail: '12 open roles · +3 this month',
    status: 'Engaged',
  },
  {
    id: 'openai',
    logoLetter: 'O',
    logoColor: '#1E8E5A',
    name: 'OpenAI',
    detail: '8 open roles · +4 this month',
    status: 'Engaged',
  },
  {
    id: 'airbnb',
    logoLetter: 'A',
    logoColor: '#E94B6B',
    name: 'Airbnb',
    detail: '6 open roles · +1 this month',
    status: 'Engaged',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function CompanyEngagementScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // Now that this is a regular stack screen (not a tab), the back
  // arrow has a real, working destination: the Dashboard screen this
  // was navigated FROM. navigation.goBack() returns to whichever
  // screen called navigation.navigate('CompanyEngagement').
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCompanyPress = (companyId: string) => {
    navigation.navigate('CompanyDetail', { companyId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ROW: back arrow + title/subtitle + menu button ── */}
        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back-outline"
              size={22}
              color={colors.backArrow}
            />
          </TouchableOpacity>

          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Partners</Text>
            <Text style={styles.headerSubtitle}>238 companies engaged</Text>
          </View>

        </View>


        {/* ── STAT CARDS (side by side) ───────────────────────────── */}
        <View style={styles.statsRow}>
          {STAT_CARDS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statChange}>{stat.change}</Text>
            </View>
          ))}
        </View>


        {/* ── PARTNER COMPANY LIST ─────────────────────────────────── */}
        {PARTNER_COMPANIES.map((company) => (
          <TouchableOpacity
            key={company.id}
            style={styles.companyRow}
            onPress={() => handleCompanyPress(company.id)}
            activeOpacity={0.85}
          >
            <View style={[
              styles.companyLogo,
              { backgroundColor: company.logoColor },
            ]}>
              <Text style={styles.logoText}>{company.logoLetter}</Text>
            </View>

            <View style={styles.companyTextBlock}>
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.companyDetail}>{company.detail}</Text>
            </View>

            <View style={styles.engagedPill}>
              <Text style={styles.engagedPillText}>{company.status}</Text>
            </View>
          </TouchableOpacity>
        ))}

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

  // paddingBottom is back to a normal value (no tab bar to clear
  // space for anymore on this screen)
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ── Header ────────────────────────────────────────────────────
  // Now includes the back button, since this screen is reached BY
  // navigating into it (not a tab-root screen like the Dashboard)
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.backBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTextBlock: {
    flex: 1, // fills space between back button and menu button
  },
  headerTitle: {
    fontSize: 20,
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

  // ── Stat cards (side by side) ─────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.statCardBg,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: colors.statLabel,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.statValue,
    marginBottom: 4,
  },
  statChange: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.statChange,
  },

  // ── Partner company rows ──────────────────────────────────────
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.rowBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.logoText,
  },
  companyTextBlock: {
    flex: 1,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.companyName,
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: 12,
    color: colors.companyDetail,
  },

  engagedPill: {
    backgroundColor: colors.engagedPillBg,
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 8,
  },
  engagedPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.engagedPillText,
  },

});