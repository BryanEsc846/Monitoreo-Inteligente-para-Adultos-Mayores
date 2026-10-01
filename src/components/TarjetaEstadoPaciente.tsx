import { StyleSheet, Text, View } from 'react-native';
import { ColoresTema } from '../constants/ColoresTema';
import type { WatchData } from '../types/WatchData';

type Props = {
  data: WatchData | null;
};

export function StatusCard({ data }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.statusList}>
        <View style={styles.statusRow}>
          <Text style={styles.icon}>❤️</Text>
          <View>
            <Text style={styles.statusLabel}>Frecuencia cardíaca</Text>
            <Text style={styles.statusValue}>{data ? `${data.frecuenciaCardiaca} bpm` : '-- bpm'}</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.icon}>🔋</Text>
          <View>
            <Text style={styles.statusLabel}>Batería del reloj</Text>
            <Text style={styles.statusValue}>{data ? `${data.bateria}%` : '--%'}</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.icon}>〰️</Text>
          <View>
            <Text style={styles.statusLabel}>Acelerómetro (X, Y, Z)</Text>
            <Text style={styles.statusValue}>
              {data ? `${data.acelerometroX.toFixed(1)}, ${data.acelerometroY.toFixed(1)}, ${data.acelerometroZ.toFixed(1)} m/s²` : '--'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ColoresTema.cardBackground,
    width: '100%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusList: { gap: 15 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 24, marginRight: 15 },
  statusLabel: { fontSize: 14, fontWeight: '600', color: '#222' },
  statusValue: { fontSize: 14, color: ColoresTema.textDark },
});
