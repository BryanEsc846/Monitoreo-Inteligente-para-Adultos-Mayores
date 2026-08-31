import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColoresTema } from '../constants/ColoresTema';

export interface TarjetaAlertaItemProps {
  tipo: 'danger' | 'warning' | 'info';
  titulo: string;
  descripcion: string;
  fecha: string;
  resuelta: boolean;
}

export function TarjetaAlertaItem({
  tipo,
  titulo,
  descripcion,
  fecha,
  resuelta,
}: TarjetaAlertaItemProps) {
  
  const getIconConfig = () => {
    switch (tipo) {
      case 'danger':
        return {
          name: 'alert-circle' as const,
          color: ColoresTema.danger || '#EF4444',
          bgColor: '#FEE2E2',
        };
      case 'warning':
        return {
          name: 'warning' as const,
          color: ColoresTema.warning || '#F59E0B',
          bgColor: '#FEF3C7',
        };
      case 'info':
      default:
        return {
          name: 'information-circle' as const,
          color: ColoresTema.primary || '#3B82F6',
          bgColor: '#DBEAFE',
        };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <View style={[styles.card, resuelta && styles.cardResuelta]}>
      <View style={[styles.iconBox, { backgroundColor: iconConfig.bgColor }]}>
        <Ionicons name={iconConfig.name} size={24} color={iconConfig.color} />
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.titulo} numberOfLines={1}>{titulo}</Text>
          {resuelta && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Resuelta</Text>
            </View>
          )}
        </View>
        <Text style={styles.descripcion} numberOfLines={2}>{descripcion}</Text>
        <Text style={styles.fecha}>{fecha}</Text>
      </View>
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
    shadowRadius: 4,
    elevation: 2,
  },
  cardResuelta: {
    opacity: 0.7,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ColoresTema.textTitle || '#1E293B',
    flex: 1,
  },
  badge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: ColoresTema.success || '#10B981',
  },
  descripcion: {
    fontSize: 12,
    color: ColoresTema.textMuted || '#94A3B8',
    marginBottom: 6,
  },
  fecha: {
    fontSize: 11,
    color: ColoresTema.textMuted || '#94A3B8',
  },
});
