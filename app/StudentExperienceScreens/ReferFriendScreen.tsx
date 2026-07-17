import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const REFERRAL_CODE = 'ALEX2026';

export default function ReferFriendScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [email, setEmail] = useState('');

  const handleShare = async () => {
    try {
        await Share.share({
          message: `Join InternLink and find your perfect internship! Use my referral code ${REFERRAL_CODE}: https://internlink.app`,
        });
    } catch {}
  };

  const handleInvite = () => {
    if (!email.trim()) { Alert.alert('Enter an email', 'Please provide an email address.'); return; }
    Alert.alert('Invite Sent!', `An invitation has been sent to ${email}`, [{ text: 'OK' }]);
    setEmail('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backArrow, { color: colors.title }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Refer a Friend</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: colors.accent }]}>
          <Ionicons name="gift-outline" size={40} color={colors.accent} />
          <Text style={styles.heroTitle}>Invite friends, earn rewards</Text>
          <Text style={styles.heroSubtitle}>Get 3 days of premium free for every friend you refer</Text>
        </View>

        <View style={[styles.codeCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
          <Text style={[styles.codeLabel, { color: colors.subtitle }]}>Your referral code</Text>
          <Text style={[styles.codeValue, { color: colors.accent }]}>{REFERRAL_CODE}</Text>
          <TouchableOpacity style={[styles.copyBtn, { backgroundColor: colors.iconCircle }]}
            onPress={() => { Alert.alert('Copied!', 'Referral code copied to clipboard'); }}>
            <Text style={[styles.copyBtnText, { color: colors.accent }]}>Copy Code</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.title }]}>Share via</Text>
        <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.accent }]} onPress={handleShare}>
          <Text style={[styles.shareBtnText, { color: colors.onPrimary }]}>Share Link</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.title }]}>Or invite by email</Text>
        <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
          <TextInput style={[styles.input, { color: colors.text }]} placeholder="friend@email.com"
            placeholderTextColor={colors.placeholder} value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none" />
          <TouchableOpacity style={[styles.inviteBtn, { backgroundColor: colors.accent }]} onPress={handleInvite}>
            <Text style={[styles.inviteBtnText, { color: colors.onPrimary }]}>Invite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  content: { flex: 1, paddingHorizontal: 20 },
  heroCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 },
  heroIcon: { fontSize: 36, marginBottom: 10 },
  heroTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 6, textAlign: 'center' },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  codeCard: { borderRadius: 16, padding: 20, borderWidth: 1, alignItems: 'center', marginBottom: 24 },
  codeLabel: { fontSize: 13, marginBottom: 6 },
  codeValue: { fontSize: 28, fontWeight: '800', letterSpacing: 4, marginBottom: 12 },
  copyBtn: { borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
  copyBtnText: { fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  shareBtn: { borderRadius: 30, paddingVertical: 14, alignItems: 'center', marginBottom: 24 },
  shareBtnText: { fontSize: 15, fontWeight: '700' },
  inputRow: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14 },
  inviteBtn: { paddingHorizontal: 20, justifyContent: 'center' },
  inviteBtnText: { fontSize: 14, fontWeight: '700' },
});
