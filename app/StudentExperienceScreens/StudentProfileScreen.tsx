import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SKILLS = ['React', 'TypeScript', 'Python', 'Figma', 'Tailwind', 'GraphQL', 'Node.js'];

const EXPERIENCE = [
  {
    id: '1',
    icon: 'V',
    iconColor: '#0F172A',
    title: 'Eng Intern',
    subtitle: 'Vercel · Summer 2025',
  },
  {
    id: '2',
    icon: 'M',
    iconColor: '#3B82F6',
    title: 'Research Assistant',
    subtitle: 'MIT Media Lab · 2024 - Present',
  },
];

export default function StudentProfileScreen({ navigation, route }: any) {
  // Get bio from route params if available (from ProfileCompletionScreen)
  const initialBio = route.params?.bio || 
    'CS student passionate about human-centered software, design systems, and AI-assisted tooling. Currently building open-source dev tools.';
  const initialSkills = route.params?.skills || SKILLS;
  
  const [username, setUsername] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState(initialBio);
  const [skills, setSkills] = useState(initialSkills);
  const [experience, setExperience] = useState(EXPERIENCE);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [newExperienceTitle, setNewExperienceTitle] = useState('');
  const [newExperienceSubtitle, setNewExperienceSubtitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Reload data when screen gains focus (after returning from SkillsScreen)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedData();
    });
    return unsubscribe;
  }, [navigation]);

  // Load data from AsyncStorage
  const loadSavedData = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      const savedProfilePhoto = await AsyncStorage.getItem('userProfilePhoto');
      const savedAbout = await AsyncStorage.getItem('userAbout');
      const savedBio = await AsyncStorage.getItem('userBio');
      const savedSkills = await AsyncStorage.getItem('userSkills');
      const savedExperience = await AsyncStorage.getItem('userExperience');
      
      if (savedUsername) setUsername(savedUsername);
      if (savedProfilePhoto) setProfilePhoto(savedProfilePhoto);
      if (savedAbout) setAboutText(savedAbout);
      else if (savedBio) setAboutText(savedBio);
      if (savedSkills) setSkills(JSON.parse(savedSkills));
      if (savedExperience) setExperience(JSON.parse(savedExperience));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Save data to AsyncStorage
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('userProfilePhoto', profilePhoto || '');
      await AsyncStorage.setItem('userAbout', aboutText);
      await AsyncStorage.setItem('userSkills', JSON.stringify(skills));
      await AsyncStorage.setItem('userExperience', JSON.stringify(experience));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleAboutEdit = () => {
    setShowAboutModal(true);
  };

  const handleAboutSave = () => {
    setShowAboutModal(false);
    saveData();
  };

  const handleSkillsEdit = () => {
    navigation.navigate('Skills', { 
      isEditing: true, 
      initialSkills: skills,
      fromProfile: true
    });
  };

  const handleExperienceEdit = () => {
    setShowExperienceModal(true);
  };

  const handleAddExperience = () => {
    if (newExperienceTitle.trim() && newExperienceSubtitle.trim()) {
      const newExp = {
        id: Date.now().toString(),
        icon: newExperienceTitle.charAt(0).toUpperCase(),
        iconColor: '#2CACAD',
        title: newExperienceTitle,
        subtitle: newExperienceSubtitle,
      };
      setExperience([...experience, newExp]);
      setNewExperienceTitle('');
      setNewExperienceSubtitle('');
      setShowExperienceModal(false);
      saveData();
    }
  };

  const handleEditProfileToggle = () => {
    if (isEditMode) {
      // Exit edit mode - save all changes
      saveData();
      setIsEditMode(false);
    } else {
      // Enter edit mode
      setIsEditMode(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings', { role: 'student' })}
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{username ? username.charAt(0).toUpperCase() : 'U'}</Text>
            </View>
          )}
          <Text style={styles.name}>{username || 'Your Name'}</Text>
          <Text style={styles.subtitle}>Student</Text>

          <View style={styles.badgesRow}>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          </View>

          {/* Edit profile button */}
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.85}
            onPress={handleEditProfileToggle}
          >
            <Text style={styles.editButtonText}>{isEditMode ? 'Done' : 'Edit profile'}</Text>
          </TouchableOpacity>
        </View>

        {/* About section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About</Text>
          {isEditMode && (
            <TouchableOpacity onPress={handleAboutEdit}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.aboutText}>
            {aboutText}
          </Text>
        </View>

        {/* Skills section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {isEditMode && (
            <TouchableOpacity onPress={handleSkillsEdit}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.card}>
          <View style={styles.skillsRow}>
            {skills.map((skill: string) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Experience section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {isEditMode && (
            <TouchableOpacity onPress={handleExperienceEdit}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.card}>
          {experience.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.experienceItem,
                index < experience.length - 1 && styles.experienceItemBorder,
              ]}
            >
              <View style={[styles.experienceIcon, { backgroundColor: item.iconColor }]}>
                <Text style={styles.experienceIconText}>{item.icon}</Text>
              </View>
              <View style={styles.experienceInfo}>
                <Text style={styles.experienceTitle}>{item.title}</Text>
                <Text style={styles.experienceSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* About Edit Modal */}
      {showAboutModal && (
        <Modal
          visible={showAboutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAboutModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit About</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                value={aboutText}
                onChangeText={setAboutText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholder="Tell employers about yourself..."
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowAboutModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleAboutSave}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Experience Edit Modal */}
      {showExperienceModal && (
        <Modal
          visible={showExperienceModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowExperienceModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Experience</Text>
              <TextInput
                style={styles.modalInput}
                value={newExperienceTitle}
                onChangeText={setNewExperienceTitle}
                placeholder="Job title"
              />
              <TextInput
                style={styles.modalInput}
                value={newExperienceSubtitle}
                onChangeText={setNewExperienceSubtitle}
                placeholder="Company · Duration"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowExperienceModal(false);
                    setNewExperienceTitle('');
                    setNewExperienceSubtitle('');
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleAddExperience}
                >
                  <Text style={styles.modalSaveText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FBFA',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#024D60',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2CACAD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 26,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  verifiedBadge: {
    backgroundColor: '#D4F0EE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verifiedText: {
    fontSize: 12,
    color: '#2CACAD',
    fontWeight: '600',
  },
  locationBadge: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F0F0F0',
  },
  editButton: {
    width: '100%',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#024D60',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#024D60',
  },
  editLink: {
    fontSize: 13,
    color: '#2CACAD',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#EAF6F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#C8E6E4',
  },
  skillText: {
    fontSize: 13,
    color: '#2CACAD',
    fontWeight: '600',
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  experienceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  experienceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  experienceIconText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  experienceInfo: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#024D60',
    marginBottom: 2,
  },
  experienceSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#024D60',
    marginBottom: 12,
  },
  modalTextArea: {
    height: 120,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalCancelText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  modalSaveButton: {
    backgroundColor: '#2CACAD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalSaveText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});