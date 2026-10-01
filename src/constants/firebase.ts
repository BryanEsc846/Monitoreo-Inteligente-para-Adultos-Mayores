import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  databaseURL: 'https://TU-PROYECTO-default-rtdb.firebaseio.com',
  projectId: 'TU_PROYECTO',
  appId: 'TU_APP_ID',
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const realtimeDatabase = getDatabase(firebaseApp);