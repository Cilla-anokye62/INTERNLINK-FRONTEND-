import { useAppTheme } from '../../src/hooks/useAppTheme';
/**
 * AccessibilityScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Accessibility Screen
 *
 * Content:
 *  - Header: back arrow + "Accessibility" title
 *  - Font size settings
 *  - Text scaling toggle
 *  - High contrast mode toggle
 *  - Screen reader settings
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



const FONT_SIZES = ['Small', 'Medium', 'Large', 'Extra Large'];

export default function AccessibilityScreen({ navigation }: any) {
    const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
const [fontSize, setFontSize] = useState('Medium');
  const [textScaling, setTextScaling] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

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
          <Text style={styles.headerTitle}>Accessibility</Text>
        </View>

        {/* Font Size */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>FONT SIZE</Text>
          <View style={styles.sizeOptions}>
            {FONT_SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeOption,
                  fontSize === size && styles.sizeOptionSelected,
                ]}
                onPress={() => setFontSize(size)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.sizeText,
                  fontSize === size && styles.sizeTextSelected,
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Text Scaling */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>TEXT</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Allow Text Scaling</Text>
              <Text style={styles.settingDescription}>
                Scale text to match device settings
              </Text>
            </View>
            <Switch
              value={textScaling}
              onValueChange={setTextScaling}
              trackColor={{ false: colors.switchTrack, true: colors.switchActive }}
              thumbColor={colors.switchThumb}
              ios_backgroundColor={colors.switchTrack}
            />
          </View>
        </View>

        {/* Visual */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>VISUAL</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>High Contrast Mode</Text>
              <Text style={styles.settingDescription}>
                Increase contrast for better visibility
              </Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: colors.switchTrack, true: colors.switchActive }}
              thumbColor={colors.switchThumb}
              ios_backgroundColor={colors.switchTrack}
            />
          </View>
          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Reduce Motion</Text>
              <Text style={styles.settingDescription}>
                Minimize animations and transitions
              </Text>
            </View>
            <Switch
              value={reduceMotion}
              onValueChange={setReduceMotion}
              trackColor={{ false: colors.switchTrack, true: colors.switchActive }}
              thumbColor={colors.switchThumb}
              ios_backgroundColor={colors.switchTrack}
            />
          </View>
        </View>

        {/* Screen Reader */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>SCREEN READER</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Screen Reader Support</Text>
              <Text style={styles.settingDescription}>
                Optimize for screen readers like VoiceOver
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={colors.icon} />
          </View>
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
  sizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  sizeOptionSelected: {
    backgroundColor: colors.switchActive,
  },
  sizeText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  sizeTextSelected: {
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingRowLast: {
    borderBottomWidth: 0,
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
});
