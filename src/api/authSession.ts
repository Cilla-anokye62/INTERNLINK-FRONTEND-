import type { UserRole } from '../store/useAppStore';
import { useAppStore } from '../store/useAppStore';
import { ApiError } from './client';
import { authApi } from './authApi';
import { refreshStoredSession } from './configuredClient';
import { clearSessionTokens, getAccessToken, saveSessionTokens } from './tokenStorage';
import type { LoginRequest, SignUpRequest, VerifyEmailRequest } from './types';

export const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) {
    return 'Unable to reach InternLink. Check that your phone and computer are on the same Wi-Fi.';
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return 'The request timed out. Check the backend connection and try again.';
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
};

const establishSession = async (session: Awaited<ReturnType<typeof authApi.login>>) => {
  await saveSessionTokens(session);
  useAppStore.getState().establishSession(session.user);
};

export const registerAccount = (request: SignUpRequest) => authApi.register(request);

export const signIn = async (role: UserRole, request: LoginRequest) => {
  const session = await authApi.login(role, request);
  await establishSession(session);
};

export const verifyEmail = async (request: VerifyEmailRequest) => {
  const session = await authApi.verifyEmail(request);
  await establishSession(session);
};

export const restoreSession = async () => {
  try {
    const session = await refreshStoredSession();
    if (session) useAppStore.getState().establishSession(session.user);
    else useAppStore.getState().clearSession();
  } catch {
    useAppStore.getState().logout();
  }
};

export const signOut = async () => {
  try {
    if (getAccessToken()) await authApi.logout();
  } catch {
    // Local sign-out must still succeed if the server or network is unavailable.
  } finally {
    await clearSessionTokens();
    useAppStore.getState().logout();
  }
};
