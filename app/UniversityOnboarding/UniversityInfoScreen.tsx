import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

const { height } = Dimensions.get('window');

const COLORS = {
  background: '#F5FBFA',
  card: '#FFFFFF',
  progressTrack: '#B2DDD8',
  progressFill: '#2EC4B6',
  stepLabel: '#4A7C75',
  stepPercent: '#2EC4B6',
  title: '#0D3B47',
  subtitle: '#4A7C75',
  uploadCard: '#F4FCFB',
  uploadCardBorder: '#C5E8E3',
  uploadIconCircle: '#E8F8F5',
  uploadIconBorder: '#2EC4B6',
  uploadIcon: '#2EC4B6',
  uploadTitle: '#0D3B47',
  uploadSubtitle: '#9BB8B4',
  uploadBtn: '#2EC4B6',
  uploadBtnText: '#FFFFFF',
  label: '#0D3B47',
  inputBg: '#FFFFFF',
  inputBorder: '#C5E8E3',
  inputBorderFocus: '#2EC4B6',
  inputText: '#0D3B47',
  placeholder: '#9BB8B4',
  inputIcon: '#9BB8B4',
  nextBtn: '#2EC4B6',
  nextBtnText: '#FFFFFF',
};

const FIELDS = [
  {
    id: 'name',
    label: 'UNIVERSITY NAME',
    placeholder: 'Massachusetts Institute of Technology',
    icon: '🎓',
    keyboardType: 'default' as const,
  },
  {
    id: 'email',
    label: 'OFFICIAL EMAIL',
    placeholder: 'careers@mit.edu',
    icon: '✉',
    keyboardType: 'email-address' as const,
  },
  {
    id: 'phone',
    label: 'CONTACT PHONE',
    placeholder: '+1 (617) 253-1000',
    icon: '📞',
    keyboardType: 'phone-pad' as const,
  },
  {
    id: 'website',
    label: 'WEBSITE',
    placeholder: 'https://www.mit.edu',
    icon: '🌐',
    keyboardType: 'url' as const,
  },
];

export default function UniversityInfoScreen({ navigation }: any) {
  const [formValues, setFormValues] = useState<Record<string, string>>({
    name: '', email: '', phone: '', website: '',
  });
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [logoUploaded, setLogoUploaded] = useState(false);

  const handleChange = (id: string, value: string) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    console.log('University info submitted:', formValues);
    navigation.navigate('InstitutionDetails');
  };

  const PROGRESS = 0.25;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Header */}
          <View style={styles.stepRow}>
            <Text style={styles.stepLabel}>University Setup · Step 1 of 4</Text>
            <Text style={styles.stepPercent}>25%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${PROGRESS * 100}%` }]} />
          </View>

          {/* White Card */}
          <View style={styles.card}>

            {/* Title */}
            <Text style={styles.title}>University information</Text>
            <Text style={styles.subtitle}>Help students recognize your institution.</Text>

            {/* Upload row */}
            <View style={styles.uploadCard}>
              <View style={styles.uploadIconCircle}>
                <Text style={styles.uploadIconText}>⬆</Text>
              </View>
              <View style={styles.uploadTextBlock}>
                <Text style={styles.uploadTitle}>Upload university logo</Text>
                <Text style={styles.uploadSubtitle}>PNG or SVG · max 2MB · square</Text>
              </View>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={() => setLogoUploaded(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.uploadBtnText}>
                  {logoUploaded ? 'Change' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input fields */}
            <View style={styles.fieldsContainer}>
              {FIELDS.map((field) => (
                <View key={field.id} style={styles.fieldGroup}>
                  <Text style={styles.label}>{field.label}</Text>
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === field.id && styles.inputWrapperFocused,
                  ]}>
                    <Text style={styles.inputIcon}>{field.icon}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={field.placeholder}
                      placeholderTextColor={COLORS.placeholder}
                      value={formValues[field.id]}
                      onChangeText={(value) => handleChange(field.id, value)}
                      keyboardType={field.keyboardType}
                      autoCapitalize={field.keyboardType === 'default' ? 'words' : 'none'}
                      onFocus={() => setFocusedInput(field.id)}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Next button */}
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>Next  →</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: height * 0.03,    // relative instead of fixed 20
    paddingBottom: height * 0.05, // relative instead of fixed 40
    backgroundColor: COLORS.background,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: COLORS.stepLabel,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  stepPercent: {
    fontSize: 12,
    color: COLORS.stepPercent,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: COLORS.progressTrack,
    borderRadius: 3,
    marginBottom: height * 0.025, // relative instead of fixed 20
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.progressFill,
    borderRadius: 3,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.title,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtitle,
    lineHeight: 20,
    marginBottom: height * 0.025, // relative instead of fixed 22
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.uploadCard,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.uploadCardBorder,
    padding: 14,
    marginBottom: height * 0.03,  // relative instead of fixed 24
  },
  uploadIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.uploadIconCircle,
    borderWidth: 1.5,
    borderColor: COLORS.uploadIconBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  uploadIconText: {
    fontSize: 20,
    color: COLORS.uploadIcon,
  },
  uploadTextBlock: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.uploadTitle,
    marginBottom: 3,
  },
  uploadSubtitle: {
    fontSize: 11,
    color: COLORS.uploadSubtitle,
    lineHeight: 16,
  },
  uploadBtn: {
    backgroundColor: COLORS.uploadBtn,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.uploadBtnText,
  },
  fieldsContainer: {
    marginBottom: height * 0.03,  // relative instead of fixed 24
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.label,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 14,
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: COLORS.inputBorderFocus,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    color: COLORS.inputIcon,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.inputText,
  },
  nextBtn: {
    backgroundColor: COLORS.nextBtn,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.nextBtn,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.nextBtnText,
    letterSpacing: 0.5,
  },
});