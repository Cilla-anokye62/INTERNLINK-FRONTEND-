import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';


// ---------- Types ----------
type CompanySize = '1-10' | '11-50' | '51-200' | '200+';

type Props = NativeStackScreenProps<any, any>;

// ---------- Main Screen ----------
const CompanyDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const [industry, setIndustry] = useState<string>('Software & SaaS');
  const [selectedSize, setSelectedSize] = useState<CompanySize>('51-200');
  const [headquarters, setHeadquarters] = useState<string>('San Francisco, CA');
  const [description, setDescription] = useState<string>(
    'We build collaborative design tools used by 40,000+ product teams worldwide. Our internship program pairs students with senior engineers and designers.'
  );

  const companySizes: CompanySize[] = ['1-10', '11-50', '51-200', '200+'];

  const handleContinue = (): void => {
    navigation.navigate('RecruitmentPreferences');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step indicator */}
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Company setup · Step 2 of 4</Text>
          <Text style={styles.stepPercent}>50%</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Company details</Text>
        <Text style={styles.subtitle}>Help students understand your business.</Text>

        {/* Industry */}
        <Text style={styles.sectionLabel}>INDUSTRY</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>🏭</Text>
          <TextInput
            style={styles.input}
            value={industry}
            onChangeText={setIndustry}
            placeholder="e.g. Software & SaaS"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Company size */}
        <Text style={styles.sectionLabel}>COMPANY SIZE</Text>
        <View style={styles.sizeRow}>
          {companySizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeButton,
                selectedSize === size && styles.sizeButtonSelected,
              ]}
              onPress={() => setSelectedSize(size)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.sizeButtonText,
                  selectedSize === size && styles.sizeButtonTextSelected,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Headquarters */}
        <Text style={styles.sectionLabel}>HEADQUARTERS</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>📍</Text>
          <TextInput
            style={styles.input}
            value={headquarters}
            onChangeText={setHeadquarters}
            placeholder="e.g. San Francisco, CA"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Company description */}
        <Text style={styles.sectionLabel}>COMPANY DESCRIPTION</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell students about your company..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const TEAL = '#2BA9A0';
const TEAL_DARK = '#1E8A82';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: TEAL,
    fontWeight: '500',
  },
  stepPercent: {
    fontSize: 13,
    color: TEXT_GRAY,
    fontWeight: '500',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: TEAL,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  sizeButtonSelected: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  sizeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  sizeButtonTextSelected: {
    color: '#FFFFFF',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 32,
  },
  textArea: {
    fontSize: 14,
    color: TEXT_DARK,
    minHeight: 120,
  },
  continueButton: {
    backgroundColor: TEAL,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CompanyDetailsScreen;