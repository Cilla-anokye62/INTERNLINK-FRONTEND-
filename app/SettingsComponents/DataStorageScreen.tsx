import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import {
  companyApi,
  getAuthErrorMessage,
  studentApi,
  universityApi,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';

export default function DataStorageScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const role = useAppStore((state) => state.userRole);
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);

  const exportData = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const data = role === 'student'
        ? await studentApi.exportData()
        : role === 'employer'
          ? await companyApi.exportData()
          : role === 'university'
            ? await universityApi.exportData()
            : null;
      if (!data) throw new Error('Data export is unavailable for this role.');
      await Clipboard.setStringAsync(JSON.stringify(data, null, 2));
      Alert.alert('Data export copied', 'Your backend account export was copied to the clipboard as JSON.');
    } catch (error) {
      Alert.alert('Could not export data', getAuthErrorMessage(error));
    } finally {
      setExporting(false);
    }
  };

  const clearCache = () => {
    Alert.alert(
      'Clear cache',
      'This clears non-session cached data. You will remain signed in.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            setClearing(true);
            try {
              const keys = await AsyncStorage.getAllKeys();
              const cacheKeys = keys.filter((key) => key !== 'internlink-storage');
              await AsyncStorage.multiRemove(cacheKeys);
              Alert.alert('Cache cleared');
            } catch {
              Alert.alert('Could not clear cache');
            } finally {
              setClearing(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data & storage</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="download-outline" size={23} color={colors.accent} />
          </View>
          <Text style={styles.cardTitle}>Export your account data</Text>
          <Text style={styles.cardText}>
            Download the data currently stored by InternLink for your account. The export is copied as JSON so you can save it securely.
          </Text>
          <TouchableOpacity style={styles.primaryButton} disabled={exporting} onPress={() => void exportData()}>
            {exporting
              ? <ActivityIndicator color={colors.onPrimary} />
              : <Text style={styles.primaryButtonText}>Copy data export</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="folder-open-outline" size={23} color={colors.accent} />
          </View>
          <Text style={styles.cardTitle}>Clear app cache</Text>
          <Text style={styles.cardText}>
            Removes temporary local data while preserving the secure session and backend account.
          </Text>
          <TouchableOpacity style={styles.secondaryButton} disabled={clearing} onPress={clearCache}>
            <Text style={styles.secondaryButtonText}>{clearing ? 'Clearing...' : 'Clear cache'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notice}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent} />
          <Text style={styles.noticeText}>
            Account deletion is available separately under Settings → Delete Account.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.title, fontSize: 17, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 36, gap: 13 },
  card: { alignItems: 'center', padding: 18, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.iconCircle, alignItems: 'center', justifyContent: 'center', marginBottom: 11 },
  cardTitle: { color: colors.title, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  cardText: { color: colors.subtitle, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 7 },
  primaryButton: { width: '100%', minHeight: 45, borderRadius: 23, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
  secondaryButton: { width: '100%', minHeight: 45, borderRadius: 23, borderWidth: 1, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  secondaryButtonText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  notice: { flexDirection: 'row', gap: 9, padding: 13, borderRadius: 12, backgroundColor: colors.iconCircle },
  noticeText: { flex: 1, color: colors.subtitle, fontSize: 12, lineHeight: 18 },
});
