import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyD1iyoS77wX6a_A6A9ukUNr5GSt9q50_sQ',
  authDomain: 'vitalia-app-aaf99.firebaseapp.com',
  databaseURL: 'https://vitalia-app-aaf99-default-rtdb.firebaseio.com',
  projectId: 'vitalia-app-aaf99',
  storageBucket: 'vitalia-app-aaf99.firebasestorage.app',
  messagingSenderId: '447349442277',
  appId: '1:447349442277:web:94141a4397c5fa3e81b60c',
  measurementId: 'G-NHVYLWF4Q8',
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const realtimeDatabase = getDatabase(firebaseApp);