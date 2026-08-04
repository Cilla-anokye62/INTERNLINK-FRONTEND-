import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  if (!config.name || !config.slug) {
    throw new Error('Expo app.json must define both name and slug.');
  }

  const isReleaseBuild = process.env.INTERNLINK_RELEASE_BUILD === 'true';
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID?.trim();
  const androidServicesFile = process.env.GOOGLE_SERVICES_JSON?.trim();

  if (isReleaseBuild) {
    if (!apiBaseUrl || !apiBaseUrl.startsWith('https://')) {
      throw new Error(
        'EXPO_PUBLIC_API_BASE_URL must be an HTTPS URL for preview and production EAS builds.'
      );
    }
    if (!projectId) {
      throw new Error(
        'EXPO_PUBLIC_EAS_PROJECT_ID is required for preview and production EAS builds.'
      );
    }
  }

  const iosUrlScheme = process.env.GOOGLE_IOS_URL_SCHEME?.trim();
  const googlePlugin: NonNullable<ExpoConfig['plugins']>[number] = iosUrlScheme
    ? ['@react-native-google-signin/google-signin', { iosUrlScheme }]
    : '@react-native-google-signin/google-signin';
  const plugins = (config.plugins ?? [])
    .filter((plugin) => {
      const name = Array.isArray(plugin) ? plugin[0] : plugin;
      return name !== '@react-native-google-signin/google-signin';
    });

  const owner = process.env.EXPO_OWNER?.trim();
  const iosServicesFile = process.env.GOOGLE_SERVICE_INFO_PLIST?.trim();

  return {
    ...config,
    name: config.name,
    slug: config.slug,
    ...(owner ? { owner } : {}),
    plugins: googleWebClientId ? [...plugins, googlePlugin] : plugins,
    android: {
      ...config.android,
      ...(androidServicesFile ? { googleServicesFile: androidServicesFile } : {}),
    },
    ios: {
      ...config.ios,
      ...(iosServicesFile ? { googleServicesFile: iosServicesFile } : {}),
    },
    extra: {
      ...config.extra,
      ...(projectId
        ? { eas: { ...(config.extra?.eas ?? {}), projectId } }
        : {}),
    },
  };
};
