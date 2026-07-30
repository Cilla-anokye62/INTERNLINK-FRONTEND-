import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import { accountApi } from './accountApi';

let handlerConfigured = false;

export const registerForPushNotifications = async () => {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return { status: 'expo-go' as const };
  }

  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID?.trim()
    || (Constants.expoConfig?.extra?.eas as { projectId?: string } | undefined)?.projectId
    || Constants.easConfig?.projectId;
  if (!projectId) {
    return { status: 'not-configured' as const };
  }

  const Notifications = await import('expo-notifications');
  if (!handlerConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    handlerConfigured = true;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'InternLink updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const current = await Notifications.getPermissionsAsync();
  const permission = current.status === 'granted'
    ? current
    : await Notifications.requestPermissionsAsync();
  if (permission.status !== 'granted') {
    return { status: 'denied' as const };
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await accountApi.registerDeviceToken(token);
  return { status: 'registered' as const, token };
};
