import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

type Props = NativeStackScreenProps<any, any>;


interface FormField {
  label: string;
  value: string;
  placeholder: string;
  icon: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "url";
}

const CompanyInformationScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [companyName, setCompanyName] = useState<string>("Northwind Studios");
  const [companyEmail, setCompanyEmail] = useState<string>("talent@northwind.io");
  const [contactPhone, setContactPhone] = useState<string>("+1 (415) 555-2014");
  const [website, setWebsite] = useState<string>("https://northwind.io");

  const fields: FormField[] = [
    { label: "COMPANY NAME", value: companyName, placeholder: "Your company name", icon: "business-outline", keyboardType: "default" },
    { label: "COMPANY EMAIL", value: companyEmail, placeholder: "talent@yourcompany.com", icon: "mail-outline", keyboardType: "email-address" },
    { label: "CONTACT PHONE", value: contactPhone, placeholder: "+1 (000) 000-0000", icon: "call-outline", keyboardType: "phone-pad" },
    { label: "WEBSITE", value: website, placeholder: "https://yourcompany.com", icon: "globe-outline", keyboardType: "url" },
  ];

  const setters: Record<string, React.Dispatch<React.SetStateAction<string>>> = {
    "COMPANY NAME": setCompanyName,
    "COMPANY EMAIL": setCompanyEmail,
    "CONTACT PHONE": setContactPhone,
    WEBSITE: setWebsite,
  };

 const handleContinue = (): void => {
  navigation.navigate('CompanyDetails');
};
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Company setup · Step 1 of 4</Text>
            <Text style={styles.progressPercent}>25%</Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "25%" }]} />
          </View>

          <Text style={styles.title}>Company information</Text>
          <Text style={styles.subtitle}>Make a great first impression on candidates.</Text>

          <TouchableOpacity style={styles.logoUploadBox} activeOpacity={0.7}>
            <Ionicons name="cloud-upload-outline" size={18} color={colors.subtitle} style={{ marginRight: 10 }} />
            <View style={styles.logoTextBlock}>
              <Text style={styles.logoMainText}>Upload company logo</Text>
              <Text style={styles.logoSubText}>PNG or SVG · max 2MB · square</Text>
            </View>
            <View style={styles.uploadBadge}>
              <Text style={styles.uploadBadgeText}>Upload</Text>
            </View>
          </TouchableOpacity>

          {fields.map((field: FormField) => (
            <View key={field.label} style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <View style={styles.inputRow}>
                <Ionicons name={field.icon as any} size={16} color={colors.subtitle} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  value={field.value}
                  onChangeText={(text: string) => setters[field.label](text)}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.placeholder}
                  keyboardType={field.keyboardType ?? "default"}
                  autoCapitalize={field.keyboardType === "email-address" || field.keyboardType === "url" ? "none" : "words"}
                  autoCorrect={false}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.85}>
            <Text style={styles.continueButtonText}>Next  →</Text>
          </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: 24 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progressLabel: { fontSize: 12, color: colors.subtitle },
  progressPercent: { fontSize: 12, color: colors.accent, fontWeight: "600" },
  progressBarTrack: { height: 4, backgroundColor: colors.inputBorder, borderRadius: 2, marginBottom: 20, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: colors.accent, borderRadius: 2 },
  title: { fontSize: 22, fontWeight: "700", color: colors.title, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.subtitle, marginBottom: 20 },
  logoUploadBox: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: colors.inputBorder, borderRadius: 12, padding: 12, marginBottom: 24, backgroundColor: colors.card },
  logoIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.iconCircle, justifyContent: "center", alignItems: "center", marginRight: 10 },
  logoIcon: { fontSize: 18 },
  logoTextBlock: { flex: 1 },
  logoMainText: { fontSize: 13, fontWeight: "600", color: colors.title },
  logoSubText: { fontSize: 11, color: colors.subtitle, marginTop: 2 },
  uploadBadge: { backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  uploadBadgeText: { color: colors.onPrimary, fontSize: 12, fontWeight: "700" },
  fieldWrapper: { marginBottom: 24 },
  fieldLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.8, color: colors.subtitle, marginBottom: 6, textTransform: "uppercase" },
  inputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: colors.inputBorder, borderRadius: 10, paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 12 : 8, backgroundColor: colors.inputBg },
  inputIcon: { fontSize: 16, marginRight: 8 },
  textInput: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },
  continueButton: { marginTop: 8, backgroundColor: colors.accent, borderRadius: 30, paddingVertical: 16, alignItems: "center" },
  continueButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: "bold" },
});

export default CompanyInformationScreen;