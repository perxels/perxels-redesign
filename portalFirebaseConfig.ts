// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const portalFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_PORTAL_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_PORTAL_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PORTAL_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_PORTAL_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_PORTAL_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_PORTAL_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_PORTAL_MEASUREMENT_ID
};

// Initialize Firebase with a named app for the portal
let portalApp;
try {
  portalApp = getApp('portal');
} catch {
  portalApp = initializeApp(portalFirebaseConfig, 'portal');
}

let analytics;

if (typeof window !== "undefined") {
  analytics = getAnalytics(portalApp);
}

const portalAuth = getAuth(portalApp);
const portalDb = getFirestore(portalApp);
const portalStorage = getStorage(portalApp);

export { portalAuth, portalDb, portalStorage, signInWithEmailAndPassword };