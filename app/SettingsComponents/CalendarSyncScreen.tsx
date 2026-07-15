import { useAppTheme } from '../../src/hooks/useAppTheme';
/**
 * CalendarSyncScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Calendar Sync Screen
 *
 * Content:
 *  - Header: back arrow + "Calendar Sync" title
 *  - Calendar sync toggle
 *  - Calendar selection
 *  - Sync frequency settings
 * ─────────────────────────────────────────────────────────────────
 */

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



const SYNC_FREQUENCIES = ['Real-time', 'Hourly', 'Daily', 'Weekly'];

export default function CalendarSyncScreen({ navigation }: any) {
    const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
const [syncEnabled, setSyncEnabled] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState('Google Calendar');
  const [syncFrequency, setSyncFrequency] = useState('Real-time');

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-outline"
              size={22}
              color={colors.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar Sync</Text>
        </View>

        {/* Sync Toggle */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>SYNC SETTINGS</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Calendar Sync</Text>
              <Text style={styles.settingDescription}>
                Sync interview schedules with your device calendar
              </Text>
            </View>
            <Switch
              value={syncEnabled}
              onValueChange={setSyncEnabled}
              trackColor={{ false: colors.switchTrack, true: colors.switchActive }}
              thumbColor={colors.switchThumb}
              ios_backgroundColor={colors.switchTrack}
            />
          </View>
        </View>

        {/* Calendar Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>CALENDAR</Text>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionInfo}>
              <Ionicons name="calendar-outline" size={20} color={colors.switchActive} />
              <Text style={styles.optionLabel}>{selectedCalendar}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color={colors.switchActive} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionInfo}>
              <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
              <Text style={styles.optionLabel}>Apple Calendar</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionInfo}>
              <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
              <Text style={styles.optionLabel}>Outlook Calendar</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sync Frequency */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>SYNC FREQUENCY</Text>
          {SYNC_FREQUENCIES.map((freq) => (
            <TouchableOpacity
              key={freq}
              style={styles.optionRow}
              onPress={() => setSyncFrequency(freq)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionLabel}>{freq}</Text>
              {syncFrequency === freq && (
                <Ionicons name="checkmark-circle" size={20} color={colors.switchActive} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.switchActive} />
          <Text style={styles.infoText}>
            Calendar sync requires permission to access your device calendar. You can revoke this permission at any time in your device settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.headerTitle,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.title,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.text,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    color: colors.title,
    marginLeft: 12,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EAF6F5',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
});
