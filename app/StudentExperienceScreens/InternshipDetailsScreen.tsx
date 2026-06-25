import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function InternshipDetailsScreen({ navigation }: any) {
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

        {/* Apply Now button — navigates to ApplicationSent screen */}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FBFA',
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: '#024D60',
    fontWeight: 'bold',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
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
    color: '#024D60',
    marginBottom: 6,
  },
  company: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  matchBadge: {
    backgroundColor: '#EAF6F5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  matchText: {
    fontSize: 12,
    color: '#2CACAD',
    fontWeight: '700',
  },
  tag: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
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
    color: '#024D60',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 10,
    marginTop: 4,
  },
  bodyText: {
    fontSize: 14,
    color: '#64748B',
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
    backgroundColor: '#EAF6F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#C8E6E4',
  },
  skillText: {
    fontSize: 13,
    color: '#2CACAD',
    fontWeight: '600',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletIcon: {
    fontSize: 14,
    color: '#2CACAD',
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: height * 0.03,
    paddingTop: 12,
    backgroundColor: '#F0FAFA',
    gap: 12,
  },
  saveBtn: {
    flex: 1,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2CACAD',
    backgroundColor: '#FFFFFF',
  },
  saveBtnText: {
    color: '#2CACAD',
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyBtn: {
    flex: 2,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#2CACAD',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});