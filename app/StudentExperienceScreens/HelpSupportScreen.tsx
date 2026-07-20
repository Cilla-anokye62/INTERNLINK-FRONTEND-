import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const FAQ = [
  { q: 'How do I apply for an internship?', a: 'Browse listings in the Discover tab, tap one, and hit Apply. Follow the 6-step flow to submit your application.' },
  { q: 'How does AI matching work?', a: 'Our AI analyzes your skills, preferences, and profile to rank internships by fit. Higher match scores mean better alignment.' },
  { q: 'Can I withdraw my application?', a: 'Yes. Open your application details and tap Withdraw. This cannot be undone.' },
  { q: 'How do I update my profile?', a: 'Go to the Profile tab and tap Edit to update your info, skills, and preferences.' },
];

export default function HelpSupportScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.contactCard, { backgroundColor: colors.accent }]}>
          <Ionicons name="chatbubble-outline" size={32} color="#fff" style={{marginBottom: 8}} />
          <Text style={styles.contactTitle}>Need help?</Text>
          <Text style={styles.contactSubtitle}>Our support team is available 24/7</Text>
          <TouchableOpacity style={styles.contactBtn} onPress={() => navigation.navigate('SendFeedback')}>
            <Text style={styles.contactBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.title }]}>Frequently Asked Questions</Text>
        {FAQ.map((item, i) => (
          <View key={i} style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
            <Text style={[styles.faqQ, { color: colors.title }]}>{item.q}</Text>
            <Text style={[styles.faqA, { color: colors.subtitle }]}>{item.a}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  contactCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 28 },
  contactTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  contactSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  contactBtn: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
  contactBtnText: { fontSize: 14, fontWeight: '700', color: colors.accent },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  faqCard: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 10 },
  faqQ: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  faqA: { fontSize: 13, lineHeight: 19 },
});
