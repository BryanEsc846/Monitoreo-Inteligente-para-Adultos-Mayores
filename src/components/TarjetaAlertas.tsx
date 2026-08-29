import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColoresTema } from '../constants/ColoresTema';

export function RecentAlerts() {
  return (
    <View style={styles.alertsContainer}>
      <View style={styles.alertsHeader}>
        <Text style={styles.alertsHeaderText}>ALERTAS RECIENTES</Text>
      </View>
      <View style={styles.alertsBody}>
        <Text style={styles.noAlertsText}>NO HAY ALERTAS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alertsContainer: {
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertsHeader: {
    backgroundColor: ColoresTema.alertHeader,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  alertsHeaderText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: ColoresTema.textDark,
  },
  alertsBody: {
    backgroundColor: ColoresTema.alertBody,
    padding: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
  },
  noAlertsText: {
    color: ColoresTema.textMuted,
    fontWeight: '600',
  },
});
