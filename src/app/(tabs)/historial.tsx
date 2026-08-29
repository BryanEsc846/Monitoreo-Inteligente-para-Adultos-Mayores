import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ColoresTema } from '../../constants/ColoresTema';
import { GraficaBarras } from '../../components/GraficaBarras';
import { historialSemanal, estadisticas, actividadDiaria } from '../../data/mockData';

export default function HistorialScreen() {
  const [periodo, setPeriodo] = useState('Semana');
  const periodos = ['Hoy', 'Semana', 'Mes'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.cardTitle}>Ritmo Cardíaco Semanal</Text>
          </View>
          <GraficaBarras datos={historialSemanal.map(d => ({ label: d.dia, valor: d.valor }))} color={ColoresTema.danger} unidad="bpm" />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Promedio</Text>
            <Text style={[styles.statValue, { color: ColoresTema.primary }]}>{estadisticas.promedio} bpm</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Máximo</Text>
            <Text style={[styles.statValue, { color: ColoresTema.danger }]}>{estadisticas.maximo} bpm</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Mínimo</Text>
            <Text style={[styles.statValue, { color: ColoresTema.success }]}>{estadisticas.minimo} bpm</Text>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Actividad del Día</Text>
          <View style={styles.timelineContainer}>
            {actividadDiaria.map((actividad, index) => {
              const dotColor = 
                actividad.tipo === 'success' ? ColoresTema.success :
                actividad.tipo === 'warning' ? ColoresTema.warning :
                ColoresTema.primary;
                
              return (
                <View key={actividad.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: dotColor }]} />
                    {index < actividadDiaria.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTime}>{actividad.hora}</Text>
                    <Text style={styles.timelineDesc}>{actividad.descripcion}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.downloadButton}>
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
  timelineCard: {
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
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 15,
  },
  timelineContainer: {
    paddingLeft: 5,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 15,
    width: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    backgroundColor: ColoresTema.border,
    position: 'absolute',
    top: 12,
    bottom: -15,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 15,
  },
  timelineTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 4,
  },
  timelineDesc: {
    fontSize: 14,
    color: ColoresTema.textDark,
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
