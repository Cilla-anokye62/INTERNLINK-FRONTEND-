import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const UNIVERSITIES = [
  'Kwame Nkrumah University of Science and Technology (KNUST)',
  'University of Ghana (UG)',
  'University of Cape Coast (UCC)',
  'University of Education, Winneba (UEW)',
  'University for Development Studies (UDS)',
  'University of Professional Studies, Accra (UPSA)',
  'Ghana Institute of Management and Public Administration (GIMPA)',
  'Ashesi University',
  'Central University',
  'Valley View University',
  'Catholic University College of Ghana',
  'Accra Technical University',
  'Kumasi Technical University',
  'Ho Technical University',
  'Takoradi Technical University',
  'Koforidua Technical University',
  'Cape Coast Technical University',
  'Sunyani Technical University',
  'Bolgatanga Technical University',
  'Tamale Technical University',
  'Wa Technical University',
  'University of Mines and Technology (UMaT)',
  'SD Dombo University of Business and Integrated Development Studies',
  'C. K. Tedam University of Technology and Applied Sciences',
];

const ACADEMIC_LEVELS = [
  'Level 100',
  'Level 200',
  'Level 300',
  'Level 400',
  'Level 500',
  'Level 600',
  'Postgraduate',
  'PhD',
];

const GRADUATION_YEARS = Array.from({ length: 10 }, (_, i) =>
  String(new Date().getFullYear() + i)
);

export default function AcademicInfoScreen({ navigation }: any) {
  const [university, setUniversity] = useState('');
  const [programme, setProgramme] = useState('');
  const [level, setLevel] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [openDropdown, setOpenDropdown] = useState<'university' | 'level' | 'year' | null>(null);

  const handleNext = () => {
    if (!university || !programme || !level || !graduationYear) {
      alert('Please fill in all fields before continuing.');
      return;
    }
    navigation.navigate('Skills');
  };

  const renderDropdownModal = (
    field: 'university' | 'level' | 'year',
    data: string[],
    onSelect: (value: string) => void
  ) => (
    <Modal
      visible={openDropdown === field}
      transparent
      animationType="fade"
      onRequestClose={() => setOpenDropdown(null)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setOpenDropdown(null)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item);
                  setOpenDropdown(null);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressRow}>
          <Text style={styles.stepLabel}>STEP 1 OF 4</Text>
          <Text style={styles.profileLabel}>Profile Setup</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={styles.progressBarFill} />
        </View>

        {/* Header */}
        <Text style={styles.title}>Tell us about your studies</Text>
        <Text style={styles.subtitle}>
          Help us find the best internship opportunities tailored to your academic background.
        </Text>

        {/* Form Card */}
        <View style={styles.card}>

          {/* University */}
          <Text style={styles.label}>University</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setOpenDropdown('university')}
            activeOpacity={0.7}
          >
            <Text style={[styles.dropdownText, !university && styles.placeholder]}>
              {university || 'Select your university'}
            </Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>

          {/* Programme */}
          <Text style={styles.label}>Programme/Course of Study</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Bsc. Computer Science"
              placeholderTextColor="#94A3B8"
              value={programme}
              onChangeText={setProgramme}
            />
          </View>

          {/* Academic Level */}
          <Text style={styles.label}>Academic Level</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setOpenDropdown('level')}
            activeOpacity={0.7}
          >
            <Text style={[styles.dropdownText, !level && styles.placeholder]}>
              {level || 'Select level'}
            </Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>

          {/* Expected Graduation */}
          <Text style={styles.label}>Expected Graduation</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setOpenDropdown('year')}
            activeOpacity={0.7}
          >
            <Text style={[styles.dropdownText, !graduationYear && styles.placeholder]}>
              {graduationYear || 'Select year'}
            </Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>

        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Next  →</Text>
        </TouchableOpacity>

        {/* Dropdown Modals */}
        {renderDropdownModal('university', UNIVERSITIES, setUniversity)}
        {renderDropdownModal('level', ACADEMIC_LEVELS, setLevel)}
        {renderDropdownModal('year', GRADUATION_YEARS, setGraduationYear)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EAF6F5',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: height * 0.03,    // relative instead of fixed 60
    paddingBottom: height * 0.05, // relative instead of fixed 40
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: '#2CACAD',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  profileLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#C8E6E4',
    borderRadius: 3,
    marginBottom: height * 0.04,  // relative instead of fixed 32
  },
  progressBarFill: {
    width: '25%',
    height: 6,
    backgroundColor: '#2CACAD',
    borderRadius: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#024D60',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#0e3038',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: height * 0.03,  // relative instead of fixed 28
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: height * 0.03,  // relative instead of fixed 28
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#024D60',
    marginBottom: 8,              // fixed back to 8 — 25 was too large
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFA',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#024D60',
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#024D60',
  },
  placeholder: {
    color: '#94A3B8',
  },
  chevron: {
    fontSize: 18,
    color: '#555',
  },
  button: {
    backgroundColor: '#2CACAD',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    maxHeight: 360,
    overflow: 'hidden',
  },
  modalItem: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontSize: 14,
    color: '#024D60',
  },
});