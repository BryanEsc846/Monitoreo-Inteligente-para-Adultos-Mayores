import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColoresTema } from '../constants/ColoresTema';

export interface TarjetaMedicamentoProps {
  nombre: string;
  dosis: string;
  horario: string;
  tomado: boolean;
  onToggle: () => void;
}

export function TarjetaMedicamento({
  nombre,
  dosis,
  horario,
  tomado,
  onToggle,
}: TarjetaMedicamentoProps) {
  return (
    <View style={[styles.card, tomado && styles.cardTomado]}>
      <View style={styles.iconBox}>
        <Ionicons name="medical" size={24} color={ColoresTema.medicine || '#8B5CF6'} />
      </View>
      <View style={styles.content}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.dosis}>{dosis}</Text>
        <View style={styles.horarioContainer}>
          <Ionicons name="time-outline" size={14} color={ColoresTema.textMuted || '#94A3B8'} />
          <Text style={styles.horario}>{horario}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        {tomado ? (
          <Ionicons name="checkmark-circle" size={28} color={ColoresTema.success || '#10B981'} />
        ) : (
          <View style={styles.emptyCircle} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ColoresTema.cardBackground || '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTomado: {
    borderLeftWidth: 3,
    borderLeftColor: ColoresTema.success || '#10B981',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: ColoresTema.medicineBg || '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  nombre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: ColoresTema.textTitle || '#1E293B',
    marginBottom: 4,
  },
  dosis: {
    fontSize: 13,
    color: ColoresTema.textMuted || '#94A3B8',
    marginBottom: 4,
  },
  horarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horario: {
    fontSize: 13,
    color: ColoresTema.textMuted || '#94A3B8',
    marginLeft: 4,
  },
  checkboxContainer: {
    padding: 5,
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ColoresTema.border || '#E2E8F0',
  },
});
