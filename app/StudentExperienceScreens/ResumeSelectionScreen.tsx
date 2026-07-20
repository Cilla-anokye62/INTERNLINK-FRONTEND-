import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { InternshipData, Resume } from '../../src/types/application';
import * as DocumentPicker from 'expo-document-picker';

const { height } = Dimensions.get('window');

const MOCK_RESUMES: Resume[] = [
  { id: 'r1', name: 'Alex_Morgan_Resume.pdf', type: 'pdf', uri: 'file:///resume1.pdf', uploadDate: '2026-06-01', size: '245 KB' },
  { id: 'r2', name: 'Alex_Morgan_CV.docx', type: 'docx', uri: 'file:///resume2.docx', uploadDate: '2026-05-15', size: '312 KB' },
];

export default function ResumeSelectionScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const internship: InternshipData = route.params?.internship;
  const [resumes, setResumes] = useState<Resume[]>(MOCK_RESUMES);
  const [selectedResume, setSelectedResume] = useState<string | null>('r1');

  const handleUploadNew = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        const newResume: Resume = {
          id: 'r-' + Date.now().toString(36),
          name: file.name,
          type: file.name.endsWith('.pdf') ? 'pdf' : 'docx',
          uri: file.uri,
          uploadDate: new Date().toISOString(),
          size: `${Math.round((file.size ?? 0) / 1024)} KB`,
        };
        setResumes(prev => [...prev, newResume]);
        setSelectedResume(newResume.id);
      }
    } catch (error) {
      console.error('Document pick error:', error);
    }
  };

  const handlePreview = () => {
    if (!selectedResume) return;
    const resume = resumes.find(r => r.id === selectedResume);
    if (resume && resume.uri) {
      Alert.alert('Preview Resume', `Opening ${resume.name}...`);
    }
  };

  const handleRemove = () => {
    Alert.alert('Remove Resume', 'Are you sure you want to remove this resume?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setSelectedResume(null) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.title }]}>Resume</Text>
          <Text style={[styles.stepLabel, { color: colors.subtitle }]}>Step 2 of 6</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.stepperInactive }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.stepperActive, width: '33%' }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.title }]}>Select your resume</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.subtitle }]}>
          Choose a resume to attach to this application. Only one can be submitted.
        </Text>

        {/* Resume cards */}
        {resumes.map((resume) => (
          <TouchableOpacity
            key={resume.id}
            style={[
              styles.resumeCard,
              {
                backgroundColor: colors.card,
                borderColor: selectedResume === resume.id ? colors.accent : colors.inputBorder,
                borderWidth: selectedResume === resume.id ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedResume(resume.id)}
            activeOpacity={0.8}
          >
            <View style={styles.resumeLeft}>
              <View style={[styles.fileIcon, { backgroundColor: resume.type === 'pdf' ? '#FEE2E2' : '#DBEAFE' }]}>
                <Text style={[styles.fileIconText, { color: resume.type === 'pdf' ? '#EF4444' : '#3B82F6' }]}>
                  {resume.type.toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={[styles.resumeName, { color: colors.title }]}>{resume.name}</Text>
                <Text style={[styles.resumeMeta, { color: colors.placeholder }]}>
                  {resume.size} · Uploaded {new Date(resume.uploadDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.resumeRight}>
              {selectedResume === resume.id && (
                <View style={[styles.checkCircle, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.checkText, { color: colors.onPrimary }]}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Upload new */}
        <TouchableOpacity
          style={[styles.uploadCard, { borderColor: colors.uploadAreaBorder, backgroundColor: colors.uploadAreaBg }]}
          onPress={handleUploadNew}
          activeOpacity={0.8}
        >
          <View style={[styles.uploadIconCircle, { backgroundColor: colors.iconCircle }]}>
            <Text style={[styles.uploadIcon, { color: colors.accent }]}>+</Text>
          </View>
          <View>
            <Text style={[styles.uploadTitle, { color: colors.title }]}>Upload new resume</Text>
            <Text style={[styles.uploadSubtitle, { color: colors.placeholder }]}>PDF or DOCX, max 5MB</Text>
          </View>
        </TouchableOpacity>

        {/* Preview / Remove */}
        {selectedResume && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.previewBtn, { borderColor: colors.inputBorder }]} onPress={handlePreview}>
              <Text style={[styles.previewText, { color: colors.accent }]}>Preview</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.removeBtn, { borderColor: colors.withdrawBg }]} onPress={handleRemove}>
              <Text style={[styles.removeText, { color: colors.withdrawText }]}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: selectedResume ? colors.accent : colors.buttonInactive }]}
          onPress={() => selectedResume && navigation.navigate('AdditionalInfo', { internship, resumeId: selectedResume })}
          disabled={!selectedResume}
          activeOpacity={0.85}
        >
          <Text style={[styles.continueText, { color: selectedResume ? colors.onPrimary : colors.placeholder }]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  stepLabel: { fontSize: 12, marginTop: 2 },
  progressContainer: { paddingHorizontal: 20, paddingBottom: 16 },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  sectionSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  resumeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 14, padding: 16, marginBottom: 12,
  },
  resumeLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  fileIcon: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  fileIconText: { fontSize: 11, fontWeight: '800' },
  resumeName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  resumeMeta: { fontSize: 12 },
  resumeRight: { marginLeft: 12 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  checkText: { fontSize: 14, fontWeight: 'bold' },
  uploadCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16,
    borderWidth: 1.5, borderStyle: 'dashed', marginBottom: 16, marginTop: 4,
  },
  uploadIconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  uploadIcon: { fontSize: 20, fontWeight: 'bold' },
  uploadTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  uploadSubtitle: { fontSize: 12 },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  previewBtn: { flex: 1, borderRadius: 30, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5 },
  previewText: { fontSize: 14, fontWeight: '600' },
  removeBtn: { flex: 1, borderRadius: 30, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5 },
  removeText: { fontSize: 14, fontWeight: '600' },
  bottomBar: {
    paddingHorizontal: 20, paddingBottom: height * 0.03, paddingTop: 12,
    borderTopWidth: 1,
  },
  continueBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  continueText: { fontSize: 16, fontWeight: 'bold' },
});
