import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getAuthErrorMessage,
  referenceDataApi,
  studentApi,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function JobPreferencesScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [availableInterests, setAvailableInterests] = useState<string[]>([]);
  const [careerInterests, setCareerInterests] = useState<string[]>([]);
  const [targetCompanies, setTargetCompanies] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [willingToRelocate, setWillingToRelocate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profile, options] = await Promise.all([
        studentApi.getMe(),
        referenceDataApi.getStudentOnboardingOptions(),
      ]);
      setCareerInterests(profile.careerInterests);
      setTargetCompanies(profile.targetCompanies.join(', '));
      setPreferredLocation(profile.preferredLocation ?? '');
      setWillingToRelocate(profile.willingToRelocate);
      setAvailableInterests(options.careerInterests.map((item) => item.name));
    } catch (error) {
      Alert.alert('Unable to load preferences', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleInterest = (interest: string) => {
    setCareerInterests((current) => (
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await studentApi.updateMe({
        careerInterests,
        targetCompanies: targetCompanies
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        preferredLocation: preferredLocation.trim(),
        willingToRelocate,
      });
      Alert.alert('Saved', 'Your job preferences were updated.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Unable to save', getAuthErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.title} />
          </TouchableOpacity>
          <Text style={styles.title}>Job Preferences</Text>
        </View>

        <Text style={styles.label}>Career interests</Text>
        <View style={styles.chips}>
          {availableInterests.map((interest) => {
            const selected = careerInterests.includes(interest);
            return (
              <TouchableOpacity
                key={interest}
                style={[styles.chip, selected && styles.selectedChip]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[styles.chipText, selected && styles.selectedChipText]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Target companies</Text>
        <Text style={styles.hint}>Separate multiple companies with commas.</Text>
        <TextInput
          style={styles.input}
          value={targetCompanies}
          onChangeText={setTargetCompanies}
          placeholder="e.g. Vodafone, Hubtel"
          placeholderTextColor={colors.subtitle}
        />

        <Text style={styles.label}>Preferred location</Text>
        <TextInput
          style={styles.input}
          value={preferredLocation}
          onChangeText={setPreferredLocation}
          placeholder="e.g. Accra or Remote"
          placeholderTextColor={colors.subtitle}
        />

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setWillingToRelocate((value) => !value)}
        >
          <Ionicons
            name={willingToRelocate ? 'checkbox' : 'square-outline'}
            size={24}
            color={colors.accent}
          />
          <Text style={styles.toggleText}>I am willing to relocate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabled]}
          onPress={() => void handleSave()}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.saveText}>Save Preferences</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginRight: 12,
  },
  title: { color: colors.title, fontSize: 22, fontWeight: '800' },
  label: { color: colors.title, fontSize: 15, fontWeight: '700', marginTop: 18, marginBottom: 10 },
  hint: { color: colors.subtitle, fontSize: 12, marginTop: -5, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  selectedChip: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  selectedChipText: { color: '#FFFFFF' },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 22 },
  toggleText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  saveButton: {
    backgroundColor: colors.button,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 30,
  },
  saveText: { color: colors.buttonText, fontWeight: '800', fontSize: 15 },
  disabled: { opacity: 0.6 },
});
