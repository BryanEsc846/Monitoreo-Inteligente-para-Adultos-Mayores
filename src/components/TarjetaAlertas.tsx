import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColoresTema } from '../constants/ColoresTema';

export function RecentAlerts() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="notifications" size={20} color={ColoresTema.warning} />
          <Text style={styles.title}>Alertas Recientes</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.link}>Ver historial</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={40} color={ColoresTema.success} />
          <Text style={styles.emptyTitle}>Todo está tranquilo</Text>
          <Text style={styles.emptyText}>No se han registrado anomalías en las últimas 24 horas.</Text>
        </View>
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
    padding: 20,
    alignItems: 'center',
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
