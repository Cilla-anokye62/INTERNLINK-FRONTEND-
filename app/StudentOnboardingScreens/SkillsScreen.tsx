import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const POPULAR_SKILLS = [
  'Python', 'JavaScript', 'Data Analysis', 'UI/UX Design', 'Leadership', 'Project Management',
];

const ALL_SKILLS = [
  'React', 'SQL', 'Figma', 'Node.js', 'Machine Learning', 'Networking',
  'Communication', 'Graphic Design', 'Excel', 'Tableau', 'Cybersecurity',
  'Cloud (AWS)', 'Team Collaboration', 'Problem Solving',
];

export default function SkillsScreen({ navigation }: any) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
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

  const handleContinue = () => {
    if (selectedSkills.length < 3) {
      alert('Please select at least 3 skills.');
      return;
    }
    navigation.navigate('CareerInterests');
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Fixed top section */}
      <View style={styles.topSection}>
        {/* Progress bar */}
        <View style={styles.progressRow}>
          <Text style={styles.stepLabel}>Step 2 of 5</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NextScreen')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '40%' }]} />
        </View>

        {/* Header */}
        <Text style={styles.title}>What skills do{'\n'}you have?</Text>
        <Text style={styles.subtitle}>
          Select all that apply. Add at least 3 for better matches.
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search skills..."
            placeholderTextColor="#94A3B8"
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
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FBFA',
  },

  // Top fixed section
  topSection: {
    paddingHorizontal: 24,
    paddingTop: height * 0.02,
    paddingBottom: 12,
    backgroundColor: '#F5FBFA',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: '#2CACAD',
    fontWeight: '600',
  },
  skipText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: '#C8E6E4',
    borderRadius: 3,
    marginBottom: height * 0.025,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: '#2CACAD',
    borderRadius: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: height * 0.02,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    color: '#94A3B8',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#024D60',
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
    color: '#94A3B8',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  chipSelected: {
    backgroundColor: '#2CACAD',
    borderColor: '#2CACAD',
  },
  chipCheck: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chipText: {
    fontSize: 13,
    color: '#024D60',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Selected summary box
  selectedBox: {
    backgroundColor: '#EAF6F5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6E4',
  },
  selectedBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2CACAD',
    marginBottom: 10,
  },
  selectedTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    backgroundColor: '#C8E6E4',
  },
  selectedTagText: {
    fontSize: 12,
    color: '#024D60',
    fontWeight: '500',
  },

  // Bottom bar
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: height * 0.03,
    paddingTop: 12,
    backgroundColor: '#F5FBFA',
  },
  continueButton: {
    backgroundColor: '#2CACAD',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});