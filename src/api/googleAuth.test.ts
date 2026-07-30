import { signInWithGoogleToken } from './authSession';
import {
  runGoogleSignIn,
  signInWithGoogle,
  type GoogleSignInModule,
} from './googleAuth';

const mockConfigure = jest.fn();
const mockHasPlayServices = jest.fn();
const mockGoogleSignIn = jest.fn();

jest.mock('./authSession', () => ({
  signInWithGoogleToken: jest.fn(),
}));

const mockSignInWithGoogleToken =
  signInWithGoogleToken as jest.MockedFunction<typeof signInWithGoogleToken>;

const mockGoogleModule = {
  GoogleSignin: {
    configure: mockConfigure,
    hasPlayServices: mockHasPlayServices,
    signIn: mockGoogleSignIn,
  },
  isSuccessResponse: (response: { type?: string }) => response.type === 'success',
  isErrorWithCode: (error: unknown) =>
    error instanceof Error && typeof (error as Error & { code?: unknown }).code === 'string',
  statusCodes: {
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    IN_PROGRESS: 'IN_PROGRESS',
    NULL_PRESENTER: 'NULL_PRESENTER',
  },
} as unknown as GoogleSignInModule;

describe('signInWithGoogle', () => {
  const originalClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = 'web-client.apps.googleusercontent.com';
    mockConfigure.mockReset();
    mockHasPlayServices.mockReset().mockResolvedValue(true);
    mockGoogleSignIn.mockReset();
    mockSignInWithGoogleToken.mockReset().mockResolvedValue(undefined);
  });

  afterAll(() => {
    if (originalClientId === undefined) {
      delete process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    } else {
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = originalClientId;
    }
  });

  it('fails clearly when the Web client ID is absent', async () => {
    delete process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

    await expect(signInWithGoogle()).rejects.toThrow(
      'Google sign-in is not configured for this build.',
    );
    expect(mockConfigure).not.toHaveBeenCalled();
  });

  it('sends the Google ID token to the backend session exchange', async () => {
    mockGoogleSignIn.mockResolvedValue({
      type: 'success',
      data: { idToken: 'signed-google-id-token' },
    });

    await expect(runGoogleSignIn(
      mockGoogleModule,
      'web-client.apps.googleusercontent.com',
    )).resolves.toBe(true);

    expect(mockConfigure).toHaveBeenCalledWith({
      webClientId: 'web-client.apps.googleusercontent.com',
      offlineAccess: false,
    });
    expect(mockHasPlayServices).toHaveBeenCalledWith({
      showPlayServicesUpdateDialog: true,
    });
    expect(mockSignInWithGoogleToken).toHaveBeenCalledWith('signed-google-id-token');
  });

  it('returns false when the user closes the Google account chooser', async () => {
    mockGoogleSignIn.mockResolvedValue({ type: 'cancelled', data: null });

    await expect(runGoogleSignIn(
      mockGoogleModule,
      'web-client.apps.googleusercontent.com',
    )).resolves.toBe(false);
    expect(mockSignInWithGoogleToken).not.toHaveBeenCalled();
  });

  it('turns Android developer errors into actionable configuration feedback', async () => {
    const error = Object.assign(new Error('DEVELOPER_ERROR'), { code: '10' });
    mockGoogleSignIn.mockRejectedValue(error);

    await expect(runGoogleSignIn(
      mockGoogleModule,
      'web-client.apps.googleusercontent.com',
    )).rejects.toThrow(
      'register com.internlink.app with the APK signing SHA-1',
    );
  });
});
