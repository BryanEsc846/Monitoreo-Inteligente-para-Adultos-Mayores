import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColoresTema } from '../constants/ColoresTema';
import { TarjetaEstadoPaciente } from '../components/TarjetaEstadoPaciente';
import { TarjetaReporteSemanal } from '../components/TarjetaReporteSemanal';
import { TarjetaAlertas } from '../components/TarjetaAlertas';
import { useRouter } from 'expo-router';

export default function PantallaMenuPrincipal() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Título Principal */}
        <Text style={styles.mainTitle}>MONITOREO DE ADULTOS MAYORES</Text>

        <TarjetaEstadoPaciente />
        <TarjetaReporteSemanal />
        <TarjetaAlertas />

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
  }
});
