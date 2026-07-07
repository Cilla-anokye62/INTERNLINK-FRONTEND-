import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';

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
  const [username, setUsername] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [newExperienceTitle, setNewExperienceTitle] = useState('');
  const [newExperienceSubtitle, setNewExperienceSubtitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

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

  const handleShareProfile = async () => {
    const profileLink = `https://internlink.app/profile/${username || 'user'}`;
    await Clipboard.setStringAsync(profileLink);
    Alert.alert('Link Copied', 'Profile link copied to clipboard!');
  };

  const handlePhotoOptions = () => {
    setShowPhotoOptions(true);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
      await AsyncStorage.setItem('userProfilePhoto', result.assets[0].uri);
    }
    setShowPhotoOptions(false);
  };

  const handleRemovePhoto = async () => {
    setProfilePhoto(null);
    await AsyncStorage.removeItem('userProfilePhoto');
    setShowPhotoOptions(false);
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
          <TouchableOpacity onPress={isEditMode ? handlePhotoOptions : undefined} activeOpacity={0.85}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{username ? username.charAt(0).toUpperCase() : 'U'}</Text>
              </View>
            )}
            {isEditMode && (
              <View style={styles.editPhotoBadge}>
                <Text style={styles.editPhotoBadgeText}>✎</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.name}>{username || 'Your Name'}</Text>
          <Text style={styles.subtitle}>Student</Text>

          <View style={styles.badgesRow}>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareProfile}
              activeOpacity={0.85}
            >
              <Text style={styles.shareButtonText}>Share Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.85}
              onPress={handleEditProfileToggle}
            >
              <Text style={styles.editButtonText}>{isEditMode ? 'Done' : 'Edit profile'}</Text>
            </TouchableOpacity>
          </View>
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

      {/* Photo options modal */}
      <Modal
        visible={showPhotoOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPhotoOptions(false)}
        >
          <View style={styles.photoOptionsContainer}>
            <Text style={styles.photoOptionsTitle}>Photo Options</Text>
            <TouchableOpacity style={styles.photoOption} onPress={handlePickImage}>
              <Text style={styles.photoOptionText}>Choose New Photo</Text>
            </TouchableOpacity>
            {profilePhoto && (
              <TouchableOpacity style={styles.photoOption} onPress={handleRemovePhoto}>
                <Text style={[styles.photoOptionText, styles.removePhotoText]}>Remove Photo</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.photoOption, styles.cancelOption]} onPress={() => setShowPhotoOptions(false)}>
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    flex: 1,
    backgroundColor: '#2CACAD',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2CACAD',
  },
  shareButtonText: {
    color: '#2CACAD',
    fontWeight: '600',
    fontSize: 14,
  },
  editPhotoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2CACAD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editPhotoBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  photoOptionsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  photoOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 16,
    textAlign: 'center',
  },
  photoOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  photoOptionText: {
    fontSize: 16,
    color: '#024D60',
    textAlign: 'center',
  },
  removePhotoText: {
    color: '#E0524C',
  },
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  cancelOptionText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
});