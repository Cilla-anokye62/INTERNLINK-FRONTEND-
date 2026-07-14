import { useAppTheme } from '../../src/hooks/useAppTheme';
/**
 * JobPreferencesScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Job Preferences Screen
 *
 * Content:
 *  - Header: back arrow + "Job Preferences" title
 *  - Job type preferences (Full-time, Part-time, Internship, Co-op)
 *  - Location preferences
 *  - Industry preferences
 *  - Save button
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
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Co-op', 'Remote', 'Hybrid'];
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Engineering', 'Business'];

export default function JobPreferencesScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [preferredLocation, setPreferredLocation] = useState('');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const toggleJobType = (type: string) => {
    setSelectedJobTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('jobPreferences', JSON.stringify({
        jobTypes: selectedJobTypes,
        industries: selectedIndustries,
        location: preferredLocation,
      }));
      Alert.alert('Success', 'Job preferences saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    }
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
          <Text style={styles.headerTitle}>Job Preferences</Text>
        </View>

        {/* Job Types */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Job Type</Text>
          <View style={styles.chipsContainer}>
            {JOB_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  selectedJobTypes.includes(type) && styles.chipSelected,
                ]}
                onPress={() => toggleJobType(type)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.chipText,
                  selectedJobTypes.includes(type) && styles.chipSelectedText,
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferred Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., New York, Remote"
            placeholderTextColor="#94A3B8"
            value={preferredLocation}
            onChangeText={setPreferredLocation}
          />
        </View>

        {/* Industries */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Industries</Text>
          <View style={styles.chipsContainer}>
            {INDUSTRIES.map((industry) => (
              <TouchableOpacity
                key={industry}
                style={[
                  styles.chip,
                  selectedIndustries.includes(industry) && styles.chipSelected,
                ]}
                onPress={() => toggleIndustry(industry)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.chipText,
                  selectedIndustries.includes(industry) && styles.chipSelectedText,
                ]}>
                  {industry}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.sectionHeader,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.chip,
  },
  chipSelected: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelected,
  },
  chipText: {
    fontSize: 14,
    color: colors.chipText,
    fontWeight: '600',
  },
  chipSelectedText: {
    color: colors.chipSelectedText,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.title,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
  },
  saveButton: {
    backgroundColor: colors.button,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.buttonText,
  },
});
