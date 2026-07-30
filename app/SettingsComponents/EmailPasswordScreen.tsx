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
import { companyApi, getAuthErrorMessage, studentApi, universityApi } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';

export default function EmailPasswordScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const role = useAppStore((state) => state.userRole);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        if (role === 'student') setEmail((await studentApi.getMe()).email || '');
        else if (role === 'employer') setEmail((await companyApi.getMe()).email);
        else if (role === 'university') setEmail((await universityApi.getMe()).contactEmail);
      } catch (loadError) {
        setError(getAuthErrorMessage(loadError));
      }
    };
    void load();
  }, [role]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Email & password</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>ACCOUNT EMAIL</Text>
          {email ? <Text style={styles.value}>{email}</Text> : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : <ActivityIndicator color={colors.accent} />}
          <Text style={styles.note}>
            Account email changes are not supported by the current backend.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={23} color={colors.accent} />
          </View>
          <Text style={styles.cardTitle}>Reset your password</Text>
          <Text style={styles.cardText}>
            InternLink will email you a secure, time-limited reset link. Existing sessions are revoked after the reset.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('ForgotPassword', { role })}
          >
            <Text style={styles.primaryButtonText}>Send password reset email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.title, fontSize: 17, fontWeight: '700' },
  content: { paddingHorizontal: 20, gap: 13 },
  card: { alignItems: 'center', padding: 18, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  label: { color: colors.subtitle, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  value: { color: colors.title, fontSize: 15, fontWeight: '600', marginTop: 8 },
  note: { color: colors.placeholder, fontSize: 11, textAlign: 'center', marginTop: 10 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.iconCircle, alignItems: 'center', justifyContent: 'center', marginBottom: 11 },
  cardTitle: { color: colors.title, fontSize: 16, fontWeight: '700' },
  cardText: { color: colors.subtitle, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 7 },
  primaryButton: { width: '100%', minHeight: 45, borderRadius: 23, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
  errorText: { color: colors.withdrawText, fontSize: 12, textAlign: 'center', marginTop: 8 },
});
