import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function VerificationScreen({ navigation }: any) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>

      {/* Email icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✉️</Text>
      </View>

      {/* Header */}
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code sent to your email</Text>

      {/* Code inputs */}
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref: any) => inputs.current[index] = ref}
            style={styles.codeInput}
            value={digit}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      {/* Verify button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UniversityInfo')}>
        <Text style={styles.buttonText}>Verify →</Text>
      </TouchableOpacity>

      {/* Resend */}
      <Text style={styles.resendText}>
        Didn't receive the code?{' '}
        <Text style={styles.resendLink}>
          Resend Code ({timer > 0 ? `0:${timer < 10 ? `0${timer}` : timer}` : 'Resend'})
        </Text>
      </Text>

      {/* Back to login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLogin}>← Back to login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9F5F0',
    paddingHorizontal: 24,
    paddingTop: height * 0.03,    // relative instead of fixed 60
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.04,  // relative instead of fixed 32
  },
  backArrow: {
    fontSize: 18,
    color: '#024D60',
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#B2EDE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.03,  // relative instead of fixed 24
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: height * 0.04,  // relative instead of fixed 32
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: height * 0.04,  // relative instead of fixed 32
  },
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#024D60',
    borderWidth: 2,
    borderColor: '#B2EDE8',
  },
  button: {
    backgroundColor: '#2CACAD',
    borderRadius: 30,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: height * 0.025, // relative instead of fixed 20
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: height * 0.025, // relative instead of fixed 20
  },
  resendLink: {
    color: '#2CACAD',
    fontWeight: '600',
  },
  backToLogin: {
    fontSize: 14,
    color: '#024D60',
    fontWeight: '600',
  },
});