/**
 * LoginScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Login Screen
 * 
 * Design: Full mint/teal background, no white card, no logo.
 * Fields: Email + Password (with show/hide toggle)
 * Actions: Login button, Google button, Forgot Password, Sign Up link
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import LoginScreen from './app/LoginScreen';
 *     <Stack.Screen name="Login" component={LoginScreen} />
 *  3. No extra packages needed — works out of the box
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView, // pushes the screen up when keyboard opens
  Platform,             // detects iOS vs Android for keyboard behaviour
  ScrollView,           // allows scrolling if keyboard covers content
} from 'react-native';


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background: '#D9F2EE', // mint — full screen background
  title: '#0D3B47', // dark teal — "Welcome Back"
  subtitle: '#4A7C75', // muted teal — subtitle text
  label: '#0D3B47', // input field labels
  inputBg: '#FFFFFF', // white input boxes
  inputBorder: '#C5E8E3', // light teal border on inputs
  inputBorderFocus: '#2EC4B6', // bright teal when input is active
  inputText: '#0D3B47', // text the user types
  placeholder: '#9BB8B4', // placeholder text inside inputs
  icon: '#9BB8B4', // icons inside input fields
  buttonBg: '#329891', // Login button background
  buttonText: '#FFFFFF', // Login button text
  Password: '#329891', // "Forgot Password?" link
  dividerLine: '#B2D8D2', // the lines around "OR"
  dividerText: '#7AADA6', // "OR" text
  googleBtn: '#FFFFFF', // Google button background
  googleBtnBorder: '#C5E8E3', // Google button border
  googleBtnText: '#0D3B47', // Google button text
  footerText: '#4A7C75', // "Don't have an account?"
  signUpText: '#329891', // "Sign Up" link
};


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function LoginScreen({ navigation }: any) {

  // Track what the user types into each field
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Controls whether the password is visible or hidden (dots)
  const [showPassword, setShowPassword] = useState(false);

  // Track which input is focused so we can highlight its border
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Called when user taps the Login button
  const handleLogin = () => {
    console.log('Logging in with:', email, password);
    // TODO: call your auth API here, then navigate on success:
    // navigation.navigate('Home');
  };

  // Called when user taps "Continue with Google"
  const handleGoogleLogin = () => {
    console.log('Google login tapped');
    // TODO: integrate Google OAuth here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/*
        KeyboardAvoidingView slides the content up when the keyboard opens
        so the input fields are never hidden behind it.
        behavior differs between iOS and Android — Platform.OS handles that.
      */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ScrollView allows the user to scroll if content is taller than screen */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // tapping outside keyboard dismisses it
          showsVerticalScrollIndicator={false}
        >

          {/* ── TITLE SECTION ───────────────────────────────── */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Log in to continue your internship search
            </Text>
          </View>
          {/* ── END TITLE ───────────────────────────────────── */}


          {/* ── FORM SECTION ────────────────────────────────── */}
          <View style={styles.form}>

            {/* ── Email Field ─────────────────────────────── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[
                styles.inputWrapper,
                // Highlight border when this field is focused
                focusedInput === 'email' && styles.inputWrapperFocused,
              ]}>
                {/* Email icon placeholder — swap for <Ionicons name="mail-outline" /> */}
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  placeholder="student@university.edu"
                  placeholderTextColor={COLORS.placeholder}
                  value={email}
                  onChangeText={setEmail}       // updates email state as user types
                  keyboardType="email-address"  // shows @ on keyboard
                  autoCapitalize="none"         // no auto-capitalisation for emails
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* ── Password Field ──────────────────────────── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'password' && styles.inputWrapperFocused,
              ]}>
                {/* Lock icon placeholder */}
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  // secureTextEntry hides the text when showPassword is false
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                {/* Eye icon — toggles password visibility */}
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {/* TODO: replace with <Ionicons name={showPassword ? "eye-off" : "eye"} /> */}
                  <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Forgot Password link ────────────────────── */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => console.log('Forgot password tapped')}
            // TODO: navigation.navigate('ForgotPassword')
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

          </View>
          {/* ── END FORM ────────────────────────────────────── */}


          {/* ── LOGIN BUTTON ────────────────────────────────── */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Login  →</Text>
          </TouchableOpacity>
          {/* ── END LOGIN BUTTON ────────────────────────────── */}


          {/* ── DIVIDER: "OR" ───────────────────────────────── */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          {/* ── END DIVIDER ─────────────────────────────────── */}


          {/* ── GOOGLE BUTTON ───────────────────────────────── */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleLogin}
            activeOpacity={0.85}
          >
            {/*
              Google "G" logo — using a coloured text placeholder.
              TODO: replace with an actual Google logo image:
              <Image source={require('../assets/google-logo.png')} style={{ width: 20, height: 20 }} />
            */}
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>
          {/* ── END GOOGLE BUTTON ───────────────────────────── */}


          {/* ── FOOTER: Sign Up link ────────────────────────── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
            // TODO: navigation.navigate('SignUp')
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          {/* ── END FOOTER ──────────────────────────────────── */}


        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // Utility
  flex: {
    flex: 1,
  },

  // Outermost container — full mint background
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ScrollView inner content — centred vertically with padding
  scrollContent: {
    flexGrow: 1,                  // allows vertical centering even with little content
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
  },

  // ── Title section ─────────────────────────────────────────────
  titleSection: {
    marginBottom: 36,
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

  // ── Form ──────────────────────────────────────────────────────
  form: {
    marginBottom: 24,
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

  // The row that holds the icon + TextInput (+ eye button for password)
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
  // Override border color when focused
  inputWrapperFocused: {
    borderColor: COLORS.inputBorderFocus,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    color: COLORS.icon,
  },
  // The actual text input — flex: 1 fills remaining space in the row
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.inputText,
  },
  eyeBtn: {
    padding: 4, // larger tap target
  },

  // ── Forgot password ───────────────────────────────────────────
  forgotBtn: {
    alignSelf: 'flex-end', // push to the right side
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2CACAD',
  },

  // ── Login button ──────────────────────────────────────────────
  loginBtn: {
    backgroundColor: COLORS.buttonBg,
    borderRadius: 50,              // pill shape
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 28,
    // Teal glow shadow
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

  // ── OR divider ────────────────────────────────────────────────
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,                       // each line takes equal space beside "OR"
    height: 1,
    backgroundColor: COLORS.dividerLine,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: COLORS.dividerText,
    fontWeight: '500',
  },

  // ── Google button ─────────────────────────────────────────────
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.googleBtn,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.googleBtnBorder,
    paddingVertical: 15,
    marginBottom: 32,
    // Subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  // Coloured "G" placeholder for the Google logo
  googleG: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',              // Google blue
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.googleBtnText,
  },

  // ── Footer ────────────────────────────────────────────────────
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