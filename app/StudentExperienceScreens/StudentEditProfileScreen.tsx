import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  getAuthErrorMessage,
  mediaApi,
  resolveMediaUrl,
  studentApi,
  type UploadableImage,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import ProfilePhotoSelector from '../../src/components/ProfilePhotoSelector';

const parseList = (value: string) => value
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

export default function StudentEditProfileScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const setUserName = useAppStore((state) => state.setUserName);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [fullName, setFullName] = useState('');
  const [background, setBackground] = useState('');
  const [program, setProgram] = useState('');
  const [level, setLevel] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [targetCompanies, setTargetCompanies] = useState('');
  const [location, setLocation] = useState('');
  const [relocate, setRelocate] = useState(false);
  const [essay, setEssay] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<UploadableImage | null>(null);

  useEffect(() => {
    studentApi.getMe()
      .then((profile) => {
        setFullName(profile.fullName);
        setBackground(profile.background || '');
        setProgram(profile.program || '');
        setLevel(profile.level || '');
        setSkills(profile.skills.join(', '));
        setInterests(profile.careerInterests.join(', '));
        setTargetCompanies(profile.targetCompanies.join(', '));
        setLocation(profile.preferredLocation || '');
        setRelocate(profile.willingToRelocate);
        setEssay(profile.personalEssay || '');
        const resolvedPhoto = resolveMediaUrl(profile.profileImageUrl);
        setPhotoUri(resolvedPhoto);
        updateProfile({ photoUri: resolvedPhoto });
      })
      .catch((error) => Alert.alert('Could not load profile', getAuthErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [updateProfile]);

  const save = async () => {
    if (!fullName.trim() || saving) return;
    setSaving(true);
    try {
      const updated = await studentApi.updateMe({
        fullName: fullName.trim(),
        background: background.trim(),
        program: program.trim(),
        level: level.trim(),
        skills: parseList(skills),
        careerInterests: parseList(interests),
        targetCompanies: parseList(targetCompanies),
        preferredLocation: location.trim(),
        willingToRelocate: relocate,
        personalEssay: essay.trim(),
      });
      setUserName(updated.fullName);
      const savedBio = updated.background ?? '';
      let savedPhotoUri = resolveMediaUrl(updated.profileImageUrl);
      if (photoFile) {
        setUploadingPhoto(true);
        const uploaded = await mediaApi.uploadAccountImage(photoFile);
        savedPhotoUri = resolveMediaUrl(uploaded.url);
        setPhotoUri(savedPhotoUri);
        setPhotoFile(null);
      }
      updateProfile({
        bio: savedBio,
        about: savedBio,
        skills: updated.skills,
        photoUri: savedPhotoUri,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not save profile', getAuthErrorMessage(error));
    } finally {
      setUploadingPhoto(false);
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <View style={{ width: 40 }} />
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ProfilePhotoSelector
            imageUri={photoUri}
            fallbackText={fullName}
            disabled={saving}
            selecting={uploadingPhoto}
            onSelect={(file, previewUri) => {
              setPhotoFile(file);
              setPhotoUri(previewUri);
            }}
          />
          <Field label="Full name" value={fullName} onChangeText={setFullName} styles={styles} />
          <Field label="About / bio" value={background} onChangeText={setBackground} styles={styles} multiline />
          <Field label="Program" value={program} onChangeText={setProgram} styles={styles} />
          <Field label="Academic level" value={level} onChangeText={setLevel} styles={styles} />
          <Field label="Skills (comma separated)" value={skills} onChangeText={setSkills} styles={styles} multiline />
          <Field label="Career interests (comma separated)" value={interests} onChangeText={setInterests} styles={styles} multiline />
          <Field label="Target companies (comma separated)" value={targetCompanies} onChangeText={setTargetCompanies} styles={styles} multiline />
          <Field label="Preferred location" value={location} onChangeText={setLocation} styles={styles} />
          <View style={styles.switchRow}>
            <Text style={styles.label}>Willing to relocate</Text>
            <Switch value={relocate} onValueChange={setRelocate} trackColor={{ true: colors.accent }} />
          </View>
          <Field label="Personal essay" value={essay} onChangeText={setEssay} styles={styles} multiline />
          <TouchableOpacity
            style={[styles.primaryButton, (!fullName.trim() || saving) && styles.disabled]}
            disabled={!fullName.trim() || saving}
            onPress={() => void save()}
          >
            {saving
              ? <ActivityIndicator color={colors.onPrimary} />
              : <Text style={styles.primaryButtonText}>Save changes</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const Field = ({ label, styles, multiline, ...props }: any) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      {...props}
      style={[styles.input, multiline && styles.textArea]}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  </View>
);

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.title, fontSize: 17, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 13 },
  field: { gap: 6 },
  label: { color: colors.title, fontSize: 12, fontWeight: '600' },
  input: { minHeight: 46, paddingHorizontal: 12, borderRadius: 11, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, color: colors.text, fontSize: 14 },
  textArea: { minHeight: 90, paddingTop: 11 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  primaryButton: { minHeight: 48, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
  disabled: { opacity: 0.5 },
});
