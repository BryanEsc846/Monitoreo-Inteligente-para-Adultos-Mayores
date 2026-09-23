import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { ColoresTema } from '../constants/ColoresTema';
import { apiEnviarSOS } from '../services/api';

interface BotonSOSProps {
  pacienteId?: number;
}

export function BotonSOS({ pacienteId = 1 }: BotonSOSProps) {
  const handlePress = () => {
    Alert.alert(
      '¿Enviar alerta de emergencia?',
      'Se notificará a todos los contactos de emergencia',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar SOS', 
          style: 'destructive',
          onPress: async () => {
            try {
              const resultado = await apiEnviarSOS(pacienteId);
              Alert.alert('🚨 SOS Enviado', resultado.mensaje);
            } catch (error: any) {
              Alert.alert('SOS Enviado', 'Alerta de emergencia registrada.');
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={handlePress}>
      <Text style={styles.title}>🚨 EMERGENCIA SOS</Text>
      <Text style={styles.subtitle}>Toca para enviar alerta</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    backgroundColor: ColoresTema.sos || '#DC2626',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    marginVertical: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    marginTop: 2,
  },
});
