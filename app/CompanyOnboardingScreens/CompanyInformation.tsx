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

type Props = NativeStackScreenProps<any, any>;


interface FormField {
  label: string;
  value: string;
  placeholder: string;
  icon: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "url";
}

const CompanyInformationScreen: React.FC<Props> = ({ navigation }) => {
  const [companyName, setCompanyName] = useState<string>("Northwind Studios");
  const [companyEmail, setCompanyEmail] = useState<string>("talent@northwind.io");
  const [contactPhone, setContactPhone] = useState<string>("+1 (415) 555-2014");
  const [website, setWebsite] = useState<string>("https://northwind.io");

  const fields: FormField[] = [
    { label: "COMPANY NAME", value: companyName, placeholder: "Your company name", icon: "🏢", keyboardType: "default" },
    { label: "COMPANY EMAIL", value: companyEmail, placeholder: "talent@yourcompany.com", icon: "✉️", keyboardType: "email-address" },
    { label: "CONTACT PHONE", value: contactPhone, placeholder: "+1 (000) 000-0000", icon: "📞", keyboardType: "phone-pad" },
    { label: "WEBSITE", value: website, placeholder: "https://yourcompany.com", icon: "🌐", keyboardType: "url" },
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
            <View style={styles.logoIconCircle}>
              <Text style={styles.logoIcon}>☁️</Text>
            </View>
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
                <Text style={styles.inputIcon}>{field.icon}</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.value}
                  onChangeText={(text: string) => setters[field.label](text)}
                  placeholder={field.placeholder}
                  placeholderTextColor="#A0AEC0"
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

const TEAL = "#2CC6B5";
const LIGHT_BG = "#F5FBFA";
const BORDER = "#D1E8E6";
const DARK_TEXT = "#1A202C";
const MID_TEXT = "#718096";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { flexGrow: 1, padding: 24 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progressLabel: { fontSize: 12, color: MID_TEXT },
  progressPercent: { fontSize: 12, color: TEAL, fontWeight: "600" },
  progressBarTrack: { height: 4, backgroundColor: "#E2E8F0", borderRadius: 2, marginBottom: 20, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: TEAL, borderRadius: 2 },
  title: { fontSize: 22, fontWeight: "700", color: DARK_TEXT, marginBottom: 4 },
  subtitle: { fontSize: 13, color: MID_TEXT, marginBottom: 20 },
  logoUploadBox: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: BORDER, borderRadius: 12, padding: 12, marginBottom: 24, backgroundColor: "#F7FFFE" },
  logoIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#D9F5F2", justifyContent: "center", alignItems: "center", marginRight: 10 },
  logoIcon: { fontSize: 18 },
  logoTextBlock: { flex: 1 },
  logoMainText: { fontSize: 13, fontWeight: "600", color: DARK_TEXT },
  logoSubText: { fontSize: 11, color: MID_TEXT, marginTop: 2 },
  uploadBadge: { backgroundColor: TEAL, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  uploadBadgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  fieldWrapper: { marginBottom: 24 },
  fieldLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.8, color: MID_TEXT, marginBottom: 6, textTransform: "uppercase" },
  inputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 12 : 8, backgroundColor: "#FAFFFE" },
  inputIcon: { fontSize: 16, marginRight: 8 },
  textInput: { flex: 1, fontSize: 14, color: DARK_TEXT, padding: 0 },
  continueButton: { marginTop: 8, backgroundColor: TEAL, borderRadius: 30, paddingVertical: 16, alignItems: "center" },
  continueButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});

export default CompanyInformationScreen;