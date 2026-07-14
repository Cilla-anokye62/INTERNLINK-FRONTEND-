/**
 * EditProfileScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Edit Profile (accessed by tapping the profile card
 * at the top of SettingsScreen)
 *
 * Content:
 *  - Large circular avatar with camera icon overlay badge ("Change Photo")
 *  - Editable fields: Full Name, Role/Title, Bio (multi-line with counter)
 *  - University/Organization (read-only, pulled from account)
 *  - Save button at bottom (filled accent pill)
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import EditProfileScreen from './app/EditProfileScreen';
 *     <Stack.Screen name="EditProfile" component={EditProfileScreen} />
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
export default function EditProfileScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // Form state — in a real app this would come from auth context/backend
  const [fullName, setFullName] = useState('Kenneth Baidoo');
  const [role, setRole] = useState('Career Services Director');
  const [bio, setBio] = useState('');
  const [university, setUniversity] = useState('MIT Career Hub'); // read-only

  // Track which input is focused for the border highlight effect
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    console.log('Saving profile:', { fullName, role, bio });
    // TODO: save to backend
    navigation.goBack();
  };

  const handleChangePhoto = () => {
    console.log('Change photo tapped');
    // TODO: open image picker
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
              name="arrow-back-outline"
              size={22}
              color={colors.title}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── AVATAR SECTION ────────────────────────────────────────── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleChangePhoto}
            activeOpacity={0.85}
          >
            {/* Large avatar circle */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>KB</Text>
            </View>

            {/* Camera badge overlay */}
            <View style={styles.cameraBadge}>
              <Ionicons
                name="camera-outline"
                size={14}
                color={colors.cameraIcon}
              />
            </View>
          </TouchableOpacity>

          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>
        {/* ── END AVATAR SECTION ───────────────────────────────────── */}


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


        {/* ── ROLE/TITLE FIELD ──────────────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>ROLE / TITLE</Text>
          <View style={[
            styles.inputContainer,
            focusedInput === 'role' && styles.inputContainerFocused,
          ]}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Career Services Director"
              placeholderTextColor={colors.placeholder}
              value={role}
              onChangeText={setRole}
              onFocus={() => setFocusedInput('role')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>


        {/* ── BIO FIELD (multi-line with counter) ───────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>BIO</Text>
          <View style={[
            styles.inputContainer,
            styles.textAreaContainer,
            focusedInput === 'bio' && styles.inputContainerFocused,
          ]}>
            <TextInput
              style={[styles.input, styles.textAreaInput]}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.placeholder}
              value={bio}
              onChangeText={setBio}
              onFocus={() => setFocusedInput('bio')}
              onBlur={() => setFocusedInput(null)}
              multiline
              numberOfLines={4}
              maxLength={150}
            />
          </View>
          <Text style={styles.counter}>
            {bio.length}/150
          </Text>
        </View>


        {/* ── UNIVERSITY/ORGANIZATION (read-only) ──────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>UNIVERSITY / ORGANIZATION</Text>
          <View style={[styles.inputContainer, styles.readOnlyContainer]}>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={university}
              editable={false}
            />
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={colors.placeholder}
              style={styles.lockIcon}
            />
          </View>
          <Text style={styles.readOnlyNote}>
            This is linked to your account and cannot be changed here.
          </Text>
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

  // ── Avatar Section ─────────────────────────────────────────────
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.avatarText,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cameraBadge,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  changePhotoText: {
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

  // ── Text Area (Bio) ────────────────────────────────────────────
  textAreaContainer: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 14,
  },
  textAreaInput: {
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 12,
    color: colors.counter,
    textAlign: 'right',
    marginTop: 6,
    marginLeft: 4,
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
  readOnlyNote: {
    fontSize: 11,
    color: colors.subtitle,
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
