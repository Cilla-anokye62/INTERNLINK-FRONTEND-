import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  companyApi,
  getAuthErrorMessage,
  listingApi,
  mediaApi,
  resolveMediaUrl,
  type CompanyProfileResponse,
  type CompanySize,
  type CompanyWorkSetup,
  type UploadableImage,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';
import ProfilePhotoSelector from '../../src/components/ProfilePhotoSelector';
import { useAppStore } from '../../src/store/useAppStore';

const parseList = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

type CompanyProfileForm = {
  companyName: string;
  phoneNumber: string;
  website: string;
  industry: string;
  companySize: CompanySize | '';
  headquarters: string;
  description: string;
  internshipCategories: string;
  preferredQualifications: string;
  workSetup: CompanyWorkSetup | '';
};

const EMPTY_COMPANY_PROFILE_FORM: CompanyProfileForm = {
  companyName: '',
  phoneNumber: '',
  website: '',
  industry: '',
  companySize: '',
  headquarters: '',
  description: '',
  internshipCategories: '',
  preferredQualifications: '',
  workSetup: '',
};

export default function CompanyProfileScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [profile, setProfile] = useState<CompanyProfileResponse | null>(null);
  const [listingCount, setListingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const hasLoadedRef = useRef(false);
  const [form, setForm] = useState<CompanyProfileForm>(EMPTY_COMPANY_PROFILE_FORM);
  const formDraft = useRef<CompanyProfileForm>(EMPTY_COMPANY_PROFILE_FORM);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<UploadableImage | null>(null);
  const setUserName = useAppStore((state) => state.setUserName);
  const updateLocalProfile = useAppStore((state) => state.updateProfile);

  const hydrate = useCallback((value: CompanyProfileResponse) => {
    const hydratedForm: CompanyProfileForm = {
      companyName: value.companyName,
      phoneNumber: value.phoneNumber || '',
      website: value.website || '',
      industry: value.industry || '',
      companySize: value.companySize || '',
      headquarters: value.headquarters || '',
      description: value.description || '',
      internshipCategories: value.internshipCategories.join(', '),
      preferredQualifications: value.preferredQualifications.join(', '),
      workSetup: value.workSetup || '',
    };
    setProfile(value);
    setForm(hydratedForm);
    formDraft.current = hydratedForm;
    const resolvedPhoto = resolveMediaUrl(value.logoUrl);
    setPhotoUri(resolvedPhoto);
    setUserName(value.companyName);
    updateLocalProfile({ photoUri: resolvedPhoto });
  }, [setUserName, updateLocalProfile]);

  const load = useCallback(async () => {
    setError('');
    try {
      const [profileResult, listings] = await Promise.all([companyApi.getMe(), listingApi.listOwn()]);
      hydrate(profileResult);
      setListingCount(listings.length);
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
      hasLoadedRef.current = true;
    }
  }, [hydrate]);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedRef.current) setLoading(true);
      void load();
    }, [load]),
  );

  const updateField = (field: keyof CompanyProfileForm, value: string) => {
    formDraft.current = { ...formDraft.current, [field]: value };
  };

  const save = async () => {
    const draft = formDraft.current;
    if (!draft.companyName.trim() || saving) return;
    setSaving(true);
    try {
      let updated = await companyApi.updateMe({
        companyName: draft.companyName.trim(),
        phoneNumber: draft.phoneNumber.trim(),
        website: draft.website.trim(),
        industry: draft.industry.trim(),
        companySize: draft.companySize,
        headquarters: draft.headquarters.trim(),
        description: draft.description.trim(),
        internshipCategories: parseList(draft.internshipCategories),
        preferredQualifications: parseList(draft.preferredQualifications),
        workSetup: draft.workSetup,
      });
      if (photoFile) {
        setUploadingPhoto(true);
        const uploaded = await mediaApi.uploadAccountImage(photoFile);
        updated = { ...updated, logoUrl: uploaded.url };
        setPhotoFile(null);
      }
      hydrate(updated);
      setEditing(false);
    } catch (saveError) {
      Alert.alert('Could not save company profile', getAuthErrorMessage(saveError));
    } finally {
      setUploadingPhoto(false);
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        refreshControl={!editing ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void load()}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        ) : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Company profile</Text>
          {profile ? (
            <TouchableOpacity style={styles.iconButton} onPress={() => setEditing((current) => !current)}>
              <Ionicons name={editing ? 'close' : 'create-outline'} size={19} color={colors.accent} />
            </TouchableOpacity>
          ) : null}
        </View>

        {error ? (
          <TouchableOpacity style={styles.errorCard} onPress={() => void load()}>
            <Text style={styles.errorText}>{error} Tap to retry.</Text>
          </TouchableOpacity>
        ) : null}

        {!profile && loading ? (
          <ActivityIndicator color={colors.accent} />
        ) : profile && !editing ? (
          <>
            <View style={styles.profileCard}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{profile.companyName.charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <Text style={styles.name}>{profile.companyName}</Text>
              <Text style={styles.subtitle}>{profile.industry || 'Industry not provided'}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{profile.verified ? 'Verified' : 'Verification pending'}</Text>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{listingCount}</Text>
                  <Text style={styles.statLabel}>Listings</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{profile.companySize || '—'}</Text>
                  <Text style={styles.statLabel}>Company size</Text>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.body}>{profile.description || 'No company description added.'}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Company information</Text>
              {[
                ['Email', profile.email],
                ['Phone', profile.phoneNumber || 'Not provided'],
                ['Website', profile.website || 'Not provided'],
                ['Headquarters', profile.headquarters || 'Not provided'],
                ['Work setup', profile.workSetup || 'Not provided'],
              ].map(([label, value]) => (
                <View key={label} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{label}</Text>
                  <Text style={styles.infoValue}>{value}</Text>
                </View>
              ))}
            </View>
          </>
        ) : profile ? (
          <View style={styles.section}>
              <ProfilePhotoSelector
                imageUri={photoUri}
                fallbackText={form.companyName}
                disabled={saving}
                selecting={uploadingPhoto}
              onSelect={(file, previewUri) => {
                setPhotoFile(file);
                setPhotoUri(previewUri);
              }}
            />
            <Field label="Company name" defaultValue={form.companyName} onChangeText={(value: string) => updateField('companyName', value)} styles={styles} />
            <Field label="Phone number" defaultValue={form.phoneNumber} onChangeText={(value: string) => updateField('phoneNumber', value)} styles={styles} />
            <Field label="Website" defaultValue={form.website} onChangeText={(value: string) => updateField('website', value)} styles={styles} />
            <Field label="Industry" defaultValue={form.industry} onChangeText={(value: string) => updateField('industry', value)} styles={styles} />
            <Field label="Company size (1-10, 11-50, 51-200, 200+)" defaultValue={form.companySize} onChangeText={(value: CompanySize | '') => updateField('companySize', value)} styles={styles} />
            <Field label="Headquarters" defaultValue={form.headquarters} onChangeText={(value: string) => updateField('headquarters', value)} styles={styles} />
            <Field label="Description" defaultValue={form.description} onChangeText={(value: string) => updateField('description', value)} styles={styles} multiline />
            <Field label="Internship categories (comma separated)" defaultValue={form.internshipCategories} onChangeText={(value: string) => updateField('internshipCategories', value)} styles={styles} multiline />
            <Field label="Preferred qualifications (comma separated)" defaultValue={form.preferredQualifications} onChangeText={(value: string) => updateField('preferredQualifications', value)} styles={styles} multiline />
            <Field label="Work setup (Remote, Hybrid, On-site)" defaultValue={form.workSetup} onChangeText={(value: CompanyWorkSetup | '') => updateField('workSetup', value)} styles={styles} />
            <TouchableOpacity style={styles.primaryButton} disabled={saving} onPress={() => void save()}>
              {saving
                ? <ActivityIndicator color={colors.onPrimary} />
                : <Text style={styles.primaryButtonText}>Save changes</Text>}
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const Field = ({ label, styles, multiline, ...props }: any) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput {...props} style={[styles.input, multiline && styles.textArea]} multiline={multiline} />
  </View>
);

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: TAB_BAR_BOTTOM_PADDING, gap: 13 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: colors.title, fontSize: 22, fontWeight: '700' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  errorCard: { padding: 12, borderRadius: 12, backgroundColor: colors.withdrawBg },
  errorText: { color: colors.withdrawText, fontSize: 12 },
  profileCard: { alignItems: 'center', padding: 20, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 11 },
  avatarImage: { width: 70, height: 70, borderRadius: 35, marginBottom: 11, backgroundColor: colors.iconCircle },
  avatarText: { color: colors.onPrimary, fontSize: 25, fontWeight: '800' },
  name: { color: colors.title, fontSize: 20, fontWeight: '700' },
  subtitle: { color: colors.subtitle, fontSize: 13, marginTop: 4 },
  badge: { marginTop: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, backgroundColor: colors.iconCircle },
  badgeText: { color: colors.accent, fontSize: 10, fontWeight: '700' },
  statsRow: { width: '100%', flexDirection: 'row', marginTop: 18, padding: 13, borderRadius: 13, backgroundColor: colors.background },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.title, fontSize: 18, fontWeight: '800' },
  statLabel: { color: colors.subtitle, fontSize: 10, marginTop: 3 },
  divider: { width: 1, backgroundColor: colors.inputBorder },
  section: { padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder, gap: 12 },
  sectionTitle: { color: colors.title, fontSize: 15, fontWeight: '700' },
  body: { color: colors.subtitle, fontSize: 13, lineHeight: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.inputBorder },
  infoLabel: { color: colors.subtitle, fontSize: 12 },
  infoValue: { color: colors.title, fontSize: 12, fontWeight: '600', maxWidth: '65%', textAlign: 'right' },
  field: { gap: 6 },
  fieldLabel: { color: colors.title, fontSize: 12, fontWeight: '600' },
  input: { minHeight: 45, paddingHorizontal: 12, borderRadius: 10, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, color: colors.text },
  textArea: { minHeight: 90, paddingTop: 11, textAlignVertical: 'top' },
  primaryButton: { minHeight: 46, borderRadius: 23, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
});
