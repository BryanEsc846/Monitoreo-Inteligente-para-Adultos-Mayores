import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColoresTema } from '../constants/ColoresTema';

export function WeeklyReport() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Reporte semanal</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.chartLabel}>Frecuencia cardíaca</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: '80%' }]} />
        </View>

        <Text style={styles.chartLabel}>Movimiento</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: '60%' }]} />
        </View>

        <Text style={styles.chartLabel}>Horas activas</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: '70%' }]} />
        </View>
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Eventos</Text>
        <Text style={styles.eventsText}>0 caídas</Text>
        <Text style={styles.eventsText}>2 alertas leves</Text>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: ColoresTema.textDark,
  },
  chartContainer: { marginBottom: 20 },
  chartLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
    color: ColoresTema.textDark,
  },
  barTrack: {
    height: 10,
    backgroundColor: ColoresTema.barTrack,
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: ColoresTema.barFill,
  },
  eventsContainer: { alignItems: 'center' },
  eventsTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: ColoresTema.textDark },
  eventsText: { fontSize: 14, marginBottom: 2, color: ColoresTema.textDark },
});
