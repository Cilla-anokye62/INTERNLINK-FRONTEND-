import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { accountApi, getAuthErrorMessage, type AccountPreferenceResponse } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function NotificationSettingsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [value, setValue] = useState<AccountPreferenceResponse | null>(null);

  useEffect(() => {
    accountApi.preferences().then(setValue)
      .catch((error) => Alert.alert('Could not load preferences', getAuthErrorMessage(error)));
  }, []);

  const toggle = async (key: keyof AccountPreferenceResponse, enabled: boolean) => {
    if (!value) return;
    const previous = value;
    setValue({ ...value, [key]: enabled });
    try {
      setValue(await accountApi.updatePreferences({ [key]: enabled }));
    } catch (error) {
      setValue(previous);
      Alert.alert('Could not save preference', getAuthErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>
      {!value ? <View style={styles.center}><ActivityIndicator color={colors.accent} /></View> : (
        <View style={styles.content}>
          <PreferenceRow label="Email notifications" value={value.emailNotifications} onChange={(next: boolean) => void toggle('emailNotifications', next)} styles={styles} colors={colors} />
          <PreferenceRow label="Push notifications" value={value.pushNotifications} onChange={(next: boolean) => void toggle('pushNotifications', next)} styles={styles} colors={colors} />
          <PreferenceRow label="Application updates" value={value.applicationUpdates} onChange={(next: boolean) => void toggle('applicationUpdates', next)} styles={styles} colors={colors} />
          <PreferenceRow label="Message updates" value={value.messageUpdates} onChange={(next: boolean) => void toggle('messageUpdates', next)} styles={styles} colors={colors} />
          <PreferenceRow label="Product news and marketing" value={value.marketingEmails} onChange={(next: boolean) => void toggle('marketingEmails', next)} styles={styles} colors={colors} />
          <Text style={styles.note}>In-app notifications remain available in your account history. Push delivery still requires a development build with native Firebase configuration.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function PreferenceRow({ label, value, onChange, styles, colors }: any) {
  return <View style={styles.row}><Text style={styles.label}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{ false: colors.inputBorder, true: colors.accent }} /></View>;
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title: { color: colors.title, fontSize: 22, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20 },
  row: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.inputBorder, paddingHorizontal: 16 },
  label: { color: colors.title, fontSize: 14, fontWeight: '600', flex: 1 },
  note: { color: colors.subtitle, fontSize: 12, lineHeight: 18, padding: 15, marginTop: 14, borderRadius: 12, backgroundColor: colors.iconCircle },
});
