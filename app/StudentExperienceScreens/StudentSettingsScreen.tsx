import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const ACCOUNT_ITEMS = [
  { id: 'personal',   label: 'Personal info' },
  { id: 'email',      label: 'Email & password' },
  { id: 'connected',  label: 'Connected accounts' },
];

const PREFERENCES_ITEMS = [
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy',       label: 'Privacy' },
  { id: 'language',      label: 'Language' },
  { id: 'appearance',    label: 'Appearance' },
];

const SUPPORT_ITEMS = [
  { id: 'help',     label: 'Help center' },
  { id: 'feedback', label: 'Send feedback' },
  { id: 'terms',    label: 'Terms & privacy' },
];

export default function StudentSettingsScreen({ navigation }: any) {

  const handleSignOut = () => {
    // TODO: clear auth tokens / session here
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderSection = (title: string, items: { id: string; label: string }[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.card}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.row,
              index < items.length - 1 && styles.rowBorder,
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.backButton} />
        </View>

        {/* Profile summary card */}
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.7}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AM</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alex Morgan</Text>
            <Text style={styles.profileEmail}>alex.morgan@uni.edu</Text>
          </View>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>

        {/* Sections */}
        {renderSection('ACCOUNT', ACCOUNT_ITEMS)}
        {renderSection('PREFERENCES', PREFERENCES_ITEMS)}
        {renderSection('SUPPORT', SUPPORT_ITEMS)}

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutCard} onPress={handleSignOut} activeOpacity={0.7}>
          <Text style={styles.signOutText}>Sign out</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#024D60',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#024D60',
  },

  // Profile summary
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2CACAD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: '#94A3B8',
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowLabel: {
    fontSize: 14,
    color: '#024D60',
    fontWeight: '500',
  },
  rowArrow: {
    fontSize: 18,
    color: '#94A3B8',
  },

  // Sign out
  signOutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
});