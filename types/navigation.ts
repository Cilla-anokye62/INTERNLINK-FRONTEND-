import type { NavigatorScreenParams } from '@react-navigation/native';
import type { InternshipData } from '../src/types/application';
import type { UserRole } from '../src/store/useAppStore';

type FlexibleParams = Record<string, unknown> | undefined;

export type StudentHomeStackParamList = {
  HomeDashboard: undefined;
  StudentMessages: undefined;
  HelpSupport: undefined;
  Calendar: undefined;
  ReferFriend: undefined;
};

export type StudentTabParamList = {
  Home: NavigatorScreenParams<StudentHomeStackParamList> | undefined;
  Discover: undefined;
  Saved: undefined;
  Applications: undefined;
  Profile: undefined;
};

/**
 * Routes registered by the active root stack in App.tsx.
 * Nested tab and Home stack routes are intentionally typed by their own navigators.
 */
export type RootStackParamList = {
  Splash: undefined;
  WelcomeOnboarding: undefined;
  RoleSelection: undefined;
  Login: undefined;
  SignUp: { role: UserRole };
  Verification: { role: UserRole; email: string };
  ForgotPassword: { role?: UserRole } | undefined;
  ResetPassword: { token?: string } | undefined;
  Onboarding: undefined;

  AcademicInfo: undefined;
  Skills: { isEditing?: boolean; initialSkills?: string[]; fromProfile?: boolean } | undefined;
  CareerInterests: undefined;
  PreferredLocation: undefined;
  ProfileCompletion: undefined;
  StudentApp: NavigatorScreenParams<StudentTabParamList> | undefined;
  InternshipDetails: { internship?: InternshipData } | undefined;
  StudentEditProfile: FlexibleParams;
  ApplicationReview: { internship: InternshipData };
  ResumeSelection: FlexibleParams;
  AdditionalInfo: FlexibleParams;
  PortfolioLinks: FlexibleParams;
  Availability: FlexibleParams;
  ReviewApplication: FlexibleParams;
  ApplicationSubmitted: FlexibleParams;
  ApplicationDetails: { applicationId: string };
  Notifications: undefined;
  StudentChatScreen: FlexibleParams;

  UniversityInfo: undefined;
  InstitutionDetails: undefined;
  CareerServicesSetup: undefined;
  ReviewComplete: undefined;
  UniversityTabs: undefined;
  PlacementOverview: undefined;
  CompanyEngagement: undefined;
  StudentDetail: { studentId: string } | undefined;
  CompanyDetail: { companyId: string } | undefined;
  UniversityNotifications: undefined;
  UniversityEditProfile: undefined;

  CompanyInformation: undefined;
  RecruitmentPreferences: undefined;
  CompanyReviewComplete: undefined;
  CompanyDetails: undefined;
  CompanyProfileCompletion: undefined;
  CompanyTabs: undefined;
  CompanyProfile: undefined;
  NewInternshipDetails: FlexibleParams;
  ApplicantProfile: { applicationId: string };
  InterviewSchedule: { applicationId: string };
  OfferSend: { applicationId: string };
  PostInternshipWizard: undefined;
  Messages: undefined;
  ChatScreen: FlexibleParams;
  Insights: undefined;

  DiscoverEmpty: undefined;
  NoConnection: FlexibleParams;
  SearchResults: FlexibleParams;
  LoadingState: FlexibleParams;
  ActionSuccessful: FlexibleParams;

  Settings: { role?: UserRole } | undefined;
  PersonalInfo: undefined;
  EmailPassword: undefined;
  ConnectedAccounts: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  LanguageSettings: undefined;
  AppearanceSettings: undefined;
  HelpCenter: undefined;
  SendFeedback: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  DeleteAccount: undefined;
  JobPreferences: undefined;
  DataStorage: undefined;
  Accessibility: undefined;
  CalendarSync: undefined;
  ReportProblem: undefined;
  About: undefined;

  PremiumPaywall: undefined;
  Payment: { plan?: 'monthly' | 'annual' } | undefined;
  PremiumConfirmation: undefined;
  PremiumManage: undefined;
};
