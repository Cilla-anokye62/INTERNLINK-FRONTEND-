import React, { useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Switch, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { InternshipListing, WorkMode } from '../../src/types/application';
import { getAuthErrorMessage, listingApi } from '../../src/api';

const { height } = Dimensions.get('window');
const STEPS = ['Basics', 'Details', 'Requirements', 'Compensation', 'Settings', 'Preview'];

const CATEGORIES = ['Engineering', 'Design', 'Data', 'Business', 'Marketing', 'Research'];
const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Data Science', 'Marketing', 'Operations'];
const EMPLOYMENT_TYPES = ['Internship', 'Co-op', 'Part-time', 'Full-time'];
const STUDENT_LEVELS = ['freshman', 'sophomore', 'junior', 'senior', 'graduate'];
const WORK_MODES: { value: WorkMode; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { value: 'remote', label: 'Remote', icon: 'home-outline' },
  { value: 'hybrid', label: 'Hybrid', icon: 'swap-horizontal-outline' },
  { value: 'onsite', label: 'On-site', icon: 'business-outline' },
];

const normalizeDeadline = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  }

  const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  const candidate = slashMatch
    ? `${slashMatch[3]}-${slashMatch[1].padStart(2, '0')}-${slashMatch[2].padStart(2, '0')}`
    : trimmed;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return null;

  const parsed = new Date(`${candidate}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== candidate
    ? null
    : candidate;
};

export default function PostInternshipWizard({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { addListing, userId, userName } = useAppStore();
  const [step, setStep] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [employmentType, setEmploymentType] = useState('Internship');
  const [category, setCategory] = useState('');
  const [branch, setBranch] = useState('');
  const [openPositions, setOpenPositions] = useState('1');

  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [dailyTasks, setDailyTasks] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState('');
  const [teamInfo, setTeamInfo] = useState('');

  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);
  const [prefSkillInput, setPrefSkillInput] = useState('');
  const [studentLevel, setStudentLevel] = useState('junior');
  const [degreeProgramme, setDegreeProgramme] = useState('');
  const [minGpa, setMinGpa] = useState('');

  const [isPaid, setIsPaid] = useState(true);
  const [monthlyStipend, setMonthlyStipend] = useState('');
  const [benefits, setBenefits] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('12 weeks');
  const [workingHours, setWorkingHours] = useState('40 hrs/week');

  const [deadline, setDeadline] = useState('');
  const [maxApplicants, setMaxApplicants] = useState('200');
  const [allowCoverLetter, setAllowCoverLetter] = useState(true);
  const [resumeRequired, setResumeRequired] = useState(true);
  const [portfolioRequired, setPortfolioRequired] = useState(false);
  const [autoScreening, setAutoScreening] = useState(false);
  const [aiMatching, setAiMatching] = useState(true);

  const addSkill = (skill: string, type: 'required' | 'preferred') => {
    if (!skill.trim()) return;
    if (type === 'required') {
      if (!requiredSkills.includes(skill.trim())) setRequiredSkills([...requiredSkills, skill.trim()]);
      setSkillInput('');
    } else {
      if (!preferredSkills.includes(skill.trim())) setPreferredSkills([...preferredSkills, skill.trim()]);
      setPrefSkillInput('');
    }
  };

  const removeSkill = (skill: string, type: 'required' | 'preferred') => {
    if (type === 'required') setRequiredSkills(requiredSkills.filter((s) => s !== skill));
    else setPreferredSkills(preferredSkills.filter((s) => s !== skill));
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    if (!title.trim()) { Alert.alert('Missing', 'Please enter an internship title.'); return; }
    if (!description.trim()) { Alert.alert('Missing', 'Please enter a description.'); return; }
    if (requiredSkills.length === 0) { Alert.alert('Missing', 'Please add at least one required skill.'); return; }
    const pos = parseInt(openPositions);
    if (isNaN(pos) || pos < 1) { Alert.alert('Invalid', 'Open positions must be at least 1.'); return; }
    if (minGpa.trim()) {
      const gpa = parseFloat(minGpa);
      if (isNaN(gpa) || gpa < 0 || gpa > 4.0) { Alert.alert('Invalid', 'Minimum GPA must be between 0 and 4.0.'); return; }
    }
    const maxApp = parseInt(maxApplicants);
    if (isNaN(maxApp) || maxApp < 1) { Alert.alert('Invalid', 'Maximum applicants must be at least 1.'); return; }
    const normalizedDeadline = normalizeDeadline(deadline);
    if (!normalizedDeadline) {
      Alert.alert('Invalid', 'Enter the deadline as MM/DD/YYYY or YYYY-MM-DD.');
      return;
    }

    setIsPublishing(true);
    try {
      const created = await listingApi.create({
        title: title.trim(),
        description: description.trim(),
        duration,
        location: location.trim(),
        remote: workMode === 'remote',
        industry: category || department,
        deadline: normalizedDeadline,
        allowance: isPaid ? monthlyStipend.trim() || 'Paid' : 'Unpaid',
        requiredSkills,
      });

      const newListing: InternshipListing = {
        id: String(created.id),
        employerId: userId || String(created.companyId), title: created.title, department, employmentType,
        category: created.industry ?? category, branch, openPositions: pos,
        description: created.description ?? description.trim(),
        responsibilities: responsibilities.split('\n').filter(Boolean),
        dailyTasks: dailyTasks.split('\n').filter(Boolean),
        learningOutcomes: learningOutcomes.split('\n').filter(Boolean),
        teamInfo: teamInfo.trim(), requiredSkills: created.requiredSkills, preferredSkills, studentLevel,
        degreeProgramme: degreeProgramme.trim(), minGpa: minGpa.trim(),
        requiredDocuments: ['Resume'], isPaid, monthlyStipend: created.allowance ?? '',
        benefits: benefits.split(',').map((benefit) => benefit.trim()).filter(Boolean),
        workMode, location: created.location ?? '', duration: created.duration ?? duration, workingHours,
        deadline: created.deadline ?? normalizedDeadline, autoClose: true, maxApplicants: maxApp,
        allowCoverLetter, resumeRequired, portfolioRequired, autoScreening, aiMatching,
        status: 'active', views: 0, applicantCount: 0,
        createdAt: created.createdAt, publishedAt: created.createdAt,
      };
      addListing(newListing);
      Alert.alert('Published!', 'Your internship is now live.', [
        { text: 'View Listings', onPress: () => navigation.navigate('CompanyTabs', { screen: 'Listings' }) },
      ]);
    } catch (error) {
      Alert.alert('Could not publish internship', getAuthErrorMessage(error));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Your listing has been saved as a draft.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const SectionLabel = ({ label }: { label: string }) => (
    <Text style={[styles.fieldLabel, { color: colors.title }]}>{label}</Text>
  );

  const Input = ({ value, onChangeText, placeholder, multiline, numberOfLines, keyboardType }: any) => (
    <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
      <TextInput
        style={[styles.input, { color: colors.text }, multiline && { minHeight: (numberOfLines || 3) * 22 }]}
        value={value} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor={colors.placeholder} multiline={multiline}
        numberOfLines={numberOfLines} textAlignVertical="top"
        keyboardType={keyboardType}
      />
    </View>
  );

  const ChipSelector = ({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (v: string) => void }) => (
    <View style={styles.chipsRow}>
      {options.map((opt) => (
        <TouchableOpacity key={opt} style={[styles.chip, {
          backgroundColor: selected === opt ? colors.accent : colors.chipIdleBg,
          borderColor: selected === opt ? colors.accent : colors.chipIdleBorder,
        }]} onPress={() => onSelect(opt)}>
          <Text style={[styles.chipText, { color: selected === opt ? colors.chipActiveText : colors.chipIdleText }]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const SkillInput = ({ value, onChange, onAdd, skills, onRemove, placeholder }: any) => (
    <View>
      <View style={[styles.skillInputRow, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
        <TextInput style={[styles.skillInput, { color: colors.text }]} value={value} onChangeText={onChange}
          placeholder={placeholder} placeholderTextColor={colors.placeholder}
          onSubmitEditing={() => onAdd(value)} returnKeyType="done" />
        <TouchableOpacity style={[styles.skillAddBtn, { backgroundColor: colors.accent }]} onPress={() => onAdd(value)}>
          <Text style={[styles.skillAddText, { color: colors.onPrimary }]}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.skillTagsRow}>
        {skills.map((s: string) => (
          <TouchableOpacity key={s} style={[styles.skillTag, { backgroundColor: colors.iconCircle }]}
            onPress={() => onRemove(s)}>
            <Text style={[styles.skillTagText, { color: colors.accent }]}>{s}  ×</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const ToggleRow = ({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) => (
    <View style={[styles.toggleRow, { borderBottomColor: colors.rowBorder }]}>
      <Text style={[styles.toggleLabel, { color: colors.title }]}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange}
        trackColor={{ false: colors.switchTrack, true: colors.switchActive }}
        thumbColor={colors.switchThumb} />
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <View>
          <SectionLabel label="Internship Title *" />
          <Input value={title} onChangeText={setTitle} placeholder="e.g., Software Engineering Intern" />
          <SectionLabel label="Department" />
          <ChipSelector options={DEPARTMENTS} selected={department} onSelect={setDepartment} />
          <SectionLabel label="Employment Type" />
          <ChipSelector options={EMPLOYMENT_TYPES} selected={employmentType} onSelect={setEmploymentType} />
          <SectionLabel label="Category" />
          <ChipSelector options={CATEGORIES} selected={category} onSelect={setCategory} />
          <SectionLabel label="Company Branch" />
          <Input value={branch} onChangeText={setBranch} placeholder="e.g., San Francisco HQ" />
          <SectionLabel label="Open Positions" />
          <Input value={openPositions} onChangeText={(v: string) => setOpenPositions(v.replace(/[^0-9]/g, ''))} placeholder="1" keyboardType="numeric" />
        </View>
      );
      case 1: return (
        <View>
          <SectionLabel label="Full Description" />
          <Input value={description} onChangeText={setDescription} placeholder="Describe the role..." multiline numberOfLines={5} />
          <SectionLabel label="Responsibilities (one per line)" />
          <Input value={responsibilities} onChangeText={setResponsibilities} placeholder="Ship features&#10;Write tests&#10;Review PRs" multiline numberOfLines={4} />
          <SectionLabel label="Daily Tasks (one per line)" />
          <Input value={dailyTasks} onChangeText={setDailyTasks} placeholder="Attend standup&#10;Write code&#10;Pair program" multiline numberOfLines={3} />
          <SectionLabel label="Learning Outcomes (one per line)" />
          <Input value={learningOutcomes} onChangeText={setLearningOutcomes} placeholder="System design&#10;Testing patterns" multiline numberOfLines={3} />
          <SectionLabel label="Team Information" />
          <Input value={teamInfo} onChangeText={setTeamInfo} placeholder="Team size, culture, etc." multiline numberOfLines={2} />
        </View>
      );
      case 2: return (
        <View>
          <SectionLabel label="Required Skills" />
          <SkillInput value={skillInput} onChange={setSkillInput} onAdd={(v: string) => addSkill(v, 'required')}
            skills={requiredSkills} onRemove={(s: string) => removeSkill(s, 'required')} placeholder="Type a skill and press +" />
          <SectionLabel label="Preferred Skills" />
          <SkillInput value={prefSkillInput} onChange={setPrefSkillInput} onAdd={(v: string) => addSkill(v, 'preferred')}
            skills={preferredSkills} onRemove={(s: string) => removeSkill(s, 'preferred')} placeholder="Type a skill and press +" />
          <SectionLabel label="Student Level" />
          <ChipSelector options={STUDENT_LEVELS} selected={studentLevel} onSelect={setStudentLevel} />
          <SectionLabel label="Degree Programme" />
          <Input value={degreeProgramme} onChangeText={setDegreeProgramme} placeholder="e.g., Computer Science" />
          <SectionLabel label="Minimum GPA (optional)" />
          <Input value={minGpa} onChangeText={(v: string) => setMinGpa(v.replace(/[^0-9.]/g, ''))} placeholder="e.g., 3.5" keyboardType="decimal-pad" />
        </View>
      );
      case 3: return (
        <View>
          <View style={[styles.toggleRow, { borderBottomColor: colors.rowBorder, marginBottom: 16 }]}>
            <Text style={[styles.toggleLabel, { color: colors.title }]}>Paid Position</Text>
            <Switch value={isPaid} onValueChange={setIsPaid}
              trackColor={{ false: colors.switchTrack, true: colors.switchActive }} thumbColor={colors.switchThumb} />
          </View>
          {isPaid && (<><SectionLabel label="Monthly Stipend" /><Input value={monthlyStipend} onChangeText={setMonthlyStipend} placeholder="e.g., GHS 4,800" /></>)}
          <SectionLabel label="Benefits (comma separated)" />
          <Input value={benefits} onChangeText={setBenefits} placeholder="Housing, Meals, Mentorship" />
          <SectionLabel label="Work Mode" />
          <View style={styles.workModeRow}>
            {WORK_MODES.map((wm) => (
              <TouchableOpacity key={wm.value} style={[styles.workModeCard, {
                backgroundColor: workMode === wm.value ? colors.accent : colors.card,
                borderColor: workMode === wm.value ? colors.accent : colors.inputBorder,
              }]} onPress={() => setWorkMode(wm.value)}>
                <Ionicons name={wm.icon} size={24} color={workMode === wm.value ? colors.onPrimary : colors.title} style={{ marginBottom: 6 }} />
                <Text style={[styles.workModeLabel, { color: workMode === wm.value ? colors.onPrimary : colors.title }]}>{wm.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <SectionLabel label="Location" />
          <Input value={location} onChangeText={setLocation} placeholder="City, State or Remote" />
          <SectionLabel label="Duration" />
          <ChipSelector options={['4 weeks', '8 weeks', '12 weeks', '16 weeks', '6 months', '1 year']} selected={duration} onSelect={setDuration} />
          <SectionLabel label="Working Hours" />
          <Input value={workingHours} onChangeText={setWorkingHours} placeholder="40 hrs/week" />
        </View>
      );
      case 4: return (
        <View>
          <SectionLabel label="Application Deadline" />
          <Input value={deadline} onChangeText={setDeadline} placeholder="MM/DD/YYYY" />
          <SectionLabel label="Maximum Applicants" />
          <Input value={maxApplicants} onChangeText={(v: string) => setMaxApplicants(v.replace(/[^0-9]/g, ''))} placeholder="200" keyboardType="numeric" />
          <ToggleRow label="Allow Cover Letter" value={allowCoverLetter} onValueChange={setAllowCoverLetter} />
          <ToggleRow label="Resume Required" value={resumeRequired} onValueChange={setResumeRequired} />
          <ToggleRow label="Portfolio Required" value={portfolioRequired} onValueChange={setPortfolioRequired} />
          <ToggleRow label="Auto-screening" value={autoScreening} onValueChange={setAutoScreening} />
          <ToggleRow label="AI Matching" value={aiMatching} onValueChange={setAiMatching} />
        </View>
      );
      case 5: return (
        <View>
          <Text style={[styles.previewTitle, { color: colors.title }]}>{title || 'Untitled Internship'}</Text>
          <Text style={[styles.previewCompany, { color: colors.subtitle }]}>{userName || 'Employer'} · {location || 'Location TBD'}</Text>
          <View style={styles.previewTags}>
            <View style={[styles.previewTag, { backgroundColor: colors.matchPillBg }]}><Text style={[styles.previewTagText, { color: colors.matchPillText }]}>{workMode}</Text></View>
            {isPaid && <View style={[styles.previewTag, { backgroundColor: colors.iconCircle }]}><Text style={[styles.previewTagText, { color: colors.accent }]}>{monthlyStipend || 'Paid'}</Text></View>}
            <View style={[styles.previewTag, { backgroundColor: colors.ratePillBg }]}><Text style={[styles.previewTagText, { color: colors.ratePillText }]}>{duration}</Text></View>
          </View>
          {description ? <><Text style={[styles.sectionTitle, { color: colors.title }]}>About</Text><Text style={[styles.previewBody, { color: colors.subtitle }]}>{description}</Text></> : null}
          {requiredSkills.length > 0 ? (<><Text style={[styles.sectionTitle, { color: colors.title }]}>Skills</Text><View style={styles.previewChips}>{requiredSkills.map((s) => <View key={s} style={[styles.previewChip, { backgroundColor: colors.iconCircle }]}><Text style={[styles.previewChipText, { color: colors.accent }]}>{s}</Text></View>)}</View></>) : null}
          {responsibilities ? <><Text style={[styles.sectionTitle, { color: colors.title }]}>Responsibilities</Text>{responsibilities.split('\n').filter(Boolean).map((r, i) => <Text key={i} style={[styles.previewBullet, { color: colors.subtitle }]}>✓ {r}</Text>)}</> : null}
          {benefits ? <><Text style={[styles.sectionTitle, { color: colors.title }]}>Benefits</Text><Text style={[styles.previewBody, { color: colors.subtitle }]}>{benefits}</Text></> : null}
          <View style={[styles.previewMeta, { backgroundColor: colors.card }]}>
            <Text style={[styles.previewMetaText, { color: colors.subtitle }]}>Open Positions: {openPositions}</Text>
            <Text style={[styles.previewMetaText, { color: colors.subtitle }]}>Deadline: {deadline || 'Open'}</Text>
            <Text style={[styles.previewMetaText, { color: colors.subtitle }]}>Max Applicants: {maxApplicants}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.title }]}>Post Internship</Text>
          <Text style={[styles.stepLabel, { color: colors.subtitle }]}>Step {step + 1} of {STEPS.length} · {STEPS[step]}</Text>
        </View>
        <TouchableOpacity onPress={handleSaveDraft}>
          <Text style={[styles.draftBtn, { color: colors.accent }]}>Draft</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.stepperInactive }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.stepperActive, width: `${((step + 1) / STEPS.length) * 100}%` }]} />
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderStep()}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
        {step > 0 && (
          <TouchableOpacity style={[styles.backStepBtn, { borderColor: colors.inputBorder }]} onPress={() => setStep(step - 1)}>
            <Text style={[styles.backStepText, { color: colors.title }]}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: colors.accent, flex: step === 0 ? 1 : 2 }, isPublishing && { opacity: 0.6 }]}
          disabled={isPublishing}
          onPress={() => {
            if (step < STEPS.length - 1) {
              if (step === 0 && !title.trim()) { Alert.alert('Missing', 'Please enter an internship title.'); return; }
              if (step === 1 && !description.trim()) { Alert.alert('Missing', 'Please enter a description.'); return; }
              setStep(step + 1);
            } else {
              void handlePublish();
            }
          }}
        >
          {isPublishing ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={[styles.nextBtnText, { color: colors.onPrimary }]}>
              {step === STEPS.length - 1 ? 'Publish Internship' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  stepLabel: { fontSize: 12, marginTop: 2 },
  draftBtn: { fontSize: 14, fontWeight: '600' },
  progressContainer: { paddingHorizontal: 20, paddingBottom: 16 },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  fieldLabel: { fontSize: 15, fontWeight: '700', marginBottom: 10, marginTop: 18 },
  inputWrapper: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 4 },
  input: { fontSize: 14, lineHeight: 22, padding: 0 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '500' },
  skillInputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  skillInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  skillAddBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  skillAddText: { fontSize: 20, fontWeight: 'bold' },
  skillTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  skillTag: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  skillTagText: { fontSize: 13, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  toggleLabel: { fontSize: 14, fontWeight: '600' },
  workModeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  workModeCard: { flex: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5 },
  workModeLabel: { fontSize: 13, fontWeight: '600' },
  previewTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  previewCompany: { fontSize: 14, marginBottom: 14 },
  previewTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  previewTag: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  previewTagText: { fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, marginTop: 16 },
  previewBody: { fontSize: 14, lineHeight: 22, marginBottom: 8 },
  previewChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  previewChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  previewChipText: { fontSize: 13, fontWeight: '600' },
  previewBullet: { fontSize: 14, lineHeight: 24, marginBottom: 2 },
  previewMeta: { borderRadius: 12, padding: 14, marginTop: 16 },
  previewMetaText: { fontSize: 13, marginBottom: 4 },
  bottomBar: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: height * 0.03, paddingTop: 12, gap: 12, borderTopWidth: 1 },
  backStepBtn: { flex: 1, borderRadius: 30, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, backgroundColor: colors.card },
  backStepText: { fontSize: 15, fontWeight: '600' },
  nextBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  nextBtnText: { fontSize: 16, fontWeight: 'bold' },
});
