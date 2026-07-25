import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';

const { height } = Dimensions.get('window');

const WORK_SETUP: Array<'Remote' | 'Hybrid' | 'On-site'> = ['Remote', 'Hybrid', 'On-site'];

export default function PreferredLocationScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const { preferredLocation, workSetup: storeWorkSetup, willingToRelocate: storeRelocate, setLocationPreferences } = useAppStore();

  const [location, setLocation] = useState(preferredLocation);
  const [workSetup, setWorkSetup] = useState<'Remote' | 'Hybrid' | 'On-site'>(storeWorkSetup);
  const [willingToRelocate, setWillingToRelocate] = useState(storeRelocate);
  const [selectedCity, setSelectedCity] = useState(preferredLocation.split(',')[0] || 'Accra');

  const LOCATIONS = [
    'Accra', 'Kumasi', 'Takoradi', 'Tamale', 'Cape Coast',
    'Sunyani', 'Koforidua', 'Ho', 'Bolgatanga', 'Wa',
    'Teshie', 'Tema', 'Madina', 'Spintex', 'East Legon',
  ];

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setLocation(`${city}, Ghana`);
  };

  const handleFinish = () => {
    setLocationPreferences(location, workSetup, willingToRelocate);
    navigation.navigate('ProfileCompletion');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
          </TouchableOpacity>
          <Text style={styles.stepLabel}>STEP 4 OF 5</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileCompletion')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '80%' }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Preferred location</Text>
        <Text style={styles.subtitle}>Where would you love to work?</Text>

        {/* Location input */}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={18} color={colors.placeholder} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter city or region"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Location list */}
        <View style={styles.locationsList}>
          {LOCATIONS.map(city => {
            const isSelected = selectedCity === city;
            return (
              <TouchableOpacity
                key={city}
                style={[styles.locationItem, isSelected && styles.locationItemSelected]}
                onPress={() => handleCitySelect(city)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={isSelected ? colors.accent : colors.placeholder}
                  style={{ marginRight: 10 }}
                />
                <Text style={[styles.locationText, isSelected && styles.locationTextSelected]}>
                  {city}
                </Text>
                {isSelected && <Ionicons name="checkmark-circle" size={18} color={colors.accent} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Work setup */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Work setup</Text>
          <View style={styles.workSetupRow}>
            {WORK_SETUP.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.workOption, workSetup === option && styles.workOptionSelected]}
                onPress={() => setWorkSetup(option)}
                activeOpacity={0.7}
              >
                <Text style={[styles.workOptionText, workSetup === option && styles.workOptionTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Willing to relocate */}
        <View style={styles.card}>
          <View style={styles.relocateRow}>
            <View style={styles.relocateText}>
              <Text style={styles.cardTitle}>Willing to relocate</Text>
              <Text style={styles.relocateSubtitle}>Show roles outside your preferred area.</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, willingToRelocate && styles.toggleActive]}
              onPress={() => setWillingToRelocate(!willingToRelocate)}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleThumb, willingToRelocate && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Finish button */}
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish} activeOpacity={0.85}>
          <Text style={styles.finishButtonText}>Continue  →</Text>
        </TouchableOpacity>

        <View style={{ height: height * 0.03 }} />
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
    paddingHorizontal: 24,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.04,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.title,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  skipText: {
    fontSize: 13,
    color: colors.placeholder,
    fontWeight: '500',
  },

  // Progress
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
    marginBottom: height * 0.03,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: height * 0.025,
  },

  // Location input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginBottom: 16,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },

  // City chips
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  chipSelected: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 2,
  },
  chipIcon: {
    fontSize: 12,
  },
  chipCheck: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: 'bold',
  },
  chipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.accent,
    fontWeight: '700',
  },

  // Location list
  locationsList: {
    marginBottom: 20,
    gap: 6,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  locationItemSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.card,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  locationTextSelected: {
    color: colors.accent,
    fontWeight: '700',
  },

  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.cardTitle,
    marginBottom: 12,
  },

  // Work setup
  workSetupRow: {
    flexDirection: 'row',
    gap: 8,
  },
  workOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: colors.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  workOptionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  workOptionText: {
    fontSize: 13,
    color: colors.subtitle,
    fontWeight: '500',
  },
  workOptionTextSelected: {
    color: colors.onPrimary,
    fontWeight: '700',
  },

  // Relocate toggle
  relocateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  relocateText: {
    flex: 1,
    marginRight: 16,
  },
  relocateSubtitle: {
    fontSize: 12,
    color: colors.placeholder,
    marginTop: 2,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.inputBorder,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: colors.accent,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },

  // Finish button
  finishButton: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  finishButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
