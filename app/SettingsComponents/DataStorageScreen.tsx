import { useAppTheme } from '../../src/hooks/useAppTheme';
/**
 * DataStorageScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Data & Storage Screen
 *
 * Content:
 *  - Header: back arrow + "Data & Storage" title
 *  - Storage usage info
 *  - Clear cache button
 *  - Offline mode toggle
 *  - Download quality settings
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function DataStorageScreen({ navigation }: any) {
    const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
const [offlineMode, setOfflineMode] = useState(false);
  const [storageUsed, setStorageUsed] = useState('12.5 MB');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. You may need to re-download some content.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setStorageUsed('0 MB');
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-outline"
              size={22}
              color={colors.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Data & Storage</Text>
        </View>

        {/* Storage Usage Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Storage Usage</Text>
          <View style={styles.storageRow}>
            <Ionicons name="folder-outline" size={24} color={colors.button} />
            <View style={styles.storageInfo}>
              <Text style={styles.storageLabel}>Used Storage</Text>
              <Text style={styles.storageValue}>{storageUsed}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCache}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        {/* Offline Mode */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Offline Mode</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Offline Mode</Text>
              <Text style={styles.settingDescription}>
                Download content for offline access
              </Text>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: colors.switchTrack, true: colors.switchActive }}
              thumbColor={colors.switchThumb}
              ios_backgroundColor={colors.switchTrack}
            />
          </View>
        </View>

        {/* Download Quality */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Download Quality</Text>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <Text style={styles.optionLabel}>High Quality</Text>
            <Ionicons name="checkmark-circle" size={20} color={colors.button} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <Text style={styles.optionLabel}>Standard Quality</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <Text style={styles.optionLabel}>Data Saver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.backBtnBg,
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
    color: colors.headerTitle,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.sectionHeader,
    letterSpacing: 1,
    marginBottom: 12,
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageInfo: {
    marginLeft: 12,
    flex: 1,
  },
  storageLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  storageValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.title,
  },
  clearButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.button,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.title,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.text,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionLabel: {
    fontSize: 14,
    color: colors.title,
  },
});
