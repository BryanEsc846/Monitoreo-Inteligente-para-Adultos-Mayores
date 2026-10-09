import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import { ColoresTema } from '../constants/ColoresTema';
import { apiGetAlertas, apiGetHistorial, HistorialResponse } from '../services/api';

export function DailyReport({ compact = false }: { compact?: boolean }) {
  const [report, setReport] = useState<HistorialResponse | null>(null);
  const [alertCount, setAlertCount] = useState(0);
  const cargar = useCallback(async () => {
    const [historial, alertas] = await Promise.all([
      apiGetHistorial(1, 'Hoy'),
      apiGetAlertas(1),
    ]);
    setReport(historial);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    setAlertCount(alertas.filter(alerta =>
      typeof alerta.timestamp === 'number' && alerta.timestamp >= startOfDay.getTime()
    ).length);
  }, []);

  useEffect(() => {
    void cargar().catch(error => console.warn('No se pudo cargar el resumen diario', error));
    const interval = setInterval(() => {
      void cargar().catch(error => console.warn('No se pudo actualizar el resumen diario', error));
    }, 10000);
    return () => clearInterval(interval);
  }, [cargar]);

  if (!report) {
    return <ActivityIndicator color={ColoresTema.primary} />;
  }

  const promedio = report.estadisticas.promedio;
  const fillWidth: DimensionValue = promedio
    ? `${Math.min(Math.max((promedio / 150) * 100, 4), 100)}%`
    : '4%';

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumen Diario</Text>
        <Ionicons name="bar-chart" size={20} color={ColoresTema.primary} />
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.barWrapper}>
          <View style={styles.labelRow}>
            <Text style={styles.chartLabel}>Frecuencia cardíaca promedio</Text>
            <Text style={styles.chartValue}>{promedio || '--'} bpm</Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: fillWidth, backgroundColor: ColoresTema.danger }]} />
          </View>
        </View>
      </View>

      {!compact && (
        <>
          <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{report.estadisticas.maximo || '--'}</Text>
              <Text style={styles.summaryText}>Máximo bpm</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{alertCount}</Text>
              <Text style={styles.summaryText}>Alertas del día</Text>
            </View>
          </View>
        </>
      )}
      {report.puntos.length === 0 && (
        <Text style={styles.noData}>Aún no hay mediciones registradas hoy.</Text>
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
  noData: {
    color: ColoresTema.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
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
