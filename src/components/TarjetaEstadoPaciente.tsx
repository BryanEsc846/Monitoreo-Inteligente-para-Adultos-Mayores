import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColoresTema } from '../constants/ColoresTema';
import type { SignosVitales } from '../services/api';
import type { WatchData } from '../types/WatchData';

interface StatusCardProps {
  ultimaConexion?: string;
  signosVitales?: SignosVitales;
  nombre?: string;
  iniciales?: string;
  estadoTexto?: string;
  coordenadas?: string;
  gpsActualizado?: string;
  latitud?: number;
  longitud?: number;
}

export function StatusCard({
  ultimaConexion = 'Hace 5 min',
  signosVitales,
  nombre = 'María López',
  iniciales = 'ML',
  estadoTexto = 'Estable',
  coordenadas,
  gpsActualizado,
  latitud,
  longitud,
}: StatusCardProps) {

  const ritmo = signosVitales?.ritmoCardiaco?.valor ?? '--';
  const movimiento = signosVitales?.movimiento?.valor ?? '--';
  const ubicacion = signosVitales?.ubicacion?.valor ?? '--';
  const bateria = signosVitales?.bateria?.valor ?? '--';

  const ritmoEstado = signosVitales?.ritmoCardiaco?.estado ?? 'unknown';
  const movEstado = signosVitales?.movimiento?.estado ?? 'unknown';
  const ubiEstado = signosVitales?.ubicacion?.estado ?? 'unknown';
  const batEstado = signosVitales?.bateria?.estado ?? 'unknown';

  const estadoColor = estadoTexto === 'Estable' ? ColoresTema.success :
    estadoTexto === 'Crítico' ? '#DC2626' : '#F59E0B';

  const verUbicacion = () => {
    if (typeof latitud !== 'number' || typeof longitud !== 'number') {
      Alert.alert('Ubicación no disponible', 'El reloj todavía no ha enviado coordenadas reales.');
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`;
    void Linking.openURL(url).catch(() =>
      Alert.alert('No se pudo abrir el mapa', `${latitud.toFixed(5)}, ${longitud.toFixed(5)}`)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.patientHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{iniciales}</Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.greeting}>Monitoreando a</Text>
          <Text style={styles.patientName}>{nombre}</Text>
          <View style={styles.ultimaConexionContainer}>
            <Ionicons name="time-outline" size={12} color={ColoresTema.textMuted} />
            <Text style={styles.ultimaConexionText}>{ultimaConexion}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: estadoTexto === 'Estable' ? '#D1FAE5' : estadoTexto === 'Crítico' ? '#FEE2E2' : '#FEF3C7' }]}>
          <View style={[styles.statusDot, { backgroundColor: estadoColor }]} />
          <Text style={[styles.statusBadgeText, { color: estadoColor }]}>{estadoTexto}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={[styles.gridItem, ritmoEstado === 'danger' && styles.gridItemDanger]}>
          <View style={[styles.iconBox, { backgroundColor: ritmoEstado === 'danger' ? '#FEE2E2' : '#FEE2E2' }]}>
            <FontAwesome5 name="heartbeat" size={18} color={ColoresTema.danger} />
          </View>
          <Text style={[styles.gridValue, ritmoEstado === 'danger' && { color: '#DC2626' }]}>{ritmo} <Text style={styles.gridUnit}>bpm</Text></Text>
          <Text style={styles.gridLabel}>Ritmo Cardíaco</Text>
        </View>

        <View style={[styles.gridItem, movEstado === 'danger' && styles.gridItemDanger]}>
          <View style={[styles.iconBox, { backgroundColor: movEstado === 'danger' ? '#FEE2E2' : '#E0E7FF' }]}>
            <MaterialCommunityIcons name="run" size={20} color={movEstado === 'danger' ? '#DC2626' : ColoresTema.primary} />
          </View>
          <Text style={[styles.gridValue, movEstado === 'danger' && { color: '#DC2626' }]}>{movimiento}</Text>
          <Text style={styles.gridLabel}>Movimiento</Text>
        </View>

        <TouchableOpacity
          style={[styles.gridItem, ubiEstado === 'warning' && styles.gridItemWarning]}
          onPress={verUbicacion}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Ver ubicación del paciente en el mapa"
        >
          <View style={[styles.iconBox, { backgroundColor: ubiEstado === 'warning' ? '#FEF3C7' : '#D1FAE5' }]}>
            <Ionicons name="location-sharp" size={18} color={ubiEstado === 'warning' ? '#F59E0B' : ColoresTema.success} />
          </View>
          <Text style={styles.gridValue} numberOfLines={2}>{ubicacion}</Text>
          {coordenadas ? <Text style={styles.gridCoordinates}>{coordenadas}</Text> : null}
          {gpsActualizado ? <Text style={styles.gridCoordinates}>Última lectura: {gpsActualizado}</Text> : null}
          <Text style={styles.gridLabel}>Ubicación</Text>
        </TouchableOpacity>

        {/* Tarjeta 4: Batería */}
        <View style={[styles.gridItem, batEstado === 'warning' && styles.gridItemWarning]}>
          <View style={[styles.iconBox, { backgroundColor: batEstado === 'warning' ? '#FEF3C7' : '#FEF3C7' }]}>
            <Ionicons name="battery-charging" size={18} color={ColoresTema.warning} />
          </View>
          <Text style={styles.gridValue}>{bateria}%</Text>
          <Text style={styles.gridLabel}>Batería Pulsera</Text>
        </View>
      </View>
    </View>
  );
}

export function WatchStatusCard({ data }: { data: WatchData | null }) {
  return (
    <View style={styles.watchCard}>
      <View style={styles.watchStatusList}>
        <View style={styles.watchStatusRow}>
          <Text style={styles.watchIcon}>❤️</Text>
          <View>
            <Text style={styles.watchStatusLabel}>Frecuencia cardíaca</Text>
            <Text style={styles.watchStatusValue}>{data ? `${data.frecuenciaCardiaca} bpm` : '-- bpm'}</Text>
          </View>
        </View>
        <View style={styles.watchStatusRow}>
          <Text style={styles.watchIcon}>🔋</Text>
          <View>
            <Text style={styles.watchStatusLabel}>Batería del reloj</Text>
            <Text style={styles.watchStatusValue}>{data ? `${data.bateria}%` : '--%'}</Text>
          </View>
        </View>
        <View style={styles.watchStatusRow}>
          <Text style={styles.watchIcon}>〰️</Text>
          <View>
            <Text style={styles.watchStatusLabel}>Acelerómetro (X, Y, Z)</Text>
            <Text style={styles.watchStatusValue}>
              {data ? `${data.acelerometroX.toFixed(1)}, ${data.acelerometroY.toFixed(1)}, ${data.acelerometroZ.toFixed(1)} m/s²` : '--'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 25,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColoresTema.cardBackground,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ColoresTema.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    color: ColoresTema.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
  },
  ultimaConexionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ultimaConexionText: {
    fontSize: 11,
    color: ColoresTema.textMuted,
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColoresTema.success,
    marginRight: 6,
  },
  statusBadgeText: {
    color: ColoresTema.success,
    fontSize: 12,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: ColoresTema.cardBackground,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  gridItemDanger: {
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  gridItemWarning: {
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 4,
  },
  gridUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: ColoresTema.textMuted,
  },
  gridLabel: {
    fontSize: 12,
    color: ColoresTema.textMuted,
  },
  gridCoordinates: {
    fontSize: 10,
    color: ColoresTema.textMuted,
    marginBottom: 4,
  },
  watchCard: {
    width: '100%',
    backgroundColor: ColoresTema.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
  },
  watchStatusList: { gap: 15 },
  watchStatusRow: { flexDirection: 'row', alignItems: 'center' },
  watchIcon: { fontSize: 24, marginRight: 15 },
  watchStatusLabel: { fontSize: 14, fontWeight: '600', color: '#222' },
  watchStatusValue: { fontSize: 14, color: ColoresTema.textDark },
});
