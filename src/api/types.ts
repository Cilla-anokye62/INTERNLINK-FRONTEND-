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
  promptSubscription: boolean;
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
  createdAt: string;
}
