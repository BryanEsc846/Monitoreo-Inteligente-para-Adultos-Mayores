import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ColoresTema } from '../../constants/ColoresTema';
import { cuidador, paciente } from '../../data/mockData';
import { BotonSOS } from '../../components/BotonSOS';
import { StatusCard } from '../../components/TarjetaEstadoPaciente';
import { WeeklyReport } from '../../components/TarjetaReporteSemanal';
import { RecentAlerts } from '../../components/TarjetaAlertas';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* 1. Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {cuidador.nombre} 👋</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{paciente.nombre} está estable</Text>
          </View>
        </View>

        {/* 2. SOS Button */}
        <View style={styles.sosContainer}>
          <BotonSOS />
        </View>

        {/* 3. Patient Status Card */}
        <StatusCard ultimaConexion={paciente.ultimaConexion} />

        {/* 4. Quick Actions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
              <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="call" size={24} color={ColoresTema.primary} />
              </View>
              <Text style={styles.actionLabel}>Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
              <View style={[styles.iconCircle, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="location-sharp" size={24} color={ColoresTema.success} />
              </View>
              <Text style={styles.actionLabel}>Ubicar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/historial')}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="document-text" size={24} color={ColoresTema.warning} />
              </View>
              <Text style={styles.actionLabel}>Reporte</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
              <View style={[styles.iconCircle, { backgroundColor: '#F3F4F6' }]}>
                <Ionicons name="settings" size={24} color={ColoresTema.textDark} />
              </View>
              <Text style={styles.actionLabel}>Ajustes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Weekly Report compact */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Resumen del Día</Text>
          <WeeklyReport compact={true} />
          <TouchableOpacity onPress={() => router.push('/(tabs)/historial')} style={styles.linkButton}>
            <Text style={styles.linkText}>Ver reporte completo →</Text>
          </TouchableOpacity>
        </View>

        {/* 6. Recent Alerts mini */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Alertas Recientes</Text>
          <RecentAlerts />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColoresTema.background,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 10,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColoresTema.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: ColoresTema.textMuted,
  },
  sosContainer: {
    marginVertical: 15,
  },
  sectionContainer: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: ColoresTema.cardBackground,
    borderRadius: 16,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: ColoresTema.textDark,
    fontWeight: '500',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  linkText: {
    color: ColoresTema.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
