import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColoresTema } from '../constants/ColoresTema';

export default function SplashScreen() {
  const router = useRouter();
  const [logoCargado, setLogoCargado] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login' as any);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { opacity: logoCargado ? 1 : 0 }]}>
        <Image
          source={require('../../assets/images/vitalia_logo.png')}
          style={styles.logo}
          resizeMode="contain"
          onLoad={() => setLogoCargado(true)}
        />
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
  logo: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: ColoresTema.textTitle,
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});