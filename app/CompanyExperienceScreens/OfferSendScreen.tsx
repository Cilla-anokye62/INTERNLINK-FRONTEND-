import React, { useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { getAuthErrorMessage, offerApi } from '../../src/api';

const { height } = Dimensions.get('window');

export default function OfferSendScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const applicationId = Number(route.params?.applicationId);

  const [salary, setSalary] = useState('');
  const [benefits, setBenefits] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiration, setExpiration] = useState('');
  const [offerLetter, setOfferLetter] = useState('');
  const [sending, setSending] = useState(false);

  const parseDate = (value: string) => {
    const trimmed = value.trim();
    const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
    return match
      ? `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`
      : trimmed;
  };

  const handleSend = async () => {
    if (!salary || !startDate) {
      Alert.alert('Missing Info', 'Please fill in salary and start date.');
      return;
    }
    if (!Number.isFinite(applicationId)) {
      Alert.alert('Missing application', 'Open this screen from an applicant profile.');
      return;
    }
    setSending(true);
    try {
      const draft = await offerApi.createDraft({
        applicationId,
        title: 'Internship offer',
        message: [offerLetter.trim(), benefits.trim() ? `Benefits: ${benefits.trim()}` : '']
          .filter(Boolean).join('\n\n'),
        compensation: salary.trim(),
        startDate: parseDate(startDate),
        expiresAt: expiration.trim() ? `${parseDate(expiration)}T23:59:59` : undefined,
      });
      await offerApi.send(draft.id);
      Alert.alert('Offer sent', 'The applicant has been notified.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Could not send offer', getAuthErrorMessage(error));
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Send Offer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Salary */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Salary / Stipend</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={salary}
            onChangeText={setSalary}
            placeholder="e.g., GHS 48/hr or GHS 2,000/month"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Benefits */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Benefits</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={benefits}
            onChangeText={setBenefits}
            placeholder="e.g., Housing stipend, Health insurance, Mentorship"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Start Date */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Start Date</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Expiration Date */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Offer Expiration Date</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={expiration}
            onChangeText={setExpiration}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Offer Letter */}
        <Text style={[styles.fieldLabel, { color: colors.title }]}>Offer Letter Message</Text>
        <View style={[styles.textAreaWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <TextInput
            style={[styles.textArea, { color: colors.text }]}
            value={offerLetter}
            onChangeText={setOfferLetter}
            placeholder="Dear [Candidate],&#10;&#10;We are pleased to offer you the position of..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.accent }]}
          onPress={handleSend}
          disabled={sending}
          activeOpacity={0.85}
        >
          {sending
            ? <ActivityIndicator color={colors.onPrimary} />
            : <Text style={[styles.sendBtnText, { color: colors.onPrimary }]}>Send Offer</Text>}
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
  inputWrapper: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  input: { fontSize: 14, padding: 0 },
  textAreaWrapper: { borderRadius: 12, borderWidth: 1, padding: 14 },
  textArea: { fontSize: 14, lineHeight: 22, minHeight: 160, padding: 0 },
  bottomBar: {
    paddingHorizontal: 20, paddingBottom: height * 0.03, paddingTop: 12, borderTopWidth: 1,
  },
  sendBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  sendBtnText: { fontSize: 16, fontWeight: 'bold' },
});
