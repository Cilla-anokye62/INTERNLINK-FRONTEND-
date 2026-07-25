export { ApiError, createApiClient } from './client';
export type { ApiClient, ApiClientConfig, ApiRequestOptions } from './client';
export { authApi } from './authApi';
export { studentApi } from './studentApi';
export { companyApi } from './companyApi';
export { universityApi } from './universityApi';
export { referenceDataApi } from './referenceDataApi';
export { listingApi } from './listingApi';
export { listingToInternshipData } from './listingMappers';
export { applicationApi } from './applicationApi';
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
  CareerInterestOption,
  CompanyProfileResponse,
  CompanySize,
  CompanyWorkSetup,
  EmailRoleRequest,
  LoginRequest,
  CreateListingRequest,
  ListingResponse,
  MessageResponse,
  PaginatedResponse,
  RefreshSessionRequest,
  ResetPasswordRequest,
  RegistrationResponse,
  SignUpRequest,
  SkillOption,
  StudentOnboardingOptionsResponse,
  StudentProfileResponse,
  UniversitySummary,
  UniversityInstitutionType,
  UniversityProfileResponse,
  UpdateStudentProfileRequest,
  UpdateCompanyProfileRequest,
  UpdateListingRequest,
  UpdateUniversityProfileRequest,
  VerifyEmailRequest,
} from './types';
