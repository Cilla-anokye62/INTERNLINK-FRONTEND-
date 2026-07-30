import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  companyApi,
  getAuthErrorMessage,
  studentApi,
  universityApi,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';

type ProfileSummary = {
  name: string;
  email: string;
  phone: string;
  roleLabel: string;
  about?: string;
};

export default function PersonalInfoScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const role = useAppStore((state) => state.userRole);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        if (role === 'student') {
          const result = await studentApi.getMe();
          const about = result.background ?? '';
          updateProfile({ bio: about, about });
          setProfile({
            name: result.fullName,
            email: result.email || 'Not provided',
            phone: result.phoneNumber || 'Not provided',
            roleLabel: 'Student',
            about: about || 'Not provided',
          });
        } else if (role === 'employer') {
          const result = await companyApi.getMe();
          setProfile({
            name: result.companyName,
            email: result.email,
            phone: result.phoneNumber || 'Not provided',
            roleLabel: 'Employer',
          });
        } else if (role === 'university') {
          const result = await universityApi.getMe();
          setProfile({
            name: result.name,
            email: result.contactEmail,
            phone: result.phoneNumber || 'Not provided',
            roleLabel: 'University',
          });
        }
      } catch (loadError) {
        setError(getAuthErrorMessage(loadError));
      }
    };
    void load();
  }, [role, updateProfile]);

  const edit = () => {
    if (role === 'student') navigation.navigate('StudentEditProfile');
    else if (role === 'employer') navigation.navigate('CompanyProfile');
    else if (role === 'university') navigation.navigate('UniversityEditProfile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal information</Text>
        <View style={{ width: 40 }} />
      </View>

      {!profile && !error ? (
        <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : profile ? (
        <View style={styles.content}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>{profile.roleLabel}</Text>
          {[
            ['Email', profile.email],
            ['Phone', profile.phone],
            ...(profile.about ? [['About', profile.about]] : []),
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.primaryButton} onPress={edit}>
            <Text style={styles.primaryButtonText}>Edit profile</Text>
          </TouchableOpacity>
          <Text style={styles.note}>Account email changes are not supported by the backend.</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.title, fontSize: 16, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  content: { marginHorizontal: 20, padding: 20, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder, alignItems: 'center' },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 11 },
  avatarText: { color: colors.onPrimary, fontSize: 24, fontWeight: '800' },
  name: { color: colors.title, fontSize: 19, fontWeight: '700', textAlign: 'center' },
  role: { color: colors.subtitle, fontSize: 12, marginTop: 3, marginBottom: 18 },
  row: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderTopWidth: 1, borderTopColor: colors.inputBorder },
  label: { color: colors.subtitle, fontSize: 13 },
  value: { color: colors.title, fontSize: 13, fontWeight: '600', maxWidth: '65%', textAlign: 'right' },
  primaryButton: { width: '100%', minHeight: 45, borderRadius: 23, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
  note: { color: colors.placeholder, fontSize: 11, textAlign: 'center', marginTop: 12 },
  errorText: { color: colors.withdrawText, fontSize: 13, textAlign: 'center' },
});
