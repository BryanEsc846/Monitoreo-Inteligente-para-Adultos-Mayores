import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColoresTema } from '../constants/ColoresTema';

export function StatusCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.greeting}>Hola, Bryam</Text>
      <Text style={styles.patientName}>Adulto mayor:{"\n"}María López</Text>

      <View style={styles.statusList}>
        <View style={styles.statusRow}>
          <Text style={styles.icon}>🟢</Text>
          <View>
            <Text style={styles.statusLabel}>Estado</Text>
            <Text style={styles.statusValue}>Todo normal</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.icon}>❤️</Text>
          <View>
            <Text style={styles.statusLabel}>Frecuencia cardíaca</Text>
            <Text style={styles.statusValue}>74 bpm</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.icon}>🚶</Text>
          <View>
            <Text style={styles.statusLabel}>Movimiento</Text>
            <Text style={styles.statusValue}>Normal</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.icon}>📍</Text>
          <View>
            <Text style={styles.statusLabel}>Ubicación</Text>
            <Text style={styles.statusValue}>En casa</Text>
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
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: ColoresTema.textDark,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: ColoresTema.textDark,
  },
  statusList: { gap: 15 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 24, marginRight: 15 },
  statusLabel: { fontSize: 14, fontWeight: '600', color: '#222' },
  statusValue: { fontSize: 14, color: ColoresTema.textDark },
});
