import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ColoresTema } from '../../constants/ColoresTema';
import { cuidador, paciente, contactosEmergencia } from '../../data/mockData';

export default function PerfilScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login' as any);
  };

  const menuOptions = [
    { icon: 'map-outline', label: 'Configurar geocerca' },
    { icon: 'notifications-outline', label: 'Notificaciones' },
    { icon: 'information-circle-outline', label: 'Sobre la app' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JL</Text>
          </View>
          <Text style={styles.profileName}>{cuidador.nombre} López</Text>
          <Text style={styles.profileSubtitle}>Cuidador</Text>
        </View>

        {/* Monitored Patient Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Paciente Monitoreado</Text>
          <View style={styles.patientInfoRow}>
            <View style={styles.patientAvatarSmall}>
              <Text style={styles.patientAvatarText}>{paciente.iniciales}</Text>
            </View>
            <View style={styles.patientDetails}>
              <Text style={styles.patientName}>{paciente.nombre}</Text>
              <Text style={styles.patientAge}>{paciente.edad} años</Text>
            </View>
          </View>
          
          <View style={styles.conditionsContainer}>
            {paciente.condiciones.map((condicion, index) => (
              <View key={index} style={styles.conditionBadge}>
                <Text style={styles.conditionText}>{condicion}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Emergency Contacts Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
          {contactosEmergencia.map((contacto, index) => (
            <View key={contacto.id} style={[styles.contactRow, index < contactosEmergencia.length - 1 && styles.borderBottom]}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contacto.nombre}</Text>
                <Text style={styles.contactRelation}>{contacto.relacion}</Text>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={20} color={ColoresTema.success} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Settings Menu */}
        <View style={styles.sectionCard}>
          {menuOptions.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.menuRow, index < menuOptions.length - 1 && styles.borderBottom]}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={option.icon as any} size={22} color={ColoresTema.textDark} style={styles.menuIcon} />
                <Text style={styles.menuLabel}>{option.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={ColoresTema.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColoresTema.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: ColoresTema.cardBackground,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: ColoresTema.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: ColoresTema.textMuted,
  },
  sectionCard: {
    backgroundColor: ColoresTema.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
    marginBottom: 15,
  },
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  patientAvatarSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  patientAvatarText: {
    color: ColoresTema.textDark,
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColoresTema.textTitle,
  },
  patientAge: {
    fontSize: 14,
    color: ColoresTema.textDark,
    marginTop: 2,
  },
  conditionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  conditionBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  conditionText: {
    fontSize: 12,
    color: ColoresTema.textDark,
    fontWeight: '500',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: ColoresTema.border,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: ColoresTema.textTitle,
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 13,
    color: ColoresTema.textMuted,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuLabel: {
    fontSize: 15,
    color: ColoresTema.textDark,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: ColoresTema.cardBackground,
    borderWidth: 1,
    borderColor: ColoresTema.danger,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: ColoresTema.danger,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
