import { useAppTheme } from '../../src/hooks/useAppTheme';
/**
 * PrivacyPolicyScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Privacy Policy Screen
 *
 * Content:
 *  - Header: back arrow + "Privacy Policy" title
 *  - Scrollable legal document content
 *  - Last updated date
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';



export default function PrivacyPolicyScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back-outline"
              size={22}
              color={colors.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.date}>Last updated: July 2026</Text>

          <Text style={styles.sectionHeader}>1. Information We Collect</Text>
          <Text style={styles.text}>
            InternLink collects information you provide directly, including your name, email, academic information, skills, and profile photo. We also collect information about your usage of the platform to improve our services.
          </Text>

          <Text style={styles.sectionHeader}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            We use your information to provide and improve our internship matching services, communicate with you about opportunities, and ensure the security of our platform. We may also use your data for analytics and research purposes.
          </Text>

          <Text style={styles.sectionHeader}>3. Information Sharing</Text>
          <Text style={styles.text}>
            We share your profile information with employers and universities based on your privacy settings. We do not sell your personal data to third parties. We may share data with service providers who assist in operating our platform.
          </Text>

          <Text style={styles.sectionHeader}>4. Data Security</Text>
          <Text style={styles.text}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
          </Text>

          <Text style={styles.sectionHeader}>5. Your Privacy Rights</Text>
          <Text style={styles.text}>
            You have the right to access, correct, or delete your personal information. You can update your privacy settings at any time through the Settings screen. You may also request account deletion.
          </Text>

          <Text style={styles.sectionHeader}>6. Cookies and Tracking</Text>
          <Text style={styles.text}>
            We use cookies and similar technologies to improve user experience and analyze usage patterns. You can control cookie settings through your device preferences.
          </Text>

          <Text style={styles.sectionHeader}>7. Third-Party Services</Text>
          <Text style={styles.text}>
            Our platform may contain links to third-party services. We are not responsible for the privacy practices of these external sites. We encourage users to read the privacy policies of any third-party services they visit.
          </Text>

          <Text style={styles.sectionHeader}>8. Children's Privacy</Text>
          <Text style={styles.text}>
            InternLink is not intended for users under the age of 16. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete it.
          </Text>

          <Text style={styles.sectionHeader}>9. Changes to This Policy</Text>
          <Text style={styles.text}>
            We may update this privacy policy from time to time. We will notify users of significant changes by posting the new policy on this page and updating the "Last updated" date.
          </Text>

          <Text style={styles.sectionHeader}>10. Contact Information</Text>
          <Text style={styles.text}>
            For questions about this Privacy Policy, please contact us at privacy@internlink.app
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.backBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.headerTitle,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: colors.date,
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.sectionHeader,
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
});
