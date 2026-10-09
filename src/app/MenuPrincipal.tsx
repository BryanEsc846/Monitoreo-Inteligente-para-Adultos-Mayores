import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WatchStatusCard } from '../components/TarjetaEstadoPaciente';
import { ColoresTema } from '../constants/ColoresTema';
import { useWatchData } from '../hooks/useWatchData';
import type { WatchData } from '../types/WatchData';

const LIMITE_PULSO_ALTO_BPM = 110;

function enviarAlarma(title: string, body: string) {
  Alert.alert(title, body);
}

export default function PantallaMenuPrincipal() {
  const router = useRouter();
  const { watchId, watchData, patientName, fallbackPatientName, linkWatch, unlinkWatch, saveFallbackPatientName } = useWatchData();
  const [scanning, setScanning] = useState(false);
  const [nombrePacienteInput, setNombrePacienteInput] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);
  const lastAlarmDataRef = useRef<WatchData | null>(null);

  useEffect(() => {
    if (!watchData) {
      lastAlarmDataRef.current = null;
      return;
    }
    const previousData = lastAlarmDataRef.current;
    if (watchData.caidaDetectada && !previousData?.caidaDetectada) {
      enviarAlarma('Alarma: posible caída', 'El acelerómetro del reloj detectó un impacto fuerte.');
    }
    if (watchData.frecuenciaCardiaca > LIMITE_PULSO_ALTO_BPM &&
        (!previousData || previousData.frecuenciaCardiaca <= LIMITE_PULSO_ALTO_BPM)) {
      enviarAlarma('Alarma: pulso elevado', `Se detectaron ${watchData.frecuenciaCardiaca} pulsaciones por minuto.`);
    }
    lastAlarmDataRef.current = watchData;
  }, [watchData]);

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
    await linkWatch(id);
    setScanning(false);
  };

  const desvincular = async () => {
    try {
      await unlinkWatch();
      setNombrePacienteInput('');
      setScanning(false);
      scannedRef.current = false;
    } catch (error) {
      console.warn('No se pudo borrar la vinculación del reloj', error);
      Alert.alert('Error', 'No se pudo borrar la vinculación del reloj. Inténtalo de nuevo.');
    }
  };

  const confirmarDesvinculacion = () => {
    Alert.alert(
      'Desvincular reloj',
      'Se eliminará el QR guardado y los datos locales asociados a los relojes vinculados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Desvincular', style: 'destructive', onPress: () => void desvincular() },
      ]
    );
  };

  const guardarNombrePaciente = async () => {
    await saveFallbackPatientName(nombrePacienteInput);
    setNombrePacienteInput('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Título Principal */}
        <Text style={styles.mainTitle}>MONITOREO DE ADULTOS MAYORES</Text>

        <View style={styles.connectionRow}>
          <View style={styles.connectionState}>
            <View style={[styles.connectionDot, watchData ? styles.connectedDot : styles.disconnectedDot]} />
            <Text style={styles.connectionText}>{watchData ? `Reloj conectado${patientName ? ` · ${patientName}` : ''}` : watchId ? 'Esperando datos' : 'Sin reloj vinculado'}</Text>
          </View>
          {!watchId && (
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
        {watchId && watchData && !watchData.adultoMayor?.trim() && !fallbackPatientName && (
          <View style={styles.patientNameForm}>
            <Text style={styles.scannerTitle}>El reloj no envía el nombre del adulto mayor</Text>
            <TextInput
              style={styles.patientNameInput}
              value={nombrePacienteInput}
              onChangeText={setNombrePacienteInput}
              placeholder="Nombre del adulto mayor"
              placeholderTextColor={ColoresTema.textMuted}
              autoCapitalize="words"
            />
            <TouchableOpacity style={styles.saveNameButton} onPress={() => void guardarNombrePaciente()}>
              <Text style={styles.saveNameButtonText}>Guardar nombre</Text>
            </TouchableOpacity>
          </View>
        )}

        {watchId && (
          <TouchableOpacity style={styles.clearQrButton} onPress={confirmarDesvinculacion} accessibilityLabel="Desvincular reloj y borrar QR">
            <Text style={styles.clearQrButtonText}>Desvincular reloj y borrar QR</Text>
          </TouchableOpacity>
        )}

        <WatchStatusCard data={watchData} />

        {/* Regresa al dashboard de la demo. */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.replace('/(tabs)' as any)}
        >
          <Text style={styles.logoutButtonText}>Volver al inicio</Text>
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
    paddingBottom: 120,
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
  patientNameForm: { width: '100%', marginBottom: 16 },
  patientNameInput: { width: '100%', minHeight: 44, borderWidth: 1, borderColor: ColoresTema.border, backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 12, color: ColoresTema.textDark },
  saveNameButton: { alignItems: 'center', padding: 11, marginTop: 8, backgroundColor: ColoresTema.buttonSecondary, borderRadius: 8 },
  saveNameButtonText: { color: '#FFFFFF', fontWeight: '700' },
  clearQrButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  clearQrButtonText: {
    color: '#B91C1C',
    fontWeight: '700',
  },
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
