import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LanguageCode } from '../constants/languages';
import {
  Application,
  ApplicationStatus,
  Notification,
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
  languageCode: LanguageCode;
  setLanguageCode: (languageCode: LanguageCode) => void;

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
  applications: [],
  draftApplication: null,
  notifications: [],
  savedInternships: [],
  listings: [],
  conversations: [],
  chatMessages: [],
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
      languageCode: 'en' as LanguageCode,
      setLanguageCode: (languageCode: LanguageCode) => set({ languageCode }),

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

      // Applications
      applications: [],
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
      notifications: [],
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
      listings: [],
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
      conversations: [],
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
      chatMessages: [],
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
      version: 5,
      partialize: (state) => ({
        themePreference: state.themePreference,
        languageCode: state.languageCode,
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
      }),
      migrate: (persistedState, version) => {
        const state = { ...(persistedState as Partial<AppState>) } as Partial<AppState> & Record<string, unknown>;
        delete state.isPremium;
        delete state.applicationsUsed;
        delete state.applicationLimit;
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
          languageCode: state.languageCode ?? 'en',
          profile: { ...EMPTY_PROFILE, ...(state.profile ?? {}) },
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
