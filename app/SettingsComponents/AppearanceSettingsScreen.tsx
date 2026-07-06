/**
 * AppearanceSettingsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Appearance Settings (PREFERENCES section in SettingsScreen)
 *
 * Content:
 *  - Three selectable cards/pills: Light, Dark, System Default
 *  - Similar style to Institution Type pills from InstitutionDetailsScreen
 *  - Instant apply pattern (no save button needed)
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import AppearanceSettingsScreen from './app/AppearanceSettingsScreen';
 *     <Stack.Screen name="AppearanceSettings" component={AppearanceSettingsScreen} />
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
  optionText:    '#0D3B47',
  optionDesc:    '#4A7C75',
  pillIdle:      '#F0F6F5',
  pillIdleText:  '#4A7C75',
  pillActive:    '#2CACAD',
  pillActiveText: '#FFFFFF',
};


// ─── DATA ─────────────────────────────────────────────────────────
// Appearance options
const APPEARANCE_OPTIONS = [
  {
    id: 'light',
    name: 'Light',
    description: 'Always use light mode',
    icon: 'sunny-outline',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Always use dark mode',
    icon: 'moon-outline',
  },
  {
    id: 'system',
    name: 'System Default',
    description: 'Follow device settings',
    icon: 'phone-portrait-outline',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function AppearanceSettingsScreen({ navigation }: any) {

  // Currently selected appearance mode
  const [selectedAppearance, setSelectedAppearance] = useState('light');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const selectAppearance = (appearanceId: string) => {
    setSelectedAppearance(appearanceId);
    console.log('Selected appearance:', appearanceId);
    // TODO: sync with backend and apply theme change instantly
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
          <Text style={styles.headerTitle}>Appearance</Text>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── APPEARANCE OPTIONS (3 across) ─────────────────────────── */}
        <View style={styles.optionsRow}>
          {APPEARANCE_OPTIONS.map((option) => {
            const isSelected = selectedAppearance === option.id;

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
                {/* Icon */}
                <View style={[
                  styles.iconCircle,
                  isSelected && styles.iconCircleActive,
                ]}>
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={isSelected ? COLORS.accent : COLORS.subtitle}
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
              </TouchableOpacity>
            );
          })}
        </View>
        {/* ── END APPEARANCE OPTIONS ──────────────────────────────── */}

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

  // ── Options Row (3 cards across) ───────────────────────────────
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  // ── Option Card ───────────────────────────────────────────────
  optionCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.pillIdle,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionCardActive: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.pillActive,
    shadowColor: COLORS.pillActive,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.pillIdle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconCircleActive: {
    backgroundColor: '#E8F8F5',
  },
  optionName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.optionText,
    marginBottom: 4,
    textAlign: 'center',
  },
  optionNameActive: {
    color: COLORS.accent,
  },
  optionDesc: {
    fontSize: 11,
    color: COLORS.optionDesc,
    textAlign: 'center',
    lineHeight: 14,
  },

});
