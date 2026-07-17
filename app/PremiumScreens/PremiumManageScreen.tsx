import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';

export default function PremiumManageScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { isPremium, setPremium, applicationsUsed } = useAppStore();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your Premium subscription? You will lose access to premium features at the end of your billing period.',
      [
        { text: 'Keep Premium', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => {
            setPremium(false);
            Alert.alert('Subscription Cancelled', 'Your Premium access has been removed.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleRestorePurchase = () => {
    Alert.alert('Restore', 'Checking for previous purchases...');
  };

  const handleUpgrade = () => {
    navigation.navigate('PremiumPaywall');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBackPress} activeOpacity={0.7}>
          <Ionicons name="arrow-back-outline" size={22} color={colors.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
      </View>

      {isPremium ? (
        <>
          {/* Premium active card */}
          <View style={styles.card}>
            <LinearGradient
              colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumCard}
            >
              <View style={styles.premiumCardHeader}>
                <View style={styles.premiumCardIconCircle}>
                  <Ionicons name="diamond-outline" size={28} color={colors.accent} />
                </View>
                <View>
                  <Text style={styles.premiumCardTitle}>InternLink Premium</Text>
                  <Text style={styles.premiumCardStatus}>Active</Text>
                </View>
              </View>
              <View style={styles.premiumDivider} />
              <View style={styles.premiumCardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Plan</Text>
                  <Text style={styles.detailValue}>Premium Annual</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Price</Text>
                  <Text style={styles.detailValue}>GHS 204/year</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Next renewal</Text>
                  <Text style={styles.detailValue}>Aug 15, 2026</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Applications used</Text>
                  <Text style={styles.detailValue}>{applicationsUsed} (unlimited)</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Features included */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Included in your plan</Text>
            {[
              'Unlimited applications',
              'Deep AI career analysis',
              'Full application tracking',
              'Resume optimization insights',
              'Priority matching algorithm',
            ].map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.dangerBtn}
              onPress={handleCancelSubscription}
              activeOpacity={0.7}
            >
              <Text style={styles.dangerBtnText}>Cancel Subscription</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Free tier card */}
          <View style={styles.card}>
            <View style={styles.freeCard}>
              <View style={styles.freeCardHeader}>
                <Ionicons name="person-outline" size={28} color={colors.subtitle} />
                <View>
                  <Text style={styles.freeCardTitle}>Free Plan</Text>
                  <Text style={styles.freeCardStatus}>Current plan</Text>
                </View>
              </View>
              <View style={styles.freeDivider} />
              <View style={styles.freeCardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Applications</Text>
                  <Text style={styles.detailValue}>{applicationsUsed} / 3 used</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>AI Matching</Text>
                  <Text style={styles.detailValue}>Basic</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tracking</Text>
                  <Text style={styles.detailValue}>Not available</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Upgrade prompt */}
          <View style={styles.upgradePrompt}>
            <Text style={styles.upgradeTitle}>Unlock Premium</Text>
            <Text style={styles.upgradeDesc}>
              Get unlimited applications, deep AI analysis, and full tracking to maximize your internship search.
            </Text>
            <TouchableOpacity onPress={handleUpgrade} activeOpacity={0.85}>
              <LinearGradient
                colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.upgradeBtn}
              >
                <Text style={styles.upgradeBtnText}>View Plans</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Restore */}
          <TouchableOpacity style={styles.restoreBtn} onPress={handleRestorePurchase} activeOpacity={0.7}>
            <Text style={styles.restoreBtnText}>Restore Purchase</Text>
          </TouchableOpacity>
        </>
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
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 16,
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

  // Cards
  card: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  premiumCard: {
    borderRadius: 20,
    padding: 20,
  },
  premiumCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  premiumCardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  premiumCardStatus: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  premiumDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  premiumCardDetails: {
    gap: 10,
  },
  freeCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  freeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  freeCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.title,
  },
  freeCardStatus: {
    fontSize: 13,
    color: colors.subtitle,
    fontWeight: '600',
  },
  freeDivider: {
    height: 1,
    backgroundColor: colors.rowBorder,
    marginBottom: 16,
  },
  freeCardDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Section
  section: {
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.subtitle,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  featureCheck: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.premiumGradientStart,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },

  // Actions
  actionsSection: {
    paddingHorizontal: 18,
    marginTop: 8,
  },
  dangerBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  dangerBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.danger,
  },

  // Upgrade prompt
  upgradePrompt: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.title,
    marginBottom: 8,
  },
  upgradeDesc: {
    fontSize: 14,
    color: colors.subtitle,
    lineHeight: 20,
    marginBottom: 20,
  },
  upgradeBtn: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  restoreBtnText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
});
