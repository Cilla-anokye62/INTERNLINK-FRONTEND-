import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { InternshipData, WorkMode, StudentLevel, Duration } from '../../src/types/application';

const { height } = Dimensions.get('window');

const DURATIONS: Duration[] = ['4 weeks', '8 weeks', '12 weeks', '16 weeks', '6 months', '1 year'];
const LEVELS: { value: StudentLevel; label: string }[] = [
  { value: 'freshman', label: 'Freshman' },
  { value: 'sophomore', label: 'Sophomore' },
  { value: 'junior', label: 'Junior' },
  { value: 'senior', label: 'Senior' },
  { value: 'graduate', label: 'Graduate' },
];
const WORK_MODES: { value: WorkMode; label: string; icon: string }[] = [
  { value: 'remote', label: 'Remote', icon: 'home-outline' },
  { value: 'hybrid', label: 'Hybrid', icon: 'swap-horizontal-outline' },
  { value: 'onsite', label: 'On-site', icon: 'business-outline' },
];

export default function AvailabilityScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const internship: InternshipData = route.params?.internship;

  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState<Duration>('12 weeks');
  const [level, setLevel] = useState<StudentLevel>('junior');
  const [workMode, setWorkMode] = useState<WorkMode>(internship?.workMode || 'hybrid');
  const [canRelocate, setCanRelocate] = useState<boolean | null>(null);

  const handleContinue = () => {
    navigation.navigate('ReviewApplication', {
      internship,
      resumeId: route.params?.resumeId,
      coverLetter: route.params?.coverLetter,
      motivation: route.params?.motivation,
      whyThis: route.params?.whyThis,
      strongCandidate: route.params?.strongCandidate,
      portfolioLinks: route.params?.portfolioLinks,
      availability: { earliestStartDate: startDate, expectedDuration: duration, studentLevel: level, preferredWorkMode: workMode, canRelocate: canRelocate ?? false },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.title }]}>Availability</Text>
          <Text style={[styles.stepLabel, { color: colors.subtitle }]}>Step 5 of 6</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.stepperInactive }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.stepperActive, width: '83%' }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Start date */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Earliest Start Date</Text>
        <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <Ionicons name="calendar-outline" size={16} color={colors.placeholder} style={{marginRight: 8, marginBottom: 8}} />
          <TouchableOpacity style={styles.dateChips}>
            {['Immediately', 'In 2 weeks', 'In 1 month', 'In 3 months'].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.dateChip, {
                  backgroundColor: startDate === opt ? colors.accent : colors.chipIdleBg,
                  borderColor: startDate === opt ? colors.accent : colors.chipIdleBorder,
                }]}
                onPress={() => setStartDate(opt)}
              >
                <Text style={[styles.dateChipText, {
                  color: startDate === opt ? colors.chipActiveText : colors.chipIdleText,
                }]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </View>

        {/* Duration */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Expected Duration</Text>
        <View style={styles.chipsRow}>
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, {
                backgroundColor: duration === d ? colors.accent : colors.chipIdleBg,
                borderColor: duration === d ? colors.accent : colors.chipIdleBorder,
              }]}
              onPress={() => setDuration(d)}
            >
              <Text style={[styles.chipText, {
                color: duration === d ? colors.chipActiveText : colors.chipIdleText,
              }]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Student level */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Current Student Level</Text>
        <View style={styles.chipsRow}>
          {LEVELS.map((l) => (
            <TouchableOpacity
              key={l.value}
              style={[styles.chip, {
                backgroundColor: level === l.value ? colors.accent : colors.chipIdleBg,
                borderColor: level === l.value ? colors.accent : colors.chipIdleBorder,
              }]}
              onPress={() => setLevel(l.value)}
            >
              <Text style={[styles.chipText, {
                color: level === l.value ? colors.chipActiveText : colors.chipIdleText,
              }]}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Work mode */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Preferred Work Mode</Text>
        <View style={styles.workModeRow}>
          {WORK_MODES.map((wm) => (
            <TouchableOpacity
              key={wm.value}
              style={[styles.workModeCard, {
                backgroundColor: workMode === wm.value ? colors.accent : colors.card,
                borderColor: workMode === wm.value ? colors.accent : colors.inputBorder,
              }]}
              onPress={() => setWorkMode(wm.value)}
            >
              <Ionicons name={wm.icon as any} size={24} color={workMode === wm.value ? colors.onPrimary : colors.title} style={{marginBottom: 6}} />
              <Text style={[styles.workModeLabel, {
                color: workMode === wm.value ? colors.onPrimary : colors.title,
              }]}>{wm.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Can relocate */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Can you relocate?</Text>
        <View style={styles.yesNoRow}>
          {[
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
          ].map((opt) => (
            <TouchableOpacity
              key={String(opt.value)}
              style={[styles.yesNoBtn, {
                backgroundColor: canRelocate === opt.value ? colors.accent : colors.card,
                borderColor: canRelocate === opt.value ? colors.accent : colors.inputBorder,
              }]}
              onPress={() => setCanRelocate(opt.value)}
            >
              <Text style={[styles.yesNoText, {
                color: canRelocate === opt.value ? colors.onPrimary : colors.title,
              }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: colors.accent }]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={[styles.continueText, { color: colors.onPrimary }]}>Review Application</Text>
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
  fieldLabel: { fontSize: 15, fontWeight: '700', marginBottom: 10, marginTop: 18 },
  inputBox: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 4 },
  dateChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dateChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  dateChipText: { fontSize: 13, fontWeight: '500' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '500' },
  workModeRow: { flexDirection: 'row', gap: 10 },
  workModeCard: {
    flex: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
    borderWidth: 1.5,
  },
  workModeLabel: { fontSize: 13, fontWeight: '600' },
  yesNoRow: { flexDirection: 'row', gap: 12 },
  yesNoBtn: {
    flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5,
  },
  yesNoText: { fontSize: 15, fontWeight: '600' },
  bottomBar: {
    paddingHorizontal: 20, paddingBottom: height * 0.03, paddingTop: 12,
    borderTopWidth: 1,
  },
  continueBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  continueText: { fontSize: 16, fontWeight: 'bold' },
});
