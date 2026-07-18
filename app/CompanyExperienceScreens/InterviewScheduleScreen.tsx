import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';

const { height } = Dimensions.get('window');

const INTERVIEW_TYPES = [
  { value: 'video', label: 'Video Call', icon: 'videocam-outline' as const },
  { value: 'phone', label: 'Phone Call', icon: 'call-outline' as const },
  { value: 'onsite', label: 'On-site', icon: 'business-outline' as const },
];

const DURATIONS = ['15 min', '30 min', '45 min', '60 min'];

export default function InterviewScheduleScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { applications, updateApplicationStatus } = useAppStore();
  const applicationId: string = route.params?.applicationId;

  const application = applications.find((a) => a.id === applicationId);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('45 min');
  const [type, setType] = useState<'video' | 'phone' | 'onsite'>('video');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');

  const handleSchedule = () => {
    if (!date || !time) {
      Alert.alert('Missing Info', 'Please enter a date and time.');
      return;
    }

    updateApplicationStatus(applicationId, 'interview_scheduled');
    Alert.alert('Interview Scheduled', 'The applicant has been notified.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Schedule Interview</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Interview type */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Interview Type</Text>
        <View style={styles.typeRow}>
          {INTERVIEW_TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.typeCard, {
                backgroundColor: type === t.value ? colors.accent : colors.card,
                borderColor: type === t.value ? colors.accent : colors.inputBorder,
              }]}
              onPress={() => setType(t.value as any)}
            >
              <Ionicons name={t.icon} size={24} color={type === t.value ? colors.onPrimary : colors.title} style={{ marginBottom: 6 }} />
              <Text style={[styles.typeLabel, {
                color: type === t.value ? colors.onPrimary : colors.title,
              }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Date</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={date}
            onChangeText={setDate}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Time */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Time</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={time}
            onChangeText={setTime}
            placeholder="10:00 AM"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Duration */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Duration</Text>
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

        {/* Location */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Location</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={location}
            onChangeText={setLocation}
            placeholder="Office address or 'Remote'"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Meeting Link */}
        {(type === 'video' || type === 'phone') && (
          <>
            <Text style={[styles.fieldLabel, { color: colors.title }]}>Meeting Link</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={meetingLink}
                onChangeText={setMeetingLink}
                placeholder="https://zoom.us/j/..."
                placeholderTextColor={colors.placeholder}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </>
        )}

        {/* Notes */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Notes (Optional)</Text>
        <View style={[styles.textAreaWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <TextInput
            style={[styles.textArea, { color: colors.text }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any additional instructions for the candidate..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Bottom */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
        <TouchableOpacity
          style={[styles.scheduleBtn, { backgroundColor: colors.accent }]}
          onPress={handleSchedule}
          activeOpacity={0.85}
        >
          <Text style={[styles.scheduleBtnText, { color: colors.onPrimary }]}>Schedule Interview</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  fieldLabel: { fontSize: 15, fontWeight: '700', marginBottom: 10, marginTop: 18 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeCard: {
    flex: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5,
  },
  typeLabel: { fontSize: 13, fontWeight: '600' },
  inputWrapper: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  input: { fontSize: 14, padding: 0 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '500' },
  textAreaWrapper: { borderRadius: 12, borderWidth: 1, padding: 14 },
  textArea: { fontSize: 14, lineHeight: 22, minHeight: 100, padding: 0 },
  bottomBar: {
    paddingHorizontal: 20, paddingBottom: height * 0.03, paddingTop: 12, borderTopWidth: 1,
  },
  scheduleBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  scheduleBtnText: { fontSize: 16, fontWeight: 'bold' },
});
