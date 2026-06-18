import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const COMPLETION_ITEMS = [
  { id: 'academic',  label: 'Academic Information', status: 'Done' },
  { id: 'skills',    label: 'Skills & Expertise',   status: 'Done' },
  { id: 'interests', label: 'Career Interests',      status: 'Done' },
  { id: 'location',  label: 'Preferred Location',    status: 'Done' },
  { id: 'photo',     label: 'Profile Photo',         status: 'Pending' },
];

const STAND_OUT_ITEMS = [
  {
    id: 'resume',
    icon: '📄',
    title: 'Upload your resume',
    subtitle: 'PDF, max 5MB',
  },
  {
    id: 'portfolio',
    icon: '🔗',
    title: 'Add portfolio link',
    subtitle: 'Behance, GitHub, personal site',
  },
  {
    id: 'bio',
    icon: '✏️',
    title: 'Write your bio',
    subtitle: 'Tell employers who you are',
  },
];

export default function ProfileCompletionScreen({ navigation }: any) {

  const handleComplete = () => {
    navigation.navigate('HomeDashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={styles.stepLabel}>Step 5 of 5</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HomeDashboard')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Almost There!</Text>
        <Text style={styles.subtitle}>
          Complete your profile to unlock personalized matches
        </Text>

        {/* Upload photo placeholder */}
        <TouchableOpacity style={styles.uploadPhotoBox} activeOpacity={0.8}>
          <View style={styles.uploadIconBox}>
            <Text style={styles.uploadIcon}>📋</Text>
            <View style={styles.uploadPlusBadge}>
              <Text style={styles.uploadPlusText}>+</Text>
            </View>
          </View>
          <Text style={styles.uploadPhotoLabel}>Upload Profile Photo</Text>
        </TouchableOpacity>

        {/* Completion checklist */}
        <View style={styles.card}>
          {COMPLETION_ITEMS.map((item, index) => {
            const isDone = item.status === 'Done';
            return (
              <View
                key={item.id}
                style={[
                  styles.checklistItem,
                  index < COMPLETION_ITEMS.length - 1 && styles.checklistItemBorder,
                ]}
              >
                <View style={[styles.checkCircle, isDone && styles.checkCircleDone]}>
                  {isDone && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.checklistLabel}>{item.label}</Text>
                <Text style={[styles.checklistStatus, isDone ? styles.statusDone : styles.statusPending]}>
                  {item.status}
                </Text>
              </View>
            );
          })}
        </View>

        {/* AI Profile Strength */}
        <View style={styles.strengthCard}>
          <View style={styles.strengthHeader}>
            <Text style={styles.strengthIcon}>✦</Text>
            <Text style={styles.strengthTitle}>AI Profile Strength: 85%</Text>
          </View>
          <View style={styles.strengthBarBg}>
            <View style={[styles.strengthBarFill, { width: '85%' }]} />
          </View>
          <Text style={styles.strengthHint}>
            Adding a profile photo boosts your match score by 15%
          </Text>
        </View>

        {/* Stand out section */}
        <Text style={styles.standOutLabel}>STAND OUT EVEN MORE</Text>
        <View style={styles.card}>
          {STAND_OUT_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.standOutItem,
                index < STAND_OUT_ITEMS.length - 1 && styles.checklistItemBorder,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.standOutIconCircle}>
                <Text style={styles.standOutIcon}>{item.icon}</Text>
              </View>
              <View style={styles.standOutText}>
                <Text style={styles.standOutTitle}>{item.title}</Text>
                <Text style={styles.standOutSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.standOutArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Complete button */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          activeOpacity={0.85}
        >
          <Text style={styles.completeButtonText}>Complete Profile & Start Matching</Text>
        </TouchableOpacity>

        <View style={{ height: height * 0.03 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EAF6F5',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.04,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: '#2CACAD',
    fontWeight: '600',
  },
  skipText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // Progress
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: '#C8E6E4',
    borderRadius: 3,
    marginBottom: height * 0.03,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: '#2CACAD',
    borderRadius: 3,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: height * 0.03,
    lineHeight: 20,
  },

  // Upload photo
  uploadPhotoBox: {
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  uploadIconBox: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: '#D4F0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadIcon: {
    fontSize: 36,
  },
  uploadPlusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2CACAD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPlusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  uploadPhotoLabel: {
    fontSize: 13,
    color: '#024D60',
    fontWeight: '600',
  },

  // Checklist card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  checklistItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkCircleDone: {
    backgroundColor: '#2CACAD',
    borderColor: '#2CACAD',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checklistLabel: {
    flex: 1,
    fontSize: 14,
    color: '#024D60',
    fontWeight: '500',
  },
  checklistStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusDone: {
    color: '#2CACAD',
  },
  statusPending: {
    color: '#94A3B8',
  },

  // AI Strength card
  strengthCard: {
    backgroundColor: '#EAF6F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6E4',
  },
  strengthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  strengthIcon: {
    fontSize: 14,
    color: '#2CACAD',
    marginRight: 6,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#024D60',
  },
  strengthBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#C8E6E4',
    borderRadius: 3,
    marginBottom: 8,
  },
  strengthBarFill: {
    height: 6,
    backgroundColor: '#2CACAD',
    borderRadius: 3,
  },
  strengthHint: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },

  // Stand out
  standOutLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 10,
  },
  standOutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  standOutIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF6F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  standOutIcon: {
    fontSize: 18,
  },
  standOutText: {
    flex: 1,
  },
  standOutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#024D60',
    marginBottom: 2,
  },
  standOutSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  standOutArrow: {
    fontSize: 20,
    color: '#94A3B8',
  },

  // Complete button
  completeButton: {
    backgroundColor: '#2CACAD',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});