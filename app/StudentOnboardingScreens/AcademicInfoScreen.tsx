import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { signOut } from '../../src/api';

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
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const { university: storeUniversity, programme: storeProgramme, academicLevel: storeLevel, graduationYear: storeYear, setAcademicInfo } = useAppStore();

  const [university, setUniversity] = useState(storeUniversity);
  const [programme, setProgramme] = useState(storeProgramme);
  const [level, setLevel] = useState(storeLevel);
  const [graduationYear, setGraduationYear] = useState(storeYear);
  const [openDropdown, setOpenDropdown] = useState<'university' | 'level' | 'year' | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    await signOut();
  };

  const handleNext = () => {
    if (!university || !programme || !level || !graduationYear) {
      alert('Please fill in all fields before continuing.');
      return;
    }
    setAcademicInfo(university, programme, level, graduationYear);
    navigation.navigate('Skills', { isEditing: false });
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
          <Text style={styles.stepLabel}>STEP 1 OF 5</Text>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => void handleSignOut()}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Ionicons name="log-out-outline" size={16} color={colors.accent} />
            )}
            <Text style={styles.signOutText}>
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarBg}>
          <View style={styles.progressBarFill} />
        </View>

        {/* Header */}
        <Text style={styles.title}>Tell us about your studies</Text>
        <Text style={styles.subtitle}>
          Help us find the best internship opportunities tailored to your academic background.
        </Text>

        {/* University */}
        <Text style={styles.label}>University</Text>
        <TouchableOpacity
          style={[
            styles.inputContainer,
            focusedInput === 'university' && styles.inputContainerFocused,
          ]}
          onPress={() => {
            setOpenDropdown('university');
            setFocusedInput('university');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="school-outline" size={18} color={colors.placeholder} style={styles.inputIcon} />
          <Text style={[styles.dropdownText, !university && styles.placeholder]}>
            {university || 'Select your university'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.placeholder} />
        </TouchableOpacity>

        {/* Programme */}
        <Text style={styles.label}>Programme/Course of Study</Text>
        <View style={[
          styles.inputContainer,
          focusedInput === 'programme' && styles.inputContainerFocused,
        ]}>
          <Ionicons name="book-outline" size={18} color={colors.placeholder} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Bsc. Computer Science"
            placeholderTextColor={colors.placeholder}
            value={programme}
            onChangeText={setProgramme}
            onFocus={() => setFocusedInput('programme')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        {/* Academic Level */}
        <Text style={styles.label}>Academic Level</Text>
        <TouchableOpacity
          style={[
            styles.inputContainer,
            focusedInput === 'level' && styles.inputContainerFocused,
          ]}
          onPress={() => {
            setOpenDropdown('level');
            setFocusedInput('level');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="layers-outline" size={18} color={colors.placeholder} style={styles.inputIcon} />
          <Text style={[styles.dropdownText, !level && styles.placeholder]}>
            {level || 'Select level'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.placeholder} />
        </TouchableOpacity>

        {/* Expected Graduation */}
        <Text style={styles.label}>Expected Graduation</Text>
        <TouchableOpacity
          style={[
            styles.inputContainer,
            focusedInput === 'graduationYear' && styles.inputContainerFocused,
          ]}
          onPress={() => {
            setOpenDropdown('year');
            setFocusedInput('graduationYear');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.placeholder} style={styles.inputIcon} />
          <Text style={[styles.dropdownText, !graduationYear && styles.placeholder]}>
            {graduationYear || 'Select year'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.placeholder} />
        </TouchableOpacity>

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

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.05,
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
    letterSpacing: 0.5,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  signOutText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
    marginBottom: height * 0.04,
  },
  progressBarFill: {
    width: '25%',
    height: 6,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.title,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: colors.subtitle,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: height * 0.03,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.label,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: colors.accent,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  placeholder: {
    color: colors.placeholder,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.onPrimary,
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
    backgroundColor: colors.card,
    borderRadius: 14,
    maxHeight: 360,
    overflow: 'hidden',
  },
  modalItem: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.rowBorder,
  },
  modalItemText: {
    fontSize: 14,
    color: colors.text,
  },
});
