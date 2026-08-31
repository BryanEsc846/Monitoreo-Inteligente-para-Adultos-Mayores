import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ColoresTema } from '../constants/ColoresTema';

export function StatusCard({ ultimaConexion = 'Hace 5 min' }: { ultimaConexion?: string }) {
  return (
    <View style={styles.container}>
      {/* Header del Paciente */}
      <View style={styles.patientHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>ML</Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.greeting}>Monitoreando a</Text>
          <Text style={styles.patientName}>María López</Text>
          <View style={styles.ultimaConexionContainer}>
            <Ionicons name="time-outline" size={12} color={ColoresTema.textMuted} />
            <Text style={styles.ultimaConexionText}>{ultimaConexion}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusBadgeText}>Estable</Text>
        </View>
      </View>

      {/* Cuadrícula de Signos Vitales (2x2) */}
      <View style={styles.grid}>
        {/* Tarjeta 1: Corazón */}
        <View style={styles.gridItem}>
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <FontAwesome5 name="heartbeat" size={18} color={ColoresTema.danger} />
          </View>
          <Text style={styles.gridValue}>74 <Text style={styles.gridUnit}>bpm</Text></Text>
          <Text style={styles.gridLabel}>Ritmo Cardíaco</Text>
        </View>

        {/* Tarjeta 2: Movimiento */}
        <View style={styles.gridItem}>
          <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
            <MaterialCommunityIcons name="run" size={20} color={ColoresTema.primary} />
          </View>
          <Text style={styles.gridValue}>Normal</Text>
          <Text style={styles.gridLabel}>Movimiento</Text>
        </View>

        {/* Tarjeta 3: Ubicación */}
        <View style={styles.gridItem}>
          <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="location-sharp" size={18} color={ColoresTema.success} />
          </View>
          <Text style={styles.gridValue}>En Casa</Text>
          <Text style={styles.gridLabel}>Ubicación</Text>
        </View>

        {/* Tarjeta 4: Batería */}
        <View style={styles.gridItem}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="battery-charging" size={18} color={ColoresTema.warning} />
          </View>
          <Text style={styles.gridValue}>85%</Text>
          <Text style={styles.gridLabel}>Batería Pulsera</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 25,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColoresTema.cardBackground,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ColoresTema.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    color: ColoresTema.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
  },
  ultimaConexionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ultimaConexionText: {
    fontSize: 11,
    color: ColoresTema.textMuted,
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColoresTema.success,
    marginRight: 6,
  },
  statusBadgeText: {
    color: ColoresTema.success,
    fontSize: 12,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: ColoresTema.cardBackground,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 4,
  },
  gridUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: ColoresTema.textMuted,
  },
  gridLabel: {
    fontSize: 12,
    color: ColoresTema.textMuted,
  },
});
