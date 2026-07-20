/**
 * ReportsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Reports (Reports tab for university users)
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";

const REPORTS = [
  {
    id: 'springSummary',
    title: 'Spring 2026 placement summary',
    detail: 'PDF · Generated 2d ago',
    isNew: true,
  },
  {
    id: 'departmentBreakdown',
    title: 'Department-level breakdown',
    detail: 'XLSX · 12 sheets',
    isNew: false,
  },
  {
    id: 'topHiringPartnersQ1',
    title: 'Top hiring partners — Q1',
    detail: 'PDF · 4 pages',
    isNew: false,
  },
  {
    id: 'diversityMetrics',
    title: 'Diversity metrics report',
    detail: 'PDF · Confidential',
    isNew: false,
  },
  {
    id: 'studentOutcomes2025',
    title: 'Student outcomes — Class of 2025',
    detail: 'XLSX · Final',
    isNew: false,
  },
];

export default function ReportsScreen() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Reports</Text>
            <Text style={styles.headerSubtitle}>Generated reports</Text>
          </View>
        </View>

        {REPORTS.map((report) => (
          <View key={report.id} style={styles.reportRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text-outline" size={20} color={colors.fileIcon} />
            </View>
            <View style={styles.reportTextBlock}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDetail}>{report.detail}</Text>
            </View>
            {report.isNew && <View style={styles.newDot} />}
          </View>
        ))}
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.headerTitle,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.headerSubtitle,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.rowBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.iconCircleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  reportTextBlock: {
    flex: 1,
    marginRight: 10,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.reportTitle,
    marginBottom: 3,
  },
  reportDetail: {
    fontSize: 12,
    color: colors.reportDetail,
  },
  newDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.newDot,
  },
});
