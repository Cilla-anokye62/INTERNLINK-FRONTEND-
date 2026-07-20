import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Dimensions, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useState, useMemo } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { isValidEmail } from '../../src/utils/validateCard';

const { height } = Dimensions.get('window');

export default function ForgotPasswordScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const emailError = useMemo(() => isValidEmail(email), [email]);

  const handleSend = () => {
    setTouched(true);
    if (emailError) return;
    setSent(true);
  };

  return (
    <ImageBackground
      source={require('../../assets/padlock.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={insets.top}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>

        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        {/* Spacer — pushes content down proportionally */}
        <View style={styles.spacer} />

        {/* Header */}
        <Text style={[styles.title, { color: colors.title }]}>Reset password</Text>
        <Text style={[styles.subtitle, { color: colors.subtitle }]}>Enter your email and we'll send a recovery link.</Text>

        {/* Email input */}
        <View style={[styles.inputContainer, touched && emailError && styles.inputContainerError]}>
          <Ionicons name="mail-outline" size={18} color={colors.inputIcon || '#94A3B8'} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.input, { color: colors.title }]}
            placeholder="eg. jeureena@email.com"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={() => setTouched(true)}
          />
        </View>
        {touched && emailError && <Text style={styles.errorText}>{emailError}</Text>}

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, sent && styles.buttonSent]}
          onPress={handleSend}
          disabled={sent}
        >
          <Text style={styles.buttonText}>{sent ? 'Link Sent ✓' : 'Send Reset Link'}</Text>
        </TouchableOpacity>

        {/* Back to sign in */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.backToLogin, { color: colors.title }]}>
            Back to <Text style={[styles.link, { color: colors.accent }]}>Sign in</Text>
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.02,      // relative instead of fixed 60
    paddingBottom: height * 0.04,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 180 removed — replaced by spacer below
  },
  backArrow: {
    fontSize: 18,
    color: '#024D60',
    fontWeight: 'bold',
  },
  spacer: {
    flex: 1,                        // pushes title down proportionally on any screen
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#010506',
    marginTop: height * 0.04,       // relative instead of fixed 100
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    color: '#0e3038',
    marginBottom: height * 0.03,    // relative instead of fixed 24
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#024D60',
  },
  inputContainerError: {
    borderColor: '#DC2626',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 16,
  },
  button: {
    backgroundColor: '#2CACAD',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonSent: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLogin: {
    textAlign: 'center',
    fontSize: 14,
    color: '#024D60',
  },
  link: {
    color: '#2CACAD',
    fontWeight: '600',
  },
});