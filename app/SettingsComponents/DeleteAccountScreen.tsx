import { useAppTheme } from '../../src/hooks/useAppTheme';
/**
 * DeleteAccountScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Delete Account Screen
 *
 * Content:
 *  - Header: back arrow + "Delete Account" title
 *  - Warning message about account deletion
 *  - Confirmation checkbox
 *  - Delete button
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';



export default function DeleteAccountScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [confirmed, setConfirmed] = useState(false);
  const resetAccount = useAppStore((state) => state.resetAccount);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeleteAccount = () => {
    if (!confirmed) {
      Alert.alert('Confirmation Required', 'Please confirm that you understand the consequences.');
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            resetAccount();
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
              name="chevron-back-outline"
              size={22}
              color={colors.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delete Account</Text>
        </View>

        {/* Warning Card */}
        <View style={styles.warningCard}>
          <Ionicons name="warning-outline" size={32} color={colors.warning} />
          <Text style={styles.warningTitle}>Warning</Text>
          <Text style={styles.warningText}>
            Deleting your account is permanent. You will lose all your data including:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Profile information</Text>
            <Text style={styles.bullet}>• Application history</Text>
            <Text style={styles.bullet}>• Saved internships</Text>
            <Text style={styles.bullet}>• Skills and preferences</Text>
            <Text style={styles.bullet}>• Messages and connections</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            After deletion, you will be logged out and redirected to the login screen. You can create a new account at any time, but your previous data cannot be recovered.
          </Text>
        </View>

        {/* Confirmation Checkbox */}
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
          <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
            {confirmed && <Ionicons name="checkmark" size={14} color={colors.onPrimary} />}
          </View>
          <Text style={styles.checkboxText}>
            I understand that this action cannot be undone and I want to delete my account.
          </Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          style={[styles.deleteButton, !confirmed && styles.deleteButtonDisabled]}
          onPress={handleDeleteAccount}
          disabled={!confirmed}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
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
  warningCard: {
    backgroundColor: colors.warningBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.warning,
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.warning,
    textAlign: 'center',
    marginBottom: 12,
  },
  bulletList: {
    alignSelf: 'flex-start',
  },
  bullet: {
    fontSize: 14,
    color: colors.warning,
    marginBottom: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.checkbox,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.checkbox,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: colors.button,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#FECACA',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.buttonText,
  },
});
