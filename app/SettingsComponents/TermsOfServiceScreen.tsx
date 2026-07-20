import { useAppTheme } from '../../src/hooks/useAppTheme';
/**
 * TermsOfServiceScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Terms of Service Screen
 *
 * Content:
 *  - Header: back arrow + "Terms of Service" title
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



export default function TermsOfServiceScreen({ navigation }: any) {
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
          <Text style={styles.headerTitle}>Terms of Service</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.date}>Last updated: July 2026</Text>

          <Text style={styles.sectionHeader}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing and using InternLink, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
          </Text>

          <Text style={styles.sectionHeader}>2. User Accounts</Text>
          <Text style={styles.text}>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. InternLink reserves the right to terminate accounts that violate these terms.
          </Text>

          <Text style={styles.sectionHeader}>3. Internship Listings</Text>
          <Text style={styles.text}>
            InternLink serves as a platform connecting students, universities, and employers. While we strive to maintain accurate information, we do not guarantee the completeness or reliability of any internship listings. Users should verify all information directly with employers.
          </Text>

          <Text style={styles.sectionHeader}>4. User Conduct</Text>
          <Text style={styles.text}>
            Users agree not to use the platform for any unlawful purpose, harass other users, or submit false or misleading information. Any violation may result in immediate account termination.
          </Text>

          <Text style={styles.sectionHeader}>5. Privacy</Text>
          <Text style={styles.text}>
            Your use of InternLink is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the platform and informs users of our data collection practices.
          </Text>

          <Text style={styles.sectionHeader}>6. Intellectual Property</Text>
          <Text style={styles.text}>
            All content on InternLink, including text, graphics, logos, and software, is the property of InternLink or its content suppliers and is protected by intellectual property laws.
          </Text>

          <Text style={styles.sectionHeader}>7. Limitation of Liability</Text>
          <Text style={styles.text}>
            InternLink shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the platform.
          </Text>

          <Text style={styles.sectionHeader}>8. Termination</Text>
          <Text style={styles.text}>
            We reserve the right to terminate or suspend your account at any time, with or without cause, with or without notice.
          </Text>

          <Text style={styles.sectionHeader}>9. Changes to Terms</Text>
          <Text style={styles.text}>
            We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
          </Text>

          <Text style={styles.sectionHeader}>10. Contact Information</Text>
          <Text style={styles.text}>
            For questions about these Terms of Service, please contact us at support@internlink.app
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
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
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
