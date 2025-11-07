/* ==========================================================
   CRÓNICAS DEL SANTUARIO — CARGA DE CRÓNICAS DESDE FIRESTORE
   ========================================================== */

// 🔥 Importar Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/* ---------- CONFIGURACIÓN FIREBASE ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyD3NEbGcUwBxwoOGBPO8PukmPHcfl42bE8",
  authDomain: "cronicas-de-nimroel.firebaseapp.com",
  projectId: "cronicas-de-nimroel",
  storageBucket: "cronicas-de-nimroel.appspot.com",
  messagingSenderId: "689465837057",
  appId: "1:689465837057:web:aecddb8b4a247bfe0de200"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ==========================================================
   📜 CARGA DE CRÓNICAS DESDE LA RUTA CORRECTA
   ========================================================== */
async function cargarCronicas() {
  try {
    // ✅ Nueva ruta adaptada a la estructura actual
    const querySnapshot = await getDocs(collection(db, "Nimroel", "estructura", "cronicas"));
    console.log(`📚 Cargando ${querySnapshot.size} crónicas desde Firestore...`);

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const era = (data.era || "Desconocida").toLowerCase();
      let contenedor;

      if (era.includes("aurora")) contenedor = document.getElementById("era-aurora");
      else if (era.includes("despertar")) contenedor = document.getElementById("era-despertar");
      else if (era.includes("conocimiento")) contenedor = document.getElementById("era-conocimiento");
      else if (era.includes("poder")) contenedor = document.getElementById("era-poder");
      else return;

      // Crear tarjeta visual
      const card = document.createElement("div");
      card.className = "cr-card";
      card.innerHTML = `
        <h3>${data.titulo || "Sin título"}</h3>
        <p><strong>Custodio:</strong> ${data.custodio || "—"}</p>
        <p>${data.resumen || ""}</p>
      `;
      contenedor.appendChild(card);
    });

    if (querySnapshot.empty) {
      console.warn("⚠️ No hay crónicas registradas aún en Firestore.");
    }
  } catch (error) {
    console.error("❌ Error al cargar crónicas:", error);
  }
}

/* ==========================================================
   🚀 INICIALIZACIÓN GENERAL
   ========================================================== */
window.addEventListener("DOMContentLoaded", cargarCronicas);
