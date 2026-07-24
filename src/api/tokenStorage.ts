import * as SecureStore from 'expo-secure-store';
import type { AuthSession } from './types';

const REFRESH_TOKEN_KEY = 'internlink.refreshToken';

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

export const saveSessionTokens = async (session: AuthSession) => {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken);
  accessToken = session.accessToken;
};

export const clearSessionTokens = async () => {
  accessToken = null;
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};
