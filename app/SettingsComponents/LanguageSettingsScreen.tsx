import React, { useMemo } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import {
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from '../../src/constants/languages';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';

export default function LanguageSettingsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const selectedLanguage = useAppStore((state) => state.languageCode);
  const setSelectedLanguage = useAppStore((state) => state.setLanguageCode);

  const selectLanguage = (languageId: LanguageCode) => {
    setSelectedLanguage(languageId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back-outline" size={22} color={colors.title} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Language</Text>
        </View>

        <View style={styles.languageCard}>
          {SUPPORTED_LANGUAGES.map((language, index) => {
            const isSelected = selectedLanguage === language.id;
            return (
              <TouchableOpacity
                key={language.id}
                style={[
                  styles.languageRow,
                  index < SUPPORTED_LANGUAGES.length - 1 && styles.languageRowNotLast,
                ]}
                onPress={() => selectLanguage(language.id)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
              >
                <View style={styles.languageTextBlock}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.nativeName}>{language.nativeName}</Text>
                </View>
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
                ) : null}
              </TouchableOpacity>
            );
          })}
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
  languageCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  languageRowNotLast: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rowBorder,
  },
  languageTextBlock: {
    flex: 1,
  },
  languageName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.label,
    marginBottom: 2,
  },
  nativeName: {
    fontSize: 13,
    color: colors.subtitle,
  },
});
