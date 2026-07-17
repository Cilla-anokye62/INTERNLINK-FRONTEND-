import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
  const initialSkills = route.params?.skills || [];

  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const isPremium = useAppStore((state) => state.isPremium);

  const [username, setUsername] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState(initialBio);
  const [skills, setSkills] = useState(initialSkills);
  const [experience, setExperience] = useState(EXPERIENCE);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [newExperienceTitle, setNewExperienceTitle] = useState('');
  const [newExperienceSubtitle, setNewExperienceSubtitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  useEffect(() => {
    loadSavedData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedData();
    });
    return unsubscribe;
  }, [navigation]);

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
    navigation.navigate('StudentOnboarding', { screen: 'Skills', params: { isEditing: true, initialSkills: skills, fromProfile: true } });
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
      saveData();
      setIsEditMode(false);
    } else {
      setIsEditMode(true);
    }
  };

  const handleShareProfile = async () => {
    const profileLink = `https://internlink.app/profile/${username || 'user'}`;
    await Clipboard.setStringAsync(profileLink);
    Alert.alert('Link Copied', 'Profile link copied to clipboard!');
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to make this work!');
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
            <Ionicons name="settings-outline" size={18} color={colors.title} />
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={isEditMode ? () => setShowPhotoOptions(true) : undefined} activeOpacity={0.85}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{username ? username.charAt(0).toUpperCase() : 'U'}</Text>
              </View>
            )}
            {isEditMode && (
              <View style={styles.editPhotoBadge}>
                <Ionicons name="create-outline" size={14} color={colors.onPrimary} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.name}>{username || 'Your Name'}</Text>
          <Text style={styles.subtitle}>Student</Text>

          <View style={styles.badgesRow}>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={12} color={colors.premiumBadgeText} style={{ marginRight: 4 }} />
                <Text style={styles.premiumBadgeText}>Premium</Text>
              </View>
            )}
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

        {/* Premium upgrade banner */}
        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => navigation.navigate('PremiumPaywall')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumBannerGradient}
            >
              <View style={styles.premiumBannerContent}>
                <Ionicons name="star" size={22} color={colors.onPrimary} style={{marginRight: 12}} />
                <View style={styles.premiumBannerTextBlock}>
                  <Text style={styles.premiumBannerTitle}>Upgrade to Premium</Text>
                  <Text style={styles.premiumBannerDesc}>Unlock unlimited applications & AI analysis</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.onPrimary} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}


        {/* About section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About</Text>
          {isEditMode && (
            <TouchableOpacity onPress={() => setShowAboutModal(true)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.aboutText}>{aboutText}</Text>
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
            <TouchableOpacity onPress={() => setShowExperienceModal(true)}>
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
                placeholderTextColor={colors.placeholder}
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
                placeholderTextColor={colors.placeholder}
              />
              <TextInput
                style={styles.modalInput}
                value={newExperienceSubtitle}
                onChangeText={setNewExperienceSubtitle}
                placeholder="Company · Duration"
                placeholderTextColor={colors.placeholder}
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

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: TAB_BAR_BOTTOM_PADDING,
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
    color: colors.title,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 26,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.subtitle,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  verifiedBadge: {
    backgroundColor: colors.iconCircle,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.premiumBadgeBg,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.premiumGradientStart,
  },
  premiumBadgeText: {
    fontSize: 12,
    color: colors.premiumBadgeText,
    fontWeight: '700',
  },
  premiumBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  shareButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  shareButtonText: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.onPrimary,
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
    color: colors.title,
  },
  editLink: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 14,
    color: colors.subtitle,
    lineHeight: 22,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: colors.iconCircle,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  skillText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  experienceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rowBorder,
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
    color: colors.cardTitle,
    marginBottom: 2,
  },
  experienceSubtitle: {
    fontSize: 12,
    color: colors.subtitle,
  },
  editPhotoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  editPhotoBadgeText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: 'bold',
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
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.inputBg,
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
    color: colors.subtitle,
    fontWeight: '600',
  },
  modalSaveButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalSaveText: {
    fontSize: 14,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  photoOptionsContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  photoOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 16,
    textAlign: 'center',
  },
  photoOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.rowBorder,
  },
  photoOptionText: {
    fontSize: 16,
    color: colors.title,
    textAlign: 'center',
  },
  removePhotoText: {
    color: colors.danger,
  },
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  cancelOptionText: {
    fontSize: 16,
    color: colors.placeholder,
    textAlign: 'center',
  },
  premiumBanner: {
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  premiumBannerGradient: {
    padding: 16,
  },
  premiumBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBannerTextBlock: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  premiumBannerDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  premiumBannerArrow: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});