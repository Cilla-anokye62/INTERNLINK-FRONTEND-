import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { InternshipData } from '../../src/types/application';

const { height } = Dimensions.get('window');

export default function ApplicationReviewScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { toggleSavedInternship, isInternshipSaved } = useAppStore();
  const internship: InternshipData = route.params?.internship;
  const isSaved = internship ? isInternshipSaved(internship.id) : false;

  const handleSaveForLater = () => {
    if (internship) toggleSavedInternship(internship.id);
  };

  if (!internship) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContent}>
          <Text style={[styles.title, { color: colors.title }]}>No internship selected</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backLink, { color: colors.accent }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Internship card */}
        <View style={styles.internshipCard}>
          <View style={[styles.companyLogo, { backgroundColor: internship.companyColor }]}>
            <Text style={styles.companyLogoText}>{internship.companyLogo}</Text>
          </View>
          <Text style={styles.internshipTitle}>{internship.title}</Text>
          <Text style={styles.companyName}>{internship.company}</Text>

          <View style={styles.tagsRow}>
            <View style={[styles.matchBadge, { backgroundColor: colors.matchPillBg }]}>
              <Text style={[styles.matchText, { color: colors.matchPillText }]}>{internship.matchScore}% match</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.ratePillBg }]}>
              <Text style={[styles.tagText, { color: colors.ratePillText }]}>{internship.workMode}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.ratePillBg }]}>
              <Text style={[styles.tagText, { color: colors.ratePillText }]}>{internship.salary}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.ratePillBg }]}>
              <Text style={[styles.tagText, { color: colors.ratePillText }]}>{internship.duration}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.rowBorder }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.placeholder }]}>Location</Text>
            <Text style={[styles.detailValue, { color: colors.title }]}>{internship.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.placeholder }]}>Applicants</Text>
            <Text style={[styles.detailValue, { color: colors.title }]}>{internship.applicants}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={[styles.sectionTitle, { color: colors.title }]}>About the role</Text>
        <Text style={[styles.bodyText, { color: colors.subtitle }]}>{internship.description}</Text>

        {/* Skills */}
        <Text style={[styles.sectionTitle, { color: colors.title }]}>Required skills</Text>
        <View style={styles.skillsRow}>
          {internship.skills.map((skill) => (
            <View key={skill} style={[styles.skillChip, { backgroundColor: colors.iconCircle, borderColor: colors.inputBorder }]}>
              <Text style={[styles.skillText, { color: colors.accent }]}>{skill}</Text>
            </View>
          ))}
        </View>

        {/* Responsibilities */}
        <Text style={[styles.sectionTitle, { color: colors.title }]}>Responsibilities</Text>
        {internship.responsibilities.map((item, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={[styles.bulletIcon, { color: colors.accent }]}>✓</Text>
            <Text style={[styles.bulletText, { color: colors.subtitle }]}>{item}</Text>
          </View>
        ))}

        {/* Benefits */}
        <Text style={[styles.sectionTitle, { color: colors.title }]}>Benefits</Text>
        {internship.benefits.map((item, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={[styles.bulletIcon, { color: colors.accent }]}>★</Text>
            <Text style={[styles.bulletText, { color: colors.subtitle }]}>{item}</Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom buttons */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
        <TouchableOpacity
          style={[styles.saveLaterBtn, { borderColor: isSaved ? colors.accent : colors.inputBorder, backgroundColor: isSaved ? colors.iconCircle : colors.card }]}
          onPress={handleSaveForLater}
        >
          <Text style={[styles.saveLaterText, { color: isSaved ? colors.accent : colors.subtitle }]}>{isSaved ? 'Saved ✓' : 'Save for Later'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate('ResumeSelection', { internship })}
          activeOpacity={0.85}
        >
          <Text style={[styles.continueText, { color: colors.onPrimary }]}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.title },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  internshipCard: {
    backgroundColor: colors.card, borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2, marginBottom: 24,
  },
  companyLogo: {
    width: 56, height: 56, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginBottom: 14,
  },
  companyLogoText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  internshipTitle: { fontSize: 20, fontWeight: 'bold', color: colors.title, marginBottom: 4 },
  companyName: { fontSize: 14, color: colors.subtitle, marginBottom: 14 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  matchBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  matchText: { fontSize: 12, fontWeight: '700' },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { fontSize: 12, fontWeight: '500' },
  divider: { height: 1, marginBottom: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 4 },
  bodyText: { fontSize: 14, lineHeight: 22, marginBottom: 20 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  skillChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1 },
  skillText: { fontSize: 13, fontWeight: '600' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  bulletIcon: { fontSize: 14, fontWeight: 'bold', marginRight: 10, marginTop: 2 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 22 },
  bottomBar: {
    flexDirection: 'row', paddingHorizontal: 20, paddingBottom: height * 0.03,
    paddingTop: 12, gap: 12, borderTopWidth: 1,
  },
  saveLaterBtn: {
    flex: 1, borderRadius: 30, paddingVertical: 16, alignItems: 'center',
    borderWidth: 1.5, backgroundColor: colors.card,
  },
  saveLaterText: { fontSize: 15, fontWeight: '600' },
  continueBtn: { flex: 2, borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  continueText: { fontSize: 16, fontWeight: 'bold' },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  backLink: { fontSize: 15, fontWeight: '600' },
});
