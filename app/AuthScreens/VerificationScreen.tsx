import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function VerificationScreen({ navigation,route }: any) { 
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
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
        <Ionicons name="chevron-back" size={24} color={colors.headerTitle} />
      </TouchableOpacity>

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
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding', { role: route.params?.role })}>
        <Text style={styles.buttonText}>Verify →</Text>
      </TouchableOpacity>

      {/* Resend */}
      <Text style={styles.resendText}>
        Didn't receive the code?{' '}
        <Text style={styles.resendLink}>
          Resend Code ({timer > 0 ? `${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60}` : 'Resend'})
        </Text>
      </Text>

      {/* Back to login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLogin}>← Back to login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: height * 0.10,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -height * 0.07,
    marginBottom: height * 0.04,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.headerTitle,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.profileEmail,
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
    backgroundColor: colors.card,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.headerTitle,
    borderWidth: 2,
    borderColor: '#B2EDE8',
  },
  button: {
    backgroundColor: colors.buttonActive,
    borderRadius: 30,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: height * 0.025, // relative instead of fixed 20
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    fontSize: 13,
    color: colors.profileEmail,
    marginBottom: height * 0.025, // relative instead of fixed 20
  },
  resendLink: {
    color: colors.buttonActive,
    fontWeight: '600',
  },
  backToLogin: {
    fontSize: 14,
    color: colors.headerTitle,
    fontWeight: '600',
  },
});