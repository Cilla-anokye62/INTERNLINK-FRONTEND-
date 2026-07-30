import type { UserRole } from '../store/useAppStore';

export interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: unknown;
  fieldErrors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  total?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  onboardingComplete: boolean;
}

export interface AuthSession {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export type BackendAuthRole = 'STUDENT' | 'EMPLOYER' | 'UNIVERSITY';

export interface RegistrationResponse {
  accountId: number;
  email: string;
  role: BackendAuthRole;
  verificationRequired: boolean;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface SignUpRequest extends LoginRequest {
  name: string;
  role: UserRole;
  consentAccepted: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
  role: UserRole;
}

export interface RefreshSessionRequest {
  refreshToken: string;
}

export interface EmailRoleRequest {
  email: string;
  role: UserRole;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}

export type BackendListingStatus = 'OPEN' | 'CLOSED';

export interface CreateListingRequest {
  title: string;
  description?: string;
  duration?: string;
  location?: string;
  remote: boolean;
  industry?: string;
  deadline?: string;
  allowance?: string;
  requiredSkills: string[];
  department?: string;
  employmentType?: string;
  category?: string;
  branch?: string;
  openPositions?: number;
  responsibilities?: string;
  dailyTasks?: string;
  learningOutcomes?: string;
  teamInfo?: string;
  preferredSkills?: string[];
  studentLevel?: string;
  degreeProgramme?: string;
  minimumGpa?: number;
  paid?: boolean;
  benefits?: string[];
  workMode?: 'REMOTE' | 'HYBRID' | 'ONSITE';
  workingHours?: string;
  maxApplicants?: number;
  allowCoverLetter?: boolean;
  resumeRequired?: boolean;
  portfolioRequired?: boolean;
  autoScreening?: boolean;
  aiMatching?: boolean;
  requiredDocuments?: string[];
}

export type UpdateListingRequest = Partial<CreateListingRequest>;

export interface ListingResponse {
  id: number;
  companyId: number;
  companyName: string;
  title: string;
  description: string | null;
  duration: string | null;
  location: string | null;
  remote: boolean;
  industry: string | null;
  deadline: string | null;
  allowance: string | null;
  status: BackendListingStatus;
  multiStage: boolean;
  requiredSkills: string[];
  department: string | null;
  employmentType: string | null;
  category: string | null;
  branch: string | null;
  openPositions: number;
  responsibilities: string | null;
  dailyTasks: string | null;
  learningOutcomes: string | null;
  teamInfo: string | null;
  preferredSkills: string[];
  studentLevel: string | null;
  degreeProgramme: string | null;
  minimumGpa: number | null;
  paid: boolean;
  benefits: string[];
  workMode: string | null;
  workingHours: string | null;
  maxApplicants: number | null;
  allowCoverLetter: boolean;
  resumeRequired: boolean;
  portfolioRequired: boolean;
  autoScreening: boolean;
  aiMatching: boolean;
  requiredDocuments: string[];
  viewCount: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BackendApplicationStatus = 'APPLIED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';

export interface BackendApplicationResponse {
  id: number;
  listingId: number;
  listingTitle: string;
  companyId: number;
  companyName: string;
  status: BackendApplicationStatus;
  trackingLocked: boolean;
  promptSubscription: boolean;
  coverLetter: string | null;
  motivation: string | null;
  whyThisInternship: string | null;
  strongCandidate: string | null;
  portfolioLinks: Record<string, string>;
  earliestStartDate: string | null;
  expectedDuration: string | null;
  preferredWorkMode: string | null;
  canRelocate: boolean | null;
  appliedAt: string;
  updatedAt: string;
}

export interface BackendApplicantResponse {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string | null;
  status: BackendApplicationStatus;
  appliedAt: string;
  updatedAt: string;
}

export type ApplicationFileKind = 'RESUME' | 'COVER_LETTER' | 'PORTFOLIO' | 'OTHER';

export interface ApplicationFileResponse {
  id: number;
  applicationId: number;
  kind: ApplicationFileKind;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface ApplicantDetailResponse extends BackendApplicantResponse {
  listingId: number;
  listingTitle: string;
  universityId: number | null;
  universityName: string | null;
  phoneNumber: string | null;
  program: string | null;
  level: string | null;
  background: string | null;
  preferredLocation: string | null;
  willingToRelocate: boolean;
  personalEssay: string | null;
  coverLetter: string | null;
  motivation: string | null;
  whyThisInternship: string | null;
  strongCandidate: string | null;
  portfolioLinks: Record<string, string>;
  earliestStartDate: string | null;
  expectedDuration: string | null;
  preferredWorkMode: string | null;
  canRelocate: boolean | null;
  skills: string[];
  careerInterests: string[];
  files: ApplicationFileResponse[];
}

export interface BookmarkResponse {
  id: number;
  listingId: number;
  listingTitle: string;
  companyName: string;
  createdAt: string;
}

export type BackendNotificationType =
  | 'APPLICATION_STATUS_CHANGED'
  | 'STAGE_TRANSITION'
  | 'INTERVIEW_SCHEDULED'
  | 'NEW_APPLICATION'
  | 'NEW_MESSAGE'
  | 'OFFER_RECEIVED'
  | 'OFFER_DECIDED'
  | 'ACCOUNT_UPDATE';

export interface BackendNotificationResponse {
  id: number;
  type: BackendNotificationType;
  message: string;
  createdAt: string;
  readAt: string | null;
  read: boolean;
}

export interface BackendMessageResponse {
  id: number;
  conversationId: number;
  senderRole: 'STUDENT' | 'EMPLOYER';
  senderAccountId: number;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export interface ConversationResponse {
  id: number;
  applicationId: number;
  listingId: number;
  listingTitle: string;
  studentId: number;
  studentName: string;
  companyId: number;
  companyName: string;
  lastMessage: BackendMessageResponse | null;
  unreadCount: number;
  updatedAt: string;
}

export interface OfferResponse {
  id: number;
  applicationId: number;
  listingId: number;
  listingTitle: string;
  companyId: number;
  companyName: string;
  studentId: number;
  studentName: string;
  title: string;
  message: string | null;
  startDate: string | null;
  endDate: string | null;
  compensation: string | null;
  expiresAt: string | null;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN';
  sentAt: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccountPreferenceResponse {
  emailNotifications: boolean;
  pushNotifications: boolean;
  applicationUpdates: boolean;
  messageUpdates: boolean;
  marketingEmails: boolean;
  profileVisible: boolean;
  analyticsConsent: boolean;
  personalizedRecommendations: boolean;
  updatedAt: string;
}

export type UpdateAccountPreferenceRequest = Partial<Omit<AccountPreferenceResponse, 'updatedAt'>>;

export interface SocialProviderStatusResponse {
  provider: 'GOOGLE' | 'APPLE';
  enabled: boolean;
  status: string;
}

export interface ListingAnalyticsResponse {
  listingId: number;
  title: string;
  status: string;
  views: number;
  applicants: number;
  active: number;
  accepted: number;
  rejected: number;
  applicationConversionRate: number;
  acceptanceRate: number;
}

export interface CompanyAnalyticsResponse {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalApplicants: number;
  acceptedApplicants: number;
  overallApplicationConversionRate: number;
  overallAcceptanceRate: number;
  candidateSkills: Record<string, number>;
  listings: ListingAnalyticsResponse[];
}

export interface RecommendationResponse {
  internshipId: number;
  title: string;
  companyName: string;
  matchScore: number;
}

export type StageType = 'FORM_REVIEW' | 'INTERVIEW' | 'MANAGER_SESSION' | 'CUSTOM';
export type StageStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PipelineStageResponse {
  id: number;
  stageOrder: number;
  name: string;
  type: StageType;
}

export interface ApplicationStageProgressResponse {
  id: number;
  stageOrder: number;
  stageName: string;
  stageType: StageType;
  status: StageStatus;
  interviewLink: string | null;
  interviewLinkExpiresAt: string | null;
  studentMeetingLink: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export type DocumentType = 'COVER_LETTER' | 'APPLICATION_ESSAY' | 'INTRO_EMAIL';
export type DocumentStatus = 'DRAFT' | 'APPROVED' | 'SUBMITTED';

export interface DocumentDraftResponse {
  id: number;
  documentType: DocumentType;
  status: DocumentStatus;
  draftText: string;
}

export type SubscriptionAudienceRole = 'STUDENT' | 'EMPLOYER' | 'UNIVERSITY';
export type BillingInterval = 'NONE' | 'WEEK' | 'MONTH' | 'YEAR';
export type SubscriptionStatus =
  | 'FREE'
  | 'PENDING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'EXPIRED'
  | 'REVOKED';

export type PremiumFeature =
  | 'STUDENT_APPLICATIONS'
  | 'STUDENT_APPLICATION_TRACKING'
  | 'STUDENT_APPLICATION_NOTIFICATIONS'
  | 'COMPANY_ACTIVE_LISTINGS'
  | 'COMPANY_ADVANCED_ANALYTICS'
  | 'COMPANY_REPORT_EXPORT'
  | 'COMPANY_PIPELINE_WORKFLOW'
  | 'UNIVERSITY_ADVANCED_ANALYTICS'
  | 'UNIVERSITY_REPORT_EXPORT'
  | 'UNIVERSITY_EMPLOYER_INSIGHTS';

export interface EntitlementResponse {
  featureKey: PremiumFeature;
  enabled: boolean;
  limit: number | null;
  used: number;
  remaining: number | null;
}

export interface SubscriptionPlanResponse {
  id: number;
  code: string;
  audienceRole: SubscriptionAudienceRole;
  displayName: string;
  description: string | null;
  billingInterval: BillingInterval;
  intervalCount: number;
  priceMinor: number | null;
  currency: string | null;
  active: boolean;
  displayOrder: number;
  purchasable: boolean;
  paystackMode: 'TEST' | 'LIVE' | null;
  entitlements: EntitlementResponse[];
}

export interface SubscriptionSnapshotResponse {
  subscriptionId: number | null;
  plan: SubscriptionPlanResponse;
  status: SubscriptionStatus;
  premiumActive: boolean;
  provider: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  entitlements: EntitlementResponse[];
}

export interface SubscriptionRecordResponse {
  id: number;
  ownerRole: SubscriptionAudienceRole;
  ownerId: number;
  planCode: string;
  planName: string;
  status: Exclude<SubscriptionStatus, 'FREE'>;
  provider: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  createdAt: string;
}

export interface BillingTransactionResponse {
  id: number;
  subscriptionId: number;
  provider: string;
  transactionId: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED' | 'REVERSED';
  amountMinor: number | null;
  currency: string | null;
  occurredAt: string;
}

export interface PaystackCheckoutResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  testMode: boolean;
}

export interface StudentDataExportResponse {
  profile: StudentProfileResponse;
  applications: BackendApplicationResponse[];
  bookmarks: BookmarkResponse[];
  notifications: BackendNotificationResponse[];
}

export interface CompanyDataExportResponse {
  profile: CompanyProfileResponse;
  listings: ListingResponse[];
}

export type PlacementStatus = 'NOT_STARTED' | 'SEARCHING' | 'PLACED';

export interface StudentPlacementResponse {
  studentId: number;
  fullName: string;
  email: string | null;
  program: string | null;
  level: string | null;
  placementStatus: PlacementStatus;
  applicationCount: number;
}

export interface PlacementStatisticsResponse {
  totalStudents: number;
  notStartedCount: number;
  searchingCount: number;
  placedCount: number;
  totalApplications: number;
}

export interface CompanyEngagementResponse {
  companyId: number;
  companyName: string;
  applicationCount: number;
  acceptedCount: number;
}

export interface UniversitySummary {
  id: number;
  name: string;
}

export interface UpdateStudentProfileRequest {
  fullName?: string;
  universityId?: number;
  background?: string;
  program?: string;
  level?: string;
  skills?: string[];
  careerInterests?: string[];
  targetCompanies?: string[];
  preferredLocation?: string;
  willingToRelocate?: boolean;
  personalEssay?: string;
}

export interface StudentProfileResponse {
  id: number;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  universityId: number | null;
  universityName: string | null;
  background: string | null;
  program: string | null;
  level: string | null;
  skills: string[];
  careerInterests: string[];
  targetCompanies: string[];
  preferredLocation: string | null;
  willingToRelocate: boolean;
  personalEssay: string | null;
  subscriptionPlan: string;
  subscriptionActive: boolean;
  subscriptionExpiresAt: string | null;
  freeApplicationsRemaining: number;
  suspended: boolean;
  emailVerified: boolean;
  onboardingComplete: boolean;
  profileImageUrl: string | null;
  createdAt: string;
}

export interface SkillOption {
  id: number;
  name: string;
  popular: boolean;
}

export interface CareerInterestOption {
  id: number;
  code: string;
  name: string;
}

export interface StudentOnboardingOptionsResponse {
  skills: SkillOption[];
  careerInterests: CareerInterestOption[];
}

export type CompanySize = '1-10' | '11-50' | '51-200' | '200+';
export type CompanyWorkSetup = 'Remote' | 'Hybrid' | 'On-site';

export interface UpdateCompanyProfileRequest {
  companyName?: string;
  phoneNumber?: string;
  website?: string;
  industry?: string;
  companySize?: CompanySize | '';
  headquarters?: string;
  description?: string;
  internshipCategories?: string[];
  preferredQualifications?: string[];
  workSetup?: CompanyWorkSetup | '';
}

export interface CompanyProfileResponse {
  id: number;
  companyName: string;
  email: string;
  phoneNumber: string | null;
  verified: boolean;
  description: string | null;
  website: string | null;
  industry: string | null;
  companySize: CompanySize | null;
  headquarters: string | null;
  internshipCategories: string[];
  preferredQualifications: string[];
  workSetup: CompanyWorkSetup | null;
  suspended: boolean;
  onboardingComplete: boolean;
  logoUrl: string | null;
  createdAt: string;
}

export type UniversityInstitutionType = 'Public' | 'Private' | 'Hybrid';

export interface UpdateUniversityProfileRequest {
  name?: string;
  phoneNumber?: string;
  website?: string;
  institutionType?: UniversityInstitutionType | '';
  country?: string;
  city?: string;
  studentCount?: number | null;
  academicPrograms?: string[];
  careerServicesContactName?: string;
  departmentEmail?: string;
  internshipCoordinatorName?: string;
  internshipCoordinatorEmail?: string;
}

export interface UniversityProfileResponse {
  id: number;
  name: string;
  contactEmail: string;
  phoneNumber: string | null;
  website: string | null;
  institutionType: UniversityInstitutionType | null;
  country: string | null;
  city: string | null;
  studentCount: number | null;
  academicPrograms: string[];
  careerServicesContactName: string | null;
  departmentEmail: string | null;
  internshipCoordinatorName: string | null;
  internshipCoordinatorEmail: string | null;
  suspended: boolean;
  emailVerified: boolean;
  onboardingComplete: boolean;
  logoUrl: string | null;
  createdAt: string;
}
