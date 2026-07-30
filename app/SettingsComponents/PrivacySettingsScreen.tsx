import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { accountApi, getAuthErrorMessage, type AccountPreferenceResponse } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function PrivacySettingsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [value, setValue] = useState<AccountPreferenceResponse | null>(null);
  useEffect(() => { accountApi.preferences().then(setValue).catch((error) => Alert.alert('Could not load privacy settings', getAuthErrorMessage(error))); }, []);

  const toggle = async (key: 'profileVisible' | 'analyticsConsent' | 'personalizedRecommendations', enabled: boolean) => {
    if (!value) return;
    const previous = value;
    setValue({ ...value, [key]: enabled });
    try { setValue(await accountApi.updatePreferences({ [key]: enabled })); }
    catch (error) { setValue(previous); Alert.alert('Could not save privacy setting', getAuthErrorMessage(error)); }
  };

  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={22} color={colors.title} /></TouchableOpacity>
      <Text style={styles.title}>Privacy</Text>
    </View>
    {!value ? <View style={styles.center}><ActivityIndicator color={colors.accent} /></View> : <View style={styles.content}>
      <Row label="Profile visible to authorized participants" value={value.profileVisible} onChange={(next: boolean) => void toggle('profileVisible', next)} styles={styles} colors={colors} />
      <Row label="Share anonymous analytics" value={value.analyticsConsent} onChange={(next: boolean) => void toggle('analyticsConsent', next)} styles={styles} colors={colors} />
      <Row label="Personalized recommendations" value={value.personalizedRecommendations} onChange={(next: boolean) => void toggle('personalizedRecommendations', next)} styles={styles} colors={colors} />
      <TouchableOpacity style={styles.action} onPress={() => navigation.navigate('DataStorage')}><Text style={styles.actionText}>Export my data</Text><Ionicons name="chevron-forward" size={18} color={colors.subtitle} /></TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={() => navigation.navigate('DeleteAccount')}><Text style={[styles.actionText, { color: colors.withdrawText }]}>Delete account</Text><Ionicons name="chevron-forward" size={18} color={colors.withdrawText} /></TouchableOpacity>
    </View>}
  </SafeAreaView>;
}

function Row({ label, value, onChange, styles, colors }: any) {
  return <View style={styles.row}><Text style={styles.label}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{ false: colors.inputBorder, true: colors.accent }} /></View>;
}
const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background }, header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title: { color: colors.title, fontSize: 22, fontWeight: '800' }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, content: { paddingHorizontal: 20 },
  row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.inputBorder, paddingHorizontal: 16 },
  label: { color: colors.title, fontSize: 14, fontWeight: '600', flex: 1, paddingRight: 12 },
  action: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  actionText: { color: colors.title, fontSize: 14, fontWeight: '600' },
});
