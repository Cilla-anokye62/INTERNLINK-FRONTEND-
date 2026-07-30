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
import React, { useEffect, useState } from 'react';
import { useAppTheme } from '../../src/hooks/useAppTheme';
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
import { useAppStore } from '../../src/store/useAppStore';
import {
  companyApi,
  resolveMediaUrl,
  signOut,
  studentApi,
  universityApi,
} from '../../src/api';
import SignOutConfirmationDialog from '../../src/components/SignOutConfirmationDialog';
import { SubscriptionStatusCard } from '../../src/components/PremiumComponents';
import { useSubscription } from '../../src/context/SubscriptionContext';


// ─── COLOR PALETTE ───────────────────────────────────────────────
// Removed hardcoded COLORS object


// ─── DATA ─────────────────────────────────────────────────────────
const SETTINGS_SECTIONS = [
  {
    id: 'account',
    label: 'ACCOUNT',
    items: [
      { id: 'personalInfo', title: 'Personal info' },
      { id: 'emailPassword', title: 'Email & password' },
      { id: 'connectedAccounts', title: 'Connected accounts' },
      { id: 'subscription', title: 'Premium & subscription' },
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
      { id: 'reportProblem', title: 'Report a problem' },
      { id: 'sendFeedback', title: 'Send feedback' },
      { id: 'about', title: 'About InternLink' },
    ],
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function SettingsScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const storedRole = useAppStore((state) => state.userRole);
  const userRole = route.params?.role || storedRole || 'student';
  const userName = useAppStore((state) => state.userName);
  const userProfile = useAppStore((state) => state.profile);
  const { snapshot } = useSubscription();
  const [backendName, setBackendName] = useState('');
  const [backendEmail, setBackendEmail] = useState('');
  const [signOutVisible, setSignOutVisible] = useState(false);
  const displayName = backendName || userName || (userRole === 'student' ? 'Student' : userRole === 'employer' ? 'Employer' : 'University');
  const profilePhoto = userProfile.photoUri;
  const profile = {
    initials: displayName.charAt(0).toUpperCase(),
    name: displayName,
    email: backendEmail || userProfile.email || 'Loading account…',
  };
  const visibleSections = SETTINGS_SECTIONS.map((section) => {
    if (section.id !== 'preferences') return section;
    const studentItems = userRole === 'student'
      ? [{ id: 'jobPreferences', title: 'Job preferences' }]
      : [];
    return {
      ...section,
      items: [
        ...studentItems,
        ...section.items,
        { id: 'dataStorage', title: 'Data & storage' },
      ],
    };
  });

  useEffect(() => {
    let active = true;
    const request = userRole === 'employer'
      ? companyApi.getMe().then((value) => ({
        name: value.companyName,
        email: value.email,
        photoUrl: value.logoUrl,
      }))
      : userRole === 'university'
        ? universityApi.getMe().then((value) => ({
          name: value.name,
          email: value.contactEmail,
          photoUrl: value.logoUrl,
        }))
        : studentApi.getMe().then((value) => ({
          name: value.fullName,
          email: value.email ?? '',
          photoUrl: value.profileImageUrl,
        }));

    request
      .then((value) => {
        if (!active) return;
        setBackendName(value.name);
        setBackendEmail(value.email);
        const photoUri = resolveMediaUrl(value.photoUrl);
        if (photoUri) useAppStore.getState().updateProfile({ photoUri });
      })
      .catch(() => {
        // The stored session identity remains visible if profile refresh fails.
      });
    return () => {
      active = false;
    };
  }, [userRole]);

  const handleBackPress = () => {
    if (userRole === 'employer') {
      navigation.navigate('Dashboard');
      return;
    }
    if (userRole === 'university') {
      navigation.navigate('Overview');
      return;
    }

    navigation.goBack();
  };

  const handleProfilePress = () => {
    if (userRole === 'employer') {
      navigation.navigate('Company');
      return;
    }
    if (userRole === 'university') {
      navigation.navigate('UniversityEditProfile');
      return;
    }

    navigation.navigate('StudentEditProfile');
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
      case 'subscription':
        navigation.navigate('Subscription');
        break;
      case 'notifications':
        navigation.navigate('NotificationSettings');
        break;
      case 'jobPreferences':
        navigation.navigate('JobPreferences');
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
      case 'dataStorage':
        navigation.navigate('DataStorage');
        break;
      case 'helpCenter':
        navigation.navigate('HelpCenter');
        break;
      case 'reportProblem':
        navigation.navigate('ReportProblem');
        break;
      case 'sendFeedback':
        navigation.navigate('SendFeedback');
        break;
      case 'about':
        navigation.navigate('About');
        break;
      default:
        break;
    }
  };

  const handleSignOut = () => {
    setSignOutVisible(false);
    void signOut();
  };

  const confirmSignOut = () => {
    setSignOutVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

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
              name="chevron-back-outline"
              size={22}
              color={colors.backArrow}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
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
              color={colors.chevron}
            />
          </View>
        </TouchableOpacity>

        <SubscriptionStatusCard
          snapshot={snapshot}
          onPress={() => navigation.navigate('Subscription')}
        />

        {/* Settings Sections */}
        {visibleSections.map((section) => (
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
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowText}>{item.title}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color={colors.chevron}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={confirmSignOut}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

      </ScrollView>

      <SignOutConfirmationDialog
        visible={signOutVisible}
        onDismiss={() => setSignOutVisible(false)}
        onConfirm={handleSignOut}
      />
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
    backgroundColor: colors.backBtnBg,
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
    color: colors.headerTitle,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.profileCardBg,
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
    backgroundColor: colors.avatarBg,
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
    color: colors.avatarText,
  },
  profileTextBlock: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.profileName,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: colors.profileEmail,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.sectionLabel,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: colors.rowBg,
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
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowText: {
    fontSize: 14,
    color: colors.rowText,
  },
  subscriptionBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionBadgeText: {
    fontSize: 12,
  },
  signOutBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.signOutText,
  },
});
