import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ColoresTema } from '../../constants/ColoresTema';
import { medicamentos as initialMedicamentos, paciente } from '../../data/mockData';
import { TarjetaMedicamento } from '../../components/TarjetaMedicamento';

export default function MedicamentosScreen() {
  const [medicamentos, setMedicamentos] = useState(initialMedicamentos);

  const toggleTomado = (id: string) => {
    setMedicamentos(prev =>
      prev.map(med =>
        med.id === id ? { ...med, tomado: !med.tomado } : med
      )
    );
  };

  const proximoMed = medicamentos.find(med => !med.tomado);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Medicamentos de {paciente.nombre}</Text>
          <Text style={styles.subtitle}>💊 Control diario de medicinas</Text>
        </View>

        {proximoMed && (
          <View style={styles.highlightSection}>
            <Text style={styles.sectionTitle}>Próximo medicamento</Text>
            <View style={styles.highlightCard}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>Próximo</Text>
              </View>
              <Text style={styles.highlightName}>{proximoMed.nombre}</Text>
              <Text style={styles.highlightDosis}>{proximoMed.dosis} - {proximoMed.horario}</Text>
              <TouchableOpacity 
                style={styles.tomarBoton}
                onPress={() => toggleTomado(proximoMed.id)}
              >
                <Text style={styles.tomarBotonText}>Marcar como tomado</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Lista de medicamentos</Text>
          {medicamentos.map(med => (
            <TarjetaMedicamento 
              key={med.id} 
              nombre={med.nombre}
              dosis={med.dosis}
              horario={med.horario}
              tomado={med.tomado}
              onToggle={() => toggleTomado(med.id)} 
            />
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Agregar medicamento</Text>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: ColoresTema.textMuted,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 12,
  },
  highlightSection: {
    marginBottom: 25,
  },
  highlightCard: {
    backgroundColor: ColoresTema.medicineBg || '#F5F3FF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  badgeContainer: {
    backgroundColor: ColoresTema.medicine || '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  highlightName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 5,
  },
  highlightDosis: {
    fontSize: 16,
    color: ColoresTema.textDark,
    marginBottom: 15,
  },
  tomarBoton: {
    backgroundColor: ColoresTema.medicine || '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tomarBotonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listSection: {
    marginBottom: 25,
  },
  addButton: {
    backgroundColor: ColoresTema.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
