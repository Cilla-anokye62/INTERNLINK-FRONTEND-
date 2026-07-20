import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { width } = Dimensions.get('window');

const FREE_FEATURES = [
  { text: 'Apply to 3 companies', included: true },
  { text: 'Basic AI match scores', included: true },
  { text: 'View internship listings', included: true },
  { text: 'Application tracking', included: false },
  { text: 'Deep AI analysis', included: false },
  { text: 'Resume insights', included: false },
  { text: 'Priority matching', included: false },
];

const PREMIUM_FEATURES = [
  { text: 'Unlimited applications', included: true },
  { text: 'Advanced AI match scores', included: true },
  { text: 'View all internship listings', included: true },
  { text: 'Full application tracking', included: true },
  { text: 'Deep AI career analysis', included: true },
  { text: 'Resume optimization insights', included: true },
  { text: 'Priority matching algorithm', included: true },
];

export default function PremiumPaywallScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const handleUpgrade = () => {
    navigation.navigate('Payment', { plan: selectedPlan });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Close button */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.7}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Hero banner */}
        <LinearGradient
          colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <Ionicons name="diamond-outline" size={40} color={colors.accent} style={styles.crownIcon} />
          <Text style={styles.heroTitle}>InternLink Premium</Text>
          <Text style={styles.heroSubtitle}>Unlock your full career potential</Text>
        </LinearGradient>

        {/* Plan selector */}
        <View style={styles.planSelector}>
          <TouchableOpacity
            style={[styles.planOption, selectedPlan === 'monthly' && styles.planOptionActive]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.7}
          >
            <Text style={[styles.planLabel, selectedPlan === 'monthly' && styles.planLabelActive]}>
              Monthly
            </Text>
            <Text style={[styles.planPrice, selectedPlan === 'monthly' && styles.planPriceActive]}>
              GHS 29/mo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planOption, selectedPlan === 'annual' && styles.planOptionActive]}
            onPress={() => setSelectedPlan('annual')}
            activeOpacity={0.7}
          >
            <View style={styles.planBadgeRow}>
              <Text style={[styles.planLabel, selectedPlan === 'annual' && styles.planLabelActive]}>
                Annual
              </Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsBadgeText}>Save 40%</Text>
              </View>
            </View>
            <Text style={[styles.planPrice, selectedPlan === 'annual' && styles.planPriceActive]}>
              GHS 17/mo
            </Text>
            <Text style={[styles.planDetail, selectedPlan === 'annual' && styles.planDetailActive]}>
              Billed GHS 204/year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Feature comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonTitle}>Free vs Premium</Text>

          {/* Free column */}
          <View style={styles.featureColumn}>
            <View style={[styles.columnHeader, styles.freeColumnHeader]}>
              <Text style={styles.columnHeaderText}>Free</Text>
            </View>
            {FREE_FEATURES.map((feature, index) => (
              <View
                key={`free-${index}`}
                style={[styles.featureRow, index === FREE_FEATURES.length - 1 && styles.featureRowLast]}
              >
                <Text style={styles.featureText}>{feature.text}</Text>
                <Text style={[styles.featureCheck, !feature.included && styles.featureCross]}>
                  {feature.included ? '✓' : '✕'}
                </Text>
              </View>
            ))}
          </View>

          {/* Premium column */}
          <View style={[styles.featureColumn, styles.premiumColumn]}>
            <LinearGradient
              colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumColumnHeader}
            >
              <Text style={styles.columnHeaderText}>Premium</Text>
              <Ionicons name="diamond-outline" size={14} color={colors.accent} />
            </LinearGradient>
            {PREMIUM_FEATURES.map((feature, index) => (
              <View
                key={`premium-${index}`}
                style={[styles.featureRow, index === PREMIUM_FEATURES.length - 1 && styles.featureRowLast]}
              >
                <Text style={styles.featureText}>{feature.text}</Text>
                <Text style={[styles.featureCheck, styles.premiumCheck]}>✓</Text>
              </View>
            ))}
          </View>
        </View>

        {/* What you'll unlock */}
        <View style={styles.unlockSection}>
          <Text style={styles.unlockTitle}>What you'll unlock</Text>

          <View style={styles.unlockCard}>
            <Ionicons name="hardware-chip-outline" size={22} color={colors.accent} style={{marginRight: 14}} />
            <View style={styles.unlockTextBlock}>
              <Text style={styles.unlockCardTitle}>Deep AI Analysis</Text>
              <Text style={styles.unlockCardDesc}>
                Our AI analyzes your skills, experience, and resume to find the best internship matches with detailed insights.
              </Text>
            </View>
          </View>

          <View style={styles.unlockCard}>
            <Ionicons name="bar-chart-outline" size={22} color={colors.accent} style={{marginRight: 14}} />
            <View style={styles.unlockTextBlock}>
              <Text style={styles.unlockCardTitle}>Application Tracking</Text>
              <Text style={styles.unlockCardDesc}>
                Track every application from submission to offer. Know exactly where you stand at every stage.
              </Text>
            </View>
          </View>

          <View style={styles.unlockCard}>
            <Ionicons name="document-text-outline" size={22} color={colors.accent} style={{marginRight: 14}} />
            <View style={styles.unlockTextBlock}>
              <Text style={styles.unlockCardTitle}>Resume Insights</Text>
              <Text style={styles.unlockCardDesc}>
                Get personalized feedback on your resume and tips to improve your candidacy for top companies.
              </Text>
            </View>
          </View>
        </View>

        {/* Trust badges */}
        <View style={styles.trustRow}>
          <View style={styles.trustBadge}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.accent} style={{marginBottom: 8}} />
              <Text style={styles.trustText}>Secure{'\n'}Payment</Text>
          </View>
          <View style={styles.trustBadge}>
              <Ionicons name="flash-outline" size={20} color={colors.accent} style={{marginBottom: 8}} />
              <Text style={styles.trustText}>Instant{'\n'}Access</Text>
          </View>
          <View style={styles.trustBadge}>
              <Ionicons name="close-circle-outline" size={20} color={colors.accent} style={{marginBottom: 8}} />
              <Text style={styles.trustText}>Cancel{'\n'}Anytime</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleUpgrade} activeOpacity={0.85}>
          <LinearGradient
            colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.upgradeBtn}
          >
            <Text style={styles.upgradeBtnText}>
              Upgrade Now — {selectedPlan === 'monthly' ? 'GHS 29/mo' : 'GHS 17/mo'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          {selectedPlan === 'annual'
            ? 'Billed annually. You can cancel anytime.'
            : 'Monthly billing. Cancel anytime.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: colors.subtitle,
    fontWeight: '600',
  },

  // Hero
  heroBanner: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
  },
  crownIcon: {
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },

  // Plan selector
  planSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 28,
  },
  planOption: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    alignItems: 'center',
  },
  planOptionActive: {
    borderColor: colors.premiumGradientStart,
    backgroundColor: colors.premiumCardBg,
  },
  planBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  savingsBadge: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  savingsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.subtitle,
    marginBottom: 4,
  },
  planLabelActive: {
    color: colors.premiumText,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.title,
  },
  planPriceActive: {
    color: colors.premiumText,
  },
  planDetail: {
    fontSize: 11,
    color: colors.placeholder,
    marginTop: 2,
  },
  planDetailActive: {
    color: colors.premiumText,
  },

  // Feature comparison
  comparisonSection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 16,
  },
  featureColumn: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  premiumColumn: {
    borderWidth: 1.5,
    borderColor: colors.premiumGradientStart,
  },
  columnHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  freeColumnHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rowBorder,
  },
  premiumColumnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,175,55,0.3)',
  },
  columnHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.title,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.rowBorder,
  },
  featureRowLast: {
    borderBottomWidth: 0,
  },
  featureText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  featureCheck: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.premiumFeatureCheck,
    marginLeft: 8,
  },
  featureCross: {
    color: colors.premiumFeatureCross,
  },
  premiumCheck: {
    color: colors.premiumGradientStart,
  },

  // Unlock section
  unlockSection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  unlockTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 16,
  },
  unlockCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unlockTextBlock: {
    flex: 1,
  },
  unlockCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 4,
  },
  unlockCardDesc: {
    fontSize: 13,
    color: colors.subtitle,
    lineHeight: 18,
  },

  // Trust
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  trustBadge: {
    alignItems: 'center',
  },
  trustText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.subtitle,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Bottom bar
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.rowBorder,
    alignItems: 'center',
  },
  upgradeBtn: {
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: width - 48,
    alignItems: 'center',
    marginBottom: 10,
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.placeholder,
    textAlign: 'center',
  },
});
