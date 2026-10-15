import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyATRVNgCRy2kHe5Ra49Aj2SXq84LmHfsaM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mith-1e752.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mith-1e752",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mith-1e752.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "384187289131",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:384187289131:web:525f8accad072a61f3246e"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let isConfigured = true;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (err) {
  console.warn('Firebase initialization error, running in demo/offline mode:', err);
  isConfigured = false;
}

export { app, auth, db, storage, isConfigured };
