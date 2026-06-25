import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

type Role = 'student' | 'employer' | 'university';

interface RoleOption {
  id: Role;
  title: string;
  description: string;
  icon: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'student',
    title: "I'm a Student",
    description: "I'm looking for internships and opportunities.",
    icon: '🎓',
  },
  {
    id: 'employer',
    title: "I'm an Employer",
    description: "I'm hiring interns and managing programs.",
    icon: '🏢',
  },
  {
    id: 'university',
    title: "I'm a University",
    description: "I'm managing student placements and partner relations.",
    icon: '🏛️',
  },
];

const COLORS = {
  background: '#F5FBFA',
  card: '#FFFFFF',
  cardBorderIdle: 'transparent',
  cardBorderActive: '#329891',
  iconCircle: 'rgba(46,196,182,0.18)',
  iconCircleActive: '#2EC4B6',
  titleText: '#0D3B47',
  subtitleText: '#4A7C75',
  cardTitle: '#0D3B47',
  cardDescription: '#4A7C75',
  checkmark: '#FFFFFF',
  buttonActive: '#329891',
  buttonInactive: 'rgba(13,59,71,0.20)',
  buttonTextActive: '#FFFFFF',
  buttonTextInact: '#6B9E99',
  backButton: '#FFFFFF',
  backArrow: '#0D3B47',
};

const { width, height } = Dimensions.get('window');

export default function RoleSelectionScreen({ navigation }: any) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

 const handleContinue = () => {
  if (!selectedRole) return;
  navigation.navigate('SignUp', { role: selectedRole });
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.screen}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}  // ← was missing
          >
            <Text style={styles.backArrowText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.pageTitle}>Who are you?</Text>
            <Text style={styles.pageSubtitle}>Select your role to get started.</Text>
          </View>

          <View style={styles.backBtn} />
        </View>

        {/* Role Cards */}
        <View style={styles.cardsWrapper}>
          {ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedRole(role.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                  <Text style={styles.iconEmoji}>{role.icon}</Text>
                </View>

                <View style={styles.cardTextBlock}>
                  <Text style={styles.cardTitle}>{role.title}</Text>
                  <Text style={styles.cardDescription}>{role.description}</Text>
                </View>

                {isSelected && (
                  <View style={styles.checkmarkBadge}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueBtn,
            selectedRole ? styles.continueBtnActive : styles.continueBtnInactive,
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
          activeOpacity={0.85}
        >
          <Text style={[
            styles.continueBtnText,
            selectedRole ? styles.continueBtnTextActive : styles.continueBtnTextInactive,
          ]}>
            Continue
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.02,      // relative instead of fixed 20
    paddingBottom: height * 0.04,   // relative instead of fixed 36
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.04,    // relative instead of fixed 36
    marginTop: height * 0.02,       // relative instead of fixed 36
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.backButton,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backArrowText: {
    fontSize: 28,
    color: COLORS.backArrow,
    lineHeight: 32,
    marginRight: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.titleText,
    letterSpacing: 0.2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.subtitleText,
    marginTop: 3,
  },
  cardsWrapper: {
    flex: 1,
    justifyContent: 'center',
    gap: 25,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.cardBorderIdle,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  cardSelected: {
    borderColor: COLORS.cardBorderActive,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconCircleSelected: {
    backgroundColor: COLORS.iconCircleActive,
  },
  iconEmoji: {
    fontSize: 22,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cardTitle,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.cardDescription,
    lineHeight: 19,
  },
  checkmarkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.cardBorderActive,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    color: COLORS.checkmark,
    fontSize: 14,
    fontWeight: '700',
  },
  continueBtn: {
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: height * 0.02,       // relative instead of fixed 20
  },
  continueBtnActive: {
    backgroundColor: COLORS.buttonActive,
    shadowColor: COLORS.buttonActive,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  continueBtnInactive: {
    backgroundColor: COLORS.buttonInactive,
  },
  continueBtnText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  continueBtnTextActive: {
    color: COLORS.buttonTextActive,
  },
  continueBtnTextInactive: {
    color: COLORS.buttonTextInact,
  },
});