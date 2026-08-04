import type { ConfigContext } from 'expo/config';
import buildConfig from './app.config';

const ENV_KEYS = [
  'INTERNLINK_RELEASE_BUILD',
  'EXPO_PUBLIC_API_BASE_URL',
  'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
  'EXPO_PUBLIC_EAS_PROJECT_ID',
  'GOOGLE_SERVICES_JSON',
  'EAS_BUILD_PLATFORM',
] as const;

const context = {
  config: {
    name: 'InternLink',
    slug: 'InternLink',
  },
} as ConfigContext;

describe('release Expo configuration', () => {
  const originalEnvironment = Object.fromEntries(
    ENV_KEYS.map((key) => [key, process.env[key]]),
  );

  beforeEach(() => {
    ENV_KEYS.forEach((key) => delete process.env[key]);
  });

  afterAll(() => {
    ENV_KEYS.forEach((key) => {
      const value = originalEnvironment[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  });

  it('fails a release build when the production API URL is missing', () => {
    process.env.INTERNLINK_RELEASE_BUILD = 'true';
    expect(() => buildConfig(context)).toThrow('EXPO_PUBLIC_API_BASE_URL');
  });

  it('accepts a release configuration without optional Google sign-in', () => {
    process.env.INTERNLINK_RELEASE_BUILD = 'true';
    process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.internlink.example';
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID = '00000000-0000-0000-0000-000000000000';

    const result = buildConfig(context);

    expect(result.extra?.eas?.projectId).toBe('00000000-0000-0000-0000-000000000000');
    expect(result.plugins).not.toContain('@react-native-google-signin/google-signin');
  });
});
