import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ColoresTema } from '../constants/ColoresTema';
import { apiGetAlertas, AlertaItem } from '../services/api';

interface RecentAlertsProps {
  pacienteId?: number;
}

export function RecentAlerts({ pacienteId = 1 }: RecentAlertsProps) {
  const [alertas, setAlertas] = useState<AlertaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarAlertas = useCallback(async () => {
    try {
      const data = await apiGetAlertas(pacienteId);
      // Solo las últimas 2 no resueltas o las más recientes
      const recientes = data.filter(a => !a.resuelta).slice(0, 2);
      setAlertas(recientes);
    } catch (error) {
      console.log('Error cargando alertas recientes:', error);
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    cargarAlertas();
    const interval = setInterval(cargarAlertas, 10000);
    return () => clearInterval(interval);
  }, [cargarAlertas]);

  const getIconConfig = (tipo: string) => {
    switch (tipo) {
      case 'danger': return { name: 'alert-circle' as const, color: '#EF4444', bg: '#FEE2E2' };
      case 'warning': return { name: 'warning' as const, color: '#F59E0B', bg: '#FEF3C7' };
      default: return { name: 'information-circle' as const, color: '#3B82F6', bg: '#DBEAFE' };
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="notifications" size={20} color={ColoresTema.warning} />
          <Text style={styles.title}>Alertas Recientes</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/alertas')}>
          <Text style={styles.link}>Ver historial</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={ColoresTema.primary} />
        ) : alertas.length > 0 ? (
          alertas.map(a => {
            const icon = getIconConfig(a.tipo);
            return (
              <View key={a.id} style={styles.alertItem}>
                <View style={[styles.alertIcon, { backgroundColor: icon.bg }]}>
                  <Ionicons name={icon.name} size={18} color={icon.color} />
                </View>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle} numberOfLines={1}>{a.titulo}</Text>
                  <Text style={styles.alertDate}>{a.fecha}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={40} color={ColoresTema.success} />
            <Text style={styles.emptyTitle}>Todo está tranquilo</Text>
            <Text style={styles.emptyText}>No se han registrado anomalías en las últimas 24 horas.</Text>
          </View>
        )}
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginLeft: 8,
  },
  link: {
    fontSize: 14,
    color: ColoresTema.primary,
    fontWeight: '600',
  },
  content: {
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    padding: 15,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ColoresTema.textTitle,
  },
  alertDate: {
    fontSize: 11,
    color: ColoresTema.textMuted,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginTop: 10,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: ColoresTema.textMuted,
    textAlign: 'center',
  },
});
