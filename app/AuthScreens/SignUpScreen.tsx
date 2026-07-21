import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { isValidName, isValidEmail, isValidPassword, passwordsMatch } from '../../src/utils/validateCard';

const { height } = Dimensions.get('window');

export default function SignUpScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const fieldY = useRef<Record<string, number>>({});
  const setUserName = useAppStore((s) => s.setUserName);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const scrollToField = (fieldName: string) => {
    const y = fieldY.current[fieldName];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 120), animated: true });
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedInput(fieldName);
    setTimeout(() => scrollToField(fieldName), 300);
  };

  const errors = useMemo(() => ({
    fullName: isValidName(fullName),
    email: isValidEmail(email),
    password: isValidPassword(password),
    confirmPassword: passwordsMatch(password, confirmPassword),
  }), [fullName, email, password, confirmPassword]);

  const isFormValid = !errors.fullName && !errors.email && !errors.password && !errors.confirmPassword && agreed;

  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSignUp = () => {
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    if (!isFormValid) return;
    setUserName(fullName.trim());
    navigation.navigate('Verification', { role: route.params?.role });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={insets.top}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.backArrow} />
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Enter your details below to get started.</Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'fullName' && styles.inputContainerFocused,
            touched.fullName && errors.fullName && styles.inputContainerError,
          ]}
          onLayout={(e) => { fieldY.current.fullName = e.nativeEvent.layout.y; }}
        >
          <Ionicons name="person-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.inputText }]}
            placeholder="Enter full name"
            placeholderTextColor={colors.placeholder}
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => handleFocus('fullName')}
            onBlur={() => { setFocusedInput(null); markTouched('fullName'); }}
            autoCapitalize="words"
          />
        </View>
        {touched.fullName && errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'email' && styles.inputContainerFocused,
            touched.email && errors.email && styles.inputContainerError,
          ]}
          onLayout={(e) => { fieldY.current.email = e.nativeEvent.layout.y; }}
        >
          <Ionicons name="mail-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.inputText }]}
            placeholder="Enter email address"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => handleFocus('email')}
            onBlur={() => { setFocusedInput(null); markTouched('email'); }}
          />
        </View>
        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'password' && styles.inputContainerFocused,
            touched.password && errors.password && styles.inputContainerError,
          ]}
          onLayout={(e) => { fieldY.current.password = e.nativeEvent.layout.y; }}
        >
          <Ionicons name="lock-closed-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.inputText }]}
            placeholder="Enter password"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            textContentType="none"
            autoComplete="off"
            onFocus={() => handleFocus('password')}
            onBlur={() => { setFocusedInput(null); markTouched('password'); }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={colors.inputIcon}
            />
          </TouchableOpacity>
        </View>
        {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'confirmPassword' && styles.inputContainerFocused,
            touched.confirmPassword && errors.confirmPassword && styles.inputContainerError,
          ]}
          onLayout={(e) => { fieldY.current.confirmPassword = e.nativeEvent.layout.y; }}
        >
          <Ionicons name="lock-closed-outline" size={18} color={colors.inputIcon} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.inputText }]}
            placeholder="Re-enter password"
            placeholderTextColor={colors.placeholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            textContentType="none"
            autoComplete="off"
            onFocus={() => handleFocus('confirmPassword')}
            onBlur={() => { setFocusedInput(null); markTouched('confirmPassword'); }}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={colors.inputIcon}
            />
          </TouchableOpacity>
        </View>
        {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

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
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={!isFormValid}
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  inputContainerError: {
    borderColor: colors.error,
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
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    backgroundColor: colors.buttonBg,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
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
