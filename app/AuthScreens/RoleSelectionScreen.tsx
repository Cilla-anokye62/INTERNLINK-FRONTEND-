import { useAppTheme } from '../../src/hooks/useAppTheme';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type Role = 'student' | 'employer' | 'university';

interface RoleOption {
  id: Role;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const ROLES: RoleOption[] = [
  {
    id: 'student',
    title: "I'm a Student",
    description: "Looking for internships and opportunities.",
    icon: 'school-outline',
  },
  {
    id: 'employer',
    title: "I'm an Employer",
    description: "Hiring interns and managing programs.",
    icon: 'briefcase-outline',
  },
  {
    id: 'university',
    title: "I'm a University",
    description: "Managing student placements and partner relations.",
    icon: 'library-outline',
  },
];

const { width, height } = Dimensions.get('window');

type Props = StackScreenProps<RootStackParamList, 'RoleSelection'>;

export default function RoleSelectionScreen({ navigation }: Props) {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    navigation.navigate('SignUp', { role: selectedRole });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={styles.screen}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.backArrow} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.pageTitle}>Who are you?</Text>
            <Text style={styles.pageSubtitle}>Select your role to get started.</Text>
          </View>
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
                <Ionicons
                  name={role.icon}
                  size={26}
                  color={isSelected ? colors.iconSelected : colors.iconIdle}
                  style={{ marginRight: 16 }}
                />

                <View style={styles.cardTextBlock}>
                  <Text style={styles.cardTitle}>{role.title}</Text>
                  <Text style={styles.cardDescription}>{role.description}</Text>
                </View>

                <View style={styles.checkmarkSlot}>
                  {isSelected && (
                    <View style={styles.checkmarkBadge}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
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

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.04,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.04,
    marginTop: height * 0.02,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.backButton,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.titleText,
    letterSpacing: 0.2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.subtitleText,
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
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.cardBorderIdle,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  cardSelected: {
    borderColor: colors.cardBorderActive,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.cardTitle,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.cardDescription,
    lineHeight: 19,
  },
  checkmarkSlot: {
    width: 28,
    height: 28,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cardBorderActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.checkmark,
    fontSize: 14,
    fontWeight: '700',
  },
  continueBtn: {
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  continueBtnActive: {
    backgroundColor: colors.buttonActive,
    shadowColor: colors.buttonActive,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  continueBtnInactive: {
    backgroundColor: colors.buttonInactive,
  },
  continueBtnText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  continueBtnTextActive: {
    color: colors.buttonTextActive,
  },
  continueBtnTextInactive: {
    color: colors.buttonTextInact,
  },
});
