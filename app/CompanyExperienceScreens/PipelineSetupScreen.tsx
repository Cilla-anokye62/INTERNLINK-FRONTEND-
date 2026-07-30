import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  getAuthErrorMessage,
  stageApi,
  type ListingResponse,
  type PipelineStageResponse,
  type StageType,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { LockedFeatureOverlay } from '../../src/components/PremiumComponents';
import { useSubscription } from '../../src/context/SubscriptionContext';

const STAGE_TYPES: { label: string; value: StageType }[] = [
  { label: 'Review', value: 'FORM_REVIEW' },
  { label: 'Interview', value: 'INTERVIEW' },
  { label: 'Manager session', value: 'MANAGER_SESSION' },
  { label: 'Custom', value: 'CUSTOM' },
];

export default function PipelineSetupScreen({ navigation, route }: any) {
  const listing = route.params?.listing as ListingResponse | undefined;
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    hasFeature,
    loading: subscriptionLoading,
  } = useSubscription();
  const pipelineEnabled = hasFeature('COMPANY_PIPELINE_WORKFLOW');
  const [stages, setStages] = useState<PipelineStageResponse[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<StageType>('FORM_REVIEW');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadStages = useCallback(async () => {
    if (!listing || !pipelineEnabled) {
      setLoading(false);
      return;
    }
    setError('');
    try {
      setStages(await stageApi.listForListing(listing.id));
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [listing, pipelineEnabled]);

  useEffect(() => {
    void loadStages();
  }, [loadStages]);

  const addStage = async () => {
    if (!listing || !name.trim() || saving) return;
    setSaving(true);
    try {
      const created = await stageApi.createForListing(listing.id, name.trim(), type);
      setStages((current) => [...current, created]);
      setName('');
    } catch (saveError) {
      Alert.alert('Could not add stage', getAuthErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hiring pipeline</Text>
        <View style={{ width: 40 }} />
      </View>

      {subscriptionLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : !pipelineEnabled ? (
        <View style={styles.lockedWrap}>
          <LockedFeatureOverlay
            title="Custom hiring pipelines are Premium"
            message="Upgrade to build multi-stage applicant workflows for reviews, interviews, and manager sessions."
            onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'company-pipeline' })}
          />
        </View>
      ) : (
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
          <Text style={styles.noticeText}>
            Stages apply to students who apply after the pipeline is configured. Stage order follows the order you add them.
          </Text>
        </View>

        <Text style={styles.listingTitle}>{listing?.title || 'Listing unavailable'}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current stages</Text>
          {loading ? (
            <ActivityIndicator color={colors.accent} />
          ) : error ? (
            <TouchableOpacity onPress={() => void loadStages()}>
              <Text style={styles.errorText}>{error} Tap to retry.</Text>
            </TouchableOpacity>
          ) : stages.length === 0 ? (
            <Text style={styles.emptyText}>No stages configured. Applications currently use direct accept/reject.</Text>
          ) : stages
            .slice()
            .sort((a, b) => a.stageOrder - b.stageOrder)
            .map((stage) => (
              <View key={stage.id} style={styles.stageRow}>
                <View style={styles.orderCircle}>
                  <Text style={styles.orderText}>{stage.stageOrder}</Text>
                </View>
                <View>
                  <Text style={styles.stageName}>{stage.name}</Text>
                  <Text style={styles.stageType}>{stage.type.replace('_', ' ')}</Text>
                </View>
              </View>
            ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add stage</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Stage name"
            placeholderTextColor={colors.placeholder}
          />
          <View style={styles.typeGrid}>
            {STAGE_TYPES.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.typeChip, type === option.value && styles.typeChipActive]}
                onPress={() => setType(option.value)}
              >
                <Text style={[styles.typeChipText, type === option.value && styles.typeChipTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.primaryButton, !name.trim() && styles.disabled]}
            disabled={!name.trim() || saving || !listing}
            onPress={() => void addStage()}
          >
            {saving
              ? <ActivityIndicator color={colors.onPrimary} />
              : <Text style={styles.primaryButtonText}>Add stage</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lockedWrap: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.title, fontSize: 17, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 36, gap: 14 },
  notice: { flexDirection: 'row', gap: 9, padding: 13, borderRadius: 12, backgroundColor: colors.iconCircle },
  noticeText: { flex: 1, color: colors.subtitle, fontSize: 12, lineHeight: 18 },
  listingTitle: { color: colors.title, fontSize: 20, fontWeight: '700' },
  section: { padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  sectionTitle: { color: colors.title, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  emptyText: { color: colors.subtitle, fontSize: 13, lineHeight: 19 },
  errorText: { color: colors.withdrawText, fontSize: 12 },
  stageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.inputBorder },
  orderCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  orderText: { color: colors.onPrimary, fontSize: 12, fontWeight: '800' },
  stageName: { color: colors.title, fontSize: 14, fontWeight: '700' },
  stageType: { color: colors.subtitle, fontSize: 11, marginTop: 2 },
  input: { minHeight: 46, borderRadius: 10, borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: colors.inputBg, color: colors.text, paddingHorizontal: 12 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 11 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: colors.inputBorder },
  typeChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  typeChipText: { color: colors.subtitle, fontSize: 12, fontWeight: '600' },
  typeChipTextActive: { color: colors.onPrimary },
  primaryButton: { minHeight: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
  disabled: { opacity: 0.5 },
});
