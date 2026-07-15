import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { height, width } = Dimensions.get('window');

const INTERESTS = [
  { id: 'software',  label: 'Software Dev',     colors: ['#0F2027', '#203A43'] as const },
  { id: 'data',      label: 'Data Science',      colors: ['#1A1A2E', '#16213E'] as const },
  { id: 'cyber',     label: 'Cybersecurity',     colors: ['#0D0D0D', '#1A0533'] as const },
  { id: 'cloud',     label: 'Cloud Computing',   colors: ['#0F3460', '#16213E'] as const },
  { id: 'uiux',      label: 'UI/UX Design',      colors: ['#1A1A2E', '#2D132C'] as const },
  { id: 'ai',        label: 'Artificial Intel',  colors: ['#0A3D62', '#1E3799'] as const },
  { id: 'marketing', label: 'Digital Marketing', colors: ['#3D0C02', '#6A0572'] as const },
  { id: 'finance',   label: 'Finance',           colors: ['#0B3D0B', '#1A3A1A'] as const },
];

export default function CareerInterestsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length < 2) {
      alert('Please select at least 2 interests.');
      return;
    }
    navigation.navigate('PreferredLocation');
  };

  const CARD_SIZE = (width - 24 * 2 - 12) / 2;

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Fixed top section */}
      <View style={styles.topSection}>
        <View style={styles.progressRow}>
          <Text style={styles.stepLabel}>Step 3 of 5</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PreferredLocation')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '60%' }]} />
        </View>

        <Text style={styles.title}>What interests{'\n'}you?</Text>
        <Text style={styles.subtitle}>
          Choose career areas you'd like to explore. Select multiple.
        </Text>

        <View style={styles.hintRow}>
          <Text style={styles.hintIcon}>✦</Text>
          <Text style={styles.hintText}>AI uses your interests to calculate match scores</Text>
        </View>
      </View>

      {/* Scrollable grid */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {INTERESTS.map(item => {
            const isSelected = selected.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleInterest(item.id)}
                activeOpacity={0.85}
                style={[
                  styles.card,
                  { width: CARD_SIZE, height: CARD_SIZE },
                  isSelected && styles.cardSelected,
                ]}
              >
                <LinearGradient
                  colors={item.colors}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                  <Text style={styles.cardLabel}>{item.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: height * 0.12 }} />
      </ScrollView>

      {/* Fixed bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.selectedCount}>{selected.length} selected</Text>
          <Text style={styles.minText}>Select at least 2</Text>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: height * 0.02,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  skipText: {
    fontSize: 13,
    color: colors.placeholder,
    fontWeight: '500',
  },
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
    marginBottom: height * 0.025,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: 12,
    lineHeight: 20,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginBottom: 4,
  },
  hintIcon: {
    fontSize: 14,
    color: colors.accent,
    marginRight: 8,
  },
  hintText: {
    fontSize: 13,
    color: colors.subtitle,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: colors.accent,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: height * 0.03,
    paddingTop: 12,
    backgroundColor: colors.background,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectedCount: {
    fontSize: 13,
    color: colors.title,
    fontWeight: '600',
  },
  minText: {
    fontSize: 13,
    color: colors.placeholder,
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