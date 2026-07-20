import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { height } = Dimensions.get('window');

const POPULAR_SKILLS = [
  'Python', 'JavaScript', 'Data Analysis', 'UI/UX Design', 'Leadership', 'Project Management',
];

const ALL_SKILLS = [
  'React', 'SQL', 'Figma', 'Node.js', 'Machine Learning', 'Networking',
  'Communication', 'Graphic Design', 'Excel', 'Tableau', 'Cybersecurity',
  'Cloud (AWS)', 'Team Collaboration', 'Problem Solving',
];

export default function SkillsScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const isEditing = route.params?.isEditing || false;
  const initialSkills = route.params?.initialSkills || [];
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [search, setSearch] = useState('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const isSelected = (skill: string) => selectedSkills.includes(skill);

  const filteredAll = ALL_SKILLS.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPopular = POPULAR_SKILLS.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = async () => {
    if (selectedSkills.length < 3) {
      alert('Please select at least 3 skills.');
      return;
    }
    
    await AsyncStorage.setItem('userSkills', JSON.stringify(selectedSkills));
    
    if (isEditing) {
      navigation.goBack();
    } else {
      navigation.navigate('CareerInterests');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Fixed top section */}
      <View style={styles.topSection}>
        {/* Progress bar */}
        <View style={styles.progressRow}>
          <Text style={styles.stepLabel}>{isEditing ? 'Edit Skills' : 'Step 2 of 5'}</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => navigation.navigate('CareerInterests')}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
        {!isEditing && (
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '40%' }]} />
          </View>
        )}

        {/* Header */}
        <Text style={styles.title}>{isEditing ? 'Edit your skills' : 'What skills do\nyou have?'}</Text>
        <Text style={styles.subtitle}>
          {isEditing 
            ? 'Update your skills to improve your profile visibility.'
            : 'Select all that apply. Add at least 3 for better matches.'
          }
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={16} color={colors.placeholder} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search skills..."
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Scrollable skills */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Popular Skills */}
        {filteredPopular.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>POPULAR SKILLS</Text>
            <View style={styles.chipsRow}>
              {filteredPopular.map(skill => (
                <TouchableOpacity
                  key={skill}
                  style={[styles.chip, isSelected(skill) && styles.chipSelected]}
                  onPress={() => toggleSkill(skill)}
                  activeOpacity={0.7}
                >
                  {isSelected(skill) && <Text style={styles.chipCheck}>✓ </Text>}
                  <Text style={[styles.chipText, isSelected(skill) && styles.chipTextSelected]}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* All Skills */}
        {filteredAll.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ALL SKILLS</Text>
            <View style={styles.chipsRow}>
              {filteredAll.map(skill => (
                <TouchableOpacity
                  key={skill}
                  style={[styles.chip, isSelected(skill) && styles.chipSelected]}
                  onPress={() => toggleSkill(skill)}
                  activeOpacity={0.7}
                >
                  {isSelected(skill) && <Text style={styles.chipCheck}>✓ </Text>}
                  <Text style={[styles.chipText, isSelected(skill) && styles.chipTextSelected]}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Selected Skills summary */}
        {selectedSkills.length > 0 && (
          <View style={styles.selectedBox}>
            <Text style={styles.selectedBoxLabel}>✓ Selected ({selectedSkills.length})</Text>
            <View style={styles.chipsRow}>
              {selectedSkills.map(skill => (
                <TouchableOpacity
                  key={skill}
                  style={styles.selectedTag}
                  onPress={() => toggleSkill(skill)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectedTagText}>{skill} ×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: height * 0.12 }} />
      </ScrollView>

      {/* Fixed Continue button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.continueButtonText}>{isEditing ? 'Save Changes' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Top fixed section
  topSection: {
    paddingHorizontal: 24,
    paddingTop: height * 0.02,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  skipText: {
    fontSize: 13,
    color: colors.placeholder,
    fontWeight: '500',
  },
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
    marginBottom: height * 0.025,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: height * 0.02,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    color: colors.placeholder,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },

  // Scrollable area
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.placeholder,
    letterSpacing: 1,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  // Chips
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipCheck: {
    fontSize: 12,
    color: colors.onPrimary,
    fontWeight: 'bold',
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.onPrimary,
    fontWeight: '600',
  },

  // Selected summary box
  selectedBox: {
    backgroundColor: colors.iconCircle,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  selectedBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 10,
  },
  selectedTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    backgroundColor: colors.inputBorder,
  },
  selectedTagText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },

  // Bottom bar
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: height * 0.03,
    paddingTop: 12,
    backgroundColor: colors.background,
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
