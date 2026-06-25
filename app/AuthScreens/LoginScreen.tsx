import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';

const { height } = Dimensions.get('window');

const COLORS = {
  background: '#F5FBFA',
  title: '#0D3B47',
  subtitle: '#4A7C75',
  label: '#0D3B47',
  inputBg: '#FFFFFF',
  inputBorder: '#C5E8E3',
  inputBorderFocus: '#2EC4B6',
  inputText: '#0D3B47',
  placeholder: '#9BB8B4',
  icon: '#9BB8B4',
  buttonBg: '#329891',
  buttonText: '#FFFFFF',
  Password: '#329891',
  dividerLine: '#B2D8D2',
  dividerText: '#7AADA6',
  googleBtn: '#FFFFFF',
  googleBtnBorder: '#C5E8E3',
  googleBtnText: '#0D3B47',
  footerText: '#4A7C75',
  signUpText: '#329891',
};

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = () => {
    console.log('Logging in with:', email, password);
  };

  const handleGoogleLogin = () => {
    console.log('Google login tapped');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
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
              <View style={[
                styles.inputWrapper,
                focusedInput === 'email' && styles.inputWrapperFocused,
              ]}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  placeholder="student@university.edu"
                  placeholderTextColor={COLORS.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'password' && styles.inputWrapperFocused,
              ]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
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
            <Text style={styles.googleG}>G</Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: height * 0.06,   // relative instead of fixed 48
  },
  titleSection: {
    marginBottom: height * 0.04,      // relative instead of fixed 36
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.title,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtitle,
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
    color: COLORS.label,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: COLORS.inputBorderFocus,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    color: COLORS.icon,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.inputText,
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
    backgroundColor: COLORS.buttonBg,
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: height * 0.035,     // relative instead of fixed 28
    shadowColor: COLORS.buttonBg,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.buttonText,
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
    backgroundColor: COLORS.dividerLine,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: COLORS.dividerText,
    fontWeight: '500',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.googleBtn,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.googleBtnBorder,
    paddingVertical: 15,
    marginBottom: height * 0.04,      // relative instead of fixed 32
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  googleG: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.googleBtnText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.footerText,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.signUpText,
  },
});