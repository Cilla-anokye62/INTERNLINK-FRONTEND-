import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { InternshipData } from '../../src/types/application';

const { height } = Dimensions.get('window');
const MAX_CHARS = 2000;

export default function AdditionalInfoScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const internship: InternshipData = route.params?.internship;
  const resumeId: string = route.params?.resumeId;

  const [coverLetter, setCoverLetter] = useState('');
  const [motivation, setMotivation] = useState('');
  const [whyThis, setWhyThis] = useState('');
  const [strongCandidate, setStrongCandidate] = useState('');

  const totalChars = coverLetter.length + motivation.length + whyThis.length + strongCandidate.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backArrow, { color: colors.title }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.title }]}>Additional Info</Text>
          <Text style={[styles.stepLabel, { color: colors.subtitle }]}>Step 3 of 6</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.stepperInactive }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.stepperActive, width: '50%' }]} />
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Cover Letter */}
          <Text style={[styles.fieldLabel, { color: colors.title }]}>Cover Letter</Text>
          <Text style={[styles.fieldHint, { color: colors.placeholder }]}>
            Tell the employer why you're the right fit. (Optional)
          </Text>
          <View style={[styles.textAreaWrapper, { backgroundColor: colors.textAreaBg, borderColor: colors.textAreaBorder }]}>
            <TextInput
              style={[styles.textArea, { color: colors.text }]}
              value={coverLetter}
              onChangeText={setCoverLetter}
              placeholder="Dear Hiring Manager,\n\nI am writing to express my interest in..."
              placeholderTextColor={colors.placeholder}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={MAX_CHARS}
            />
          </View>

          {/* Motivation Statement */}
          <Text style={[styles.fieldLabel, { color: colors.title }]}>Motivation Statement</Text>
          <Text style={[styles.fieldHint, { color: colors.placeholder }]}>
            A brief statement about what drives you. (Optional)
          </Text>
          <View style={[styles.textAreaWrapper, { backgroundColor: colors.textAreaBg, borderColor: colors.textAreaBorder }]}>
            <TextInput
              style={[styles.textArea, { color: colors.text, height: 80 }]}
              value={motivation}
              onChangeText={setMotivation}
              placeholder="What excites you about this opportunity?"
              placeholderTextColor={colors.placeholder}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          {/* Why this internship */}
          <Text style={[styles.fieldLabel, { color: colors.title }]}>Why do you want this internship?</Text>
          <View style={[styles.textAreaWrapper, { backgroundColor: colors.textAreaBg, borderColor: colors.textAreaBorder }]}>
            <TextInput
              style={[styles.textArea, { color: colors.text, height: 100 }]}
              value={whyThis}
              onChangeText={setWhyThis}
              placeholder="Describe what吸引 you about this specific role and company..."
              placeholderTextColor={colors.placeholder}
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />
          </View>

          {/* Strong candidate */}
          <Text style={[styles.fieldLabel, { color: colors.title }]}>What makes you a strong candidate?</Text>
          <View style={[styles.textAreaWrapper, { backgroundColor: colors.textAreaBg, borderColor: colors.textAreaBorder }]}>
            <TextInput
              style={[styles.textArea, { color: colors.text, height: 100 }]}
              value={strongCandidate}
              onChangeText={setStrongCandidate}
              placeholder="Highlight your relevant skills, experiences, and achievements..."
              placeholderTextColor={colors.placeholder}
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />
          </View>

          {/* Character counter */}
          <View style={styles.counterRow}>
            <Text style={[styles.counter, { color: colors.placeholder }]}>
              {totalChars.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            </Text>
            <Text style={[styles.autosave, { color: colors.accent }]}>Draft saved</Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate('PortfolioLinks', { internship, resumeId, coverLetter, motivation, whyThis, strongCandidate })}
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
  fieldLabel: { fontSize: 15, fontWeight: '700', marginBottom: 4, marginTop: 16 },
  fieldHint: { fontSize: 13, marginBottom: 10, lineHeight: 18 },
  textAreaWrapper: {
    borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8,
  },
  textArea: { fontSize: 14, lineHeight: 22, minHeight: 120, padding: 0 },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  counter: { fontSize: 12 },
  autosave: { fontSize: 12, fontWeight: '600' },
  bottomBar: {
    paddingHorizontal: 20, paddingBottom: height * 0.03, paddingTop: 12,
    borderTopWidth: 1,
  },
  continueBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  continueText: { fontSize: 16, fontWeight: 'bold' },
});
