/**
 * PrivacySettingsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Privacy Settings (PREFERENCES section in SettingsScreen)
 *
 * Content:
 *  - Toggle switches for: Profile visibility (Public/University only),
 *    Show email to employers, Show phone to employers
 *  - Block list management row (navigates to sub-screen, rendered as
 *    "Blocked Users (0)" row with chevron)
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import PrivacySettingsScreen from './app/PrivacySettingsScreen';
 *     <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
 * 
 * NOTE: Uses React Native's built-in Switch component (no extra install needed)
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';


// ─── DATA ─────────────────────────────────────────────────────────
// Privacy toggle settings
const PRIVACY_SETTINGS = [
  {
    id: 'showEmail',
    label: 'Show email to employers',
    icon: 'mail-outline',
  },
  {
    id: 'showPhone',
    label: 'Show phone to employers',
    icon: 'call-outline',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function PrivacySettingsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Profile visibility: 'public' or 'university'
  const [visibility, setVisibility] = useState<'public' | 'university'>('university');

  // Toggle states
  const [privacySettings, setPrivacySettings] = useState<Record<string, boolean>>({
    showEmail: true,
    showPhone: false,
  });

  // Blocked users count (placeholder)
  const [blockedCount] = useState(0);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const togglePrivacySetting = (settingId: string) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
    console.log('Toggled privacy setting:', settingId);
    // TODO: sync with backend
  };

  const handleBlockedUsersPress = () => {
    console.log('Navigate to blocked users screen');
    // TODO: navigation.navigate('BlockedUsers');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ROW: back arrow + title ──────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-outline"
              size={22}
              color={colors.title}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy</Text>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── PROFILE VISIBILITY SECTION ─────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>PROFILE VISIBILITY</Text>

          <View style={styles.visibilityRow}>
            <Text style={styles.visibilityLabel}>Who can see your profile?</Text>
          </View>

          {/* Two selectable pills */}
          <View style={styles.pillsRow}>
            <TouchableOpacity
              style={[
                styles.visibilityPill,
                visibility === 'public' && styles.visibilityPillActive,
              ]}
              onPress={() => setVisibility('public')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.visibilityPillText,
                visibility === 'public' && styles.visibilityPillTextActive,
              ]}>
                Public
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.visibilityPill,
                visibility === 'university' && styles.visibilityPillActive,
              ]}
              onPress={() => setVisibility('university')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.visibilityPillText,
                visibility === 'university' && styles.visibilityPillTextActive,
              ]}>
                University only
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* ── END PROFILE VISIBILITY SECTION ───────────────────── */}


        {/* ── CONTACT INFO SECTION ─────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>CONTACT INFO</Text>

          {PRIVACY_SETTINGS.map((item) => (
            <View
              key={item.id}
              style={[
                styles.settingRow,
                PRIVACY_SETTINGS.indexOf(item) < PRIVACY_SETTINGS.length - 1 && styles.settingRowNotLast,
              ]}
            >
              {/* Icon Circle */}
              <View style={styles.iconCircle}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={colors.icon}
                />
              </View>

              {/* Label */}
              <Text style={styles.rowText}>{item.label}</Text>

              {/* Switch */}
              <Switch
                value={privacySettings[item.id]}
                onValueChange={() => togglePrivacySetting(item.id)}
                trackColor={{ false: colors.switchTrack, true: colors.switchActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
          ))}
        </View>
        {/* ── END CONTACT INFO SECTION ──────────────────────────── */}


        {/* ── BLOCK LIST SECTION ───────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>BLOCK LIST</Text>

          <TouchableOpacity
            style={styles.blockedRow}
            onPress={handleBlockedUsersPress}
            activeOpacity={0.7}
          >
            <View style={styles.blockedIconCircle}>
              <Ionicons
                name="person-remove-outline"
                size={20}
                color={colors.icon}
              />
            </View>
            <Text style={styles.blockedText}>Blocked Users ({blockedCount})</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color={colors.chevron}
            />
          </TouchableOpacity>
        </View>
        {/* ── END BLOCK LIST SECTION ──────────────────────────────── */}

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

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.title,
  },

  // ── Section Cards ─────────────────────────────────────────────
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.sectionHeader,
    letterSpacing: 1,
    marginBottom: 12,
  },

  // ── Profile Visibility (Segmented Control) ─────────────────────
  visibilityRow: {
    marginBottom: 12,
  },
  visibilityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.rowText,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  visibilityPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.pillIdle,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.pillIdle,
  },
  visibilityPillActive: {
    backgroundColor: colors.pillActive,
    borderColor: colors.pillActive,
  },
  visibilityPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.pillIdleText,
  },
  visibilityPillTextActive: {
    color: colors.pillActiveText,
  },

  // ── Setting Row ───────────────────────────────────────────────
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  settingRowNotLast: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rowBorder,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.rowText,
  },

  // ── Blocked Users Row ─────────────────────────────────────────
  blockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  blockedIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  blockedText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.rowText,
  },

});
