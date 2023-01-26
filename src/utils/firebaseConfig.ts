import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBch5sIpBLIgp1keh4er7G6dXBG58Cj3vw",
  authDomain: "vidacast---novo.firebaseapp.com",
  projectId: "vidacast---novo",
  storageBucket: "vidacast---novo.appspot.com",
  messagingSenderId: "9161767055",
  appId: "1:9161767055:web:f6711daa4af5451ef058fa",
  measurementId: "G-DYQJ8HJ9QN",
};

export function initializeFirebaseApp() {
  if (getApps().length) return getApp();

  if (typeof window !== undefined) {
    console.log("Firebase App Initialized");
    return initializeApp(firebaseConfig);
  }
}
