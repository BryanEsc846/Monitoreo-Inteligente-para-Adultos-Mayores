import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColoresTema } from '../constants/ColoresTema';
import { StatusCard } from '../components/TarjetaEstadoPaciente';
import { WeeklyReport } from '../components/TarjetaReporteSemanal';
import { RecentAlerts } from '../components/TarjetaAlertas';
import { useRouter } from 'expo-router';

export default function PantallaMenuPrincipal() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Título Principal */}
        <Text style={styles.mainTitle}>MONITOREO DE ADULTOS MAYORES</Text>

        <StatusCard />
        <WeeklyReport />
        <RecentAlerts />

        {/* Acciones Rápidas */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionEmoji}>📞</Text>
            <Text style={styles.quickActionLabel}>Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionButton, styles.quickActionEmergency]}>
            <Text style={styles.quickActionEmoji}>🚑</Text>
            <Text style={[styles.quickActionLabel, styles.quickActionEmergencyText]}>Emergencia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionEmoji}>🔋</Text>
            <Text style={styles.quickActionLabel}>Batería</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de Descarga */}
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Descargar PDF</Text>
        </TouchableOpacity>

        {/* Botón para salir (Solo para probar la navegación) */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.replace('/login' as any)}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

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
    alignItems: 'center',
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: ColoresTema.textTitle,
  },
  downloadButton: {
    backgroundColor: ColoresTema.buttonPrimary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A7A9C',
    marginBottom: 10,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColoresTema.textDark,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 14,
    color: ColoresTema.textMuted,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  quickActionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionEmergency: {
    borderWidth: 2,
    borderColor: '#E53935',
  },
  quickActionEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: ColoresTema.textTitle,
  },
  quickActionEmergencyText: {
    color: '#E53935',
  },
});
