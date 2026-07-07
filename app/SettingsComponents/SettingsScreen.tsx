/**
 * SettingsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Central Settings Screen (shared across all roles)
 *
 * Content:
 *  - Header: back arrow + "Settings" title
 *  - Profile card: avatar, name, email, chevron (tap to edit profile)
 *  - "ACCOUNT" section: Personal info, Email & password, Connected accounts
 *  - "PREFERENCES" section: Notifications, Privacy, Language, Appearance
 *  - "SUPPORT" section: Help center, Send feedback
 *  - "Sign out" text link at the very bottom (red, no background)
 *
 * Role-specific behavior:
 *  - Profile card navigates to role-specific edit profile screen
 *  - Detects user role from route params or auth context
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:        '#F5FBFA',
  backBtnBg:         '#FFFFFF',
  backArrow:         '#0D3B47',
  headerTitle:       '#0D3B47',

  // Profile card
  profileCardBg:     '#FFFFFF',
  avatarBg:          '#0D3B47',
  avatarText:        '#FFFFFF',
  profileName:       '#0D3B47',
  profileEmail:      '#9BB8B4',
  chevron:           '#C7DAD7',

  // Section labels
  sectionLabel:      '#4A7C75',

  // Setting rows
  rowBg:             '#FFFFFF',
  rowText:           '#0D3B47',

  // Sign out link
  signOutText:       '#E0524C',
};


// ─── DATA ─────────────────────────────────────────────────────────
const SETTINGS_SECTIONS = [
  {
    id: 'account',
    label: 'ACCOUNT',
    items: [
      { id: 'personalInfo', title: 'Personal info' },
      { id: 'emailPassword', title: 'Email & password' },
      { id: 'connectedAccounts', title: 'Connected accounts' },
    ],
  },
  {
    id: 'preferences',
    label: 'PREFERENCES',
    items: [
      { id: 'notifications', title: 'Notifications' },
      { id: 'privacy', title: 'Privacy' },
      { id: 'language', title: 'Language' },
      { id: 'appearance', title: 'Appearance' },
    ],
  },
  {
    id: 'support',
    label: 'SUPPORT',
    items: [
      { id: 'helpCenter', title: 'Help center' },
      { id: 'sendFeedback', title: 'Send feedback' },
    ],
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function SettingsScreen({ navigation, route }: any) {
  const userRole = route.params?.role || 'student'; // Default to student if not provided

  const [username, setUsername] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    initials: 'U',
    name: 'Your Name',
    email: 'user@example.com',
  });

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      const savedProfilePhoto = await AsyncStorage.getItem('userProfilePhoto');
      
      if (savedUsername) {
        setUsername(savedUsername);
        setProfile(prev => ({
          ...prev,
          name: savedUsername,
          initials: savedUsername.charAt(0).toUpperCase(),
        }));
      }
      if (savedProfilePhoto) setProfilePhoto(savedProfilePhoto);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleProfilePress = () => {
    // Navigate to role-specific profile screen
    if (userRole === 'student') {
      navigation.navigate('Profile');
      navigation.navigate('HomeDashboard', { screen: 'Profile' });
    } else if (userRole === 'university') {
      navigation.navigate('EditProfile');
    } else if (userRole === 'employer') {
      // TODO: Add employer edit profile screen
      console.log('Employer profile edit not yet implemented');
    }
  };

  const handleRowPress = (rowId: string) => {
    switch (rowId) {
      case 'personalInfo':
        navigation.navigate('PersonalInfo');
        break;
      case 'emailPassword':
        navigation.navigate('EmailPassword');
        break;
      case 'connectedAccounts':
        navigation.navigate('ConnectedAccounts');
        break;
      case 'notifications':
        navigation.navigate('NotificationSettings');
        break;
      case 'privacy':
        navigation.navigate('PrivacySettings');
        break;
      case 'language':
        navigation.navigate('LanguageSettings');
        break;
      case 'appearance':
        navigation.navigate('AppearanceSettings');
        break;
      case 'helpCenter':
        navigation.navigate('HelpCenter');
        break;
      case 'sendFeedback':
        navigation.navigate('SendFeedback');
        break;
      default:
        console.log('Unknown setting:', rowId);
    }
  };

  const handleSignOut = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-outline"
              size={22}
              color={COLORS.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={handleProfilePress}
          activeOpacity={0.85}
        >
        <View style={styles.profileCard}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.initials}</Text>
            </View>
          )}
          <View style={styles.profileTextBlock}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={18}
            color={COLORS.chevron}
          />
        </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingRow,
                    index === section.items.length - 1 && styles.settingRowLast,
                  ]}
                  onPress={() => handleRowPress(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.rowText}>{item.title}</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color={COLORS.chevron}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.backBtnBg,
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
    color: COLORS.headerTitle,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.profileCardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 14,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.avatarText,
  },
  profileTextBlock: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.profileName,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: COLORS.profileEmail,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.sectionLabel,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.rowBg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F6F5',
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  rowText: {
    fontSize: 14,
    color: COLORS.rowText,
  },
  signOutBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.signOutText,
  },
});
