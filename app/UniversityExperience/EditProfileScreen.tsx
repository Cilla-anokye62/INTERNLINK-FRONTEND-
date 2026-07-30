import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
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
  universityApi,
  type UniversityInstitutionType,
  type UploadableImage,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import ProfilePhotoSelector from '../../src/components/ProfilePhotoSelector';
import { useAppStore } from '../../src/store/useAppStore';

const parseList = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

export default function EditProfileScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<UploadableImage | null>(null);
  const setUserName = useAppStore((state) => state.setUserName);
  const updateLocalProfile = useAppStore((state) => state.updateProfile);
  const [form, setForm] = useState({
    name: '',
    contactEmail: '',
    phoneNumber: '',
    website: '',
    institutionType: '' as UniversityInstitutionType | '',
    country: '',
    city: '',
    studentCount: '',
    academicPrograms: '',
    careerServicesContactName: '',
    departmentEmail: '',
    internshipCoordinatorName: '',
    internshipCoordinatorEmail: '',
  });

  useEffect(() => {
    universityApi.getMe()
      .then((profile) => {
        setForm({
          name: profile.name,
          contactEmail: profile.contactEmail,
          phoneNumber: profile.phoneNumber || '',
          website: profile.website || '',
          institutionType: profile.institutionType || '',
          country: profile.country || '',
          city: profile.city || '',
          studentCount: profile.studentCount == null ? '' : String(profile.studentCount),
          academicPrograms: profile.academicPrograms.join(', '),
          careerServicesContactName: profile.careerServicesContactName || '',
          departmentEmail: profile.departmentEmail || '',
          internshipCoordinatorName: profile.internshipCoordinatorName || '',
          internshipCoordinatorEmail: profile.internshipCoordinatorEmail || '',
        });
        const resolvedPhoto = resolveMediaUrl(profile.logoUrl);
        setPhotoUri(resolvedPhoto);
        setUserName(profile.name);
        updateLocalProfile({ photoUri: resolvedPhoto });
      })
      .catch((error) => Alert.alert('Could not load profile', getAuthErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [setUserName, updateLocalProfile]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const save = async () => {
    if (!form.name.trim() || saving) return;
    const studentCount = form.studentCount.trim() === '' ? null : Number(form.studentCount);
    if (studentCount !== null && (!Number.isInteger(studentCount) || studentCount < 0)) {
      Alert.alert('Invalid student count', 'Student count must be a whole number of zero or more.');
      return;
    }
    setSaving(true);
    try {
      const updated = await universityApi.updateMe({
        name: form.name.trim(),
        phoneNumber: form.phoneNumber.trim(),
        website: form.website.trim(),
        institutionType: form.institutionType,
        country: form.country.trim(),
        city: form.city.trim(),
        studentCount,
        academicPrograms: parseList(form.academicPrograms),
        careerServicesContactName: form.careerServicesContactName.trim(),
        departmentEmail: form.departmentEmail.trim(),
        internshipCoordinatorName: form.internshipCoordinatorName.trim(),
        internshipCoordinatorEmail: form.internshipCoordinatorEmail.trim(),
      });
      let savedPhotoUri = resolveMediaUrl(updated.logoUrl);
      if (photoFile) {
        const uploaded = await mediaApi.uploadAccountImage(photoFile);
        savedPhotoUri = resolveMediaUrl(uploaded.url);
        setPhotoFile(null);
      }
      setUserName(updated.name);
      updateLocalProfile({ photoUri: savedPhotoUri });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not save university profile', getAuthErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit university profile</Text>
        <View style={{ width: 40 }} />
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ProfilePhotoSelector
            imageUri={photoUri}
            fallbackText={form.name}
            disabled={saving}
            onSelect={(file, previewUri) => {
              setPhotoFile(file);
              setPhotoUri(previewUri);
            }}
          />
          <Field label="University name" value={form.name} onChangeText={(value: string) => update('name', value)} styles={styles} />
          <Field label="Account email" value={form.contactEmail} editable={false} styles={styles} />
          <Field label="Phone number" value={form.phoneNumber} onChangeText={(value: string) => update('phoneNumber', value)} styles={styles} />
          <Field label="Website" value={form.website} onChangeText={(value: string) => update('website', value)} styles={styles} />
          <Field label="Institution type (Public, Private, Hybrid)" value={form.institutionType} onChangeText={(value: string) => update('institutionType', value)} styles={styles} />
          <Field label="Country" value={form.country} onChangeText={(value: string) => update('country', value)} styles={styles} />
          <Field label="City" value={form.city} onChangeText={(value: string) => update('city', value)} styles={styles} />
          <Field label="Student count" value={form.studentCount} onChangeText={(value: string) => update('studentCount', value)} keyboardType="number-pad" styles={styles} />
          <Field label="Academic programs (comma separated)" value={form.academicPrograms} onChangeText={(value: string) => update('academicPrograms', value)} styles={styles} multiline />
          <Field label="Career services contact" value={form.careerServicesContactName} onChangeText={(value: string) => update('careerServicesContactName', value)} styles={styles} />
          <Field label="Department email" value={form.departmentEmail} onChangeText={(value: string) => update('departmentEmail', value)} keyboardType="email-address" styles={styles} />
          <Field label="Internship coordinator" value={form.internshipCoordinatorName} onChangeText={(value: string) => update('internshipCoordinatorName', value)} styles={styles} />
          <Field label="Coordinator email" value={form.internshipCoordinatorEmail} onChangeText={(value: string) => update('internshipCoordinatorEmail', value)} keyboardType="email-address" styles={styles} />
          <TouchableOpacity style={styles.primaryButton} disabled={saving} onPress={() => void save()}>
            {saving
              ? <ActivityIndicator color={colors.onPrimary} />
              : <Text style={styles.primaryButtonText}>Save changes</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const Field = ({ label, styles, multiline, editable = true, ...props }: any) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      {...props}
      editable={editable}
      style={[styles.input, multiline && styles.textArea, !editable && styles.readOnly]}
      multiline={multiline}
    />
  </View>
);

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.title, fontSize: 16, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 13 },
  field: { gap: 6 },
  label: { color: colors.title, fontSize: 12, fontWeight: '600' },
  input: { minHeight: 46, paddingHorizontal: 12, borderRadius: 11, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, color: colors.text, fontSize: 14 },
  textArea: { minHeight: 88, paddingTop: 11, textAlignVertical: 'top' },
  readOnly: { opacity: 0.65 },
  primaryButton: { minHeight: 48, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
});
