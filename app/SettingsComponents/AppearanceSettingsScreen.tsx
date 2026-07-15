/**
 * AppearanceSettingsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Appearance Settings
 *
 * Wired to the central ThemeContext via useAppTheme().
 * Selecting Light / Dark / System Default instantly changes the
 * entire app's theme and persists the choice via Zustand + AsyncStorage.
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

// ─── DATA ─────────────────────────────────────────────────────────
const APPEARANCE_OPTIONS = [
  {
    id: 'light' as const,
    name: 'Light',
    description: 'Always use light mode',
    icon: 'sunny-outline' as const,
  },
  {
    id: 'dark' as const,
    name: 'Dark',
    description: 'Always use dark mode',
    icon: 'moon-outline' as const,
  },
  {
    id: 'system' as const,
    name: 'System Default',
    description: 'Follow device settings',
    icon: 'phone-portrait-outline' as const,
  },
];

// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function AppearanceSettingsScreen({ navigation }: any) {
  // Pull the live preference and the setter from the centralized theme
  const { colors, themePreference, setThemePreference, theme } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const selectAppearance = (id: 'light' | 'dark' | 'system') => {
    setThemePreference(id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ──────────────────────────────────────────────── */}
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
          <Text style={styles.headerTitle}>Appearance</Text>
        </View>

        {/* ── SECTION LABEL ────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>THEME</Text>

        {/* ── APPEARANCE OPTION CARDS (3 across) ──────────────────── */}
        <View style={styles.optionsRow}>
          {APPEARANCE_OPTIONS.map((option) => {
            const isSelected = themePreference === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardActive,
                ]}
                onPress={() => selectAppearance(option.id)}
                activeOpacity={0.85}
              >
                {/* Icon circle */}
                <View style={[
                  styles.iconCircle,
                  isSelected && styles.iconCircleActive,
                ]}>
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={isSelected ? colors.accent : colors.subtitle}
                  />
                </View>

                {/* Name */}
                <Text style={[
                  styles.optionName,
                  isSelected && styles.optionNameActive,
                ]}>
                  {option.name}
                </Text>

                {/* Description */}
                <Text style={styles.optionDesc}>{option.description}</Text>

                {/* Active checkmark badge */}
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color={colors.onPrimary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── INFO NOTE ────────────────────────────────────────────── */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.accent}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.infoText}>
            Your preference is saved automatically and will persist when you reopen the app.
          </Text>
        </View>
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
    paddingBottom: 40,
  },

  // ── Header ──────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
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

  // ── Section label ────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.sectionLabel,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },

  // ── Options Row (3 cards across) ─────────────────────────────────
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },

  // ── Option Card ──────────────────────────────────────────────────
  optionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.cardBorderIdle,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionCardActive: {
    borderColor: colors.cardBorderActive,
    shadowColor: colors.cardBorderActive,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconCircleActive: {
    backgroundColor: colors.iconCircle,
  },
  optionName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.cardTitle,
    marginBottom: 4,
    textAlign: 'center',
  },
  optionNameActive: {
    color: colors.accent,
  },
  optionDesc: {
    fontSize: 10,
    color: colors.cardDescription,
    textAlign: 'center',
    lineHeight: 14,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Info box ─────────────────────────────────────────────────────
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.iconCircle,
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.subtitle,
    lineHeight: 19,
  },
});
