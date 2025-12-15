// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Use client-side env vars (NEXT_PUBLIC_*) — required for browser SDK
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

const isClient = typeof window !== "undefined";

if (isClient) {
  // helpful debug when env vars are not provided
  if (!firebaseConfig.apiKey) {
    // eslint-disable-next-line no-console
    console.error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY. Add your Firebase client config to .env.local and restart dev server."
    );
  }
}

let app: ReturnType<typeof initializeApp> | undefined;

if (isClient) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

// Expose auth/db only on client. On server they will be null to avoid server-side initialization.
export const auth = isClient && app ? getAuth(app) : (null as unknown);
export const db = isClient && app ? getFirestore(app) : (null as unknown);