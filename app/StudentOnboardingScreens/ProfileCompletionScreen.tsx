import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { height } = Dimensions.get('window');

const COMPLETION_ITEMS = [
  { id: 'academic',  label: 'Academic Information', status: 'Done' },
  { id: 'skills',    label: 'Skills & Expertise',   status: 'Done' },
  { id: 'interests', label: 'Career Interests',      status: 'Done' },
  { id: 'location',  label: 'Preferred Location',    status: 'Done' },
  { id: 'photo',     label: 'Profile Photo',         status: 'Pending' },
];

const STAND_OUT_ITEMS = [
  {
    id: 'resume',
    icon: 'document-text-outline',
    title: 'Upload your resume',
    subtitle: 'PDF, max 5MB',
  },
  {
    id: 'portfolio',
    icon: 'link-outline',
    title: 'Add portfolio link',
    subtitle: 'Behance, GitHub, personal site',
  },
  {
    id: 'bio',
    icon: 'create-outline',
    title: 'Write your bio',
    subtitle: 'Tell employers who you are',
  },
];

export default function ProfileCompletionScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [username, setUsername] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [completionItems, setCompletionItems] = useState(COMPLETION_ITEMS);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [bio, setBio] = useState('');
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);

  const handleComplete = async () => {
    // Save all profile data to AsyncStorage
    try {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('userBio', bio);
      await AsyncStorage.setItem('userProfilePhoto', profilePhoto || '');
      await AsyncStorage.setItem('userPortfolioLink', portfolioLink);
      await AsyncStorage.setItem('userResumeUploaded', JSON.stringify(resumeUploaded));
      
      navigation.navigate('HomeDashboard');
    } catch (error) {
      console.error('Error saving profile data:', error);
      alert('Failed to save profile data');
    }
  };

  const pickImage = async () => {
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
      // Update photo status to Done
      setCompletionItems(prev => 
        prev.map(item => 
          item.id === 'photo' ? { ...item, status: 'Done' } : item
        )
      );
    }
  };

  const handleResumeUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        const name = file.name;
        const uri = file.uri;
        await AsyncStorage.setItem('userResumeName', name);
        await AsyncStorage.setItem('userResumeUri', uri);
        setResumeFileName(name);
        setResumeUploaded(true);
        setShowResumeModal(false);
      }
    } catch (error) {
      console.error('Document pick error:', error);
    }
  };

  const handlePortfolioSave = () => {
    if (portfolioLink.trim()) {
      setShowPortfolioModal(false);
    }
  };

  const handleBioSave = async () => {
    if (bio.trim()) {
      // Save bio to AsyncStorage
      await AsyncStorage.setItem('userBio', bio);
      setShowBioModal(false);
    }
  };

  const handleStandOutItemPress = (itemId: string) => {
    switch (itemId) {
      case 'resume':
        setShowResumeModal(true);
        break;
      case 'portfolio':
        setShowPortfolioModal(true);
        break;
      case 'bio':
        setShowBioModal(true);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={styles.stepLabel}>Step 5 of 5</Text>
          <TouchableOpacity onPress={() => navigation.replace('HomeDashboard')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Almost There!</Text>
        <Text style={styles.subtitle}>
          Complete your profile to unlock personalized matches
        </Text>

        {/* Upload photo placeholder */}
        <TouchableOpacity style={styles.uploadPhotoBox} onPress={pickImage} activeOpacity={0.8}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadIconBox}>
              <Ionicons name="clipboard-outline" size={36} color={colors.placeholder} />
              <View style={styles.uploadPlusBadge}>
                <Text style={styles.uploadPlusText}>+</Text>
              </View>
            </View>
          )}
          <Text style={styles.uploadPhotoLabel}>
            {profilePhoto ? 'Change Photo' : 'Upload Profile Photo'}
          </Text>
        </TouchableOpacity>

        {/* Username input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {/* Completion checklist */}
        <View style={styles.card}>
          {completionItems.map((item, index) => {
            const isDone = item.status === 'Done';
            return (
              <View
                key={item.id}
                style={[
                  styles.checklistItem,
                  index < completionItems.length - 1 && styles.checklistItemBorder,
                ]}
              >
                <View style={[styles.checkCircle, isDone && styles.checkCircleDone]}>
                  {isDone && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.checklistLabel}>{item.label}</Text>
                <Text style={[styles.checklistStatus, isDone ? styles.statusDone : styles.statusPending]}>
                  {item.status}
                </Text>
              </View>
            );
          })}
        </View>

        {/* AI Profile Strength */}
        <View style={styles.strengthCard}>
          <View style={styles.strengthHeader}>
            <Ionicons name="sparkles-outline" size={16} color={colors.accent} style={{ marginRight: 6 }} />
            <Text style={styles.strengthTitle}>AI Profile Strength: 85%</Text>
          </View>
          <View style={styles.strengthBarBg}>
            <View style={[styles.strengthBarFill, { width: '85%' }]} />
          </View>
          <Text style={styles.strengthHint}>
            Adding a profile photo boosts your match score by 15%
          </Text>
        </View>

        {/* Stand out section */}
        <Text style={styles.standOutLabel}>STAND OUT EVEN MORE</Text>
        <View style={styles.card}>
          {STAND_OUT_ITEMS.map((item, index) => {
            const isCompleted = 
              (item.id === 'resume' && resumeUploaded) ||
              (item.id === 'portfolio' && portfolioLink.trim()) ||
              (item.id === 'bio' && bio.trim());
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.standOutItem,
                  index < STAND_OUT_ITEMS.length - 1 && styles.checklistItemBorder,
                ]}
                onPress={() => handleStandOutItemPress(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.standOutIconCircle, isCompleted && styles.standOutIconCircleDone]}>
                  <Ionicons name={item.icon as any} size={18} color={isCompleted ? colors.onPrimary : colors.placeholder} />
                </View>
                <View style={styles.standOutText}>
                  <Text style={styles.standOutTitle}>{item.title}</Text>
                  <Text style={styles.standOutSubtitle}>
                    {isCompleted ? 'Completed' : item.subtitle}
                  </Text>
                </View>
                {isCompleted ? (
                  <Text style={styles.standOutCheck}>✓</Text>
                ) : (
                  <Text style={styles.standOutArrow}>›</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Complete button */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          activeOpacity={0.85}
        >
          <Text style={styles.completeButtonText}>Complete Profile & Start Matching</Text>
        </TouchableOpacity>

        <View style={{ height: height * 0.03 }} />
      </ScrollView>

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Resume</Text>
            <Text style={styles.modalSubtitle}>Select a PDF or DOCX file (max 5MB)</Text>
            {resumeUploaded && resumeFileName ? (
              <View style={styles.uploadedFile}>
                <Ionicons name="document-text-outline" size={18} color={colors.accent} style={{ marginRight: 8 }} />
                <Text style={styles.uploadedFileName} numberOfLines={1}>{resumeFileName}</Text>
              </View>
            ) : null}
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleResumeUpload}
            >
              <Text style={styles.modalButtonText}>{resumeUploaded ? 'Choose Different File' : 'Choose File'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowResumeModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Portfolio Link Modal */}
      {showPortfolioModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Portfolio Link</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://yourportfolio.com"
              value={portfolioLink}
              onChangeText={setPortfolioLink}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handlePortfolioSave}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowPortfolioModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bio Modal */}
      {showBioModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write Your Bio</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Tell employers about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleBioSave}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowBioModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingTop: height * 0.02,
    paddingBottom: height * 0.04,
  },

  // Header
  headerRow: {
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

  // Progress
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
    marginBottom: height * 0.03,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: height * 0.03,
    lineHeight: 20,
  },

  // Upload photo
  uploadPhotoBox: {
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  uploadedImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  uploadIconBox: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: colors.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadIcon: {
    fontSize: 36,
  },
  uploadPlusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPlusText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  uploadPhotoLabel: {
    fontSize: 13,
    color: colors.label,
    fontWeight: '600',
  },

  // Username input
  inputContainer: {
    marginBottom: height * 0.03,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.label,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.text,
  },

  // Checklist card
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  checklistItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rowBorder,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkCircleDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkMark: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checklistLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  checklistStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusDone: {
    color: colors.accent,
  },
  statusPending: {
    color: colors.placeholder,
  },

  // AI Strength card
  strengthCard: {
    backgroundColor: colors.iconCircle,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  strengthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  strengthIcon: {
    fontSize: 14,
    color: colors.accent,
    marginRight: 6,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.title,
  },
  strengthBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
    marginBottom: 8,
  },
  strengthBarFill: {
    height: 6,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  strengthHint: {
    fontSize: 12,
    color: colors.subtitle,
    lineHeight: 18,
  },

  // Stand out
  standOutLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.placeholder,
    letterSpacing: 1,
    marginBottom: 10,
  },
  standOutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  standOutIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  standOutIcon: {
    fontSize: 18,
  },
  standOutText: {
    flex: 1,
  },
  standOutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cardTitle,
    marginBottom: 2,
  },
  standOutSubtitle: {
    fontSize: 12,
    color: colors.placeholder,
  },
  standOutArrow: {
    fontSize: 20,
    color: colors.placeholder,
  },
  standOutIconCircleDone: {
    backgroundColor: colors.accent,
  },
  standOutCheck: {
    fontSize: 20,
    color: colors.accent,
    fontWeight: 'bold',
  },

  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: 20,
  },
  uploadedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  uploadedFileName: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
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
    marginBottom: 16,
  },
  modalTextArea: {
    height: 100,
  },
  modalButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  modalButtonText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: colors.subtitle,
    fontSize: 14,
  },

  // Complete button
  completeButton: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  completeButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});