import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../hooks/useAppTheme';

interface SignOutConfirmationDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export default function SignOutConfirmationDialog({
  visible,
  onConfirm,
  onDismiss,
}: SignOutConfirmationDialogProps) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="No, stay signed in"
        />
        <View
          style={styles.dialog}
          accessibilityViewIsModal
          accessibilityRole="alert"
        >
          <View style={styles.icon}>
            <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          </View>
          <Text style={styles.title}>Sign Out</Text>
          <Text style={styles.message}>Are you sure you want to sign out?</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onDismiss}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="No, stay signed in"
            >
              <Text style={styles.cancelButtonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirm}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Yes, sign out"
            >
              <Text style={styles.confirmButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 22,
    padding: 22,
    backgroundColor: colors.rowBg,
    borderWidth: 1,
    borderColor: colors.rowBorder,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: `${colors.danger}1A`,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.headerTitle,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.rowText,
    marginBottom: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backBtnBg,
    borderWidth: 1,
    borderColor: colors.rowBorder,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.rowText,
  },
  confirmButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
