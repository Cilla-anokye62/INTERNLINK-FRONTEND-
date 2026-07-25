export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'viewed'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'assessment'
  | 'offer_received'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export type WorkMode = 'remote' | 'hybrid' | 'onsite';

export type StudentLevel = 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';

export type Duration = '4 weeks' | '8 weeks' | '12 weeks' | '16 weeks' | '6 months' | '1 year';

export interface InternshipData {
  id: string;
  backendListingId?: number;
  title: string;
  company: string;
  companyId: string;
  companyLogo: string;
  companyColor: string;
  location: string;
  workMode: WorkMode;
  salary: string;
  duration: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  matchScore: number;
  applicants: number;
  postedDate: string;
  closingDate: string;
}

export interface Resume {
  id: string;
  name: string;
  type: 'pdf' | 'docx';
  uri: string;
  uploadDate: string;
  size: string;
}

export interface PortfolioLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  behance?: string;
  dribbble?: string;
  personalWebsite?: string;
}

export interface Availability {
  earliestStartDate: string;
  expectedDuration: string;
  studentLevel: StudentLevel;
  preferredWorkMode: WorkMode;
  canRelocate: boolean;
}

export interface ApplicationDraft {
  internshipId: string;
  resumeId: string | null;
  coverLetter: string;
  motivationStatement: string;
  whyThisInternship: string;
  strongCandidateReason: string;
  portfolioLinks: PortfolioLinks;
  availability: Availability;
}

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  employerId: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  resume: Resume | null;
  coverLetter: string;
  motivationStatement: string;
  whyThisInternship: string;
  strongCandidateReason: string;
  portfolioLinks: PortfolioLinks;
  availability: Availability;
  internship: InternshipData;
  timeline: ApplicationTimelineEvent[];
  messages: ApplicationMessage[];
  interview: InterviewData | null;
  offer: OfferData | null;
}

export interface ApplicationTimelineEvent {
  id: string;
  status: ApplicationStatus;
  label: string;
  description: string;
  timestamp: string;
  isActive: boolean;
}

export interface ApplicationMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface InterviewData {
  id: string;
  applicationId: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  meetingLink?: string;
  notes?: string;
  type: 'video' | 'phone' | 'onsite';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface OfferData {
  id: string;
  applicationId: string;
  salary: string;
  benefits: string[];
  startDate: string;
  expirationDate: string;
  offerLetter: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface Notification {
  id: string;
  type: 'application_submitted' | 'application_viewed' | 'status_changed' | 'interview_scheduled' | 'assessment_assigned' | 'offer_received' | 'rejected' | 'new_application' | 'student_responded' | 'interview_accepted' | 'offer_accepted';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  applicationId?: string;
  userId: string;
  role: 'student' | 'employer';
}

export interface ApplicantWithApplication {
  applicationId: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  initials: string;
  university: string;
  programme: string;
  matchScore: number;
  appliedDate: string;
  status: ApplicationStatus;
  resumeAvailable: boolean;
  skills: string[];
  coverLetter: string;
  availability: Availability;
  portfolioLinks: PortfolioLinks;
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: '#64748B', bgColor: '#F1F5F9' },
  submitted: { label: 'Submitted', color: '#2CACAD', bgColor: '#D4F0EE' },
  viewed: { label: 'Viewed', color: '#3B82F6', bgColor: '#DBEAFE' },
  under_review: { label: 'Under Review', color: '#D97706', bgColor: '#FEF3C7' },
  shortlisted: { label: 'Shortlisted', color: '#10B981', bgColor: '#D1FAE5' },
  interview_scheduled: { label: 'Interview', color: '#8B5CF6', bgColor: '#EDE9FE' },
  assessment: { label: 'Assessment', color: '#F59E0B', bgColor: '#FEF3C7' },
  offer_received: { label: 'Offer', color: '#10B981', bgColor: '#D1FAE5' },
  accepted: { label: 'Accepted', color: '#059669', bgColor: '#D1FAE5' },
  rejected: { label: 'Rejected', color: '#EF4444', bgColor: '#FEE2E2' },
  withdrawn: { label: 'Withdrawn', color: '#6B7280', bgColor: '#F3F4F6' },
};

export const TIMELINE_STEPS: ApplicationStatus[] = [
  'submitted',
  'viewed',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'offer_received',
  'accepted',
];

// ===== Internship Listings (Employer-created) =====
export type InternshipListingStatus = 'active' | 'paused' | 'draft' | 'closed';

export interface InternshipListing {
  id: string;
  employerId: string;
  title: string;
  department: string;
  employmentType: string;
  category: string;
  branch: string;
  openPositions: number;
  description: string;
  responsibilities: string[];
  dailyTasks: string[];
  learningOutcomes: string[];
  teamInfo: string;
  requiredSkills: string[];
  preferredSkills: string[];
  studentLevel: string;
  degreeProgramme: string;
  minGpa: string;
  requiredDocuments: string[];
  isPaid: boolean;
  monthlyStipend: string;
  benefits: string[];
  workMode: WorkMode;
  location: string;
  duration: string;
  workingHours: string;
  deadline: string;
  autoClose: boolean;
  maxApplicants: number;
  allowCoverLetter: boolean;
  resumeRequired: boolean;
  portfolioRequired: boolean;
  autoScreening: boolean;
  aiMatching: boolean;
  status: InternshipListingStatus;
  views: number;
  applicantCount: number;
  createdAt: string;
  publishedAt: string | null;
}

// ===== Messaging =====
export interface Conversation {
  id: string;
  ownerId: string;
  participantId: string;
  participantName: string;
  participantInitials: string;
  participantColor: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  applicationId?: string;
  internshipTitle?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'system' | 'file' | 'interview_invite' | 'offer';
  fileName?: string;
}

// ===== Analytics =====
export interface EmployerAnalytics {
  activeInternships: number;
  totalApplications: number;
  applicationsThisWeek: number;
  avgMatchScore: number;
  interviewsScheduled: number;
  offersSent: number;
  acceptedOffers: number;
  rejectedApplications: number;
  pendingReview: number;
  totalViews: number;
  conversionRate: number;
  interviewConversionRate: number;
  offerAcceptanceRate: number;
  applicationsByDay: { day: string; count: number }[];
  applicationsByUniversity: { name: string; count: number }[];
  applicationsByProgramme: { name: string; count: number }[];
  skillsDistribution: { skill: string; count: number }[];
  statusBreakdown: { status: string; count: number; color: string }[];
  topListings: { title: string; applications: number; views: number }[];
}
