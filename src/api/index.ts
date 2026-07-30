export { ApiConnectionError, ApiError, createApiClient } from './client';
export type { ApiClient, ApiClientConfig, ApiRequestOptions } from './client';
export { authApi } from './authApi';
export { studentApi } from './studentApi';
export { companyApi } from './companyApi';
export { universityApi } from './universityApi';
export { referenceDataApi } from './referenceDataApi';
export { listingApi } from './listingApi';
export { listingToInternshipData } from './listingMappers';
export { applicationApi } from './applicationApi';
export { bookmarkApi } from './bookmarkApi';
export { notificationApi } from './notificationApi';
export { stageApi } from './stageApi';
export { documentApi } from './documentApi';
export { messagingApi } from './messagingApi';
export { offerApi } from './offerApi';
export { mediaApi, resolveMediaUrl } from './mediaApi';
export type { MediaUploadResponse, UploadableImage } from './mediaApi';
export { accountApi } from './accountApi';
export { analyticsApi } from './analyticsApi';
export { subscriptionApi } from './subscriptionApi';
export { signInWithGoogle } from './googleAuth';
export { registerForPushNotifications } from './pushNotifications';
export { completeCompanyOnboarding } from './companyOnboarding';
export { completeUniversityOnboarding } from './universityOnboarding';
export { completeStudentOnboarding } from './studentOnboarding';
export type {
  CompleteStudentOnboardingRequest,
  CompleteStudentOnboardingResult,
} from './studentOnboarding';
export { apiBaseUrl, apiClient, publicApiClient } from './configuredClient';
export {
  getAuthErrorMessage,
  registerAccount,
  restoreSession,
  signIn,
  signInWithGoogleToken,
  signOut,
  verifyEmail,
} from './authSession';
export type {
  ApiErrorBody,
  AuthenticatedUser,
  AuthSession,
  BackendApplicantResponse,
  BackendApplicationResponse,
  BackendApplicationStatus,
  BackendAuthRole,
  BackendNotificationResponse,
  BackendNotificationType,
  BackendMessageResponse,
  ConversationResponse,
  OfferResponse,
  AccountPreferenceResponse,
  UpdateAccountPreferenceRequest,
  SocialProviderStatusResponse,
  CompanyAnalyticsResponse,
  ListingAnalyticsResponse,
  ApplicationFileResponse,
  ApplicationFileKind,
  ApplicantDetailResponse,
  BookmarkResponse,
  CareerInterestOption,
  CompanyDataExportResponse,
  CompanyEngagementResponse,
  CompanyProfileResponse,
  CompanySize,
  CompanyWorkSetup,
  EmailRoleRequest,
  LoginRequest,
  CreateListingRequest,
  DocumentDraftResponse,
  DocumentStatus,
  DocumentType,
  ApplicationStageProgressResponse,
  ListingResponse,
  MessageResponse,
  PaginatedResponse,
  PipelineStageResponse,
  PlacementStatisticsResponse,
  PlacementStatus,
  RecommendationResponse,
  RefreshSessionRequest,
  ResetPasswordRequest,
  RegistrationResponse,
  SignUpRequest,
  SkillOption,
  StudentOnboardingOptionsResponse,
  StudentDataExportResponse,
  StudentPlacementResponse,
  StudentProfileResponse,
  StageStatus,
  StageType,
  SubscriptionAudienceRole,
  BillingInterval,
  SubscriptionStatus,
  PremiumFeature,
  EntitlementResponse,
  SubscriptionPlanResponse,
  SubscriptionSnapshotResponse,
  SubscriptionRecordResponse,
  BillingTransactionResponse,
  PaystackCheckoutResponse,
  UniversitySummary,
  UniversityInstitutionType,
  UniversityProfileResponse,
  UpdateStudentProfileRequest,
  UpdateCompanyProfileRequest,
  UpdateListingRequest,
  UpdateUniversityProfileRequest,
  VerifyEmailRequest,
} from './types';
