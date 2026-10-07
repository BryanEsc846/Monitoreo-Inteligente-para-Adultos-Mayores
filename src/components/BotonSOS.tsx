import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ColoresTema } from '../constants/ColoresTema';
import { apiEnviarSOS } from '../services/api';

interface BotonSOSProps {
  pacienteId?: number;
}

export function BotonSOS({ pacienteId = 1 }: BotonSOSProps) {
  const handlePress = () => {
    Alert.alert(
      '¿Enviar alerta de emergencia?',
      'Se agregará una alerta local de demostración. No se notificará a contactos reales.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar SOS', 
          style: 'destructive',
          onPress: async () => {
            const resultado = await apiEnviarSOS(pacienteId);
            Alert.alert('SOS registrado (demo)', resultado.mensaje);
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
