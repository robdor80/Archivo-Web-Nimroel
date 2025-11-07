// ==========================================================
// 🔥 CONFIGURACIÓN GENERAL DE FIREBASE — Archivo del Santuario
// Evita inicializar más de una vez
// ==========================================================

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// ==========================================================
// ⚙️ Configuración del proyecto Firebase
// ==========================================================
const firebaseConfig = {
  apiKey: "AIzaSyD3NEbGcUwBxwoOGBPO8PukmPHcfl42bE8",
  authDomain: "cronicas-de-nimroel.firebaseapp.com",
  projectId: "cronicas-de-nimroel",
  storageBucket: "cronicas-de-nimroel.appspot.com",
  messagingSenderId: "689465837057",
  appId: "1:689465837057:web:aecddb8b4a247bfe0de200"
};

// ==========================================================
// 🚀 Inicializar o reutilizar la app existente
// ==========================================================
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Base de datos
const db = getFirestore(app);

// Autenticación
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Exportar módulos
export { app, db, auth, provider, signInWithPopup, signOut, onAuthStateChanged };
