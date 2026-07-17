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
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';



type CompanySize = '1-10' | '11-50' | '51-200' | '200+';

type Props = NativeStackScreenProps<any, any>;

// ---------- Main Screen ----------
const CompanyDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

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
          <Ionicons name="business-outline" size={16} color={colors.subtitle} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            value={industry}
            onChangeText={setIndustry}
            placeholder="e.g. Software & SaaS"
            placeholderTextColor={colors.placeholder}
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
          <Ionicons name="location-outline" size={16} color={colors.subtitle} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            value={headquarters}
            onChangeText={setHeadquarters}
            placeholder="e.g. San Francisco, CA"
            placeholderTextColor={colors.placeholder}
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
            placeholderTextColor={colors.placeholder}
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
    fontSize: 11,
    fontWeight: '700',
    color: colors.placeholder,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
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
    color: colors.text,
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
    borderColor: colors.inputBorder,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  sizeButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sizeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.title,
  },
  sizeButtonTextSelected: {
    color: colors.onPrimary,
  },
  textAreaContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 32,
  },
  textArea: {
    fontSize: 14,
    color: colors.text,
    minHeight: 120,
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

export default CompanyDetailsScreen;