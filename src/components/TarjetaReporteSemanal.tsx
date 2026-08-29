import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColoresTema } from '../constants/ColoresTema';

export function WeeklyReport({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.header}>
        <Text style={styles.title}>Reporte Semanal</Text>
        <Ionicons name="bar-chart" size={20} color={ColoresTema.primary} />
      </View>

      <View style={styles.chartContainer}>
        {/* Barra 1 */}
        <View style={styles.barWrapper}>
          <View style={styles.labelRow}>
            <Text style={styles.chartLabel}>Frecuencia cardíaca media</Text>
            <Text style={styles.chartValue}>72 bpm</Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: '70%', backgroundColor: ColoresTema.danger }]} />
          </View>
        </View>

        {/* Barra 2 */}
        <View style={styles.barWrapper}>
          <View style={styles.labelRow}>
            <Text style={styles.chartLabel}>Nivel de actividad</Text>
            <Text style={styles.chartValue}>Moderado</Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: '50%', backgroundColor: ColoresTema.primary }]} />
          </View>
        </View>
      </View>

      {!compact && (
        <>
          <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>0</Text>
              <Text style={styles.summaryText}>Caídas</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>2</Text>
              <Text style={styles.summaryText}>Alertas leves</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="download-outline" size={18} color={ColoresTema.primary} />
            <Text style={styles.downloadText}>Descargar PDF del médico</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ColoresTema.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardCompact: {
    padding: 15,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
  },
  chartContainer: {
    marginBottom: 20,
  },
  barWrapper: {
    marginBottom: 15,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  chartLabel: {
    fontSize: 13,
    color: ColoresTema.textDark,
    fontWeight: '500',
  },
  chartValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
  },
  barTrack: {
    height: 8,
    backgroundColor: ColoresTema.barTrack,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 2,
  },
  summaryText: {
    fontSize: 12,
    color: ColoresTema.textMuted,
  },
  divider: {
    width: 1,
    backgroundColor: ColoresTema.border,
    marginHorizontal: 15,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  downloadText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: ColoresTema.primary,
  }
});
