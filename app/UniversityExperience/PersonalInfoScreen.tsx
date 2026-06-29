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


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:    '#F5FBFA',
  card:          '#FFFFFF',
  cardBorder:    '#C5E8E3',
  title:         '#0D3B47',
  subtitle:      '#4A7C75',
  label:         '#0D3B47',
  inputBg:       '#FFFFFF',
  inputBorder:   'transparent',
  inputFocus:    '#2CACAD',
  placeholder:   '#94A3B8',
  accent:        '#2CACAD',
  accentText:    '#FFFFFF',
  danger:        '#E0524C',
  chevron:       '#C7DAD7',
  rowBorder:     '#F0F6F5',
  avatarBg:      '#0D3B47',
  avatarText:    '#FFFFFF',
  cameraBadge:   '#2CACAD',
  cameraIcon:    '#FFFFFF',
  note:          '#94A3B8',
};


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function PersonalInfoScreen({ navigation }: any) {

  // Form state
  const [fullName, setFullName] = useState('Kenneth Baidoo');
  const [email, setEmail] = useState('kenneth.baidoo@uni.edu'); // read-only
  const [phone, setPhone] = useState('+233 24 123 4567');

  // Track which input is focused
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    console.log('Saving personal info:', { fullName, phone });
    // TODO: save to backend
    navigation.goBack();
  };

  const handleChangePhoto = () => {
    console.log('Change photo tapped');
    // TODO: open image picker
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

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
              color={COLORS.title}
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
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>KB</Text>
              </View>
              <View style={styles.cameraBadge}>
                <Ionicons
                  name="camera-outline"
                  size={14}
                  color={COLORS.cameraIcon}
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
              placeholderTextColor={COLORS.placeholder}
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
              placeholderTextColor={COLORS.placeholder}
              value={email}
              editable={false}
            />
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={COLORS.placeholder}
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
              placeholder="+1 (555) 000-0000"
              placeholderTextColor={COLORS.placeholder}
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
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.card,
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
    color: COLORS.title,
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
    backgroundColor: COLORS.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.avatarText,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.cameraBadge,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  changePhotoBtn: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  changePhotoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
  },

  // ── Input Fields ───────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.label,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: COLORS.inputFocus,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.title,
  },

  // ── Read-only Field ─────────────────────────────────────────────
  readOnlyContainer: {
    backgroundColor: '#F8FAFA',
  },
  readOnlyInput: {
    color: COLORS.subtitle,
  },
  lockIcon: {
    marginLeft: 10,
  },
  note: {
    fontSize: 12,
    color: COLORS.note,
    marginTop: 6,
    marginLeft: 4,
  },

  // ── Save Button ────────────────────────────────────────────────
  saveBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accentText,
  },

});
