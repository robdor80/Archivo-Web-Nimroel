// ==========================================================
// CONFIGURACIÓN GLOBAL DE FIREBASE — CRÓNICAS DE NIMROEL
// ==========================================================

// Importar módulos de Firebase (desde CDN)
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración del proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD3NEbGcUwBxwoOGBP0P8PukmPHcf142bE8",
  authDomain: "cronicas-de-nimroel.firebaseapp.com",
  projectId: "cronicas-de-nimroel",
  storageBucket: "cronicas-de-nimroel.appspot.com",
  messagingSenderId: "689465837057",
  appId: "1:689465837057:web:aecddb8b4a247bfe0de200"
};

// ✅ Evita inicializar Firebase más de una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exportar Firestore ya inicializado para usar en todas las páginas
export const db = getFirestore(app);
