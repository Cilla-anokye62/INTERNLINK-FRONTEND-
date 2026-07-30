import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { accountApi, type SocialProviderStatusResponse } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function ConnectedAccountsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [providers, setProviders] = useState<SocialProviderStatusResponse[] | null>(null);
  useEffect(() => { accountApi.socialProviders().then(setProviders).catch(() => setProviders([])); }, []);
  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={22} color={colors.title} /></TouchableOpacity><Text style={styles.title}>Connected Accounts</Text></View>
    {!providers ? <View style={styles.center}><ActivityIndicator color={colors.accent} /></View> : <View style={styles.content}>
      {providers.map((provider) => <View key={provider.provider} style={styles.row}>
        <Ionicons name={provider.provider === 'GOOGLE' ? 'logo-google' : 'logo-apple'} size={25} color={colors.title} />
        <View style={styles.flex}><Text style={styles.name}>{provider.provider === 'GOOGLE' ? 'Google' : 'Apple'}</Text><Text style={styles.status}>{provider.enabled ? 'Available for connection' : 'Not configured by the server'}</Text></View>
        <View style={[styles.badge, provider.enabled && styles.enabledBadge]}><Text style={styles.badgeText}>{provider.enabled ? 'Ready' : 'Unavailable'}</Text></View>
      </View>)}
      <Text style={styles.note}>Password login remains active. Provider buttons are only enabled after the matching Google or Apple credentials are configured securely on the backend.</Text>
    </View>}
  </SafeAreaView>;
}
const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background }, header: { flexDirection: 'row', alignItems: 'center', padding: 20 }, back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, title: { color: colors.title, fontSize: 21, fontWeight: '800' }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, content: { paddingHorizontal: 20, gap: 10 }, row: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder }, flex: { flex: 1 }, name: { color: colors.title, fontSize: 15, fontWeight: '700' }, status: { color: colors.subtitle, fontSize: 11, marginTop: 3 }, badge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12, backgroundColor: colors.withdrawBg }, enabledBadge: { backgroundColor: colors.iconCircle }, badgeText: { color: colors.text, fontSize: 10, fontWeight: '700' }, note: { color: colors.subtitle, fontSize: 12, lineHeight: 18, padding: 14, marginTop: 6, borderRadius: 12, backgroundColor: colors.iconCircle },
});
