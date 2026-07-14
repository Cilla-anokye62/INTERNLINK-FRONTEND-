import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { height } = Dimensions.get('window');

export default function SignUpScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.backArrow} />
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Enter your details below to get started.</Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <View style={[
          styles.inputContainer,
          focusedInput === 'fullName' && styles.inputContainerFocused,
        ]}>
          <Ionicons name="person-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Jane Doe"
            placeholderTextColor={colors.placeholder}
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => setFocusedInput('fullName')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <View style={[
          styles.inputContainer,
          focusedInput === 'email' && styles.inputContainerFocused,
        ]}>
          <Ionicons name="mail-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="jane.doe@email.com"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={[
          styles.inputContainer,
          focusedInput === 'password' && styles.inputContainerFocused,
        ]}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.inputIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={[
          styles.inputContainer,
          focusedInput === 'confirmPassword' && styles.inputContainerFocused,
        ]}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.placeholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            onFocus={() => setFocusedInput('confirmPassword')}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.inputIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Tooltip */}
        <View style={styles.tooltip}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.accent} style={{ marginRight: 8 }} />
          <Text style={styles.tooltipText}>We'll send a verification code to confirm your email.</Text>
        </View>

        {/* Checkbox */}
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreed(!agreed)}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={14} color={colors.onPrimary} />}
          </View>
          <Text style={styles.checkboxText}>
            I agree to the{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('TermsOfService')}>Terms and Conditions</Text>
            {' '}and{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('PrivacyPolicy')}>Privacy Policy</Text>.
          </Text>
        </TouchableOpacity>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Verification', { role: route.params?.role })}
        >
          <Text style={styles.buttonText}>Create Account →</Text>
        </TouchableOpacity>

        {/* Login link */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.link}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.05,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backButton,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.03,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: height * 0.03,
  },
  label: {
    fontSize: 14,
    color: colors.label,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: colors.inputBorderFocus,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.inputText,
  },
  tooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoBoxBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: height * 0.025,
  },
  tooltipText: {
    flex: 1,
    fontSize: 13,
    color: colors.infoBoxText,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height * 0.03,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.accent,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: colors.label,
    lineHeight: 20,
  },
  link: {
    color: colors.accent,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.buttonBg,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.footerText,
  },
});
