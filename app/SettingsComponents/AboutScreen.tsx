import { useAppTheme } from '../../src/hooks/useAppTheme';
/**
 * AboutScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — About InternLink Screen
 *
 * Content:
 *  - Header: back arrow + "About InternLink" title
 *  - App logo and name
 *  - Version information
 *  - Links to website and social media
 *  - Legal links
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

export default function AboutScreen({ navigation }: any) {
    const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLinkPress = (url: string) => {
    // TODO: Open URL in browser
    console.log('Opening URL:', url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={colors.background === '#121212' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

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
              name="arrow-back-outline"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About InternLink</Text>
        </View>

        {/* App Info Card */}
        <View style={styles.appInfoCard}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🎓</Text>
          </View>
          <Text style={styles.appName}>InternLink</Text>
          <Text style={styles.tagline}>Connecting Students with Opportunities</Text>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Version</Text>
            <Text style={styles.versionValue}>1.0.0</Text>
          </View>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Build</Text>
            <Text style={styles.versionValue}>2026.07.10</Text>
          </View>
        </View>

        {/* Links Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>LINKS</Text>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleLinkPress('https://internlink.app')}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={20} color={colors.primary} />
            <Text style={styles.linkText}>Website</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleLinkPress('https://twitter.com/internlink')}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-twitter" size={20} color={colors.primary} />
            <Text style={styles.linkText}>Twitter</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleLinkPress('https://linkedin.com/company/internlink')}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-linkedin" size={20} color={colors.primary} />
            <Text style={styles.linkText}>LinkedIn</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkRow, styles.linkRowLast]}
            onPress={() => handleLinkPress('https://github.com/internlink')}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-github" size={20} color={colors.primary} />
            <Text style={styles.linkText}>GitHub</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Legal Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>LEGAL</Text>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('TermsOfService')}
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkRow, styles.linkRowLast]}
            onPress={() => navigation.navigate('PrivacyPolicy')}
            activeOpacity={0.7}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <Text style={styles.copyright}>
          © 2026 InternLink. All rights reserved.
        </Text>
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
    backgroundColor: colors.surface,
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
    color: colors.title,
  },
  appInfoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20', // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: 20,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerLine,
  },
  versionLabel: {
    fontSize: 14,
    color: colors.subtitle,
  },
  versionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.title,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.title,
    letterSpacing: 1,
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerLine,
  },
  linkRowLast: {
    borderBottomWidth: 0,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.subtitle,
    marginTop: 8,
  },
});
