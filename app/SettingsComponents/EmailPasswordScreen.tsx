/**
 * EmailPasswordScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Email & Password (ACCOUNT section in SettingsScreen)
 *
 * Content:
 *  - Two separate sections: "Change Email" and "Change Password"
 *  - Change Email: current email shown, new email input, confirm with password
 *  - Change Password: current password, new password, confirm new password,
 *    with password strength hint
 *  - Two separate Save buttons, one per section
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import EmailPasswordScreen from './app/EmailPasswordScreen';
 *     <Stack.Screen name="EmailPassword" component={EmailPasswordScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";

// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function EmailPasswordScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // Email form state
  const [currentEmail] = useState('kenneth.baidoo@uni.edu');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Track which input is focused
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleChangeEmail = () => {
    console.log('Changing email:', { newEmail });
    // TODO: save to backend
    navigation.goBack();
  };

  const handleChangePassword = () => {
    console.log('Changing password');
    // TODO: save to backend
    navigation.goBack();
  };

  // Simple password strength check (just checks length for demo)
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'Weak';
    if (password.length < 12) return 'Medium';
    return 'Strong';
  };

  const passwordStrength = getPasswordStrength(newPassword);

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
              name="arrow-back-outline"
              size={22}
              color={colors.title}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Email & Password</Text>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── CHANGE EMAIL SECTION ─────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Change Email</Text>

          {/* Current Email (read-only) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CURRENT EMAIL</Text>
            <View style={[styles.inputContainer, styles.readOnlyContainer]}>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={currentEmail}
                editable={false}
              />
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color={colors.placeholder}
                style={styles.lockIcon}
              />
            </View>
          </View>

          {/* New Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>NEW EMAIL</Text>
            <View style={[
              styles.inputContainer,
              focusedInput === 'newEmail' && styles.inputContainerFocused,
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter new email"
                placeholderTextColor={colors.placeholder}
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedInput('newEmail')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Confirm with Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CONFIRM WITH PASSWORD</Text>
            <View style={[
              styles.inputContainer,
              focusedInput === 'emailPassword' && styles.inputContainerFocused,
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter your current password"
                placeholderTextColor={colors.placeholder}
                value={emailPassword}
                onChangeText={setEmailPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('emailPassword')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Save Button for Email */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleChangeEmail}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>Update Email</Text>
          </TouchableOpacity>
        </View>
        {/* ── END CHANGE EMAIL SECTION ───────────────────────────── */}


        {/* ── CHANGE PASSWORD SECTION ───────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Change Password</Text>

          {/* Current Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CURRENT PASSWORD</Text>
            <View style={[
              styles.inputContainer,
              focusedInput === 'currentPassword' && styles.inputContainerFocused,
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                placeholderTextColor={colors.placeholder}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('currentPassword')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* New Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>NEW PASSWORD</Text>
            <View style={[
              styles.inputContainer,
              focusedInput === 'newPassword' && styles.inputContainerFocused,
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor={colors.placeholder}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('newPassword')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            {/* Password Strength Hint */}
            {newPassword.length > 0 && (
              <Text style={[
                styles.hint,
                passwordStrength === 'Weak' && styles.hintWeak,
                passwordStrength === 'Medium' && styles.hintMedium,
                passwordStrength === 'Strong' && styles.hintStrong,
              ]}>
                Password strength: {passwordStrength}
              </Text>
            )}
          </View>

          {/* Confirm New Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
            <View style={[
              styles.inputContainer,
              focusedInput === 'confirmPassword' && styles.inputContainerFocused,
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor={colors.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Save Button for Password */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleChangePassword}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>Update Password</Text>
          </TouchableOpacity>
        </View>
        {/* ── END CHANGE PASSWORD SECTION ─────────────────────────── */}

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

  // ── Section Cards ─────────────────────────────────────────────
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 20,
  },

  // ── Input Fields ───────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 16,
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

  // ── Password Strength Hint ─────────────────────────────────────
  hint: {
    fontSize: 12,
    color: colors.hint,
    marginTop: 6,
    marginLeft: 4,
  },
  hintWeak: {
    color: colors.danger,
  },
  hintMedium: {
    color: '#F59E0B',
  },
  hintStrong: {
    color: '#10B981',
  },

  // ── Save Button ────────────────────────────────────────────────
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
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
