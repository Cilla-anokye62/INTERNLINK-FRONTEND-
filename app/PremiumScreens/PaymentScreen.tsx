import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import {
  stripDigits,
  detectCardType,
  isValidCardNumber,
  isValidExpiry,
  isValidCVV,
  isValidCardholderName,
  isValidMomoNumber,
  type CardErrors,
  type CardType,
} from '../../src/utils/validateCard';

const { width } = Dimensions.get('window');

type PaymentMethod = 'card' | 'momo';

const CARD_LOGOS: Record<CardType, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  discover: 'DISC',
  unknown: '',
};

export default function PaymentScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const setPremium = useAppStore((state) => state.setPremium);

  const selectedPlan = route.params?.plan || 'annual';
  const price = selectedPlan === 'monthly' ? 'GHS 29/mo' : 'GHS 17/mo';

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const raw = useMemo(() => stripDigits(cardNumber), [cardNumber]);
  const detectedType = useMemo(() => detectCardType(raw), [raw]);
  const logoText = CARD_LOGOS[detectedType];

  const errors: CardErrors = useMemo(() => ({
    cardNumber: isValidCardNumber(cardNumber),
    expiry: isValidExpiry(cardExpiry),
    cvv: isValidCVV(cardCvv, detectedType),
    cardholderName: isValidCardholderName(cardholderName),
  }), [cardNumber, cardExpiry, cardCvv, cardholderName, detectedType]);

  const momoError = useMemo(() => isValidMomoNumber(momoNumber), [momoNumber]);

  const isCardFormValid = !errors.cardNumber && !errors.expiry && !errors.cvv && !errors.cardholderName;
  const isMomoFormValid = !momoError;
  const isFormValid = paymentMethod === 'card' ? isCardFormValid : isMomoFormValid;

  const markTouched = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handlePay = () => {
    // Mark all fields as touched to show errors
    if (paymentMethod === 'card') {
      setTouched({ cardNumber: true, expiry: true, cvv: true, cardholderName: true });
      if (!isCardFormValid) return;
    } else {
      setTouched({ momoNumber: true });
      if (!isMomoFormValid) return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPremium(true);
      navigation.replace('PremiumConfirmation');
    }, 1500);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 19);
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(cleaned.slice(0, 2) + '/' + cleaned.slice(2));
    } else {
      setCardExpiry(cleaned);
    }
  };

  const FieldError = ({ field }: { field: string }) => {
    if (!touched[field]) return null;
    const msg = paymentMethod === 'card' ? (errors as any)[field] : momoError;
    if (!msg) return null;
    return <Text style={styles.errorText}>{msg}</Text>;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={colors.title} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Payment</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Order summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plan</Text>
            <Text style={styles.summaryValue}>Premium {selectedPlan === 'monthly' ? 'Monthly' : 'Annual'}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryPrice}>{price}</Text>
          </View>
        </View>

        {/* Payment method selector */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[styles.methodCard, paymentMethod === 'card' && styles.methodCardActive]}
            onPress={() => { setPaymentMethod('card'); setTouched({}); }}
            activeOpacity={0.7}
          >
            <Ionicons name="card-outline" size={22} color={paymentMethod === 'card' ? colors.onPrimary : colors.subtitle} />
            <Text style={[styles.methodLabel, paymentMethod === 'card' && styles.methodLabelActive]}>Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodCard, paymentMethod === 'momo' && styles.methodCardActive]}
            onPress={() => { setPaymentMethod('momo'); setTouched({}); }}
            activeOpacity={0.7}
          >
            <Ionicons name="phone-portrait-outline" size={22} color={paymentMethod === 'momo' ? colors.onPrimary : colors.subtitle} />
            <Text style={[styles.methodLabel, paymentMethod === 'momo' && styles.methodLabelActive]}>Mobile Money</Text>
          </TouchableOpacity>
        </View>

        {/* Card form */}
        {paymentMethod === 'card' && (
          <View style={styles.formSection}>
            {/* Cardholder Name */}
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={[styles.inputRow, touched.cardholderName && errors.cardholderName && styles.inputRowError]}>
              <Ionicons name="person-outline" size={18} color={colors.placeholder} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Jane Doe"
                placeholderTextColor={colors.placeholder}
                value={cardholderName}
                onChangeText={setCardholderName}
                onBlur={() => markTouched('cardholderName')}
                autoCapitalize="words"
              />
            </View>
            <FieldError field="cardholderName" />

            {/* Card Number */}
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={[styles.inputRow, touched.cardNumber && errors.cardNumber && styles.inputRowError]}>
              <Ionicons name="card-outline" size={18} color={colors.placeholder} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={formatCardNumber}
                onBlur={() => markTouched('cardNumber')}
                maxLength={23}
              />
              {logoText ? <Text style={[styles.cardLogo, { color: colors.subtitle }]}>{logoText}</Text> : null}
            </View>
            <FieldError field="cardNumber" />

            {/* Expiry + CVV */}
            <View style={styles.halfRow}>
              <View style={styles.halfField}>
                <Text style={styles.inputLabel}>Expiry</Text>
                <View style={[styles.textInput, styles.textInputInline, touched.expiry && errors.expiry && styles.inputRowError]}>
                  <TextInput
                    style={styles.textInputInner}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="numeric"
                    value={cardExpiry}
                    onChangeText={formatExpiry}
                    onBlur={() => markTouched('expiry')}
                    maxLength={5}
                  />
                </View>
                <FieldError field="expiry" />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={[styles.textInput, styles.textInputInline, touched.cvv && errors.cvv && styles.inputRowError]}>
                  <TextInput
                    style={styles.textInputInner}
                    placeholder={detectedType === 'amex' ? '1234' : '123'}
                    placeholderTextColor={colors.placeholder}
                    keyboardType="numeric"
                    value={cardCvv}
                    onChangeText={(t) => setCardCvv(t.replace(/\D/g, '').slice(0, detectedType === 'amex' ? 4 : 3))}
                    onBlur={() => markTouched('cvv')}
                    maxLength={detectedType === 'amex' ? 4 : 3}
                    secureTextEntry
                  />
                </View>
                <FieldError field="cvv" />
              </View>
            </View>
          </View>
        )}

        {/* Mobile money form */}
        {paymentMethod === 'momo' && (
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Mobile Money Number</Text>
            <View style={[styles.inputRow, touched.momoNumber && momoError && styles.inputRowError]}>
              <Ionicons name="call-outline" size={18} color={colors.placeholder} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="024 000 0000"
                placeholderTextColor={colors.placeholder}
                keyboardType="phone-pad"
                value={momoNumber}
                onChangeText={(t) => setMomoNumber(t)}
                onBlur={() => markTouched('momoNumber')}
                maxLength={12}
              />
            </View>
            <FieldError field="momoNumber" />
            <View style={styles.momoProviders}>
              <View style={styles.providerBadge}><Text style={styles.providerText}>MTN</Text></View>
              <View style={styles.providerBadge}><Text style={styles.providerText}>Vodafone</Text></View>
              <View style={styles.providerBadge}><Text style={styles.providerText}>AirtelTigo</Text></View>
            </View>
          </View>
        )}

        {/* Security note */}
        <View style={styles.securityRow}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.placeholder} />
          <Text style={styles.securityText}>Secured with 256-bit SSL encryption</Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handlePay} activeOpacity={0.85} disabled={processing || !isFormValid}
          style={!isFormValid ? { opacity: 0.5 } : undefined}>
          <LinearGradient
            colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.payBtn, processing && styles.payBtnDisabled]}
          >
            <Text style={styles.payBtnText}>
              {processing ? 'Processing...' : `Pay ${price}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: colors.title },
  summaryCard: { backgroundColor: colors.card, borderRadius: 16, padding: 18, marginBottom: 28 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: colors.subtitle },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.title },
  summaryPrice: { fontSize: 18, fontWeight: '800', color: colors.premiumGradientStart },
  summaryDivider: { height: 1, backgroundColor: colors.rowBorder, marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.title, marginBottom: 12 },
  methodRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  methodCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderRadius: 14, paddingVertical: 16, borderWidth: 2, borderColor: colors.inputBorder, gap: 8 },
  methodCardActive: { backgroundColor: colors.premiumGradientStart, borderColor: colors.premiumGradientStart },
  methodLabel: { fontSize: 14, fontWeight: '600', color: colors.subtitle },
  methodLabelActive: { color: '#FFFFFF' },
  formSection: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.subtitle, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.inputBorder, paddingHorizontal: 14, marginBottom: 4 },
  inputRowError: { borderColor: '#EF4444' },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, height: 48, fontSize: 15, color: colors.text },
  textInputInline: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.inputBorder, paddingHorizontal: 14, marginBottom: 4 },
  textInputInner: { flex: 1, height: 48, fontSize: 15, color: colors.text },
  cardLogo: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  halfRow: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  errorText: { fontSize: 12, color: '#EF4444', marginBottom: 10, marginLeft: 4, marginTop: 2 },
  momoProviders: { flexDirection: 'row', gap: 8, marginTop: 4 },
  providerBadge: { backgroundColor: colors.iconCircle, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  providerText: { fontSize: 12, fontWeight: '600', color: colors.subtitle },
  securityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 },
  securityText: { fontSize: 12, color: colors.placeholder },
  bottomBar: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.rowBorder, alignItems: 'center' },
  payBtn: { borderRadius: 30, paddingVertical: 18, paddingHorizontal: 32, width: width - 48, alignItems: 'center' },
  payBtnDisabled: { opacity: 0.7 },
  payBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
