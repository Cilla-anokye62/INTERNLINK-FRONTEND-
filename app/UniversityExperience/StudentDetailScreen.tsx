import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { StudentPlacementResponse } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function StudentDetailScreen({ navigation, route }: any) {
  const student = route.params?.student as StudentPlacementResponse | undefined;
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student details</Text>
        <View style={{ width: 40 }} />
      </View>
      {!student ? (
        <View style={styles.center}>
          <Text style={styles.title}>Student details unavailable</Text>
          <Text style={styles.subtitle}>Open the student from the university Students tab.</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{student.fullName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{student.fullName}</Text>
          <Text style={styles.subtitle}>{student.email || 'No email available'}</Text>
          {[
            ['Program', student.program || 'Not provided'],
            ['Level', student.level || 'Not provided'],
            ['Placement status', student.placementStatus.replace('_', ' ')],
            ['Applications', String(student.applicationCount)],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
          <Text style={styles.note}>
            The backend currently exposes placement monitoring fields only; private student profile details are not shared with universities.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.title, fontSize: 17, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 8 },
  content: { marginHorizontal: 20, padding: 20, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder, alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: colors.onPrimary, fontSize: 23, fontWeight: '800' },
  title: { color: colors.title, fontSize: 19, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: colors.subtitle, fontSize: 13, marginTop: 4, marginBottom: 18, textAlign: 'center' },
  row: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderTopWidth: 1, borderTopColor: colors.inputBorder },
  label: { color: colors.subtitle, fontSize: 13 },
  value: { color: colors.title, fontSize: 13, fontWeight: '600', maxWidth: '58%', textAlign: 'right' },
  note: { color: colors.placeholder, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 16 },
});
