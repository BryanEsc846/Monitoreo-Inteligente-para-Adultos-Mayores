import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusCard } from '../components/TarjetaEstadoPaciente';
import { ColoresTema } from '../constants/ColoresTema';
import { realtimeDatabase } from '../constants/firebase';
import type { WatchData } from '../types/WatchData';

const WATCH_ID_STORAGE_KEY = 'vitalia.watchId';
const LIMITE_PULSO_ALTO_BPM = 110;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function enviarAlarma(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default', ...(Platform.OS === 'android' ? { channelId: 'alarms' } : {}) },
    trigger: null,
  });
}

export default function PantallaMenuPrincipal() {
  const router = useRouter();
  const [watchId, setWatchId] = useState<string | null>(null);
  const [watchData, setWatchData] = useState<WatchData | null>(null);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);
  const lastAlarmDataRef = useRef<WatchData | null>(null);

  useEffect(() => {
    const prepararNotificaciones = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('alarms', {
          name: 'Alarmas de monitoreo',
          importance: Notifications.AndroidImportance.MAX,
          sound: 'default',
          vibrationPattern: [0, 400, 200, 400],
        });
      }
      const current = await Notifications.getPermissionsAsync();
      if (!current.granted) await Notifications.requestPermissionsAsync();
    };
    void prepararNotificaciones().catch(error => console.warn('No se pudieron activar las alarmas', error));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(WATCH_ID_STORAGE_KEY).then(setWatchId);
  }, []);

  useEffect(() => {
    if (!watchId) {
      setWatchData(null);
      lastAlarmDataRef.current = null;
      return;
    }
    return onValue(ref(realtimeDatabase, `devices/${watchId}/latest`), snapshot => {
      const nextData = snapshot.exists() ? snapshot.val() as WatchData : null;
      const previousData = lastAlarmDataRef.current;
      if (nextData?.caidaDetectada && !previousData?.caidaDetectada) {
        void enviarAlarma('Alarma: posible caída', 'El acelerómetro del reloj detectó un impacto fuerte.').catch(console.warn);
      }
      if (nextData && nextData.frecuenciaCardiaca > LIMITE_PULSO_ALTO_BPM &&
          (!previousData || previousData.frecuenciaCardiaca <= LIMITE_PULSO_ALTO_BPM)) {
        void enviarAlarma('Alarma: pulso elevado', `Se detectaron ${nextData.frecuenciaCardiaca} pulsaciones por minuto.`).catch(console.warn);
      }
      lastAlarmDataRef.current = nextData;
      setWatchData(nextData);
    });
  }, [watchId]);

  const iniciarEscaneo = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    scannedRef.current = false;
    setScanning(true);
  };

  const vincularQr = async (value: string) => {
    const match = value.match(/^vitalia:\/\/pair\/([a-f0-9-]{36})$/i);
    if (!match || scannedRef.current) return;
    scannedRef.current = true;
    const id = match[1];
    await AsyncStorage.setItem(WATCH_ID_STORAGE_KEY, id);
    setWatchId(id);
    setScanning(false);
  };

  const desvincular = async () => {
    await AsyncStorage.removeItem(WATCH_ID_STORAGE_KEY);
    setWatchId(null);
    setWatchData(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Título Principal */}
        <Text style={styles.mainTitle}>MONITOREO DE ADULTOS MAYORES</Text>

        <View style={styles.connectionRow}>
          <View style={styles.connectionState}>
            <View style={[styles.connectionDot, watchData ? styles.connectedDot : styles.disconnectedDot]} />
            <Text style={styles.connectionText}>{watchData ? 'Reloj conectado' : watchId ? 'Esperando datos' : 'Sin reloj vinculado'}</Text>
          </View>
          {watchId ? (
            <TouchableOpacity onPress={desvincular} accessibilityLabel="Desvincular reloj">
              <Text style={styles.linkAction}>Desvincular</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={iniciarEscaneo} accessibilityLabel="Escanear QR del reloj">
              <Text style={styles.linkAction}>Escanear QR</Text>
            </TouchableOpacity>
          )}
        </View>

        {scanning && (
          <View style={styles.scannerContainer}>
            <Text style={styles.scannerTitle}>Escanea el QR mostrado en el reloj</Text>
            <CameraView
              style={styles.camera}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={({ data }) => void vincularQr(data)}
            />
            <TouchableOpacity onPress={() => setScanning(false)} style={styles.cancelScan}>
              <Text style={styles.linkAction}>Cancelar escaneo</Text>
            </TouchableOpacity>
          </View>
        )}

        {watchId && !watchData && <ActivityIndicator color={ColoresTema.buttonSecondary} style={styles.waiting} />}
        <StatusCard data={watchData} />

        {/* Botón para salir (Solo para probar la navegación) */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.replace('/login' as any)}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColoresTema.background,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: ColoresTema.textTitle,
  },
  connectionRow: {
    width: '100%',
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  connectionState: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  connectionDot: { width: 9, height: 9, borderRadius: 5 },
  connectedDot: { backgroundColor: '#2E9D62' },
  disconnectedDot: { backgroundColor: '#B47B24' },
  connectionText: { color: ColoresTema.textDark, fontSize: 13, fontWeight: '600' },
  linkAction: { color: ColoresTema.buttonSecondary, fontSize: 14, fontWeight: '700' },
  scannerContainer: { width: '100%', marginBottom: 16, alignItems: 'center' },
  scannerTitle: { color: ColoresTema.textDark, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  camera: { width: '100%', height: 250, overflow: 'hidden', borderRadius: 8 },
  cancelScan: { padding: 10 },
  waiting: { marginBottom: 12 },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 14,
    color: ColoresTema.textMuted,
    textDecorationLine: 'underline',
  },
});
