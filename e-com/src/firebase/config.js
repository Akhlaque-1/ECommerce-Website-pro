import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// =========================
// Firebase Config
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyAoV0lLpnRvhp2_91_br5pQetQv502JlR8",
  authDomain: "ecommerce-app-866ee.firebaseapp.com",
  projectId: "ecommerce-app-866ee",
  storageBucket: "ecommerce-app-866ee.appspot.com",
  messagingSenderId: "581275651211",
  appId: "1:581275651211:web:370278e1840c1ba872d88e",
};

// =========================
// Safe Initialization
// =========================
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// =========================
// Firebase Services
// =========================
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;