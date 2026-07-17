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

// ---------- Types ----------
type Props = NativeStackScreenProps<any, any>;
type LocationType = 'Remote' | 'Hybrid' | 'On-site';

// ---------- Main Screen ----------
const NewInternshipDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const [roleTitle, setRoleTitle] = useState<string>('Frontend Engineering Intern');
  const [department, setDepartment] = useState<string>('Engineering');
  const [type, setType] = useState<string>('Internship');
  const [location, setLocation] = useState<LocationType>('Hybrid');
  const [startDate, setStartDate] = useState<string>('June 1, 2026');
  const [duration, setDuration] = useState<string>('12 weeks');
  const [compensation, setCompensation] = useState<string>('$48 / hour');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'GraphQL']);
  const [newSkill, setNewSkill] = useState<string>('');
  const [description, setDescription] = useState<string>(
    "Join our platform team to build the next generation of developer tools. You'll ship to production from week one and own a feature by mid-summer."
  );

  const locationOptions: LocationType[] = ['Remote', 'Hybrid', 'On-site'];

  const handleRemoveSkill = (skill: string): void => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleAddSkill = (): void => {
    if (newSkill.trim() !== '') {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSaveDraft = (): void => {
    console.log('Save draft pressed');
    // TODO: save draft logic
  };

  const handleContinue = (): void => {
    console.log('Continue pressed');
    // TODO: navigate to next step
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New internship</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.publishLink}>Publish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Step indicator */}
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Step 2 of 4 · Details</Text>
          <Text style={styles.stepPercent}>50%</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>

        {/* Role title */}
        <Text style={styles.fieldLabel}>Role title</Text>
        <TextInput
          style={styles.input}
          value={roleTitle}
          onChangeText={setRoleTitle}
          placeholder="e.g. Frontend Engineering Intern"
          placeholderTextColor="#9CA3AF"
        />

        {/* Department + Type */}
        <View style={styles.twoColumnRow}>
          <View style={styles.twoColumnItem}>
            <Text style={styles.fieldLabel}>Department</Text>
            <TextInput
              style={styles.input}
              value={department}
              onChangeText={setDepartment}
              placeholder="e.g. Engineering"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.twoColumnItem}>
            <Text style={styles.fieldLabel}>Type</Text>
            <TextInput
              style={styles.input}
              value={type}
              onChangeText={setType}
              placeholder="e.g. Internship"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Location */}
        <Text style={styles.fieldLabel}>Location</Text>
        <View style={styles.locationRow}>
          {locationOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.locationButton,
                location === option && styles.locationButtonSelected,
              ]}
              onPress={() => setLocation(option)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.locationButtonText,
                  location === option && styles.locationButtonTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Start date + Duration */}
        <View style={styles.twoColumnRow}>
          <View style={styles.twoColumnItem}>
            <Text style={styles.fieldLabel}>Start date</Text>
            <View style={styles.inputRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.placeholder} style={{marginRight: 8}} />
              <TextInput
                style={styles.inputFlex}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="Start date"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
          <View style={styles.twoColumnItem}>
            <Text style={styles.fieldLabel}>Duration</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="e.g. 12 weeks"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Compensation */}
        <Text style={styles.fieldLabel}>Compensation</Text>
        <TextInput
          style={styles.input}
          value={compensation}
          onChangeText={setCompensation}
          placeholder="e.g. $48 / hour"
          placeholderTextColor="#9CA3AF"
        />

        {/* Required skills */}
        <Text style={styles.fieldLabel}>Required skills</Text>
        <View style={styles.skillsContainer}>
          <View style={styles.skillsWrap}>
            {skills.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillChipText}>{skill}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveSkill(skill)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.skillChipRemove}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addSkillButton}
              onPress={handleAddSkill}
              activeOpacity={0.7}
            >
              <Text style={styles.addSkillText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.fieldLabel}>Description</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the internship role..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.saveDraftButton}
          onPress={handleSaveDraft}
          activeOpacity={0.7}
        >
          <Text style={styles.saveDraftText}>Save draft</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const TEAL = '#2BA9A0';
const TEAL_DARK = '#1E8A82';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 18,
    color: TEXT_DARK,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  publishLink: {
    fontSize: 14,
    color: TEAL,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    color: TEAL,
    fontWeight: '500',
  },
  stepPercent: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: TEAL,
    borderRadius: 2,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_GRAY,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: TEXT_DARK,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  inputIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  inputFlex: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  twoColumnItem: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  locationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  locationButtonSelected: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  locationButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  locationButtonTextSelected: {
    color: '#FFFFFF',
  },
  skillsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 12,
    marginBottom: 16,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEAL,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  skillChipText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  skillChipRemove: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  addSkillButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addSkillText: {
    fontSize: 12,
    color: TEXT_GRAY,
    fontWeight: '600',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  textArea: {
    fontSize: 14,
    color: TEXT_DARK,
    minHeight: 100,
  },
  bottomRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    backgroundColor: '#FFFFFF',
  },
  saveDraftButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
  },
  saveDraftText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  continueButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: TEAL,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default NewInternshipDetailsScreen;