/**
 * PersonalInfoScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Personal Info (ACCOUNT section in SettingsScreen)
 *
 * Content:
 *  - Editable fields: Full Name, Email (read-only with support note),
 *    Phone Number, Profile Photo (circular avatar + "Change Photo" button)
 *  - Save button at bottom
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import PersonalInfoScreen from './app/PersonalInfoScreen';
 *     <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from "../../src/hooks/useAppTheme";

// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function PersonalInfoScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(''); // read-only
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Track which input is focused
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      const savedProfilePhoto = await AsyncStorage.getItem('userProfilePhoto');
      const savedPhone = await AsyncStorage.getItem('userPhone');
      const savedEmail = await AsyncStorage.getItem('userEmail');

      if (savedUsername) setFullName(savedUsername);
      if (savedProfilePhoto) setProfilePhoto(savedProfilePhoto);
      if (savedPhone) setPhone(savedPhone);
      if (savedEmail) setEmail(savedEmail);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('username', fullName);
      await AsyncStorage.setItem('userPhone', phone);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving personal info:', error);
      alert('Failed to save changes');
    }
  };

  const handleChangePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to change your photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      const uri = result.assets[0].uri;
      setProfilePhoto(uri);
      await AsyncStorage.setItem('userProfilePhoto', uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── HEADER ROW: back arrow + title ──────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back-outline"
              size={22}
              color={colors.title}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Info</Text>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── PROFILE PHOTO SECTION ────────────────────────────────── */}
        <View style={styles.photoSection}>
          <View style={styles.photoRow}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handleChangePhoto}
              activeOpacity={0.85}
            >
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{fullName ? fullName.charAt(0).toUpperCase() : 'U'}</Text>
                </View>
              )}
              <View style={styles.cameraBadge}>
                <Ionicons
                  name="camera-outline"
                  size={14}
                  color={colors.cameraIcon}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changePhotoBtn}
              onPress={handleChangePhoto}
              activeOpacity={0.7}
            >
              <Text style={styles.changePhotoBtnText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* ── END PROFILE PHOTO SECTION ───────────────────────────── */}


        {/* ── FULL NAME FIELD ───────────────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>FULL NAME</Text>
          <View style={[
            styles.inputContainer,
            focusedInput === 'fullName' && styles.inputContainerFocused,
          ]}>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={colors.placeholder}
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedInput('fullName')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>


        {/* ── EMAIL FIELD (read-only) ───────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>EMAIL</Text>
          <View style={[styles.inputContainer, styles.readOnlyContainer]}>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.placeholder}
              value={email}
              editable={false}
            />
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={colors.placeholder}
              style={styles.lockIcon}
            />
          </View>
          <Text style={styles.note}>
            Contact support to change your email address.
          </Text>
        </View>


        {/* ── PHONE NUMBER FIELD ────────────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <View style={[
            styles.inputContainer,
            focusedInput === 'phone' && styles.inputContainerFocused,
          ]}>
            <TextInput
              style={styles.input}
              placeholder="+233 XX XXX XXXX"
              placeholderTextColor={colors.placeholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>


        {/* ── SAVE BUTTON ───────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const createStyles = (colors: any) => StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.title,
  },

  // ── Profile Photo Section ─────────────────────────────────────
  photoSection: {
    marginBottom: 24,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.avatarText,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.cameraBadge,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  changePhotoBtn: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  changePhotoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },

  // ── Input Fields ───────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.label,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: colors.inputFocus,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.title,
  },

  // ── Read-only Field ─────────────────────────────────────────────
  readOnlyContainer: {
    backgroundColor: '#F8FAFA',
  },
  readOnlyInput: {
    color: colors.subtitle,
  },
  lockIcon: {
    marginLeft: 10,
  },
  note: {
    fontSize: 12,
    color: colors.note,
    marginTop: 6,
    marginLeft: 4,
  },

  // ── Save Button ────────────────────────────────────────────────
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accentText,
  },

});
