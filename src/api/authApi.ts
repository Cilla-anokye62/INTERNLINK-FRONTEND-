import type { UserRole } from '../store/useAppStore';
import { apiClient, publicApiClient } from './configuredClient';
import type {
  AuthSession,
  EmailRoleRequest,
  LoginRequest,
  MessageResponse,
  RegistrationResponse,
  ResetPasswordRequest,
  SignUpRequest,
  VerifyEmailRequest,
} from './types';

const endpointRole: Record<UserRole, 'students' | 'companies' | 'universities'> = {
  student: 'students',
  employer: 'companies',
  university: 'universities',
};

const registrationBody = ({ name, email, password, consentAccepted, role }: SignUpRequest) => {
  if (role === 'student') {
    return { fullName: name, email, password, consentAccepted };
  }
  if (role === 'employer') {
    return { companyName: name, email, password, consentAccepted };
  }
  return { name, contactEmail: email, password, consentAccepted };
};

export const authApi = {
  register(request: SignUpRequest) {
    return publicApiClient.request<RegistrationResponse>(
      `/api/auth/${endpointRole[request.role]}/register`,
      {
        method: 'POST',
        body: registrationBody(request),
        requiresAuth: false,
      },
    );
  },

  login(role: UserRole, request: LoginRequest) {
    return publicApiClient.request<AuthSession>(`/api/auth/${endpointRole[role]}/login`, {
      method: 'POST',
      body: request,
      requiresAuth: false,
    });
  },

  verifyEmail(request: VerifyEmailRequest) {
    return publicApiClient.request<AuthSession>('/api/auth/verify-email', {
      method: 'POST',
      body: request,
      requiresAuth: false,
    });
  },

  resendVerification(request: EmailRoleRequest) {
    return publicApiClient.request<MessageResponse>('/api/auth/resend-verification', {
      method: 'POST',
      body: request,
      requiresAuth: false,
    });
  },

  forgotPassword(request: EmailRoleRequest) {
    return publicApiClient.request<MessageResponse>('/api/auth/forgot-password', {
      method: 'POST',
      body: request,
      requiresAuth: false,
    });
  },

  resetPassword(request: ResetPasswordRequest) {
    return publicApiClient.request<void>('/api/auth/reset-password', {
      method: 'POST',
      body: request,
      requiresAuth: false,
    });
  },

  logout() {
    return apiClient.request<void>('/api/auth/logout', { method: 'POST' });
  },

  completeOnboarding() {
    return apiClient.request<void>('/api/auth/onboarding-complete', { method: 'POST' });
  },
};
