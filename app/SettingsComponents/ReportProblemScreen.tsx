import { useAppTheme } from '../../src/hooks/useAppTheme';
/**
 * ReportProblemScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Report a Problem Screen
 *
 * Content:
 *  - Header: back arrow + "Report a Problem" title
 *  - Problem type selection
 *  - Description input
 *  - Screenshot attachment option
 *  - Submit button
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';



const PROBLEM_TYPES = ['Bug', 'Feature Request', 'Performance', 'UI/UX Issue', 'Other'];

export default function ReportProblemScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [hasScreenshot, setHasScreenshot] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert('Required', 'Please select a problem type');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required', 'Please provide a description');
      return;
    }
    Alert.alert('Success', 'Your report has been submitted. Thank you for your feedback!');
    navigation.goBack();
  };

  const handleAttachScreenshot = () => {
    // TODO: Implement image picker
    setHasScreenshot(!hasScreenshot);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back-outline"
              size={22}
              color={colors.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report a Problem</Text>
        </View>

        {/* Problem Type */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>PROBLEM TYPE</Text>
          <View style={styles.chipsContainer}>
            {PROBLEM_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  selectedType === type && styles.chipSelected,
                ]}
                onPress={() => setSelectedType(type)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.chipText,
                  selectedType === type && styles.chipSelectedText,
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>DESCRIPTION</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the problem you encountered..."
            placeholderTextColor="#024D60"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Screenshot */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ATTACHMENTS</Text>
          <TouchableOpacity
            style={styles.screenshotButton}
            onPress={handleAttachScreenshot}
            activeOpacity={0.7}
          >
            <Ionicons
              name={hasScreenshot ? 'checkmark-circle' : 'image-outline'}
              size={20}
              color={hasScreenshot ? colors.button : '#94A3B8'}
            />
            <Text style={[
              styles.screenshotButtonText,
              hasScreenshot && styles.screenshotButtonTextAttached,
            ]}>
              {hasScreenshot ? 'Screenshot Attached' : 'Attach Screenshot'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.backBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.headerTitle,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.sectionHeader,
    letterSpacing: 1,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.chip,
  },
  chipSelected: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelected,
  },
  chipText: {
    fontSize: 14,
    color: colors.chipText,
    fontWeight: '600',
  },
  chipSelectedText: {
    color: colors.chipSelectedText,
  },
  textArea: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.title,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    height: 120,
  },
  screenshotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
  },
  screenshotButtonText: {
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 12,
    fontWeight: '600',
  },
  screenshotButtonTextAttached: {
    color: colors.button,
  },
  submitButton: {
    backgroundColor: colors.button,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.buttonText,
  },
});
