import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
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

  // Datos de la gráfica (reales o fallback)
  const puntos = historial?.puntos || [
    { dia: 'L', valor: 72 }, { dia: 'M', valor: 75 }, { dia: 'Mi', valor: 68 },
    { dia: 'J', valor: 74 }, { dia: 'V', valor: 80 }, { dia: 'S', valor: 71 }, { dia: 'D', valor: 74 },
  ];
  const stats = historial?.estadisticas || { promedio: 73, maximo: 80, minimo: 68 };

  const handleDescargarPDF = () => {
    Alert.alert(
      'Reporte PDF',
      `Reporte de ${periodo} generado.\n\n` +
      `Paciente: María López\n` +
      `Promedio: ${stats.promedio} bpm\n` +
      `Máximo: ${stats.maximo} bpm\n` +
      `Mínimo: ${stats.minimo} bpm\n\n` +
      `Nota: La funcionalidad completa de exportación PDF estará disponible en la versión final.`,
      [{ text: 'Entendido' }]
    );
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

        <TouchableOpacity style={styles.downloadButton} onPress={handleDescargarPDF}>
          <Ionicons name="download-outline" size={20} color={ColoresTema.primary} />
          <Text style={styles.downloadButtonText}>Descargar reporte PDF</Text>
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
  }
});
