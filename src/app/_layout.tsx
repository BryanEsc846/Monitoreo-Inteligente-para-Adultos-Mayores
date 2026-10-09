import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { configureNotifications } from '../services/notifications';

export default function RootLayout() {
  useEffect(() => {
    void configureNotifications().catch(error =>
      console.warn('No se pudieron configurar las notificaciones', error)
    );
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="MenuPrincipal" />
    </Stack>
  );
}
