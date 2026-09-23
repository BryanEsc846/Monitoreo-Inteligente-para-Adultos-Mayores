import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ColoresTema } from '../../constants/ColoresTema';
import { TarjetaAlertaItem } from '../../components/TarjetaAlertaItem';
import { apiGetAlertas, apiResolverAlerta, AlertaItem } from '../../services/api';

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState<AlertaItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const cargarAlertas = useCallback(async () => {
    try {
      const data = await apiGetAlertas(1);
      setAlertas(data);
    } catch (error) {
      console.log('Error cargando alertas:', error);
    }
  }, []);

  useEffect(() => {
    cargarAlertas();
    // Polling cada 5 segundos para detectar nuevas alertas rápidamente
    const interval = setInterval(cargarAlertas, 5000);
    return () => clearInterval(interval);
  }, [cargarAlertas]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarAlertas();
    setRefreshing(false);
  }, [cargarAlertas]);

  const handleResolver = async (alertaId: number) => {
    try {
      await apiResolverAlerta(alertaId);
      Alert.alert('Alerta resuelta', 'La alerta ha sido marcada como atendida.');
      await cargarAlertas();
    } catch (error) {
      Alert.alert('Error', 'No se pudo resolver la alerta.');
    }
  };

  const alertasResueltas = alertas.filter(a => a.resuelta).length;
  const alertasTotales = alertas.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial de Alertas</Text>
        <Ionicons name="notifications" size={24} color={ColoresTema.textTitle} />
      </View>

      <View style={styles.summaryStrip}>
        <Text style={styles.summaryText}>
          {alertasTotales} alertas totales · {alertasResueltas} resueltas
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ColoresTema.primary]} />
        }
      >
        {alertasTotales > 0 ? (
          alertas.map(alerta => (
            <TouchableOpacity
              key={alerta.id}
              onLongPress={() => {
                if (!alerta.resuelta) {
                  Alert.alert(
                    'Resolver Alerta',
                    `¿Marcar "${alerta.titulo}" como resuelta?`,
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Resolver', onPress: () => handleResolver(alerta.id) },
                    ]
                  );
                }
              }}
              activeOpacity={0.8}
            >
              <TarjetaAlertaItem 
                tipo={alerta.tipo}
                titulo={alerta.titulo}
                descripcion={alerta.descripcion}
                fecha={alerta.fecha}
                resuelta={alerta.resuelta}
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color={ColoresTema.success} />
            <Text style={styles.emptyStateTitle}>Todo está tranquilo</Text>
            <Text style={styles.emptyStateDesc}>No hay alertas recientes para mostrar.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColoresTema.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
  },
  summaryStrip: {
    backgroundColor: ColoresTema.cardBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryText: {
    fontSize: 14,
    color: ColoresTema.textDark,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 5,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateDesc: {
    fontSize: 14,
    color: ColoresTema.textMuted,
    textAlign: 'center',
  },
});
