import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { height } = Dimensions.get('window');

export default function ApplicationSubmittedScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const company = route.params?.company || 'Company';
  const title = route.params?.title || 'Internship';
  const applicationId = route.params?.applicationId || 'INT-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleTrack = () => {
    navigation.navigate('MyApplications');
  };

  const handleBrowse = () => {
    navigation.navigate('HomeDashboard');
  };

  const handleHome = () => {
    navigation.navigate('HomeDashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={[styles.backArrow, { color: colors.title }]}>←</Text>
      </TouchableOpacity>

      <View style={styles.centerContent}>
        {/* Animated checkmark */}
        <Animated.View style={[styles.checkOuter, { backgroundColor: colors.successAnimBg, transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.checkInner, { backgroundColor: colors.accent }]}>
            <Text style={[styles.checkMark, { color: colors.onPrimary }]}>✓</Text>
          </View>
        </Animated.View>

        {/* Info */}
        <Animated.View style={[styles.infoContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={[styles.title, { color: colors.title }]}>Application Submitted!</Text>
          <Text style={[styles.subtitle, { color: colors.subtitle }]}>
            Your application has been sent to {company}. You'll be notified when the status changes.
          </Text>

          {/* Details card */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={[styles.cardLogo, { backgroundColor: colors.iconCircle }]}>
              <Text style={[styles.cardLogoText, { color: colors.accent }]}>{company[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.title }]}>{title}</Text>
              <Text style={[styles.cardCompany, { color: colors.subtitle }]}>{company}</Text>
            </View>
          </View>

          {/* Meta info */}
          <View style={[styles.metaCard, { backgroundColor: colors.card }]}>
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.placeholder }]}>Application ID</Text>
              <Text style={[styles.metaValue, { color: colors.title }]}>{applicationId}</Text>
            </View>
            <View style={[styles.metaDivider, { backgroundColor: colors.rowBorder }]} />
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.placeholder }]}>Submitted</Text>
              <Text style={[styles.metaValue, { color: colors.title }]}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={[styles.metaDivider, { backgroundColor: colors.rowBorder }]} />
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.placeholder }]}>Est. Review Time</Text>
              <Text style={[styles.metaValue, { color: colors.title }]}>5-7 business days</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Buttons */}
      <Animated.View style={[styles.bottomBar, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={[styles.trackBtn, { backgroundColor: colors.accent }]}
          onPress={handleTrack}
          activeOpacity={0.85}
        >
          <Text style={[styles.trackBtnText, { color: colors.onPrimary }]}>Track Application</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.browseBtn, { borderColor: colors.inputBorder }]}
          onPress={handleBrowse}
          activeOpacity={0.85}
        >
          <Text style={[styles.browseBtnText, { color: colors.title }]}>Continue Browsing</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHome}>
          <Text style={[styles.homeLink, { color: colors.accent }]}>Go Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center', marginTop: height * 0.02,
  },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  checkOuter: {
    width: 110, height: 110, borderRadius: 55, alignItems: 'center',
    justifyContent: 'center', marginBottom: 28,
  },
  checkInner: {
    width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { fontSize: 36, fontWeight: 'bold' },
  infoContainer: { alignItems: 'center', width: '100%' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24, paddingHorizontal: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16,
    width: '100%', marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardLogo: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardLogoText: { fontSize: 18, fontWeight: 'bold' },
  cardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  cardCompany: { fontSize: 12 },
  metaCard: {
    borderRadius: 16, padding: 16, width: '100%',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  metaLabel: { fontSize: 13 },
  metaValue: { fontSize: 13, fontWeight: '600' },
  metaDivider: { height: 1 },
  bottomBar: { paddingBottom: height * 0.04, gap: 12 },
  trackBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  trackBtnText: { fontSize: 16, fontWeight: 'bold' },
  browseBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5 },
  browseBtnText: { fontSize: 16, fontWeight: 'bold' },
  homeLink: { fontSize: 15, fontWeight: '600', textAlign: 'center', marginTop: 4 },
});
