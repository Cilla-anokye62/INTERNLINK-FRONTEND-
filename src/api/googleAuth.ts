import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import { signInWithGoogleToken } from './authSession';

export type GoogleSignInModule =
  typeof import('@react-native-google-signin/google-signin');

const configurationError = () => new Error(
  'Google sign-in is not configured for this build. Add the Google Web client ID, register '
  + 'com.internlink.app with the APK signing SHA-1, enable Google sign-in on the backend, '
  + 'and rebuild the app.',
);

export const runGoogleSignIn = async (
  googleModule: GoogleSignInModule,
  webClientId: string,
) => {
  try {
    googleModule.GoogleSignin.configure({
      webClientId,
      offlineAccess: false,
    });
    await googleModule.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await googleModule.GoogleSignin.signIn();
    if (!googleModule.isSuccessResponse(response)) {
      return false;
    }

    const idToken = response.data.idToken;
    if (!idToken) {
      throw new Error(
        'Google did not return an identity token. Check that the configured client ID is a Web OAuth client ID.',
      );
    }

    await signInWithGoogleToken(idToken);
    return true;
  } catch (error) {
    if (!googleModule.isErrorWithCode(error)) throw error;

    if (error.code === googleModule.statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error(
        'Google Play Services is missing or out of date. Update it on this device and try again.',
      );
    }
    if (error.code === googleModule.statusCodes.IN_PROGRESS) {
      throw new Error('Google sign-in is already in progress.');
    }
    if (error.code === googleModule.statusCodes.NULL_PRESENTER) {
      throw new Error('Google sign-in could not open. Wait a moment and try again.');
    }
    if (
      error.code === '10'
      || error.code === 'DEVELOPER_ERROR'
      || error.message.includes('DEVELOPER_ERROR')
    ) {
      throw configurationError();
    }
    throw new Error('Google sign-in could not be completed. Please try again.');
  }
};

export const signInWithGoogle = async () => {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  if (!webClientId) {
    throw configurationError();
  }

  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    throw new Error(
      'Google sign-in requires an InternLink development or APK build and is not available inside Expo Go.',
    );
  }

  if (Platform.OS === 'web') {
    throw new Error('Google sign-in is currently available in the Android and iOS app builds.');
  }

  const googleModule = await import('@react-native-google-signin/google-signin');
  return runGoogleSignIn(googleModule, webClientId);
};
