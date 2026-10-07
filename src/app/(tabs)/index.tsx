import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotonSOS } from '../../components/BotonSOS';
import { RecentAlerts } from '../../components/TarjetaAlertas';
import { StatusCard } from '../../components/TarjetaEstadoPaciente';
import { WeeklyReport } from '../../components/TarjetaReporteSemanal';
import { ColoresTema } from '../../constants/ColoresTema';
import { DEMO_USER_NAME_KEY } from '../../constants/demoSession';
import { useWatchData } from '../../hooks/useWatchData';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [nombreCuidador, setNombreCuidador] = useState('Cuidador');
  const { watchId, watchData, patientName } = useWatchData();
  const pacienteId = 1;

  useEffect(() => {
    void AsyncStorage.getItem(DEMO_USER_NAME_KEY)
      .then(name => { if (name) setNombreCuidador(name); })
      .catch(error => console.warn('No se pudo cargar el nombre del cuidador', error));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  const nombrePaciente = patientName || (watchId ? 'Esperando nombre del reloj' : 'Sin reloj vinculado');
  const estadoTexto = !watchData ? (watchId ? 'Esperando datos' : 'Sin reloj') :
    watchData.estado === 'EMERGENCIA' ? 'Crítico' : watchData.estado === 'Alerta' ? 'Alerta' : 'Estable';
  const ultimaConexion = watchData?.timestamp
    ? `Actualizado ${new Date(watchData.timestamp).toLocaleTimeString()}`
    : 'Esperando sincronización';
  const signosVitales = watchData ? {
    ritmoCardiaco: {
      valor: watchData.frecuenciaCardiaca,
      unidad: 'bpm',
      estado: watchData.frecuenciaCardiaca > 110 || watchData.frecuenciaCardiaca < 50 ? 'danger' : 'normal',
    },
    movimiento: { valor: watchData.movimiento || '--', estado: watchData.caidaDetectada ? 'danger' : 'normal' },
    ubicacion: { valor: watchData.ubicacion || '--', estado: watchData.ubicacion?.startsWith('Fuera de casa') ? 'warning' : 'normal' },
    bateria: { valor: watchData.bateria, unidad: '%', estado: watchData.bateria <= 20 ? 'warning' : 'normal' },
  } : undefined;
  const coordenadas = watchData?.ubicacionReal &&
    typeof watchData.latitud === 'number' && typeof watchData.longitud === 'number'
    ? `${watchData.latitud.toFixed(5)}, ${watchData.longitud.toFixed(5)}`
    : undefined;
  const gpsActualizado = watchData?.ubicacionReal && watchData.ubicacionTimestamp
    ? new Date(watchData.ubicacionTimestamp).toLocaleTimeString()
    : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ColoresTema.primary]} />
        }
      >
        
        {/* 1. Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {nombreCuidador}</Text>
          <View style={styles.statusRow}>
            <View style={[
              styles.statusDot,
              { backgroundColor: estadoTexto === 'Estable' ? ColoresTema.success : estadoTexto === 'Crítico' ? '#DC2626' : '#F59E0B' }
            ]} />
            <Text style={styles.statusText}>{nombrePaciente} está {estadoTexto.toLowerCase()}</Text>
          </View>
        </View>

        {/* 2. SOS Button */}
        <View style={styles.sosContainer}>
          <BotonSOS pacienteId={pacienteId} />
        </View>

        {!watchId && (
          <TouchableOpacity style={styles.pairButton} onPress={() => router.push('/MenuPrincipal' as any)}>
            <Ionicons name="qr-code-outline" size={20} color={ColoresTema.primary} />
            <Text style={styles.pairButtonText}>Vincular reloj con QR</Text>
          </TouchableOpacity>
        )}

        {/* 3. Patient Status Card - telemetría Firebase */}
        <StatusCard
          ultimaConexion={ultimaConexion}
          signosVitales={signosVitales}
          coordenadas={coordenadas}
          gpsActualizado={gpsActualizado}
          latitud={watchData?.ubicacionReal ? watchData.latitud : undefined}
          longitud={watchData?.ubicacionReal ? watchData.longitud : undefined}
          nombre={nombrePaciente}
          iniciales={patientName?.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || '--'}
          estadoTexto={estadoTexto}
        />

        {/* 4. Quick Actions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/historial')}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="document-text" size={24} color={ColoresTema.warning} />
              </View>
              <Text style={styles.actionLabel}>Reporte</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Weekly Report compact */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Resumen del Día</Text>
          <WeeklyReport compact={true} />
          <TouchableOpacity onPress={() => router.push('/(tabs)/historial')} style={styles.linkButton}>
            <Text style={styles.linkText}>Ver reporte completo →</Text>
          </TouchableOpacity>
        </View>

        {/* 6. Recent Alerts mini */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Alertas Recientes</Text>
          <RecentAlerts pacienteId={pacienteId} />
        </View>

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
    paddingBottom: 40,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 10,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColoresTema.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: ColoresTema.textMuted,
  },
  sosContainer: {
    marginVertical: 15,
  },
  pairButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: ColoresTema.border, borderRadius: 10, paddingVertical: 12, marginBottom: 18 },
  pairButtonText: { color: ColoresTema.primary, fontSize: 14, fontWeight: '700' },
  sectionContainer: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: ColoresTema.cardBackground,
    borderRadius: 16,
    padding: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  actionLabel: {
    fontSize: 12,
    color: ColoresTema.textDark,
    fontWeight: '500',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  linkText: {
    color: ColoresTema.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
