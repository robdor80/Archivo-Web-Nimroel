// ==========================================================
// 🔥 CONFIGURACIÓN GENERAL DE FIREBASE — Archivo del Santuario
// Incluye Firestore + Autenticación con Google
// ==========================================================

// 🧩 Importar módulos principales de Firebase
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
// ⚙️ CONFIGURACIÓN DE TU PROYECTO FIREBASE
// ==========================================================
// (⚠️ Ya contiene tus claves válidas y operativas)
const firebaseConfig = {
  apiKey: "AIzaSyD3NEbGcUwBxwoOGBPO8PukmPHcfl42bE8",
  authDomain: "cronicas-de-nimroel.firebaseapp.com",
  projectId: "cronicas-de-nimroel",
  storageBucket: "cronicas-de-nimroel.appspot.com",
  messagingSenderId: "689465837057",
  appId: "1:689465837057:web:aecddb8b4a247bfe0de200"
};

// ==========================================================
// 🚀 INICIALIZAR FIREBASE
// ==========================================================
const app = initializeApp(firebaseConfig);

// Base de datos principal (Firestore)
const db = getFirestore(app);

// ==========================================================
// 🔐 AUTENTICACIÓN CON GOOGLE
// ==========================================================
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ==========================================================
// 🧭 EXPORTAR MÓDULOS
// ==========================================================
// De este modo otros archivos pueden importar:
// import { db, auth, provider, signInWithPopup, signOut, onAuthStateChanged } from "/Archivo-Web-Nimroel/firebase-config.js";
export {
  app,
  db,
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
};
