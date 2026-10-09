import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ColoresTema } from '../../constants/ColoresTema';
import { GraficaBarras } from '../../components/GraficaBarras';
import { apiGetHistorial, HistorialResponse } from '../../services/api';

export default function HistorialScreen() {
  const [periodo, setPeriodo] = useState('Semana');
  const periodos = ['Hoy', 'Semana', 'Mes'];
  const [historial, setHistorial] = useState<HistorialResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const cargarHistorial = useCallback(async () => {
    try {
      const data = await apiGetHistorial(1, periodo);
      setHistorial(data);
    } catch (error) {
      console.log('Error cargando historial, usando datos por defecto:', error);
    }
  }, [periodo]);

  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarHistorial();
    setRefreshing(false);
  }, [cargarHistorial]);

  const puntos = historial?.puntos || [];
  const stats = historial?.estadisticas || { promedio: 0, maximo: 0, minimo: 0 };

  const handleCompartirReporte = async () => {
    await Share.share({
      title: `Reporte de salud - ${periodo}`,
      message: [
        `Reporte de salud de María López (${periodo})`,
        `Promedio: ${stats.promedio || '--'} bpm`,
        `Máximo: ${stats.maximo || '--'} bpm`,
        `Mínimo: ${stats.minimo || '--'} bpm`,
        puntos.length ? `Mediciones agrupadas: ${puntos.length}` : 'Sin mediciones registradas.',
      ].join('\n'),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ColoresTema.primary]} />
        }
      >
        <Text style={styles.headerTitle}>Historial de Salud</Text>

        <View style={styles.periodSelector}>
          {periodos.map(p => (
            <TouchableOpacity 
              key={p} 
              style={[styles.periodButton, periodo === p && styles.periodButtonActive]}
              onPress={() => setPeriodo(p)}
            >
              <Text style={[styles.periodButtonText, periodo === p && styles.periodButtonTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="heart" size={24} color={ColoresTema.danger} />
            <Text style={styles.cardTitle}>
              Ritmo Cardíaco {periodo === 'Hoy' ? 'de Hoy' : periodo === 'Semana' ? 'Semanal' : 'Mensual'}
            </Text>
          </View>
          <GraficaBarras
            datos={puntos.map(d => ({ label: d.dia, valor: d.valor }))}
            color={ColoresTema.danger}
            unidad="bpm"
          />
          {puntos.length === 0 && (
            <Text style={styles.noData}>No hay mediciones registradas para este período.</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Promedio</Text>
            <Text style={[styles.statValue, { color: ColoresTema.primary }]}>{stats.promedio} bpm</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Máximo</Text>
            <Text style={[styles.statValue, { color: ColoresTema.danger }]}>{stats.maximo} bpm</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Mínimo</Text>
            <Text style={[styles.statValue, { color: ColoresTema.success }]}>{stats.minimo} bpm</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.downloadButton} onPress={() => void handleCompartirReporte()}>
          <Ionicons name="share-outline" size={20} color={ColoresTema.primary} />
          <Text style={styles.downloadButtonText}>Compartir reporte</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColoresTema.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: ColoresTema.primary,
  },
  periodButtonText: {
    color: ColoresTema.textDark,
    fontSize: 14,
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  chartCard: {
    backgroundColor: ColoresTema.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: ColoresTema.cardBackground,
    borderRadius: 16,
    padding: 15,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: ColoresTema.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColoresTema.cardBackground,
    borderWidth: 1,
    borderColor: ColoresTema.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 10,
  },
  downloadButtonText: {
    color: ColoresTema.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  noData: {
    color: ColoresTema.textMuted,
    textAlign: 'center',
    fontSize: 13,
    marginTop: 4,
  }
});
