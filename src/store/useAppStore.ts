import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Application,
  ApplicationStatus,
  Notification,
  InternshipData,
  Resume,
  PortfolioLinks,
  Availability,
  InternshipListing,
  Conversation,
  ChatMessage,
  EmployerAnalytics,
} from '../types/application';

export type ThemePreference = 'light' | 'dark' | 'system';
export type UserRole = 'student' | 'employer' | 'university';
export type AuthEntryRoute = 'welcome' | 'login';

export interface ProfileExperience {
  id: string;
  ionicon: string;
  title: string;
  subtitle: string;
}

export interface UserProfile {
  email: string;
  phone: string;
  photoUri: string | null;
  bio: string;
  about: string;
  skills: string[];
  experience: ProfileExperience[];
  portfolioLink: string;
  resumeName: string;
  resumeUri: string;
  resumeUploaded: boolean;
  jobTypes: string[];
  industries: string[];
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  onboardingComplete: boolean;
}

const EMPTY_PROFILE: UserProfile = {
  email: '',
  phone: '',
  photoUri: null,
  bio: '',
  about: '',
  skills: [],
  experience: [],
  portfolioLink: '',
  resumeName: '',
  resumeUri: '',
  resumeUploaded: false,
  jobTypes: [],
  industries: [],
};

interface AppState {
  // Persistence hydration
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  sessionInitialized: boolean;
  setSessionInitialized: (value: boolean) => void;

  // Theme State
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;

  // Auth State
  authEntryRoute: AuthEntryRoute;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  userRole: UserRole | null;
  userId: string;
  userName: string;
  profile: UserProfile;
  setUserName: (name: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  establishSession: (user: SessionUser) => void;
  login: (role: UserRole) => void;
  beginOnboarding: (role: UserRole) => void;
  completeOnboarding: () => void;
  cancelOnboarding: () => void;
  clearSession: () => void;
  logout: () => void;
  resetAccount: () => void;

  // Location Preferences
  preferredLocation: string;
  workSetup: 'Remote' | 'Hybrid' | 'On-site';
  willingToRelocate: boolean;
  setLocationPreferences: (location: string, workSetup: 'Remote' | 'Hybrid' | 'On-site', willingToRelocate: boolean) => void;

  // Academic Info
  university: string;
  programme: string;
  academicLevel: string;
  graduationYear: string;
  setAcademicInfo: (university: string, programme: string, academicLevel: string, graduationYear: string) => void;

  // Career Interests
  careerInterests: string[];
  setCareerInterests: (interests: string[]) => void;

  // Premium State
  isPremium: boolean;
  applicationsUsed: number;
  applicationLimit: number;
  setPremium: (value: boolean) => void;
  incrementApplicationsUsed: () => void;
  resetApplications: () => void;

  // Applications
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  getApplicationsByStudent: (studentId: string) => Application[];
  getApplicationsByEmployer: (employerId: string) => Application[];
  getApplicationsByInternship: (internshipId: string) => Application[];
  withdrawApplication: (applicationId: string) => void;

  // Drafts
  draftApplication: Partial<Application> | null;
  saveDraft: (draft: Partial<Application>) => void;
  clearDraft: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notif: Notification) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: (role: 'student' | 'employer') => void;
  getUnreadCount: (role: 'student' | 'employer') => number;

  // Saved Internships
  savedInternships: string[];
  toggleSavedInternship: (internshipId: string) => void;
  isInternshipSaved: (internshipId: string) => boolean;

  // Internship Listings
  listings: InternshipListing[];
  addListing: (listing: InternshipListing) => void;
  updateListing: (listingId: string, updates: Partial<InternshipListing>) => void;
  publishListing: (listingId: string) => void;
  getListingsByEmployer: (employerId: string) => InternshipListing[];

  // Conversations / Messaging
  conversations: Conversation[];
  addConversation: (conv: Conversation) => void;
  findOrCreateConversation: (ownerId: string, participantId: string, participantName: string, participantInitials: string, participantColor: string, applicationId?: string, internshipTitle?: string) => Conversation;
  getConversationsByEmployer: (employerId: string) => Conversation[];
  markConversationRead: (convId: string) => void;
  togglePinConversation: (convId: string) => void;
  archiveConversation: (convId: string) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  getMessagesByConversation: (convId: string) => ChatMessage[];

  // Analytics
  getAnalytics: (employerId: string) => EmployerAnalytics;
}

const LEGACY_PROFILE_KEYS = [
  'username',
  'userEmail',
  'userPhone',
  'userProfilePhoto',
  'userBio',
  'userAbout',
  'userSkills',
  'userExperience',
  'userPortfolioLink',
  'userResumeName',
  'userResumeUri',
  'userResumeUploaded',
  'jobPreferences',
];

const parseLegacyJson = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const migrateLegacyProfileStorage = async (state?: AppState) => {
  if (!state) return;
  const entries = Object.fromEntries(await AsyncStorage.multiGet(LEGACY_PROFILE_KEYS));
  const legacyJobPreferences = parseLegacyJson<{
    jobTypes?: string[];
    industries?: string[];
  }>(entries.jobPreferences, {});

  if (!state.userName && entries.username) state.setUserName(entries.username);
  state.updateProfile({
    email: state.profile.email || entries.userEmail || '',
    phone: state.profile.phone || entries.userPhone || '',
    photoUri: state.profile.photoUri || entries.userProfilePhoto || null,
    bio: state.profile.bio || entries.userBio || '',
    about: state.profile.about || entries.userAbout || entries.userBio || '',
    skills: state.profile.skills.length
      ? state.profile.skills
      : parseLegacyJson<string[]>(entries.userSkills, []),
    experience: state.profile.experience.length
      ? state.profile.experience
      : parseLegacyJson<ProfileExperience[]>(entries.userExperience, []),
    portfolioLink: state.profile.portfolioLink || entries.userPortfolioLink || '',
    resumeName: state.profile.resumeName || entries.userResumeName || '',
    resumeUri: state.profile.resumeUri || entries.userResumeUri || '',
    resumeUploaded: state.profile.resumeUploaded
      || parseLegacyJson<boolean>(entries.userResumeUploaded, false),
    jobTypes: state.profile.jobTypes.length ? state.profile.jobTypes : legacyJobPreferences.jobTypes || [],
    industries: state.profile.industries.length ? state.profile.industries : legacyJobPreferences.industries || [],
  });
  await AsyncStorage.multiRemove(LEGACY_PROFILE_KEYS);
};

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

const createTimelineEvent = (
  status: ApplicationStatus,
  label: string,
  description: string,
  isActive: boolean
) => ({
  id: generateId(),
  status,
  label,
  description,
  timestamp: new Date().toISOString(),
  isActive,
});

const DEFAULT_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    internshipId: 'int-1',
    studentId: 'student-1',
    employerId: 'employer-1',
    status: 'shortlisted',
    submittedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    resume: { id: 'r1', name: 'Alex_Morgan_Resume.pdf', type: 'pdf', uri: '', uploadDate: new Date().toISOString(), size: '245 KB' },
    coverLetter: 'I am passionate about software engineering and would love to contribute to your team...',
    motivationStatement: 'Building products that impact millions of users drives me every day.',
    whyThisInternship: 'Airbnb represents the perfect intersection of technology and human connection.',
    strongCandidateReason: 'My experience with React and TypeScript aligns perfectly with your requirements.',
    portfolioLinks: { github: 'https://github.com/alexmorgan', linkedin: 'https://linkedin.com/in/alexmorgan' },
    availability: { earliestStartDate: '2026-06-01', expectedDuration: '12 weeks', studentLevel: 'junior', preferredWorkMode: 'hybrid', canRelocate: true },
    interview: null,
    offer: null,
    internship: {
      id: 'int-1',
      title: 'Software Engineering Intern',
      company: 'Airbnb',
      companyId: 'employer-1',
      companyLogo: 'A',
      companyColor: '#EF4444',
      location: 'San Francisco, CA',
      workMode: 'hybrid',
      salary: 'GHS 48/hr',
      duration: '12 weeks',
      description: 'Join the Trust & Safety team to build experiences used by 150M+ travelers worldwide.',
      responsibilities: ['Ship customer-facing features', 'Pair with senior engineers', 'Contribute to design system'],
      requirements: ['React', 'TypeScript', 'GraphQL'],
      benefits: ['Housing stipend', 'Mentorship program', 'Free meals'],
      skills: ['React', 'TypeScript', 'GraphQL', 'Testing'],
      matchScore: 94,
      applicants: 128,
      postedDate: new Date(Date.now() - 14 * 86400000).toISOString(),
      closingDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    },
    timeline: [
      createTimelineEvent('submitted', 'Application Submitted', 'Your application was sent successfully', true),
      createTimelineEvent('viewed', 'Application Viewed', 'The employer viewed your application', true),
      createTimelineEvent('shortlisted', 'Shortlisted', 'You have been shortlisted for the next round', true),
    ],
    messages: [],
  },
  {
    id: 'app-2',
    internshipId: 'int-2',
    studentId: 'student-1',
    employerId: 'employer-2',
    status: 'interview_scheduled',
    submittedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    resume: { id: 'r1', name: 'Alex_Morgan_Resume.pdf', type: 'pdf', uri: '', uploadDate: new Date().toISOString(), size: '245 KB' },
    coverLetter: '',
    motivationStatement: 'I am eager to bring my frontend skills to Meta.',
    whyThisInternship: '',
    strongCandidateReason: '',
    portfolioLinks: {},
    availability: { earliestStartDate: '2026-06-01', expectedDuration: '12 weeks', studentLevel: 'junior', preferredWorkMode: 'remote', canRelocate: false },
    interview: {
      id: 'interview-1',
      applicationId: 'app-2',
      date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      time: '10:00 AM',
      duration: '45 minutes',
      location: 'Remote',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Please have your portfolio ready.',
      type: 'video',
      status: 'scheduled',
    },
    offer: null,
    internship: {
      id: 'int-2',
      title: 'Software Intern',
      company: 'Meta',
      companyId: 'employer-2',
      companyLogo: 'M',
      companyColor: '#3B82F6',
      location: 'New York, NY',
      workMode: 'remote',
      salary: 'GHS 55/hr',
      duration: '12 weeks',
      description: 'Work on the Instagram team to build features for 2B+ users.',
      responsibilities: ['Build new features', 'Optimize performance', 'Write tests'],
      requirements: ['React Native', 'JavaScript', 'REST APIs'],
      benefits: ['Remote work', 'Equipment stipend'],
      skills: ['React Native', 'JavaScript', 'TypeScript'],
      matchScore: 91,
      applicants: 256,
      postedDate: new Date(Date.now() - 20 * 86400000).toISOString(),
      closingDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    },
    timeline: [
      createTimelineEvent('submitted', 'Application Submitted', 'Your application was sent', true),
      createTimelineEvent('viewed', 'Application Viewed', 'The employer viewed your application', true),
      createTimelineEvent('under_review', 'Under Review', 'Your application is being reviewed', true),
      createTimelineEvent('interview_scheduled', 'Interview Scheduled', 'Video call on ' + new Date(Date.now() + 5 * 86400000).toLocaleDateString(), true),
    ],
    messages: [],
  },
  {
    id: 'app-3',
    internshipId: 'int-3',
    studentId: 'student-1',
    employerId: 'employer-3',
    status: 'offer_received',
    submittedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    resume: { id: 'r1', name: 'Alex_Morgan_Resume.pdf', type: 'pdf', uri: '', uploadDate: new Date().toISOString(), size: '245 KB' },
    coverLetter: '',
    motivationStatement: '',
    whyThisInternship: '',
    strongCandidateReason: '',
    portfolioLinks: {},
    availability: { earliestStartDate: '2026-06-01', expectedDuration: '12 weeks', studentLevel: 'junior', preferredWorkMode: 'hybrid', canRelocate: true },
    interview: null,
    offer: {
      id: 'offer-1',
      applicationId: 'app-3',
      salary: 'GHS 52/hr',
      benefits: ['Housing stipend', 'Health insurance', 'Mentorship'],
      startDate: '2026-06-15',
      expirationDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      offerLetter: 'We are pleased to offer you the position of Frontend Engineering Intern...',
      status: 'pending',
    },
    internship: {
      id: 'int-3',
      title: 'Frontend Intern',
      company: 'Stripe',
      companyId: 'employer-3',
      companyLogo: 'S',
      companyColor: '#7C3AED',
      location: 'San Francisco, CA',
      workMode: 'hybrid',
      salary: 'GHS 52/hr',
      duration: '12 weeks',
      description: 'Build the next generation of payment infrastructure UI.',
      responsibilities: ['Build payment flows', 'Improve accessibility', 'Write unit tests'],
      requirements: ['React', 'TypeScript', 'CSS'],
      benefits: ['Housing stipend', 'Health insurance'],
      skills: ['React', 'TypeScript', 'CSS', 'Accessibility'],
      matchScore: 88,
      applicants: 192,
      postedDate: new Date(Date.now() - 30 * 86400000).toISOString(),
      closingDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    },
    timeline: [
      createTimelineEvent('submitted', 'Application Submitted', 'Your application was sent', true),
      createTimelineEvent('viewed', 'Application Viewed', 'The employer reviewed your application', true),
      createTimelineEvent('under_review', 'Under Review', 'Being evaluated by the hiring team', true),
      createTimelineEvent('shortlisted', 'Shortlisted', 'You made it to the final round', true),
      createTimelineEvent('interview_scheduled', 'Interview Completed', 'Technical interview on ' + new Date(Date.now() - 7 * 86400000).toLocaleDateString(), true),
      createTimelineEvent('offer_received', 'Offer Received', 'Congratulations! You received an offer', true),
    ],
    messages: [],
  },
  {
    id: 'app-4',
    internshipId: 'int-4',
    studentId: 'student-1',
    employerId: 'employer-4',
    status: 'rejected',
    submittedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    resume: { id: 'r1', name: 'Alex_Morgan_Resume.pdf', type: 'pdf', uri: '', uploadDate: new Date().toISOString(), size: '245 KB' },
    coverLetter: '',
    motivationStatement: '',
    whyThisInternship: '',
    strongCandidateReason: '',
    portfolioLinks: {},
    availability: { earliestStartDate: '2026-06-01', expectedDuration: '12 weeks', studentLevel: 'junior', preferredWorkMode: 'remote', canRelocate: false },
    interview: null,
    offer: null,
    internship: {
      id: 'int-4',
      title: 'Data Intern',
      company: 'Notion',
      companyId: 'employer-4',
      companyLogo: 'N',
      companyColor: '#0F172A',
      location: 'San Francisco, CA',
      workMode: 'remote',
      salary: 'GHS 45/hr',
      duration: '10 weeks',
      description: 'Work with the data team to build analytics tools.',
      responsibilities: ['Build dashboards', 'Analyze data', 'Write SQL queries'],
      requirements: ['Python', 'SQL', 'Data visualization'],
      benefits: ['Remote work', 'Flexible hours'],
      skills: ['Python', 'SQL', 'Pandas'],
      matchScore: 72,
      applicants: 310,
      postedDate: new Date(Date.now() - 45 * 86400000).toISOString(),
      closingDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    timeline: [
      createTimelineEvent('submitted', 'Application Submitted', 'Your application was sent', true),
      createTimelineEvent('viewed', 'Application Viewed', 'Reviewed by hiring manager', true),
      createTimelineEvent('rejected', 'Not Selected', 'Unfortunately, we have decided to move forward with other candidates', true),
    ],
    messages: [],
  },
];

const DEFAULT_LISTINGS: InternshipListing[] = [
  {
    id: 'listing-1', employerId: 'employer-1', title: 'Software Engineering Intern', department: 'Engineering',
    employmentType: 'Internship', category: 'Engineering', branch: 'San Francisco HQ', openPositions: 3,
    description: 'Join the Trust & Safety team to build experiences used by 150M+ travelers worldwide.',
    responsibilities: ['Ship customer-facing features', 'Pair with senior engineers', 'Contribute to design system'],
    dailyTasks: ['Write React components', 'Attend standup', 'Review PRs'], learningOutcomes: ['Production engineering skills', 'System design fundamentals'],
    teamInfo: 'You will work with a team of 8 engineers led by a Staff Engineer.',
    requiredSkills: ['React', 'TypeScript', 'GraphQL'], preferredSkills: ['Testing', 'CI/CD'],
    studentLevel: 'junior', degreeProgramme: 'Computer Science', minGpa: '3.5',
    requiredDocuments: ['Resume', 'Transcript'], isPaid: true, monthlyStipend: 'GHS 4,800',
    benefits: ['Housing stipend', 'Mentorship', 'Free meals'], workMode: 'hybrid',
    location: 'San Francisco, CA', duration: '12 weeks', workingHours: '40 hrs/week',
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    autoClose: true, maxApplicants: 200, allowCoverLetter: true, resumeRequired: true,
    portfolioRequired: false, autoScreening: false, aiMatching: true, status: 'active',
    views: 1247, applicantCount: 128, createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'listing-2', employerId: 'employer-1', title: 'Product Design Intern', department: 'Design',
    employmentType: 'Internship', category: 'Design', branch: 'San Francisco HQ', openPositions: 2,
    description: 'Help shape the future of travel experiences through thoughtful design.',
    responsibilities: ['Design user flows', 'Create prototypes', 'Conduct user research'],
    dailyTasks: ['Sketch concepts', 'Build Figma prototypes', 'Present to team'], learningOutcomes: ['Design thinking', 'User research methods'],
    teamInfo: 'Work with a team of 5 designers and 2 researchers.',
    requiredSkills: ['Figma', 'UI Design', 'Prototyping'], preferredSkills: ['Motion design', 'User research'],
    studentLevel: 'junior', degreeProgramme: 'Design / HCI', minGpa: '',
    requiredDocuments: ['Resume', 'Portfolio'], isPaid: true, monthlyStipend: 'GHS 4,200',
    benefits: ['Design tools provided', 'Mentorship'], workMode: 'onsite',
    location: 'San Francisco, CA', duration: '12 weeks', workingHours: '40 hrs/week',
    deadline: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
    autoClose: true, maxApplicants: 150, allowCoverLetter: false, resumeRequired: true,
    portfolioRequired: true, autoScreening: false, aiMatching: true, status: 'active',
    views: 892, applicantCount: 86, createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'listing-3', employerId: 'employer-1', title: 'Data Science Intern', department: 'Data',
    employmentType: 'Internship', category: 'Data', branch: 'Remote', openPositions: 1,
    description: 'Work with our data team to build analytics tools and ML models.',
    responsibilities: ['Build dashboards', 'Analyze user behavior', 'Develop ML models'],
    dailyTasks: ['Write SQL queries', 'Build models', 'Present findings'], learningOutcomes: ['Applied ML', 'Data pipeline design'],
    teamInfo: 'Join a team of 6 data scientists and 3 ML engineers.',
    requiredSkills: ['Python', 'SQL', 'Pandas'], preferredSkills: ['TensorFlow', 'Spark'],
    studentLevel: 'senior', degreeProgramme: 'Data Science / CS', minGpa: '3.7',
    requiredDocuments: ['Resume', 'Transcript'], isPaid: true, monthlyStipend: 'GHS 5,000',
    benefits: ['Remote work', 'Equipment stipend'], workMode: 'remote',
    location: 'Remote', duration: '16 weeks', workingHours: '40 hrs/week',
    deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    autoClose: false, maxApplicants: 100, allowCoverLetter: true, resumeRequired: true,
    portfolioRequired: false, autoScreening: true, aiMatching: true, status: 'active',
    views: 654, applicantCount: 52, createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const DEFAULT_CONVERSATIONS: Conversation[] = [
  // Employer-owned conversations (participant = student)
  {
    id: 'conv-1', ownerId: 'employer-1', participantId: 'student-1', participantName: 'Alex Morgan',
    participantInitials: 'AM', participantColor: '#3B82F6',
    lastMessage: 'Thank you for the interview opportunity! I look forward to it.',
    lastMessageTime: new Date(Date.now() - 2 * 3600000).toISOString(),
    unreadCount: 0, isPinned: true, isMuted: false, isArchived: false,
    applicationId: 'app-1', internshipTitle: 'Software Engineering Intern',
  },
  {
    id: 'conv-2', ownerId: 'employer-1', participantId: 'student-2', participantName: 'Priya Patel',
    participantInitials: 'PP', participantColor: '#10B981',
    lastMessage: 'Could you share more details about the team structure?',
    lastMessageTime: new Date(Date.now() - 5 * 3600000).toISOString(),
    unreadCount: 2, isPinned: false, isMuted: false, isArchived: false,
    applicationId: 'app-5', internshipTitle: 'Product Design Intern',
  },
  {
    id: 'conv-3', ownerId: 'employer-1', participantId: 'student-3', participantName: 'Marcus Lee',
    participantInitials: 'ML', participantColor: '#F59E0B',
    lastMessage: 'I have uploaded my updated resume as requested.',
    lastMessageTime: new Date(Date.now() - 24 * 3600000).toISOString(),
    unreadCount: 0, isPinned: false, isMuted: false, isArchived: false,
    applicationId: 'app-6', internshipTitle: 'Data Science Intern',
  },
  // Student-owned conversations (participant = employer)
  {
    id: 'conv-s1', ownerId: 'student-1', participantId: 'employer-1', participantName: 'Acme Tech',
    participantInitials: 'AT', participantColor: '#2CACAD',
    lastMessage: 'We would like to schedule a technical interview. Would next Tuesday at 10 AM work for you?',
    lastMessageTime: new Date(Date.now() - 24 * 3600000).toISOString(),
    unreadCount: 1, isPinned: true, isMuted: false, isArchived: false,
    applicationId: 'app-1', internshipTitle: 'Software Engineering Intern',
  },
  {
    id: 'conv-s2', ownerId: 'student-1', participantId: 'employer-2', participantName: 'Stripe',
    participantInitials: 'ST', participantColor: '#8B5CF6',
    lastMessage: 'Your application has been reviewed. We will be in touch soon.',
    lastMessageTime: new Date(Date.now() - 48 * 3600000).toISOString(),
    unreadCount: 0, isPinned: false, isMuted: false, isArchived: false,
    applicationId: 'app-3', internshipTitle: 'Frontend Intern',
  },
];

const DEFAULT_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'msg-1', conversationId: 'conv-1', senderId: 'employer-1', senderName: 'Acme Tech', content: 'Hi Alex, congratulations! You have been shortlisted for the Software Engineering Intern position.', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), isRead: true, type: 'system' },
  { id: 'msg-2', conversationId: 'conv-1', senderId: 'student-1', senderName: 'Alex Morgan', content: 'Thank you so much! I am very excited about this opportunity.', timestamp: new Date(Date.now() - 47 * 3600000).toISOString(), isRead: true, type: 'text' },
  { id: 'msg-3', conversationId: 'conv-1', senderId: 'employer-1', senderName: 'Acme Tech', content: 'We would like to schedule a technical interview. Would next Tuesday at 10 AM work for you?', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), isRead: true, type: 'text' },
  { id: 'msg-4', conversationId: 'conv-1', senderId: 'student-1', senderName: 'Alex Morgan', content: 'Tuesday at 10 AM works perfectly. Should I prepare anything specific?', timestamp: new Date(Date.now() - 23 * 3600000).toISOString(), isRead: true, type: 'text' },
  { id: 'msg-5', conversationId: 'conv-1', senderId: 'employer-1', senderName: 'Acme Tech', content: 'Please have your portfolio and be ready to discuss a technical project in depth. Here is the meeting link: https://zoom.us/j/123', timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), isRead: true, type: 'interview_invite' },
  { id: 'msg-6', conversationId: 'conv-1', senderId: 'student-1', senderName: 'Alex Morgan', content: 'Thank you for the interview opportunity! I look forward to it.', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), isRead: true, type: 'text' },

  { id: 'msg-7', conversationId: 'conv-2', senderId: 'student-2', senderName: 'Priya Patel', content: 'Hi! I just applied for the Product Design Intern position.', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), isRead: true, type: 'text' },
  { id: 'msg-8', conversationId: 'conv-2', senderId: 'employer-1', senderName: 'Acme Tech', content: 'Hi Priya! We received your application. Your portfolio looks impressive.', timestamp: new Date(Date.now() - 7 * 3600000).toISOString(), isRead: true, type: 'text' },
  { id: 'msg-9', conversationId: 'conv-2', senderId: 'student-2', senderName: 'Priya Patel', content: 'Could you share more details about the team structure?', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), isRead: false, type: 'text' },

  { id: 'msg-10', conversationId: 'conv-3', senderId: 'employer-1', senderName: 'Acme Tech', content: 'Hi Marcus, thanks for applying. Could you upload an updated resume?', timestamp: new Date(Date.now() - 30 * 3600000).toISOString(), isRead: true, type: 'text' },
  { id: 'msg-11', conversationId: 'conv-3', senderId: 'student-3', senderName: 'Marcus Lee', content: 'I have uploaded my updated resume as requested.', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), isRead: true, type: 'text' },

  // Student-owned conversation messages (conv-s1: student-1 ↔ Acme Tech)
  { id: 'msg-s1', conversationId: 'conv-s1', senderId: 'student-1', senderName: 'Alex Morgan', content: 'Hi! I just submitted my application for the Software Engineering Intern position.', timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), isRead: true, type: 'text' },
  { id: 'msg-s2', conversationId: 'conv-s1', senderId: 'employer-1', senderName: 'Acme Tech', content: 'Hi Alex, congratulations! You have been shortlisted for the Software Engineering Intern position.', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), isRead: true, type: 'system' },
  { id: 'msg-s3', conversationId: 'conv-s1', senderId: 'student-1', senderName: 'Alex Morgan', content: 'Thank you so much! I am very excited about this opportunity.', timestamp: new Date(Date.now() - 47 * 3600000).toISOString(), isRead: true, type: 'text' },
  { id: 'msg-s4', conversationId: 'conv-s1', senderId: 'employer-1', senderName: 'Acme Tech', content: 'We would like to schedule a technical interview. Would next Tuesday at 10 AM work for you?', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), isRead: false, type: 'interview_invite' },

  // Student-owned conversation messages (conv-s2: student-1 ↔ Stripe)
  { id: 'msg-s5', conversationId: 'conv-s2', senderId: 'student-1', senderName: 'Alex Morgan', content: 'Hello! I applied for the Frontend Intern role and wanted to follow up on my application.', timestamp: new Date(Date.now() - 50 * 3600000).toISOString(), isRead: true, type: 'text' },
  { id: 'msg-s6', conversationId: 'conv-s2', senderId: 'employer-2', senderName: 'Stripe', content: 'Your application has been reviewed. We will be in touch soon.', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), isRead: true, type: 'text' },
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'status_changed',
    title: 'Application Shortlisted',
    message: 'Your application for Software Engineering Intern at Airbnb has been shortlisted!',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    isRead: false,
    applicationId: 'app-1',
    userId: 'student-1',
    role: 'student',
  },
  {
    id: 'notif-2',
    type: 'interview_scheduled',
    title: 'Interview Scheduled',
    message: 'You have a video interview for Software Intern at Meta on ' + new Date(Date.now() + 5 * 86400000).toLocaleDateString(),
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    isRead: false,
    applicationId: 'app-2',
    userId: 'student-1',
    role: 'student',
  },
  {
    id: 'notif-3',
    type: 'offer_received',
    title: 'Offer Received!',
    message: 'Congratulations! You received an offer for Frontend Intern at Stripe.',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    isRead: false,
    applicationId: 'app-3',
    userId: 'student-1',
    role: 'student',
  },
  {
    id: 'notif-4',
    type: 'new_application',
    title: 'New Application',
    message: 'Alex Morgan applied for Software Engineering Intern.',
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    isRead: true,
    applicationId: 'app-1',
    userId: 'employer-1',
    role: 'employer',
  },
  {
    id: 'notif-5',
    type: 'new_application',
    title: 'New Application',
    message: 'Priya Patel applied for Product Design Intern.',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    isRead: false,
    userId: 'employer-1',
    role: 'employer',
  },
  {
    id: 'notif-6',
    type: 'student_responded',
    title: 'Student Responded',
    message: 'Alex Morgan replied to your message about the interview schedule.',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    isRead: false,
    applicationId: 'app-1',
    userId: 'employer-1',
    role: 'employer',
  },
  {
    id: 'notif-7',
    type: 'interview_accepted',
    title: 'Interview Accepted',
    message: 'Marcus Lee accepted the interview invitation for Data Science Intern.',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    isRead: true,
    applicationId: 'app-6',
    userId: 'employer-1',
    role: 'employer',
  },
  {
    id: 'notif-8',
    type: 'offer_accepted',
    title: 'Offer Accepted!',
    message: 'Congratulations! Alex Morgan accepted your offer for Software Engineering Intern.',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    isRead: false,
    applicationId: 'app-1',
    userId: 'employer-1',
    role: 'employer',
  },
  {
    id: 'notif-9',
    type: 'new_application',
    title: 'New Application',
    message: 'Jordan Kim applied for Data Science Intern.',
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    isRead: true,
    applicationId: 'app-7',
    userId: 'employer-1',
    role: 'employer',
  },
  {
    id: 'notif-10',
    type: 'application_viewed',
    title: 'Application Viewed',
    message: 'You viewed Priya Patel\'s application for Product Design Intern.',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    isRead: true,
    applicationId: 'app-5',
    userId: 'employer-1',
    role: 'employer',
  },
];

const createAccountResetState = (authEntryRoute: AuthEntryRoute): Partial<AppState> => ({
  authEntryRoute,
  isAuthenticated: false,
  onboardingComplete: false,
  userRole: null,
  userId: '',
  userName: '',
  profile: { ...EMPTY_PROFILE },
  preferredLocation: 'Accra, Ghana',
  workSetup: 'Hybrid',
  willingToRelocate: true,
  university: '',
  programme: '',
  academicLevel: '',
  graduationYear: '',
  careerInterests: [],
  isPremium: false,
  applicationsUsed: 0,
  applicationLimit: 3,
  applications: [...DEFAULT_APPLICATIONS],
  draftApplication: null,
  notifications: [...DEFAULT_NOTIFICATIONS],
  savedInternships: [],
  listings: [...DEFAULT_LISTINGS],
  conversations: [...DEFAULT_CONVERSATIONS],
  chatMessages: [...DEFAULT_CHAT_MESSAGES],
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
      sessionInitialized: false,
      setSessionInitialized: (value: boolean) => set({ sessionInitialized: value }),

      // Default theme preference
      themePreference: 'system' as ThemePreference,
      setThemePreference: (theme: ThemePreference) => set({ themePreference: theme }),

      // Default auth state
      authEntryRoute: 'welcome' as AuthEntryRoute,
      isAuthenticated: false,
      onboardingComplete: false,
      userRole: null as UserRole | null,
      userId: '',
      userName: '',
      profile: { ...EMPTY_PROFILE },
      setUserName: (name: string) => set({ userName: name }),
      updateProfile: (updates: Partial<UserProfile>) => set((state) => ({
        profile: { ...state.profile, ...updates },
      })),
      establishSession: (user: SessionUser) => set((state) => ({
        isAuthenticated: true,
        onboardingComplete: user.onboardingComplete,
        userRole: user.role,
        userId: user.id,
        userName: user.name,
        profile: { ...state.profile, email: user.email },
      })),
      login: (role: UserRole) => set((state) => ({
        isAuthenticated: true,
        onboardingComplete: state.userRole === role && !state.onboardingComplete
          ? false
          : true,
        userRole: role,
        userId: role === 'student' ? 'student-1' : role === 'employer' ? 'employer-1' : 'university-1',
        userName: state.userName || (role === 'student' ? 'Student' : role === 'employer' ? 'Employer' : 'University'),
      })),
      beginOnboarding: (role: UserRole) => set({
        isAuthenticated: true,
        onboardingComplete: false,
        userRole: role,
        userId: '',
      }),
      completeOnboarding: () => set((state) => {
        if (!state.userRole) return state;
        return {
          isAuthenticated: true,
          onboardingComplete: true,
          userName: state.userName || (state.userRole === 'student' ? 'Student' : state.userRole === 'employer' ? 'Employer' : 'University'),
        };
      }),
      cancelOnboarding: () => set(createAccountResetState('login')),
      clearSession: () => set((state) => createAccountResetState(state.authEntryRoute)),
      logout: () => set(createAccountResetState('login')),
      resetAccount: () => set(createAccountResetState('welcome')),

      // Location Preferences
      preferredLocation: 'Accra, Ghana',
      workSetup: 'Hybrid' as 'Remote' | 'Hybrid' | 'On-site',
      willingToRelocate: true,
      setLocationPreferences: (location: string, workSetup: 'Remote' | 'Hybrid' | 'On-site', willingToRelocate: boolean) =>
        set({ preferredLocation: location, workSetup, willingToRelocate }),

      // Academic Info
      university: '',
      programme: '',
      academicLevel: '',
      graduationYear: '',
      setAcademicInfo: (university: string, programme: string, academicLevel: string, graduationYear: string) =>
        set({ university, programme, academicLevel, graduationYear }),

      // Career interests
      careerInterests: [],
      setCareerInterests: (interests: string[]) => set({ careerInterests: interests }),

      // Default premium state
      isPremium: false,
      applicationsUsed: 0,
      applicationLimit: 3,
      setPremium: (value: boolean) => set({
        isPremium: value,
        applicationLimit: 3,
      }),
      incrementApplicationsUsed: () => {
        const { applicationsUsed } = get();
        set({ applicationsUsed: applicationsUsed + 1 });
      },
      resetApplications: () => set({ applicationsUsed: 0 }),

      // Applications
      applications: DEFAULT_APPLICATIONS,
      addApplication: (app: Application) => {
        const { applications } = get();
        set({ applications: [...applications, app] });
      },
      updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => {
        const { applications } = get();
        set({
          applications: applications.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  status,
                  updatedAt: new Date().toISOString(),
                  timeline: [
                    ...app.timeline,
                    createTimelineEvent(status, STATUS_LABELS[status], STATUS_DESCRIPTIONS[status], true),
                  ],
                }
              : app
          ),
        });
      },
      getApplicationsByStudent: (studentId: string) => {
        return get().applications.filter((app) => app.studentId === studentId);
      },
      getApplicationsByEmployer: (employerId: string) => {
        return get().applications.filter((app) => app.employerId === employerId);
      },
      getApplicationsByInternship: (internshipId: string) => {
        return get().applications.filter((app) => app.internshipId === internshipId);
      },
      withdrawApplication: (applicationId: string) => {
        const { applications } = get();
        set({
          applications: applications.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  status: 'withdrawn' as ApplicationStatus,
                  updatedAt: new Date().toISOString(),
                  timeline: [
                    ...app.timeline,
                    createTimelineEvent('withdrawn', STATUS_LABELS['withdrawn'], STATUS_DESCRIPTIONS['withdrawn'], true),
                  ],
                }
              : app
          ),
        });
      },

      // Drafts
      draftApplication: null,
      saveDraft: (draft: Partial<Application>) => set({ draftApplication: draft }),
      clearDraft: () => set({ draftApplication: null }),

      // Notifications
      notifications: DEFAULT_NOTIFICATIONS,
      addNotification: (notif: Notification) => {
        const { notifications } = get();
        set({ notifications: [notif, ...notifications] });
      },
      markNotificationRead: (notifId: string) => {
        const { notifications } = get();
        set({
          notifications: notifications.map((n) =>
            n.id === notifId ? { ...n, isRead: true } : n
          ),
        });
      },
      markAllNotificationsRead: (role: 'student' | 'employer') => {
        const { notifications } = get();
        set({
          notifications: notifications.map((n) =>
            n.role === role ? { ...n, isRead: true } : n
          ),
        });
      },
      getUnreadCount: (role: 'student' | 'employer') => {
        return get().notifications.filter((n) => n.role === role && !n.isRead).length;
      },

      // Saved Internships
      savedInternships: ['int-1', 'int-3'],
      toggleSavedInternship: (internshipId: string) => {
        const { savedInternships } = get();
        if (savedInternships.includes(internshipId)) {
          set({ savedInternships: savedInternships.filter((id) => id !== internshipId) });
        } else {
          set({ savedInternships: [...savedInternships, internshipId] });
        }
      },
      isInternshipSaved: (internshipId: string) => {
        return get().savedInternships.includes(internshipId);
      },

      // Listings
      listings: DEFAULT_LISTINGS,
      addListing: (listing: InternshipListing) => {
        const { listings } = get();
        set({ listings: [...listings, listing] });
      },
      updateListing: (listingId: string, updates: Partial<InternshipListing>) => {
        const { listings } = get();
        set({ listings: listings.map((l) => l.id === listingId ? { ...l, ...updates } : l) });
      },
      publishListing: (listingId: string) => {
        const { listings } = get();
        set({
          listings: listings.map((l) =>
            l.id === listingId ? { ...l, status: 'active' as const, publishedAt: new Date().toISOString() } : l
          ),
        });
      },
      getListingsByEmployer: (employerId: string) => {
        return get().listings.filter((l) => l.employerId === employerId);
      },

      // Conversations
      conversations: DEFAULT_CONVERSATIONS,
      addConversation: (conv: Conversation) => {
        const { conversations } = get();
        set({ conversations: [conv, ...conversations] });
      },
      findOrCreateConversation: (ownerId, participantId, participantName, participantInitials, participantColor, applicationId, internshipTitle) => {
        const { conversations } = get();
        const existing = conversations.find(
          (c) => c.ownerId === ownerId && c.participantId === participantId && c.applicationId === applicationId
        );
        if (existing) return existing;
        const newConv: Conversation = {
          id: 'conv-' + Date.now().toString(36),
          ownerId,
          participantId,
          participantName,
          participantInitials,
          participantColor,
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          isPinned: false,
          isMuted: false,
          isArchived: false,
          applicationId,
          internshipTitle,
        };
        set({ conversations: [newConv, ...conversations] });
        return newConv;
      },
      getConversationsByEmployer: (employerId: string) => {
        return get().conversations.filter((c) => c.ownerId === employerId);
      },
      markConversationRead: (convId: string) => {
        const { conversations } = get();
        set({ conversations: conversations.map((c) => c.id === convId ? { ...c, unreadCount: 0 } : c) });
      },
      togglePinConversation: (convId: string) => {
        const { conversations } = get();
        set({ conversations: conversations.map((c) => c.id === convId ? { ...c, isPinned: !c.isPinned } : c) });
      },
      archiveConversation: (convId: string) => {
        const { conversations } = get();
        set({ conversations: conversations.map((c) => c.id === convId ? { ...c, isArchived: !c.isArchived } : c) });
      },

      // Messages
      chatMessages: DEFAULT_CHAT_MESSAGES,
      addChatMessage: (msg: ChatMessage) => {
        const { chatMessages, conversations } = get();
        set({
          chatMessages: [...chatMessages, msg],
          conversations: conversations.map((c) =>
            c.id === msg.conversationId
              ? { ...c, lastMessage: msg.content, lastMessageTime: msg.timestamp, unreadCount: msg.senderId !== get().userId ? c.unreadCount + 1 : c.unreadCount }
              : c
          ),
        });
      },
      getMessagesByConversation: (convId: string) => {
        return get().chatMessages.filter((m) => m.conversationId === convId);
      },

      // Analytics
      getAnalytics: (employerId: string) => {
        const state = get();
        const apps = state.applications.filter((a) => a.employerId === employerId);
        const listings = state.listings.filter((l) => l.employerId === employerId);
        const now = Date.now();
        const weekAgo = now - 7 * 86400000;

        const byDay: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now - i * 86400000);
          byDay[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
        }
        apps.forEach((a) => {
          const day = new Date(a.submittedAt).toLocaleDateString('en-US', { weekday: 'short' });
          if (day in byDay) byDay[day]++;
        });

        const uniCount: Record<string, number> = {};
        const progCount: Record<string, number> = {};
        const skillCount: Record<string, number> = {};
        const statusCount: Record<string, number> = {};
        apps.forEach((a) => {
          const uni = a.internship.company;
          uniCount[uni] = (uniCount[uni] || 0) + 1;
          progCount['CS'] = (progCount['CS'] || 0) + 1;
          a.internship.skills.forEach((s) => { skillCount[s] = (skillCount[s] || 0) + 1; });
          statusCount[a.status] = (statusCount[a.status] || 0) + 1;
        });

        return {
          activeInternships: listings.filter((l) => l.status === 'active').length,
          totalApplications: apps.length,
          applicationsThisWeek: apps.filter((a) => new Date(a.submittedAt).getTime() > weekAgo).length,
          avgMatchScore: apps.length ? Math.round(apps.reduce((s, a) => s + a.internship.matchScore, 0) / apps.length) : 0,
          interviewsScheduled: apps.filter((a) => a.status === 'interview_scheduled').length,
          offersSent: apps.filter((a) => a.status === 'offer_received').length,
          acceptedOffers: apps.filter((a) => a.status === 'accepted').length,
          rejectedApplications: apps.filter((a) => a.status === 'rejected').length,
          pendingReview: apps.filter((a) => a.status === 'submitted' || a.status === 'viewed').length,
          totalViews: listings.reduce((s, l) => s + l.views, 0),
          conversionRate: apps.length ? Math.round((apps.filter((a) => a.status !== 'rejected').length / apps.length) * 100) : 0,
          interviewConversionRate: apps.length ? Math.round((apps.filter((a) => a.status === 'interview_scheduled' || a.status === 'offer_received' || a.status === 'accepted').length / apps.length) * 100) : 0,
          offerAcceptanceRate: apps.filter((a) => a.status === 'offer_received').length ? Math.round((apps.filter((a) => a.status === 'accepted').length / Math.max(apps.filter((a) => a.status === 'offer_received' || a.status === 'accepted').length, 1)) * 100) : 0,
          applicationsByDay: Object.entries(byDay).map(([day, count]) => ({ day, count })),
          applicationsByUniversity: Object.entries(uniCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
          applicationsByProgramme: Object.entries(progCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
          skillsDistribution: Object.entries(skillCount).map(([skill, count]) => ({ skill, count })).sort((a, b) => b.count - a.count).slice(0, 10),
          statusBreakdown: [
            { status: 'Submitted', count: statusCount['submitted'] || 0, color: '#2CACAD' },
            { status: 'Under Review', count: statusCount['under_review'] || 0, color: '#D97706' },
            { status: 'Shortlisted', count: statusCount['shortlisted'] || 0, color: '#10B981' },
            { status: 'Interview', count: statusCount['interview_scheduled'] || 0, color: '#8B5CF6' },
            { status: 'Offer', count: statusCount['offer_received'] || 0, color: '#059669' },
            { status: 'Rejected', count: statusCount['rejected'] || 0, color: '#EF4444' },
          ],
          topListings: listings.map((l) => ({ title: l.title, applications: l.applicantCount, views: l.views })).sort((a, b) => b.applications - a.applications),
        };
      },
    }),
    {
      name: 'internlink-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 3,
      partialize: (state) => ({
        themePreference: state.themePreference,
        authEntryRoute: state.authEntryRoute,
        profile: state.profile,
        preferredLocation: state.preferredLocation,
        workSetup: state.workSetup,
        willingToRelocate: state.willingToRelocate,
        university: state.university,
        programme: state.programme,
        academicLevel: state.academicLevel,
        graduationYear: state.graduationYear,
        careerInterests: state.careerInterests,
        isPremium: state.isPremium,
        applicationsUsed: state.applicationsUsed,
        applicationLimit: state.applicationLimit,
      }),
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<AppState>;
        return {
          ...state,
          ...(version < 1 && !state.isAuthenticated ? { userRole: null, userId: '' } : {}),
          onboardingComplete: version < 2 ? Boolean(state.isAuthenticated) : state.onboardingComplete ?? false,
          ...(version < 3 ? {
            isAuthenticated: false,
            onboardingComplete: false,
            userRole: null,
            userId: '',
            userName: '',
          } : {}),
          profile: { ...EMPTY_PROFILE, ...(state.profile ?? {}) },
          applicationLimit: 3,
          isPremium: state.isPremium ?? false,
        };
      },
      onRehydrateStorage: () => (state) => {
        void migrateLegacyProfileStorage(state).finally(() => {
          if (state) state.setHasHydrated(true);
          else useAppStore.setState({ hasHydrated: true });
        });
      },
    }
  )
);

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  submitted: 'Application Submitted',
  viewed: 'Application Viewed',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled',
  assessment: 'Assessment Assigned',
  offer_received: 'Offer Received',
  accepted: 'Offer Accepted',
  rejected: 'Not Selected',
  withdrawn: 'Application Withdrawn',
};

const STATUS_DESCRIPTIONS: Record<ApplicationStatus, string> = {
  draft: 'Your application is saved as a draft',
  submitted: 'Your application has been sent to the employer',
  viewed: 'The employer has viewed your application',
  under_review: 'Your application is being reviewed by the hiring team',
  shortlisted: 'Congratulations! You have been shortlisted',
  interview_scheduled: 'An interview has been scheduled',
  assessment: 'An assessment has been assigned to you',
  offer_received: 'You have received an offer!',
  accepted: 'You have accepted the offer',
  rejected: 'Unfortunately, you were not selected',
  withdrawn: 'You have withdrawn your application',
};
