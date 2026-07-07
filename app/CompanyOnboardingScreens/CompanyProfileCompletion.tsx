import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

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
}

const SummaryRowItem: React.FC<SummaryRowItemProps> = ({ row, onEdit }) => {
  return (
    <View style={styles.row}>
      <View style={styles.rowIconCircle}>
        <Text style={styles.rowIconText}>{row.icon}</Text>
      </View>

      <View style={styles.rowTextContainer}>
        <Text style={styles.rowTitle}>{row.title}</Text>
        <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
      </View>

      <TouchableOpacity onPress={onEdit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.editIcon}>✏️</Text>
      </TouchableOpacity>
    </View>
  );
};
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, any>;
// ---------- Main Screen ----------
const CompanyProfileCompletion: React.FC<Props> = ({ navigation }) => {
  const summaryRows: SummaryRow[] = [
    {
      icon: '🏢',
      title: 'Company info',
      subtitle: 'Northwind · talent@northwind.io',
    },
    {
      icon: '📁',
      title: 'Details',
      subtitle: 'Software · 51-200 employees',
    },
    {
      icon: '💼',
      title: 'Recruitment',
      subtitle: '3 categories · Hybrid',
    },
    {
      icon: '📍',
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
          />
        ))}

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>📄</Text>
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
const TEAL = '#2BA9A0';
const TEAL_LIGHT = '#E6F5F4';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FBFA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FBFA',
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
    color: TEAL,
    fontWeight: '500',
  },
  stepPercent: {
    fontSize: 13,
    color: TEXT_GRAY,
    fontWeight: '500',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: TEAL,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 20,
  },
  companyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
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
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  companyMeta: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  scoreBadge: {
    backgroundColor: TEAL_LIGHT,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  scoreBadgeText: {
    color: TEAL,
    fontSize: 12,
    fontWeight: '700',
  },
  companyProgressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  companyProgressFill: {
    height: '100%',
    backgroundColor: TEAL,
    borderRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  rowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TEAL_LIGHT,
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
    color: TEXT_DARK,
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  editIcon: {
    fontSize: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEAL_LIGHT,
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
    color: TEAL,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: TEAL,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveLaterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveLaterButtonText: {
    color: TEXT_DARK,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CompanyProfileCompletion;