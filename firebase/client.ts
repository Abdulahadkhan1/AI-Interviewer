// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzr8W7EJns1x0-j9n_o3nj3LTSgaCHbUU",
  authDomain: "prep-wise-395e2.firebaseapp.com",
  projectId: "prep-wise-395e2",
  storageBucket: "prep-wise-395e2.firebasestorage.app",
  messagingSenderId: "539630888920",
  appId: "1:539630888920:web:84adc7e883fb6319b4b4ad",
  measurementId: "G-HS54TLMTLW"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig): getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);