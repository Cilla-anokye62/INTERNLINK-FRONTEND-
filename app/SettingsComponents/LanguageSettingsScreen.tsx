/**
 * LanguageSettingsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Language Settings (PREFERENCES section in SettingsScreen)
 *
 * Content:
 *  - Radio-button-style list of languages (English, French, Spanish, Twi)
 *  - Each row with a checkmark on the selected one
 *  - Instant apply pattern (no save button needed)
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import LanguageSettingsScreen from './app/LanguageSettingsScreen';
 *     <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
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
  languageText:  '#0D3B47',
  checkmark:     '#2CACAD',
  rowBg:         '#FFFFFF',
};


// ─── DATA ─────────────────────────────────────────────────────────
// Available languages
const LANGUAGES = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
  },
  {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
  },
  {
    id: 'tw',
    name: 'Twi',
    nativeName: 'Twi',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function LanguageSettingsScreen({ navigation }: any) {

  // Currently selected language
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const selectLanguage = (languageId: string) => {
    setSelectedLanguage(languageId);
    console.log('Selected language:', languageId);
    // TODO: sync with backend and apply language change instantly
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
          <Text style={styles.headerTitle}>Language</Text>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── LANGUAGE LIST ───────────────────────────────────────── */}
        <View style={styles.languageCard}>
          {LANGUAGES.map((language) => {
            const isSelected = selectedLanguage === language.id;

            return (
              <TouchableOpacity
                key={language.id}
                style={[
                  styles.languageRow,
                  LANGUAGES.indexOf(language) < LANGUAGES.length - 1 && styles.languageRowNotLast,
                ]}
                onPress={() => selectLanguage(language.id)}
                activeOpacity={0.7}
              >
                {/* Language Name */}
                <View style={styles.languageTextBlock}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.nativeName}>{language.nativeName}</Text>
                </View>

                {/* Checkmark (only shown when selected) */}
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={COLORS.checkmark}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        {/* ── END LANGUAGE LIST ──────────────────────────────────── */}

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

  // ── Language Card ─────────────────────────────────────────────
  languageCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  // ── Language Row ───────────────────────────────────────────────
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  languageRowNotLast: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.rowBorder,
  },
  languageTextBlock: {
    flex: 1,
  },
  languageName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.languageText,
    marginBottom: 2,
  },
  nativeName: {
    fontSize: 13,
    color: COLORS.subtitle,
  },

});
