import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import { useCallback, useEffect, useState } from 'react';
import { realtimeDatabase } from '../constants/firebase';
import type { WatchData } from '../types/WatchData';

const WATCH_ID_STORAGE_KEY = 'vitalia.watchId';
const PATIENT_NAME_STORAGE_KEY = 'vitalia.patientName.';

export function useWatchData() {
  const [isFocused, setIsFocused] = useState(false);
  const [watchId, setWatchId] = useState<string | null>(null);
  const [watchData, setWatchData] = useState<WatchData | null>(null);
  const [fallbackPatientName, setFallbackPatientName] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    setIsFocused(true);
    void AsyncStorage.getItem(WATCH_ID_STORAGE_KEY)
      .then(id => { if (active) setWatchId(id); })
      .catch(error => console.warn('No se pudo leer el reloj vinculado', error));

    return () => {
      active = false;
      setIsFocused(false);
    };
  }, []));

  useEffect(() => {
    if (!isFocused || !watchId) {
      setWatchData(null);
      return;
    }

    return onValue(ref(realtimeDatabase, `devices/${watchId}/latest`), snapshot => {
      setWatchData(snapshot.exists() ? snapshot.val() as WatchData : null);
    }, error => {
      console.warn('No se pudo sincronizar el reloj', error);
      setWatchData(null);
    });
  }, [isFocused, watchId]);

  useEffect(() => {
    if (!watchId) {
      setFallbackPatientName(null);
      return;
    }

    let active = true;
    void AsyncStorage.getItem(`${PATIENT_NAME_STORAGE_KEY}${watchId}`)
      .then(name => { if (active) setFallbackPatientName(name); })
      .catch(error => console.warn('No se pudo leer el nombre local del paciente', error));

    return () => { active = false; };
  }, [watchId]);

  const linkWatch = useCallback(async (id: string) => {
    await AsyncStorage.setItem(WATCH_ID_STORAGE_KEY, id);
    setWatchId(id);
    setWatchData(null);
  }, []);

  const unlinkWatch = useCallback(async () => {
    const storedKeys = await AsyncStorage.getAllKeys();
    const watchKeys = storedKeys.filter(key =>
      key === WATCH_ID_STORAGE_KEY || key.startsWith(PATIENT_NAME_STORAGE_KEY)
    );
    await AsyncStorage.multiRemove(watchKeys);
    setWatchId(null);
    setWatchData(null);
    setFallbackPatientName(null);
  }, []);

  const saveFallbackPatientName = useCallback(async (name: string) => {
    if (!watchId || !name.trim()) return;
    const normalizedName = name.trim();
    await AsyncStorage.setItem(`${PATIENT_NAME_STORAGE_KEY}${watchId}`, normalizedName);
    setFallbackPatientName(normalizedName);
  }, [watchId]);

  return {
    watchId,
    watchData,
    patientName: watchData?.adultoMayor?.trim() || fallbackPatientName,
    fallbackPatientName,
    linkWatch,
    unlinkWatch,
    saveFallbackPatientName,
  };
}