import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    icon: '📄',
    title: 'Upload your resume',
    subtitle: 'PDF, max 5MB',
  },
  {
    id: 'portfolio',
    icon: '🔗',
    title: 'Add portfolio link',
    subtitle: 'Behance, GitHub, personal site',
  },
  {
    id: 'bio',
    icon: '✏️',
    title: 'Write your bio',
    subtitle: 'Tell employers who you are',
  },
];

export default function ProfileCompletionScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [completionItems, setCompletionItems] = useState(COMPLETION_ITEMS);
  const [resumeUploaded, setResumeUploaded] = useState(false);
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

  const handleResumeUpload = () => {
    // TODO: Implement actual file picker for resume
    setResumeUploaded(true);
    setShowResumeModal(false);
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
          <TouchableOpacity onPress={() => navigation.navigate('HomeDashboard')}>
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
              <Text style={styles.uploadIcon}>📋</Text>
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
            <Text style={styles.strengthIcon}>✦</Text>
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
                  <Text style={styles.standOutIcon}>{item.icon}</Text>
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
            <Text style={styles.modalSubtitle}>Select a PDF file (max 5MB)</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleResumeUpload}
            >
              <Text style={styles.modalButtonText}>Choose File</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FBFA',
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
    color: '#2CACAD',
    fontWeight: '600',
  },
  skipText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // Progress
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: '#C8E6E4',
    borderRadius: 3,
    marginBottom: height * 0.03,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: '#2CACAD',
    borderRadius: 3,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
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
    backgroundColor: '#D4F0EE',
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
    backgroundColor: '#2CACAD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPlusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  uploadPhotoLabel: {
    fontSize: 13,
    color: '#024D60',
    fontWeight: '600',
  },

  // Username input
  inputContainer: {
    marginBottom: height * 0.03,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#024D60',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#024D60',
  },

  // Checklist card
  card: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#F0F0F0',
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkCircleDone: {
    backgroundColor: '#2CACAD',
    borderColor: '#2CACAD',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checklistLabel: {
    flex: 1,
    fontSize: 14,
    color: '#024D60',
    fontWeight: '500',
  },
  checklistStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusDone: {
    color: '#2CACAD',
  },
  statusPending: {
    color: '#94A3B8',
  },

  // AI Strength card
  strengthCard: {
    backgroundColor: '#EAF6F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6E4',
  },
  strengthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  strengthIcon: {
    fontSize: 14,
    color: '#2CACAD',
    marginRight: 6,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#024D60',
  },
  strengthBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#C8E6E4',
    borderRadius: 3,
    marginBottom: 8,
  },
  strengthBarFill: {
    height: 6,
    backgroundColor: '#2CACAD',
    borderRadius: 3,
  },
  strengthHint: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },

  // Stand out
  standOutLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
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
    backgroundColor: '#EAF6F5',
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
    color: '#024D60',
    marginBottom: 2,
  },
  standOutSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  standOutArrow: {
    fontSize: 20,
    color: '#94A3B8',
  },
  standOutIconCircleDone: {
    backgroundColor: '#2CACAD',
  },
  standOutCheck: {
    fontSize: 20,
    color: '#2CACAD',
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
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#024D60',
    marginBottom: 16,
  },
  modalTextArea: {
    height: 100,
  },
  modalButton: {
    backgroundColor: '#2CACAD',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#64748B',
    fontSize: 14,
  },

  // Complete button
  completeButton: {
    backgroundColor: '#2CACAD',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});