import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Enter your details below to get started.</Text>

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>👤</Text>
        <TextInput
          style={styles.input}
          placeholder="Jane Doe"
          placeholderTextColor="#94A3B8"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>✉️</Text>
        <TextInput
          style={styles.input}
          placeholder="jane.doe@email.com"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>🔒</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#94A3B8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.inputIcon}>{showPassword ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>🔒</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#94A3B8"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Text style={styles.inputIcon}>{showConfirmPassword ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

      {/* Tooltip */}
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>🛡️ We'll send a verification code to confirm your email.</Text>
      </View>

      {/* Checkbox */}
      <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreed(!agreed)}>
        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
          {agreed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxText}>
          I agree to the{' '}
          <Text style={styles.link}>Terms and Conditions</Text>
          {' '}and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      </TouchableOpacity>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Verification')}>
        <Text style={styles.buttonText}>Create Account →</Text>
      </TouchableOpacity>

      {/* Login link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.link}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FAFA',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  backArrow: {
    fontSize: 18,
    color: '#024D60',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#024D60',
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF9F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 52,
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
  tooltip: {
    backgroundColor: '#B2EDE8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  tooltipText: {
    fontSize: 13,
    color: '#024D60',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2CACAD',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2CACAD',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: '#024D60',
    lineHeight: 20,
  },
  link: {
    color: '#2CACAD',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#D9F5F0',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748B',
  },
});