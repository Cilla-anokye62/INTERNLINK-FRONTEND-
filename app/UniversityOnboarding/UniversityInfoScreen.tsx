import { useAppTheme } from '../../src/hooks/useAppTheme';
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
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');


// Each field now carries an `icon` that is an Ionicons NAME string
// (e.g. "school-outline") instead of an emoji character. The actual
// <Ionicons /> component gets rendered further down, where
// field.icon is passed in as the `name` prop.
const FIELDS = [
  {
    id: 'name',
    label: 'University Name',
    placeholder: 'Kwame Nkrumah University...',
    icon: 'school-outline',
    keyboardType: 'default' as const,
  },
  {
    id: 'email',
    label: 'Official Email',
    placeholder: 'knust@knust.edu.gh',
    icon: 'mail-outline',
    keyboardType: 'email-address' as const,
  },
  {
    id: 'phone',
    label: 'Contact Phone',
    placeholder: '+233 24 123 4567',
    icon: 'call-outline',
    keyboardType: 'phone-pad' as const,
  },
  {
    id: 'website',
    label: 'Website',
    placeholder: 'https://www.knust.edu.gh',
    icon: 'globe-outline',
    keyboardType: 'url' as const,
  },
];

export default function UniversityInfoScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

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
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

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
                {/*
                  Upload arrow — swapped from the "⬆" emoji to a real
                  Ionicons icon. Sized and colored the same way the
                  emoji's Text style used to be (20px, colors.uploadIcon).
                */}
                <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color={colors.uploadIcon}
                />
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

                  {/*
                    This wrapper already matched the target structure:
                    a focus-aware container holding an icon + TextInput
                    side by side. Only the icon itself needed swapping —
                    from a <Text>{emoji}</Text> to a real <Ionicons />,
                    using the same inputIcon style name (now repurposed
                    for icon spacing instead of font styling).
                  */}
                  <View style={[
                    styles.inputContainer,
                    focusedInput === field.id && styles.inputContainerFocused,
                  ]}>
                    <Ionicons
                      name={field.icon as any}
                      size={18}
                      color={colors.inputIcon}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder={field.placeholder}
                      placeholderTextColor={colors.placeholder}
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
              <Text style={styles.nextBtnText}>Next</Text>
              {/* TODO icon ("→") replaced with a real arrow icon for consistency */}
              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.nextBtnText}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.05,
    backgroundColor: colors.background,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.stepLabel,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  stepPercent: {
    fontSize: 12,
    color: colors.stepPercent,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: colors.progressTrack,
    borderRadius: 3,
    marginBottom: height * 0.025,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.progressFill,
    borderRadius: 3,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    lineHeight: 20,
    marginBottom: height * 0.03,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.uploadCard,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.uploadCardBorder,
    padding: 14,
    marginBottom: height * 0.03,
  },
  uploadIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.uploadIconCircle,
    borderWidth: 1.5,
    borderColor: colors.uploadIconBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  uploadTextBlock: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.uploadTitle,
    marginBottom: 3,
  },
  uploadSubtitle: {
    fontSize: 11,
    color: colors.uploadSubtitle,
    lineHeight: 16,
  },
  uploadBtn: {
    backgroundColor: colors.uploadBtn,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.uploadBtnText,
  },
  fieldsContainer: {
    marginBottom: height * 0.03,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.label,
    marginBottom: 6,
  },
  // Renamed from `inputWrapper` to `inputContainer` and
  // `inputWrapperFocused` to `inputContainerFocused` to match the
  // naming convention used in the target snippet you provided.
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: colors.inputBorderFocus,
  },
  // Now styles the spacing around the Ionicons icon rather than a
  // font size/color (Ionicons takes size/color as direct props instead)
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.inputText,
  },
  nextBtn: {
    flexDirection: 'row', // added so the "Next" text and arrow icon sit side by side
    backgroundColor: colors.nextBtn,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.nextBtnText,
  },
});