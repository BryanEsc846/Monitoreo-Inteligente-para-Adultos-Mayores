import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ColoresTema } from '../constants/ColoresTema';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulamos un tiempo de carga del Splash Screen de 2 segundos
    const timer = setTimeout(() => {
      // Redirigimos al Login
      router.replace('/login' as any);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>VitalGuard</Text>
        <Text style={styles.subtitle}>Cuidando a los que amas</Text>
        <ActivityIndicator size="large" color={ColoresTema.buttonSecondary} style={styles.loader} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColoresTema.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ColoresTema.buttonSecondary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: ColoresTema.textTitle,
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  }
});
