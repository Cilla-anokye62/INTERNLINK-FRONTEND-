import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { height } = Dimensions.get('window');

const WORK_SETUP = ['Remote', 'Hybrid', 'On-site'];

// Simple Ghana map SVG placeholder
function GhanaMap({ selectedCity, styles, colors }: { selectedCity: string, styles: any, colors: any }) {
  return (
    <View style={styles.mapContainer}>
      <Svg viewBox="0 0 300 380" width="100%" height="100%">
        {/* Ghana shape */}
        <Path
          d="M80,20 L220,20 L240,60 L250,120 L240,180 L220,240 L200,300 L180,340 L150,360 L120,340 L100,300 L80,240 L60,180 L50,120 L60,60 Z"
          fill={colors.accent}
          opacity={0.3}
          stroke={colors.accent}
          strokeWidth={2}
        />

        {/* Accra dot */}
        <Circle
          cx="185"
          cy="300"
          r={selectedCity === 'Accra' ? 10 : 6}
          fill={colors.accent}
          opacity={selectedCity === 'Accra' ? 1 : 0.5}
        />
        <G>
          <Path
            d="M185,280 Q185,270 185,265"
            stroke={colors.accent}
            strokeWidth={1}
            opacity={0.4}
          />
        </G>

        {/* Kumasi dot */}
        <Circle
          cx="140"
          cy="200"
          r={selectedCity === 'Kumasi' ? 10 : 6}
          fill={colors.accent}
          opacity={selectedCity === 'Kumasi' ? 1 : 0.5}
        />

        {/* Takoradi dot */}
        <Circle
          cx="100"
          cy="290"
          r={selectedCity === 'Takoradi' ? 10 : 6}
          fill={colors.accent}
          opacity={selectedCity === 'Takoradi' ? 1 : 0.5}
        />

        {/* Tamale dot */}
        <Circle
          cx="150"
          cy="100"
          r={selectedCity === 'Tamale' ? 10 : 6}
          fill={colors.accent}
          opacity={selectedCity === 'Tamale' ? 1 : 0.5}
        />

        {/* Center pin for selected */}
        <Circle cx="150" cy="190" r="30" fill="none" stroke={colors.accent} strokeWidth={1} opacity={0.3} />
        <Path
          d="M150,175 C144,175 139,180 139,186 C139,194 150,205 150,205 C150,205 161,194 161,186 C161,180 156,175 150,175 Z M150,190 C147.8,190 146,188.2 146,186 C146,183.8 147.8,182 150,182 C152.2,182 154,183.8 154,186 C154,188.2 152.2,190 150,190 Z"
          fill={colors.accent}
          opacity={0.4}
        />
      </Svg>
    </View>
  );
}

export default function PreferredLocationScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [location, setLocation] = useState('Accra, Ghana');
  const [workSetup, setWorkSetup] = useState('Hybrid');
  const [willingToRelocate, setWillingToRelocate] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Accra');

  const CITIES = ['Accra', 'Kumasi', 'Takoradi', 'Tamale', 'Remote'];

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    if (city !== 'Remote') {
      setLocation(`${city}, Ghana`);
    } else {
      setLocation('Remote');
    }
  };

  const handleFinish = () => {
    navigation.navigate('ProfileCompletion');
    // navigation.navigate('HomeScreen');
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
          <TouchableOpacity onPress={() => navigation.replace('HomeDashboard')}>
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

        {/* City chips */}
        <View style={styles.chipsRow}>
          {CITIES.map(city => {
            const isSelected = selectedCity === city;
            return (
              <TouchableOpacity
                key={city}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleCitySelect(city)}
                activeOpacity={0.7}
              >
                {city === 'Remote' && <Ionicons name="wifi-outline" size={14} color={colors.accent} style={{ marginRight: 4 }} />}
                {isSelected && city !== 'Remote' && <Text style={styles.chipCheck}>✓ </Text>}
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Ghana Map */}
        <GhanaMap selectedCity={selectedCity} styles={styles} colors={colors} />

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
          <Text style={styles.finishButtonText}>Finish Setup  →</Text>
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

  // Map
  mapContainer: {
    width: '100%',
    height: 260,
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    padding: 10,
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