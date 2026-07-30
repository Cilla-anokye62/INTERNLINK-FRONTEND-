import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { CompanyEngagementResponse } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function CompanyDetailScreen({ navigation, route }: any) {
  const company = route.params?.company as CompanyEngagementResponse | undefined;
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Company engagement</Text>
        <View style={{ width: 40 }} />
      </View>
      {!company ? (
        <View style={styles.center}>
          <Text style={styles.title}>Company details unavailable</Text>
          <Text style={styles.subtitle}>Open the company from the engagement list.</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{company.companyName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{company.companyName}</Text>
          <Text style={styles.subtitle}>Engagement with your university’s students</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{company.applicationCount}</Text>
              <Text style={styles.statLabel}>Applications</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{company.acceptedCount}</Text>
              <Text style={styles.statLabel}>Accepted</Text>
            </View>
          </View>
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
  content: { marginHorizontal: 20, padding: 22, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder, alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: colors.onPrimary, fontSize: 23, fontWeight: '800' },
  title: { color: colors.title, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: colors.subtitle, fontSize: 13, marginTop: 5, textAlign: 'center' },
  statsRow: { width: '100%', flexDirection: 'row', marginTop: 24, padding: 16, borderRadius: 14, backgroundColor: colors.background },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.title, fontSize: 24, fontWeight: '800' },
  statLabel: { color: colors.subtitle, fontSize: 11, marginTop: 4 },
  divider: { width: 1, backgroundColor: colors.inputBorder },
});
