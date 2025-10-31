// ==========================================================
// 🔥 CONFIGURACIÓN GENERAL DE FIREBASE — Archivo del Santuario
// Incluye Firestore + Autenticación con Google
// ==========================================================

// Importar módulos principales de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// ==========================================================
// ⚙️ Configuración de tu proyecto (mantén tus claves actuales)
// ==========================================================
const firebaseConfig = {
  apiKey: "AIzaSy...", // tus claves reales
  authDomain: "cronicas-de-nimroel.firebaseapp.com",
  projectId: "cronicas-de-nimroel",
  storageBucket: "cronicas-de-nimroel.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234"
};

// ==========================================================
// 🚀 Inicializar Firebase
// ==========================================================
const app = initializeApp(firebaseConfig);

// Base de datos (por si la usas después)
const db = getFirestore(app);

// ==========================================================
// 🔐 Autenticación (login con Google)
// ==========================================================
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Exportar todo lo necesario para otros scripts
export { app, db, auth, provider, signInWithPopup, signOut, onAuthStateChanged };
