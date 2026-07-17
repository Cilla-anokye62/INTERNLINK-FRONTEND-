import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { InternshipData } from '../../src/types/application';

const { height } = Dimensions.get('window');

const PORTFOLIO_FIELDS = [
  { key: 'github', label: 'GitHub', icon: 'GH', placeholder: 'https://github.com/username', color: '#333', helper: 'Link to your code repositories and projects' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'LI', placeholder: 'https://linkedin.com/in/username', color: '#0077B5', helper: 'Your professional profile' },
  { key: 'portfolio', label: 'Portfolio', icon: 'PW', placeholder: 'https://yourportfolio.com', color: '#2CACAD', helper: 'Your personal portfolio website' },
  { key: 'behance', label: 'Behance', icon: 'Be', placeholder: 'https://behance.net/username', color: '#1769FF', helper: 'Design projects and case studies' },
  { key: 'dribbble', label: 'Dribbble', icon: 'Dr', placeholder: 'https://dribbble.com/username', color: '#EA4C89', helper: 'UI/UX design shots and prototypes' },
  { key: 'personalWebsite', label: 'Personal Website', icon: 'W', placeholder: 'https://yoursite.com', color: '#6366F1', helper: 'Your personal blog or website' },
];

export default function PortfolioLinksScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const internship: InternshipData = route.params?.internship;

  const [links, setLinks] = useState<Record<string, string>>({
    github: '',
    linkedin: '',
    portfolio: '',
    behance: '',
    dribbble: '',
    personalWebsite: '',
  });

  const filledCount = Object.values(links).filter((v) => v.trim().length > 0).length;

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const handleContinue = () => {
    const invalidFields = Object.entries(links).filter(([_, url]) => url.trim() && !validateUrl(url));
    if (invalidFields.length > 0) return;
    navigation.navigate('Availability', {
      internship,
      resumeId: route.params?.resumeId,
      coverLetter: route.params?.coverLetter,
      motivation: route.params?.motivation,
      whyThis: route.params?.whyThis,
      strongCandidate: route.params?.strongCandidate,
      portfolioLinks: links,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backArrow, { color: colors.title }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.title }]}>Portfolio</Text>
          <Text style={[styles.stepLabel, { color: colors.subtitle }]}>Step 4 of 6</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.stepperInactive }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.stepperActive, width: '67%' }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.title }]}>Portfolio Links</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.subtitle }]}>
          Add links to your professional profiles. All fields are optional.
        </Text>

        {PORTFOLIO_FIELDS.map((field) => (
          <View key={field.key} style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <View style={[styles.fieldIcon, { backgroundColor: field.color + '20' }]}>
                <Text style={[styles.fieldIconText, { color: field.color }]}>{field.icon}</Text>
              </View>
              <Text style={[styles.fieldLabel, { color: colors.title }]}>{field.label}</Text>
              {links[field.key] ? (
                <View style={[styles.addedBadge, { backgroundColor: colors.iconCircle }]}>
                  <Text style={[styles.addedText, { color: colors.accent }]}>Added</Text>
                </View>
              ) : null}
            </View>
            <View style={[styles.inputWrapper, {
              backgroundColor: colors.inputBg,
              borderColor: links[field.key] && !validateUrl(links[field.key])
                ? colors.error : colors.inputBorder,
            }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={links[field.key]}
                onChangeText={(text) => setLinks((prev) => ({ ...prev, [field.key]: text }))}
                placeholder={field.placeholder}
                placeholderTextColor={colors.placeholder}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Text style={{ fontSize: 12, color: colors.placeholder, marginBottom: 12, marginTop: -8 }}>{field.helper}</Text>
            {links[field.key] && !validateUrl(links[field.key]) && (
              <Text style={[styles.errorText, { color: colors.error }]}>Please enter a valid URL starting with http:// or https://</Text>
            )}
          </View>
        ))}

        {filledCount > 0 && (
          <View style={[styles.summaryBar, { backgroundColor: colors.iconCircle }]}>
            <Text style={[styles.summaryText, { color: colors.accent }]}>
              {filledCount} link{filledCount > 1 ? 's' : ''} added
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: colors.accent }]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={[styles.continueText, { color: colors.onPrimary }]}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  stepLabel: { fontSize: 12, marginTop: 2 },
  progressContainer: { paddingHorizontal: 20, paddingBottom: 16 },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  sectionSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  fieldContainer: { marginBottom: 16 },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  fieldIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  fieldIconText: { fontSize: 12, fontWeight: '800' },
  fieldLabel: { fontSize: 14, fontWeight: '600', flex: 1 },
  addedBadge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  addedText: { fontSize: 11, fontWeight: '600' },
  inputWrapper: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  input: { fontSize: 14, padding: 0 },
  errorText: { fontSize: 12, marginTop: 4 },
  summaryBar: { borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 8 },
  summaryText: { fontSize: 13, fontWeight: '600' },
  bottomBar: {
    paddingHorizontal: 20, paddingBottom: height * 0.03, paddingTop: 12,
    borderTopWidth: 1,
  },
  continueBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  continueText: { fontSize: 16, fontWeight: 'bold' },
});
