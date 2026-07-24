import Constants from 'expo-constants';
import { useAppStore } from '../store/useAppStore';
import { ApiError, createApiClient, type ApiClient } from './client';
import { clearSessionTokens, getAccessToken, getRefreshToken, saveSessionTokens } from './tokenStorage';
import type { AuthSession } from './types';

const explicitBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
const localApiPort = process.env.EXPO_PUBLIC_API_PORT?.trim() || '8081';

const getDevelopmentHost = () => {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  if (!hostUri) return null;

  const withoutScheme = hostUri.replace(/^https?:\/\//, '');
  if (withoutScheme.startsWith('[')) {
    const closingBracket = withoutScheme.indexOf(']');
    return closingBracket > 0 ? withoutScheme.slice(0, closingBracket + 1) : null;
  }
  return withoutScheme.split(/[/:]/, 1)[0] || null;
};

const developmentHost = getDevelopmentHost();
const developmentBaseUrl = __DEV__ && developmentHost
  ? `http://${developmentHost}:${localApiPort}`
  : null;
const configuredBaseUrl = explicitBaseUrl || developmentBaseUrl;

if (!configuredBaseUrl) {
  throw new Error(
    'The API address could not be determined. Configure EXPO_PUBLIC_API_BASE_URL and reload Expo.',
  );
}

export const publicApiClient = createApiClient({ baseUrl: configuredBaseUrl });

let refreshInFlight: Promise<AuthSession | null> | null = null;

export const refreshStoredSession = (): Promise<AuthSession | null> => {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    try {
      const session = await publicApiClient.request<AuthSession>('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
        requiresAuth: false,
      });
      await saveSessionTokens(session);
      return session;
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        await clearSessionTokens();
        useAppStore.getState().logout();
      }
      throw error;
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
};

const refreshAccessToken = async () => {
  const session = await refreshStoredSession();
  return session?.accessToken ?? null;
};

export const apiClient: ApiClient = createApiClient({
  baseUrl: configuredBaseUrl,
  getAccessToken,
  refreshAccessToken,
});

export const apiBaseUrl = configuredBaseUrl;
