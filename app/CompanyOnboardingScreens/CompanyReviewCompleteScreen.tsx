import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

// ---------- Types ----------
interface SummaryRow {
  icon: string;
  title: string;
  subtitle: string;
}

// ---------- Reusable Row Component ----------
interface SummaryRowItemProps {
  row: SummaryRow;
  onEdit: () => void;
  colors: any;
}

const SummaryRowItem: React.FC<SummaryRowItemProps> = ({ row, onEdit, colors }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 10,
    }}>
      <Ionicons name={row.icon as any} size={16} color={colors.subtitle} style={{ marginRight: 12 }} />

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '700',
          color: colors.title,
          marginBottom: 2,
        }}>{row.title}</Text>
        <Text style={{
          fontSize: 12,
          color: colors.subtitle,
        }}>{row.subtitle}</Text>
      </View>

      <TouchableOpacity onPress={onEdit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="create-outline" size={16} color={colors.subtitle} />
      </TouchableOpacity>
    </View>
  );
};

// ---------- Main Screen ----------
const CompanyReviewCompleteScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const summaryRows: SummaryRow[] = [
    {
      icon: 'business-outline',
      title: 'Company info',
      subtitle: 'Northwind · talent@northwind.io',
    },
    {
      icon: 'folder-outline',
      title: 'Details',
      subtitle: 'Software · 51-200 employees',
    },
    {
      icon: 'briefcase-outline',
      title: 'Recruitment',
      subtitle: '3 categories · Hybrid',
    },
    {
      icon: 'location-outline',
      title: 'Locations',
      subtitle: 'SF · NYC · Remote',
    },
  ];

  const handleEdit = (sectionTitle: string): void => {
    console.log('Edit pressed for:', sectionTitle);
    // TODO: navigate back to the relevant setup step
  };

  const handleCompleteSetup = (): void => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'CompanyTabs' }],
    });
  };

  const handleSaveAndFinishLater = (): void => {
    console.log('Save & finish later pressed');
    // TODO: save draft and exit flow
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step indicator */}
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Company setup · Step 4 of 4</Text>
          <Text style={styles.stepPercent}>100%</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Review & complete</Text>
        <Text style={styles.subtitle}>
          Confirm your company profile before going live.
        </Text>

        {/* Company card */}
        <View style={styles.companyCard}>
          <View style={styles.companyCardTop}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>N</Text>
            </View>

            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>Northwind Studios</Text>
              <Text style={styles.companyMeta}>Software · 51-200 · SF</Text>
            </View>

            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>92%</Text>
            </View>
          </View>

          <View style={styles.companyProgressTrack}>
            <View style={[styles.companyProgressFill, { width: '92%' }]} />
          </View>
        </View>

        {/* Summary rows */}
        {summaryRows.map((row) => (
          <SummaryRowItem
            key={row.title}
            row={row}
            onEdit={() => handleEdit(row.title)}
            colors={colors}
          />
        ))}

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="document-text-outline" size={14} color={colors.accent} style={{ marginRight: 8 }} />
          <Text style={styles.infoBannerText}>
            You can post your first internship right after setup.
          </Text>
        </View>

        {/* Complete setup button */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteSetup}
          activeOpacity={0.8}
        >
          <Text style={styles.completeButtonText}>Complete Setup</Text>
        </TouchableOpacity>

        {/* Save & finish later button */}
        <TouchableOpacity
          style={styles.saveLaterButton}
          onPress={handleSaveAndFinishLater}
          activeOpacity={0.7}
        >
          <Text style={styles.saveLaterButtonText}>Save & finish later</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '500',
  },
  stepPercent: {
    fontSize: 13,
    color: colors.subtitle,
    fontWeight: '500',
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.inputBorder,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: 20,
  },
  companyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 16,
    marginBottom: 16,
  },
  companyCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 2,
  },
  companyMeta: {
    fontSize: 12,
    color: colors.subtitle,
  },
  scoreBadge: {
    backgroundColor: colors.iconCircle,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  scoreBadgeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  companyProgressTrack: {
    height: 4,
    backgroundColor: colors.inputBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  companyProgressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  rowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIconText: {
    fontSize: 16,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
    color: colors.subtitle,
  },
  editIcon: {
    fontSize: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.iconCircle,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 6,
    marginBottom: 20,
  },
  infoBannerIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  completeButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveLaterButton: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveLaterButtonText: {
    color: colors.title,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CompanyReviewCompleteScreen;