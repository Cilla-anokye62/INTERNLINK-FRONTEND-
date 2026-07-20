/**
 * ReportsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Reports (Reports tab for university users)
 *
 * Content (from design):
 *  - Header: "Reports" title + "Generate & export" subtitle
 *    + circular teal "+" button on the right (to generate a new report)
 *  - List of report rows, each with: file-type icon, title (can wrap
 *    onto 2 lines), detail line (format · status/info), and a download
 *    icon on the right
 *  - One report ("Spring 2026 placement summary") has a small teal dot
 *    next to the download icon — likely indicating it's new/unread
 *  - Bottom tab bar with "Reports" highlighted as active
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import ReportsScreen from './app/ReportsScreen';
 *     <Stack.Screen name="Reports" component={ReportsScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // non-deprecated version
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";

// ─── DATA ─────────────────────────────────────────────────────────

// The list of available reports. In the real app this would come from
// your backend — for now it's hardcoded to match the design.
// "isNew" controls whether the small teal dot shows next to the
// download icon (only the first report has it in the design).
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




// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function ReportsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Main scrollable content sits above the fixed bottom tab bar */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ROW: title/subtitle ─────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Reports</Text>
            <Text style={styles.headerSubtitle}>Generated reports</Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleGenerateReport}
            activeOpacity={0.85}
          >
            <Ionicons
              name="add"
              size={22}
              color={colors.addBtnIcon}
            />
          </TouchableOpacity>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── REPORT LIST ──────────────────────────────────────────── */}
        {REPORTS.map((report) => (
          <View
            key={report.id}
            style={styles.reportRow}
          >

            {/* Left: file icon inside a light teal circle */}
            <View style={styles.iconCircle}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.fileIcon}
              />
            </View>

            {/* Middle: title + detail line, fills remaining space */}
            <View style={styles.reportTextBlock}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDetail}>{report.detail}</Text>
            </View>

            {/* Right: download icon, with an optional small "new" dot
                rendered above-left of it for unread/new reports */}
            <View style={styles.downloadColumn}>
              {report.isNew && <View style={styles.newDot} />}

              <TouchableOpacity
                onPress={() => handleDownloadPress(report.id)}
                activeOpacity={0.7}
                style={styles.downloadBtn}
              >
                <Ionicons
                  name="download-outline"
                  size={18}
                  color={colors.downloadIcon}
                />
              </TouchableOpacity>
            </View>

          </View>
        ))}
        {/* ── END REPORT LIST ─────────────────────────────────────── */}

      </ScrollView>



    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const createStyles = (colors: any) => StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Scrollable content — leaves room at the bottom so the tab bar
  // doesn't cover the last items
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 100, // extra space so content isn't hidden behind tab bar
  },

  // ── Header ────────────────────────────────────────────────────
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
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.addBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    // Teal glow shadow to make this primary action stand out
    shadowColor: colors.addBtnBg,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  // ── Report rows ───────────────────────────────────────────────
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

  // ── "New" dot indicator ────────────────────────────────────────
  newDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.newDot,
    backgroundColor: colors.newDot,
    marginBottom: 6,
  },
  downloadBtn: {
    padding: 2, // slightly larger tap target than the icon's visual size
  },


});