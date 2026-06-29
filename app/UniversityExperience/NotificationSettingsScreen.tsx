/**
 * NotificationSettingsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Notification Settings (PREFERENCES section in SettingsScreen)
 *
 * Content:
 *  - Grouped toggle switches under sub-headers
 *  - "Push Notifications": New matches, Application updates, Messages
 *  - "Email Notifications": Weekly digest, Marketing emails
 *  - Each row: icon + label + Switch on the right
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import NotificationSettingsScreen from './app/NotificationSettingsScreen';
 *     <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
 * 
 * NOTE: Uses React Native's built-in Switch component (no extra install needed)
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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:    '#F5FBFA',
  card:          '#FFFFFF',
  cardBorder:    '#C5E8E3',
  title:         '#0D3B47',
  subtitle:      '#4A7C75',
  label:         '#0D3B47',
  inputBg:       '#FFFFFF',
  inputBorder:   'transparent',
  inputFocus:    '#2CACAD',
  placeholder:   '#94A3B8',
  accent:        '#2CACAD',
  accentText:    '#FFFFFF',
  danger:        '#E0524C',
  chevron:       '#C7DAD7',
  rowBorder:     '#F0F6F5',
  sectionHeader: '#4A7C75',
  rowText:       '#0D3B47',
  iconBg:        '#E8F8F5',
  icon:          '#2CACAD',
  switchTrack:   '#E5F2F0',
  switchThumb:   '#FFFFFF',
  switchActive:  '#2CACAD',
};


// ─── DATA ─────────────────────────────────────────────────────────
// Push notification settings
const PUSH_NOTIFICATIONS = [
  {
    id: 'newMatches',
    label: 'New matches',
    icon: 'heart-outline',
  },
  {
    id: 'appUpdates',
    label: 'Application updates',
    icon: 'notifications-outline',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: 'chatbubble-outline',
  },
];

// Email notification settings
const EMAIL_NOTIFICATIONS = [
  {
    id: 'weeklyDigest',
    label: 'Weekly digest',
    icon: 'mail-outline',
  },
  {
    id: 'marketingEmails',
    label: 'Marketing emails',
    icon: 'megaphone-outline',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function NotificationSettingsScreen({ navigation }: any) {

  // Push notification toggle states
  const [pushSettings, setPushSettings] = useState<Record<string, boolean>>({
    newMatches: true,
    appUpdates: true,
    messages: true,
  });

  // Email notification toggle states
  const [emailSettings, setEmailSettings] = useState<Record<string, boolean>>({
    weeklyDigest: true,
    marketingEmails: false,
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

  const togglePushSetting = (settingId: string) => {
    setPushSettings((prev) => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
    console.log('Toggled push setting:', settingId);
    // TODO: sync with backend
  };

  const toggleEmailSetting = (settingId: string) => {
    setEmailSettings((prev) => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
    console.log('Toggled email setting:', settingId);
    // TODO: sync with backend
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

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
              color={COLORS.title}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── PUSH NOTIFICATIONS SECTION ───────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Push Notifications</Text>

          {PUSH_NOTIFICATIONS.map((item) => (
            <View
              key={item.id}
              style={[
                styles.settingRow,
                PUSH_NOTIFICATIONS.indexOf(item) < PUSH_NOTIFICATIONS.length - 1 && styles.settingRowNotLast,
              ]}
            >
              {/* Icon Circle */}
              <View style={styles.iconCircle}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={COLORS.icon}
                />
              </View>

              {/* Label */}
              <Text style={styles.rowText}>{item.label}</Text>

              {/* Switch */}
              <Switch
                value={pushSettings[item.id]}
                onValueChange={() => togglePushSetting(item.id)}
                trackColor={{ false: COLORS.switchTrack, true: COLORS.switchActive }}
                thumbColor={COLORS.switchThumb}
                ios_backgroundColor={COLORS.switchTrack}
              />
            </View>
          ))}
        </View>
        {/* ── END PUSH NOTIFICATIONS SECTION ─────────────────────── */}


        {/* ── EMAIL NOTIFICATIONS SECTION ──────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Email Notifications</Text>

          {EMAIL_NOTIFICATIONS.map((item) => (
            <View
              key={item.id}
              style={[
                styles.settingRow,
                EMAIL_NOTIFICATIONS.indexOf(item) < EMAIL_NOTIFICATIONS.length - 1 && styles.settingRowNotLast,
              ]}
            >
              {/* Icon Circle */}
              <View style={styles.iconCircle}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={COLORS.icon}
                />
              </View>

              {/* Label */}
              <Text style={styles.rowText}>{item.label}</Text>

              {/* Switch */}
              <Switch
                value={emailSettings[item.id]}
                onValueChange={() => toggleEmailSetting(item.id)}
                trackColor={{ false: COLORS.switchTrack, true: COLORS.switchActive }}
                thumbColor={COLORS.switchThumb}
                ios_backgroundColor={COLORS.switchTrack}
              />
            </View>
          ))}
        </View>
        {/* ── END EMAIL NOTIFICATIONS SECTION ─────────────────────── */}

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.card,
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
    color: COLORS.title,
  },

  // ── Section Cards ─────────────────────────────────────────────
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 8,
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
    color: COLORS.sectionHeader,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 12,
    marginTop: 12,
  },

  // ── Setting Row ───────────────────────────────────────────────
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingRowNotLast: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.rowBorder,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.rowText,
  },

});
