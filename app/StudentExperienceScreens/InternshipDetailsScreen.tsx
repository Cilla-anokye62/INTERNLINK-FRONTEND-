import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { height } = Dimensions.get('window');

export default function InternshipDetailsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveIcon}>🔖</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Company avatar */}
        <View style={styles.companyAvatar}>
          <Text style={styles.companyAvatarText}>A</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Software Engineering Intern</Text>
        <Text style={styles.company}>Airbnb · San Francisco, CA</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>94% match</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Hybrid</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>GHS 48/hr</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>12 weeks</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>128</Text>
            <Text style={styles.statLabel}>Applicants</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2d ago</Text>
            <Text style={styles.statLabel}>Posted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Apr 15</Text>
            <Text style={styles.statLabel}>Closes</Text>
          </View>
        </View>

        {/* About the role */}
        <Text style={styles.sectionTitle}>About the role</Text>
        <Text style={styles.bodyText}>
          Join the Trust & Safety team to build experiences used by 150M+ travelers worldwide. You'll work alongside senior engineers, ship production code, and own a meaningful feature by the end of the summer.
        </Text>

        {/* Skills required */}
        <Text style={styles.sectionTitle}>Skills required</Text>
        <View style={styles.skillsRow}>
          {['React', 'TypeScript', 'GraphQL', 'Testing'].map(skill => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        {/* What you'll do */}
        <Text style={styles.sectionTitle}>What you'll do</Text>
        {[
          'Ship customer-facing features end-to-end',
          'Pair with senior engineers in weekly reviews',
          'Contribute to design system + tooling',
        ].map((item, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletIcon}>✓</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <View style={{ height: height * 0.12 }} />
      </ScrollView>

      {/* Bottom action buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => navigation.navigate('ApplicationSent')}
          activeOpacity={0.85}
        >
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </TouchableOpacity>
      </View>

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
  applyBtnText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});