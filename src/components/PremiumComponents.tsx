import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../hooks/useAppTheme';
import { useSubscription } from '../context/SubscriptionContext';
import type {
  EntitlementResponse,
  PremiumFeature,
  SubscriptionPlanResponse,
  SubscriptionSnapshotResponse,
} from '../api/types';

export function PremiumBadge({ label = 'PREMIUM' }: { label?: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.badge, { backgroundColor: colors.premiumBadgeBg }]}>
      <Ionicons name="sparkles" size={12} color={colors.premiumBadgeText} />
      <Text style={[styles.badgeText, { color: colors.premiumBadgeText }]}>{label}</Text>
    </View>
  );
}

export function ApplicationLimitIndicator({
  entitlement,
  onUpgrade,
  title = 'Applications used',
  unlimitedTitle = 'Premium Active',
  unlimitedValue = 'Unlimited Applications',
}: {
  entitlement: EntitlementResponse | null;
  onUpgrade?: () => void;
  title?: string;
  unlimitedTitle?: string;
  unlimitedValue?: string;
}) {
  const { colors } = useAppTheme();
  if (!entitlement) return null;
  const unlimited = entitlement.limit == null;
  return (
    <TouchableOpacity
      disabled={!onUpgrade || unlimited}
      onPress={onUpgrade}
      activeOpacity={0.85}
      style={[
        styles.limitCard,
        {
          backgroundColor: unlimited ? colors.premiumBannerBg : colors.card,
          borderColor: unlimited ? colors.premiumBannerBorder : colors.cardBorder,
        },
      ]}
      accessibilityRole={onUpgrade && !unlimited ? 'button' : undefined}
      accessibilityLabel={
        unlimited
          ? `${unlimitedTitle}, ${unlimitedValue}`
          : `${entitlement.used} of ${entitlement.limit} ${title.toLowerCase()}`
      }
    >
      <View style={styles.limitCopy}>
        <Text style={[styles.limitTitle, { color: colors.title }]}>
          {unlimited ? unlimitedTitle : title}
        </Text>
        <Text style={[styles.limitValue, { color: unlimited ? colors.premiumText : colors.primary }]}>
          {unlimited ? unlimitedValue : `${entitlement.used} / ${entitlement.limit}`}
        </Text>
      </View>
      {unlimited ? (
        <PremiumBadge label="ACTIVE" />
      ) : onUpgrade ? (
        <Ionicons name="chevron-forward" size={20} color={colors.icon} />
      ) : null}
    </TouchableOpacity>
  );
}

export function SubscriptionStatusCard({
  snapshot,
  onPress,
}: {
  snapshot: SubscriptionSnapshotResponse | null;
  onPress?: () => void;
}) {
  const { colors } = useAppTheme();
  if (!snapshot) return null;
  return (
    <TouchableOpacity
      style={[styles.statusCard, {
        backgroundColor: snapshot.premiumActive ? colors.premiumCardBg : colors.card,
        borderColor: snapshot.premiumActive ? colors.premiumBannerBorder : colors.cardBorder,
      }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.statusIcon, { backgroundColor: colors.premiumBadgeBg }]}>
        <Ionicons
          name={snapshot.premiumActive ? 'diamond' : 'sparkles-outline'}
          size={20}
          color={colors.premiumBadgeText}
        />
      </View>
      <View style={styles.statusCopy}>
        <Text style={[styles.statusTitle, { color: colors.title }]}>
          {snapshot.plan.displayName}
        </Text>
        <Text style={[styles.statusSubtitle, { color: colors.subtitle }]}>
          {snapshot.premiumActive
            ? snapshot.cancelAtPeriodEnd
              ? 'Active until the end of your billing period'
              : 'Premium benefits are active'
            : 'Upgrade to unlock more features'}
        </Text>
      </View>
      {snapshot.premiumActive ? <PremiumBadge label={snapshot.status} /> : (
        <Ionicons name="chevron-forward" size={20} color={colors.icon} />
      )}
    </TouchableOpacity>
  );
}

export function FeatureComparisonCard({
  plan,
  selected,
  onPress,
  priceLabel,
}: {
  plan: SubscriptionPlanResponse;
  selected: boolean;
  onPress: () => void;
  priceLabel?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[
        styles.planCard,
        {
          backgroundColor: colors.card,
          borderColor: selected ? colors.premiumGradientStart : colors.cardBorder,
        },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={styles.planHeader}>
        <View style={styles.planNameWrap}>
          <Text style={[styles.planName, { color: colors.title }]}>{plan.displayName}</Text>
          {plan.billingInterval !== 'NONE' ? <PremiumBadge /> : null}
        </View>
        <View style={[styles.radio, { borderColor: selected ? colors.premiumText : colors.icon }]}>
          {selected ? <View style={[styles.radioDot, { backgroundColor: colors.premiumText }]} /> : null}
        </View>
      </View>
      {plan.description ? (
        <Text style={[styles.planDescription, { color: colors.subtitle }]}>{plan.description}</Text>
      ) : null}
      <Text style={[styles.planPrice, { color: colors.title }]}>
        {priceLabel ?? (plan.priceMinor == null
          ? 'Price not configured'
          : plan.priceMinor === 0
            ? 'Free'
            : `${plan.currency ?? ''} ${(plan.priceMinor / 100).toFixed(2)}`)}
      </Text>
      <View style={styles.featureList}>
        {plan.entitlements.filter((feature) => feature.enabled).map((feature) => (
          <View key={feature.featureKey} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.premiumFeatureCheck} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              {featureLabel(feature)}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export function LockedFeatureOverlay({
  title,
  message,
  onUpgrade,
}: {
  title: string;
  message: string;
  onUpgrade: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.lockedCard, { backgroundColor: colors.premiumCardBg }]}>
      <View style={[styles.lockIcon, { backgroundColor: colors.premiumBadgeBg }]}>
        <Ionicons name="lock-closed" size={24} color={colors.premiumBadgeText} />
      </View>
      <Text style={[styles.lockTitle, { color: colors.title }]}>{title}</Text>
      <Text style={[styles.lockMessage, { color: colors.subtitle }]}>{message}</Text>
      <TouchableOpacity
        style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
        onPress={onUpgrade}
        accessibilityRole="button"
      >
        <Ionicons name="sparkles" size={17} color={colors.onPrimary} />
        <Text style={[styles.upgradeButtonText, { color: colors.onPrimary }]}>View Premium</Text>
      </TouchableOpacity>
    </View>
  );
}

export function EntitlementGate({
  feature,
  children,
  fallback,
}: React.PropsWithChildren<{
  feature: PremiumFeature;
  fallback: React.ReactNode;
}>) {
  const { hasFeature, loading } = useSubscription();
  if (loading) return <ActivityIndicator />;
  return hasFeature(feature) ? <>{children}</> : <>{fallback}</>;
}

export function UpgradeModal({
  visible,
  title,
  message,
  onClose,
  onUpgrade,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onUpgrade: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable
          style={[styles.modalCard, { backgroundColor: colors.card }]}
          onPress={(event) => event.stopPropagation()}
        >
          <LinearGradient
            colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
            style={styles.modalIcon}
          >
            <Ionicons name="diamond" size={28} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.modalTitle, { color: colors.title }]}>{title}</Text>
          <Text style={[styles.modalMessage, { color: colors.subtitle }]}>{message}</Text>
          <TouchableOpacity
            style={[styles.modalPrimary, { backgroundColor: colors.primary }]}
            onPress={onUpgrade}
          >
            <Text style={[styles.modalPrimaryText, { color: colors.onPrimary }]}>Explore Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalSecondary} onPress={onClose}>
            <Text style={[styles.modalSecondaryText, { color: colors.subtitle }]}>Not now</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const featureLabel = (feature: EntitlementResponse) => {
  const label = feature.featureKey
    .replace(/^(STUDENT|COMPANY|UNIVERSITY)_/, '')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (value) => value.toUpperCase());
  return feature.limit == null ? label : `${label}: ${feature.limit}`;
};

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  limitCard: { minHeight: 72, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', gap: 12 },
  limitCopy: { flex: 1 },
  limitTitle: { fontSize: 12, fontWeight: '600', marginBottom: 3 },
  limitValue: { fontSize: 16, fontWeight: '800' },
  statusCard: { borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  statusCopy: { flex: 1 },
  statusTitle: { fontSize: 15, fontWeight: '800', marginBottom: 3 },
  statusSubtitle: { fontSize: 12, lineHeight: 17 },
  planCard: { borderWidth: 2, borderRadius: 20, padding: 18 },
  planHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  planNameWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  planName: { fontSize: 18, fontWeight: '800' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
  planDescription: { fontSize: 13, lineHeight: 19, marginTop: 10 },
  planPrice: { fontSize: 15, fontWeight: '700', marginTop: 12 },
  featureList: { marginTop: 14, gap: 9 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { flex: 1, fontSize: 13 },
  lockedCard: { borderRadius: 20, padding: 22, alignItems: 'center' },
  lockIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  lockTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  lockMessage: { fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 7, marginBottom: 17 },
  upgradeButton: { minHeight: 46, borderRadius: 23, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  upgradeButtonText: { fontSize: 14, fontWeight: '800' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 24 },
  modalCard: { borderRadius: 24, padding: 24, alignItems: 'center' },
  modalIcon: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 21, fontWeight: '800', textAlign: 'center' },
  modalMessage: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  modalPrimary: { minHeight: 48, alignSelf: 'stretch', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  modalPrimaryText: { fontSize: 15, fontWeight: '800' },
  modalSecondary: { minHeight: 42, alignItems: 'center', justifyContent: 'center' },
  modalSecondaryText: { fontSize: 14, fontWeight: '600' },
});
