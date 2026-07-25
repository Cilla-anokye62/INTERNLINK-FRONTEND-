import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { InternshipData } from '../../src/types/application';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const MOCK_INTERNSHIP: InternshipData = {
  id: 'int-1',
  title: 'Software Engineering Intern',
  company: 'Airbnb',
  companyId: 'employer-1',
  companyLogo: 'A',
  companyColor: '#EF4444',
  location: 'San Francisco, CA',
  workMode: 'hybrid',
  salary: 'GHS 48/hr',
  duration: '12 weeks',
  description: 'Join the Trust & Safety team to build experiences used by 150M+ travelers worldwide. You\'ll work alongside senior engineers, ship production code, and own a meaningful feature by the end of the summer.',
  responsibilities: ['Ship customer-facing features end-to-end', 'Pair with senior engineers in weekly reviews', 'Contribute to design system + tooling'],
  requirements: ['React', 'TypeScript', 'GraphQL', 'Testing'],
  benefits: ['Housing stipend', 'Mentorship program', 'Free meals'],
  skills: ['React', 'TypeScript', 'GraphQL', 'Testing'],
  matchScore: 94,
  applicants: 128,
  postedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
  closingDate: new Date(Date.now() + 30 * 86400000).toISOString(),
};

export default function InternshipDetailsScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { isPremium, applicationsUsed, applicationLimit, savedInternships, toggleSavedInternship } = useAppStore();

  const raw = route.params?.internship;

  const internship: InternshipData = raw
    ? {
        id: raw.id || 'int-0',
        title: raw.title || 'Internship',
        company: raw.company || 'Company',
        companyId: raw.companyId || 'employer-0',
        companyLogo: raw.companyLogo || raw.company?.[0] || 'C',
        companyColor: raw.companyColor || raw.color || '#2CACAD',
        location: raw.location || '',
        workMode: raw.workMode || (raw.location?.includes('Remote') ? 'remote' : raw.location?.includes('Hybrid') ? 'hybrid' : 'onsite'),
        salary: raw.salary || raw.pay || '',
        duration: raw.duration || '',
        description: raw.description || 'Join this exciting internship opportunity and gain hands-on experience in a dynamic environment.',
        responsibilities: raw.responsibilities || ['Contribute to real projects', 'Collaborate with the team', 'Learn from industry experts'],
        requirements: raw.requirements || raw.skills || [],
        benefits: raw.benefits || ['Mentorship', 'Networking opportunities'],
        skills: raw.skills || ['React', 'TypeScript', 'Communication'],
        matchScore: raw.matchScore || raw.match || 0,
        applicants: raw.applicants || Math.floor(Math.random() * 200) + 50,
        postedDate: raw.postedDate || new Date(Date.now() - 7 * 86400000).toISOString(),
        closingDate: raw.closingDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      }
    : MOCK_INTERNSHIP;

  const isSaved = savedInternships.includes(internship.id);

  const handleApply = () => {
    if (!isPremium && applicationsUsed >= applicationLimit) {
      navigation.navigate('PremiumPaywall');
      return;
    }
    navigation.navigate('ApplicationReview', { internship });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={() => toggleSavedInternship(internship.id)}>
          <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={isSaved ? colors.accent : colors.title} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Company avatar */}
        <View style={[styles.companyAvatar, { backgroundColor: internship.companyColor }]}>
          <Text style={styles.companyAvatarText}>{internship.companyLogo}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{internship.title}</Text>
        <Text style={styles.company}>{internship.company} · {internship.location}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {internship.matchScore > 0 ? (
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>{internship.matchScore}% match</Text>
            </View>
          ) : null}
          <View style={styles.tag}>
            <Text style={styles.tagText}>{internship.workMode}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{internship.salary}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{internship.duration}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {internship.applicants > 0 ? (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{internship.applicants}</Text>
                <Text style={styles.statLabel}>Applicants</Text>
              </View>
              <View style={styles.statDivider} />
            </>
          ) : null}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{new Date(internship.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
            <Text style={styles.statLabel}>Posted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{new Date(internship.closingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
            <Text style={styles.statLabel}>Closes</Text>
          </View>
        </View>

        {/* About the role */}
        <Text style={styles.sectionTitle}>About the role</Text>
        <Text style={styles.bodyText}>{internship.description}</Text>

        {/* Skills required */}
        <Text style={styles.sectionTitle}>Skills required</Text>
        <View style={styles.skillsRow}>
          {internship.skills.map(skill => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        {/* What you'll do */}
        <Text style={styles.sectionTitle}>What you'll do</Text>
        {internship.responsibilities.map((item, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletIcon}>✓</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <View style={{ height: height * 0.12 }} />
      </ScrollView>

      {/* Bottom action buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => toggleSavedInternship(internship.id)}>
          <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={16} color={colors.accent} style={{marginRight: 6}} />
          <Text style={styles.saveBtnText}>{isSaved ? 'Saved' : 'Save'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.applyBtn, !isPremium && applicationsUsed >= applicationLimit && styles.applyBtnLocked]}
          onPress={handleApply}
          activeOpacity={0.85}
        >
          <Text style={styles.applyBtnText}>
            {!isPremium && applicationsUsed >= applicationLimit
              ? 'Upgrade to Apply'
              : 'Apply Now'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Application limit indicator for free users */}
      {!isPremium && (
        <View style={styles.limitIndicator}>
          <Text style={styles.limitText}>
            {applicationsUsed} / {applicationLimit} free applications used
          </Text>
        </View>
      )}

    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.title,
    fontWeight: 'bold',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  companyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  companyAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 6,
  },
  company: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  matchBadge: {
    backgroundColor: colors.matchPillBg,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  matchText: {
    fontSize: 12,
    color: colors.matchPillText,
    fontWeight: '700',
  },
  tag: {
    backgroundColor: colors.ratePillBg,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    color: colors.ratePillText,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.placeholder,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.rowBorder,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 10,
    marginTop: 4,
  },
  bodyText: {
    fontSize: 14,
    color: colors.subtitle,
    lineHeight: 22,
    marginBottom: 20,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  skillChip: {
    backgroundColor: colors.iconCircle,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  skillText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletIcon: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: colors.subtitle,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: height * 0.03,
    paddingTop: 12,
    backgroundColor: colors.background,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.rowBorder,
  },
  saveBtn: {
    flex: 1,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.card,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyBtn: {
    flex: 2,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  applyBtnLocked: {
    backgroundColor: colors.premiumGradientStart,
  },
  applyBtnText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  limitIndicator: {
    alignItems: 'center',
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  limitText: {
    fontSize: 12,
    color: colors.placeholder,
    fontWeight: '500',
  },
});
