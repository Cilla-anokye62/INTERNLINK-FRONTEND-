import { useAppTheme } from '../../src/hooks/useAppTheme';
import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { isValidEmail, nonEmpty } from '../../src/utils/validateCard';

const { height } = Dimensions.get('window');



export default function LoginScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const login = useAppStore((s) => s.login);
  const userRole = useAppStore((s) => s.userRole);
  const scrollRef = useRef<ScrollView>(null);
  const fieldY = useRef<Record<string, number>>({});

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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => ({
    email: isValidEmail(email),
    password: nonEmpty(password, 'Password'),
  }), [email, password]);

  const isFormValid = !errors.email && !errors.password;

  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleLogin = () => {
    setTouched({ email: true, password: true });
    if (!isFormValid) return;
    const role = userRole || 'student';
    login(role);
    const dashboard = role === 'employer' ? 'CompanyTabs' : role === 'university' ? 'UniversityTabs' : 'HomeDashboard';
    navigation.replace(dashboard);
  };

  const handleGoogleLogin = () => {
    console.log('Google login tapped');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Log in to continue your internship search
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'email' && styles.inputWrapperFocused,
                  touched.email && errors.email && styles.inputWrapperError,
                ]}
                onLayout={(e) => { fieldY.current.email = e.nativeEvent.layout.y; }}
              >
                <Ionicons name="mail-outline" size={18} color={colors.inputIcon} style={{ marginRight: 10 }} />
                <TextInput
                  style={[styles.input, { color: colors.inputText }]}
                  placeholder="student@university.edu"
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
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'password' && styles.inputWrapperFocused,
                  touched.password && errors.password && styles.inputWrapperError,
                ]}
                onLayout={(e) => { fieldY.current.password = e.nativeEvent.layout.y; }}
              >
                <Ionicons name="lock-closed-outline" size={18} color={colors.inputIcon} style={{ marginRight: 10 }} />
                <TextInput
                  style={[styles.input, { color: colors.inputText }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  textContentType="password"
                  autoComplete="password"
                  onFocus={() => handleFocus('password')}
                  onBlur={() => { setFocusedInput(null); markTouched('password'); }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={colors.inputIcon} />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Login  →</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Button */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleLogin}
            activeOpacity={0.85}
          >
            <Image source={require('../../assets/google logo.png')} style={styles.googleIcon} />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: height * 0.06,
  },
  titleSection: {
    marginBottom: height * 0.04,      // relative instead of fixed 36
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    marginBottom: height * 0.03,      // relative instead of fixed 24
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.label,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: colors.inputBorderFocus,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    color: colors.icon,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.inputText,
  },
  eyeBtn: {
    padding: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2CACAD',
  },
  loginBtn: {
    backgroundColor: colors.buttonBg,
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: height * 0.035,     // relative instead of fixed 28
    shadowColor: colors.buttonBg,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  loginBtnDisabled: {
    opacity: 0.5,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.buttonText,
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.025,     // relative instead of fixed 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dividerLine,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: colors.dividerText,
    fontWeight: '500',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.googleBtn,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.googleBtnBorder,
    paddingVertical: 15,
    marginBottom: height * 0.04,      // relative instead of fixed 32
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.googleBtnText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.footerText,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.signUpText,
  },
});