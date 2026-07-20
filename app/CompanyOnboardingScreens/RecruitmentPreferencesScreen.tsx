import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

// ---------- Types ----------
type WorkSetup = 'Remote' | 'Hybrid' | 'On-site';

interface ChipData {
  label: string;
  selected: boolean;
}

// ---------- Reusable Chip Component ----------
interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: any;
}

const Chip: React.FC<ChipProps> = ({ label, selected, onPress, colors }) => {
  return (
    <TouchableOpacity
      style={[
        {
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          backgroundColor: colors.card,
        },
        selected && {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        {
          fontSize: 13,
          color: colors.title,
          fontWeight: '500',
        },
        selected && {
          color: colors.onPrimary,
        }
      ]}>
        {selected ? `✓ ${label}` : label}
      </Text>
    </TouchableOpacity>
  );
};
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, any>;

// ---------- Main Screen ----------
const RecruitmentPreferencesScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // Internship categories state
  const [categories, setCategories] = useState<ChipData[]>([
    { label: 'Engineering', selected: true },
    { label: 'Design', selected: true },
    { label: 'Product', selected: true },
    { label: 'Data', selected: false },
    { label: 'Marketing', selected: false },
    { label: 'Operations', selected: false },
  ]);

  // Preferred qualifications state
  const [qualifications, setQualifications] = useState<ChipData[]>([
    { label: "Bachelor's+", selected: true },
    { label: '3.0+ GPA', selected: true },
    { label: 'Final year', selected: false },
    { label: 'Visa sponsorship', selected: false },
    { label: 'Portfolio required', selected: true },
  ]);

  // Work setup state (single select)
  const [workSetup, setWorkSetup] = useState<WorkSetup>('Hybrid');

  const toggleCategory = (index: number) => {
    setCategories((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleQualification = (index: number) => {
    setQualifications((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleContinue = (): void => {
    navigation.navigate('CompanyProfileCompletion');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step indicator */}
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Company setup · Step 3 of 4</Text>
          <Text style={styles.stepPercent}>75%</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Recruitment preferences</Text>
        <Text style={styles.subtitle}>
          We'll surface candidates that match your needs.
        </Text>

        {/* Internship categories */}
        <Text style={styles.sectionLabel}>INTERNSHIP CATEGORIES</Text>
        <View style={styles.card}>
          <View style={styles.chipWrap}>
            {categories.map((item, index) => (
              <Chip
                key={item.label}
                label={item.label}
                selected={item.selected}
                onPress={() => toggleCategory(index)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* Preferred qualifications */}
        <Text style={styles.sectionLabel}>PREFERRED QUALIFICATIONS</Text>
        <View style={styles.card}>
          <View style={styles.chipWrap}>
            {qualifications.map((item, index) => (
              <Chip
                key={item.label}
                label={item.label}
                selected={item.selected}
                onPress={() => toggleQualification(index)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* Internship locations */}
        <Text style={styles.sectionLabel}>INTERNSHIP LOCATIONS</Text>
        <View style={styles.locationCard}>
          <Ionicons name="location-outline" size={16} color={colors.accent} style={{ marginRight: 8 }} />
          <Text style={styles.locationText}>
            San Francisco · New York · Remote
          </Text>
        </View>

        {/* Work setup */}
        <Text style={styles.sectionLabel}>WORK SETUP</Text>
        <View style={styles.workSetupRow}>
          {(['Remote', 'Hybrid', 'On-site'] as WorkSetup[]).map((option) => {
            const isSelected = workSetup === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.workSetupButton,
                  isSelected && styles.workSetupButtonSelected,
                ]}
                onPress={() => setWorkSetup(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.workSetupText,
                    isSelected && styles.workSetupTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Next  →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '500',
  },
  stepPercent: {
    fontSize: 13,
    color: colors.subtitle,
    fontWeight: '500',
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.inputBorder,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.placeholder,
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 14,
    marginBottom: 20,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.card,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 13,
    color: colors.title,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.onPrimary,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
  },
  workSetupRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  workSetupButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  workSetupButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  workSetupText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.title,
  },
  workSetupTextSelected: {
    color: colors.onPrimary,
  },
  continueButton: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecruitmentPreferencesScreen;