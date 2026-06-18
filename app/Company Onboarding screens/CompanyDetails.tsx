import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

type CompanySize = '1-10' | '11-50' | '51-200' | '200+';

const CompanyDetailsScreen: React.FC = () => {
  const [industry, setIndustry] = useState<string>('Software & SaaS');
  const [selectedSize, setSelectedSize] = useState<CompanySize>('51-200');
  const [headquarters, setHeadquarters] = useState<string>('San Francisco, CA');
  const [description, setDescription] = useState<string>(
    'We build collaborative design tools used by 40,000+ product teams worldwide. Our internship program pairs students with senior engineers and designers.'
  );

  const companySizes: CompanySize[] = ['1-10', '11-50', '51-200', '200+'];

  const handleContinue = (): void => {
    console.log({ industry, selectedSize, headquarters, description });
    // Add your navigation here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fafa" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Company setup · Step 2 of 4</Text>
          <Text style={styles.progressPercent}>50%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Company details</Text>
        <Text style={styles.subtitle}>Help students understand your business.</Text>

        {/* Industry */}
        <Text style={styles.label}>INDUSTRY</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>💼</Text>
          <TextInput
            style={styles.textInput}
            value={industry}
            onChangeText={setIndustry}
            placeholder="Select industry"
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Company Size */}
        <Text style={styles.label}>COMPANY SIZE</Text>
        <View style={styles.sizeRow}>
          {companySizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.sizeButton, selectedSize === size && styles.sizeButtonActive]}
              onPress={() => setSelectedSize(size)}
              activeOpacity={0.8}
            >
              <Text style={[styles.sizeButtonText, selectedSize === size && styles.sizeButtonTextActive]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Headquarters */}
        <Text style={styles.label}>HEADQUARTERS</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>📍</Text>
          <TextInput
            style={styles.textInput}
            value={headquarters}
            onChangeText={setHeadquarters}
            placeholder="City, State"
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Company Description */}
        <Text style={styles.label}>COMPANY DESCRIPTION</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Tell students about your company..."
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const TEAL = '#3DBFB8';
const TEAL_DARK = '#2ea89f';
const BACKGROUND = '#eef9f9';
const LABEL_COLOR = '#8a9aab';
const TEXT_COLOR = '#1a2b35';
const BORDER_COLOR = '#dce8ea';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: LABEL_COLOR,
  },
  progressPercent: {
    fontSize: 12,
    color: LABEL_COLOR,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#d0e8ea',
    borderRadius: 2,
    marginBottom: 28,
  },
  progressBarFill: {
    width: '50%',
    height: 4,
    backgroundColor: TEAL,
    borderRadius: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_COLOR,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: LABEL_COLOR,
    marginBottom: 28,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: LABEL_COLOR,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_COLOR,
    padding: 0,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  sizeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_COLOR,
  },
  sizeButtonTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 14,
    fontSize: 14,
    color: TEXT_COLOR,
    minHeight: 120,
    marginBottom: 32,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: TEAL,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: TEAL_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default CompanyDetailsScreen;