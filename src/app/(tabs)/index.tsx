import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ColoresTema } from '../../constants/ColoresTema';
import { BotonSOS } from '../../components/BotonSOS';
import { StatusCard } from '../../components/TarjetaEstadoPaciente';
import { WeeklyReport } from '../../components/TarjetaReporteSemanal';
import { RecentAlerts } from '../../components/TarjetaAlertas';
import { apiGetEstadoPaciente, apiGetPacientes, getCurrentUserId, EstadoPaciente } from '../../services/api';

export default function HomeScreen() {
  const [estado, setEstado] = useState<EstadoPaciente | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pacienteId, setPacienteId] = useState<number>(1);
  const [nombreCuidador, setNombreCuidador] = useState('Cuidador');

  const cargarDatos = useCallback(async () => {
    try {
      // Cargar lista de pacientes del cuidador
      const userId = getCurrentUserId() || 1;
      const pacientes = await apiGetPacientes(userId);
      if (pacientes.length > 0) {
        setPacienteId(pacientes[0].id);
      }

      // Cargar estado actual del paciente
      const estadoData = await apiGetEstadoPaciente(pacienteId);
      setEstado(estadoData);
    } catch (error) {
      console.log('Error cargando datos del dashboard, usando fallback:', error);
    }
  }, [pacienteId]);

  useEffect(() => {
    cargarDatos();
    // Polling cada 10 segundos para simular tiempo real
    const interval = setInterval(cargarDatos, 10000);
    return () => clearInterval(interval);
  }, [cargarDatos]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  }, [cargarDatos]);

  const handleLlamar = () => {
    const phoneNumber = '+50378901234';
    const phoneUrl = Platform.OS === 'web' ? `tel:${phoneNumber}` : `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Llamada', `Llamando a emergencias: ${phoneNumber}`);
        }
      })
      .catch(() => Alert.alert('Llamada', `Número de emergencia: ${phoneNumber}`));
  };

  const handleUbicar = () => {
    const lat = 13.6929;
    const lng = -89.2182;
    const nombre = estado?.nombre || 'Paciente';
    const mapUrl = Platform.select({
      ios: `maps:0,0?q=${nombre}@${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${nombre})`,
      web: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    Linking.openURL(mapUrl).catch(() =>
      Alert.alert('Ubicación', `${nombre} está en: ${estado?.ubicacion || 'En Casa'} (${lat}, ${lng})`)
    );
  };

  // Determinar datos a mostrar
  const nombrePaciente = estado?.nombre || 'María López';
  const estadoTexto = estado?.estado || 'Estable';
  const ultimaConexion = estado?.ultima_conexion || 'Hace 5 min';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ColoresTema.primary]} />
        }
      >
        
        {/* 1. Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, Cuidador 👋</Text>
          <View style={styles.statusRow}>
            <View style={[
              styles.statusDot,
              { backgroundColor: estadoTexto === 'Estable' ? ColoresTema.success : estadoTexto === 'Crítico' ? '#DC2626' : '#F59E0B' }
            ]} />
            <Text style={styles.statusText}>{nombrePaciente} está {estadoTexto.toLowerCase()}</Text>
          </View>
        </View>

        {/* 2. SOS Button */}
        <View style={styles.sosContainer}>
          <BotonSOS pacienteId={pacienteId} />
        </View>

        {/* 3. Patient Status Card - con datos reales */}
        <StatusCard
          ultimaConexion={ultimaConexion}
          signosVitales={estado?.signos_vitales}
          nombre={nombrePaciente}
          iniciales={estado?.iniciales || 'ML'}
          estadoTexto={estadoTexto}
        />

        {/* 4. Quick Actions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleLlamar}>
              <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="call" size={24} color={ColoresTema.primary} />
              </View>
              <Text style={styles.actionLabel}>Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleUbicar}>
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

            <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert('Ajustes', 'Funcionalidad en desarrollo')}>
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
          <RecentAlerts pacienteId={pacienteId} />
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
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
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
