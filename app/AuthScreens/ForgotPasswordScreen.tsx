import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  return (
    <ImageBackground
      source={require('../../assets/padlock.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        {/* Spacer — pushes content down proportionally */}
        <View style={styles.spacer} />

        {/* Header */}
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send a recovery link.</Text>

        {/* Email input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. jeureena@email.com"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>

        {/* Back to sign in */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backToLogin}>
            Back to <Text style={styles.link}>Sign in</Text>
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
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
  button: {
    backgroundColor: '#2CACAD',
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