import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

let configured = false;

export async function configureNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  if (configured) return;
  configured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    const requested = await Notifications.requestPermissionsAsync();
    if (!requested.granted) {
      console.warn('Las notificaciones están desactivadas para Vitalia');
      return;
    }
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alertas', {
      name: 'Alertas médicas',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

export async function enviarNotificacionAlerta(titulo: string, cuerpo: string): Promise<void> {
  await configureNotifications();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
      sound: 'default',
      ...(Platform.OS === 'android' ? { channelId: 'alertas' } : {}),
    },
    trigger: null,
  });
}
