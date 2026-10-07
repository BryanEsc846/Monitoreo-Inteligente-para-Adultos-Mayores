import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColoresTema } from '../constants/ColoresTema';
import { DEMO_PASSWORD, DEMO_USER_NAME_KEY } from '../constants/demoSession';

export default function LoginScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(DEMO_USER_NAME_KEY)
      .then(savedName => { if (savedName) setNombre(savedName); })
      .catch(error => console.warn('No se pudo cargar el nombre local', error));
  }, []);

  const ingresar = async () => {
    const normalizedName = nombre.trim();
    if (!normalizedName) {
      Alert.alert('Falta el nombre', 'Escribe tu nombre para continuar.');
      return;
    }
    if (contrasena !== DEMO_PASSWORD) {
      Alert.alert('Contraseña incorrecta', 'Revisa la contraseña de demostración.');
      return;
    }

    setGuardando(true);
    try {
      await AsyncStorage.setItem(DEMO_USER_NAME_KEY, normalizedName);
      router.replace('/(tabs)' as any);
    } catch {
      Alert.alert('No se pudo guardar', 'Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>VITALIA</Text>
        <Text style={styles.subtitle}>Monitoreo de adultos mayores</Text>
        <Text style={styles.label}>Nombre del cuidador</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
          placeholderTextColor={ColoresTema.textMuted}
          autoCapitalize="words"
          editable={!guardando}
          returnKeyType="next"
        />
        <Text style={styles.label}>Contraseña de demostración</Text>
        <TextInput
          style={styles.input}
          value={contrasena}
          onChangeText={setContrasena}
          placeholder="Contraseña"
          placeholderTextColor={ColoresTema.textMuted}
          secureTextEntry
          editable={!guardando}
          onSubmitEditing={() => void ingresar()}
        />
        <Text style={styles.hint}>Clave fija para esta demo: {DEMO_PASSWORD}</Text>
        <TouchableOpacity style={styles.button} onPress={() => void ingresar()} disabled={guardando}>
          {guardando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Continuar</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: ColoresTema.background },
  container: { flex: 1, justifyContent: 'center', padding: 28, width: '100%', maxWidth: 440, alignSelf: 'center' },
  title: { color: ColoresTema.primary, fontSize: 30, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: ColoresTema.textMuted, fontSize: 15, textAlign: 'center', marginTop: 6, marginBottom: 36 },
  label: { color: ColoresTema.textTitle, fontSize: 14, fontWeight: '600', marginBottom: 7 },
  input: { backgroundColor: '#FFFFFF', borderColor: ColoresTema.border, borderWidth: 1, borderRadius: 10, minHeight: 48, paddingHorizontal: 14, marginBottom: 20, color: ColoresTema.textDark },
  hint: { color: ColoresTema.textMuted, fontSize: 12, marginTop: -12, marginBottom: 20 },
  button: { minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: ColoresTema.buttonSecondary },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});