import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColoresTema } from '../constants/ColoresTema';

export interface DatoBarra {
  label: string;
  valor: number;
}

export interface GraficaBarrasProps {
  datos: DatoBarra[];
  color: string;
  unidad: string;
  maxValor?: number;
}

export function GraficaBarras({ datos, color, unidad, maxValor }: GraficaBarrasProps) {
  const maxValue = maxValor || Math.max(...datos.map(d => d.valor), 1);

  return (
    <View style={styles.container}>
      <View style={styles.gridLinesContainer}>
        <View style={styles.gridLine} />
        <View style={styles.gridLine} />
        <View style={styles.gridLine} />
        <View style={[styles.gridLine, styles.gridLineBottom]} />
      </View>

      <View style={styles.barsContainer}>
        {datos.map((item, index) => {
          const heightRatio = Math.min(item.valor / maxValue, 1);
          const barHeight = heightRatio * 120; // Max visual height for bar

          return (
            <View key={index} style={styles.barWrapper}>
              <Text style={styles.valueText}>
                {item.valor}
                {unidad ? ` ${unidad}` : ''}
              </Text>
              <View style={styles.barBackground}>
                <View 
                  style={[
                    styles.barFill, 
                    { height: barHeight, backgroundColor: color }
                  ]} 
                />
              </View>
              <Text style={styles.labelText}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: '100%',
    position: 'relative',
    marginTop: 10,
    marginBottom: 10,
  },
  gridLinesContainer: {
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  gridLine: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: ColoresTema.border || '#E2E8F0',
    width: '100%',
  },
  gridLineBottom: {
    borderStyle: 'solid',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
    zIndex: 2,
  },
  barWrapper: {
    alignItems: 'center',
    width: 30,
  },
  valueText: {
    fontSize: 10,
    color: ColoresTema.textMuted || '#94A3B8',
    marginBottom: 4,
    textAlign: 'center',
  },
  barBackground: {
    height: 120,
    width: 20,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  labelText: {
    fontSize: 12,
    color: ColoresTema.textDark || '#334155',
    marginTop: 8,
    position: 'absolute',
    bottom: -20,
  },
});
