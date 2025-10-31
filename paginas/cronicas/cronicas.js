/* ==========================================================
   CRÓNICAS DEL SANTUARIO — CARGA DE CRÓNICAS DESDE FIRESTORE
   ========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/* ---------- CONFIGURACIÓN FIREBASE ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyD3NEbGcUwBxwoOGBP0P8PukmPHcf142bE8",
  authDomain: "cronicas-de-nimroel.firebaseapp.com",
  projectId: "cronicas-de-nimroel",
  storageBucket: "cronicas-de-nimroel.appspot.com",
  messagingSenderId: "689465837057",
  appId: "1:689465837057:web:aecddb8b4a247bfe0de200"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ==========================================================
   CARGA DE CRÓNICAS DESDE FIRESTORE
   ========================================================== */
async function cargarCronicas() {
  const querySnapshot = await getDocs(collection(db, "cronicas"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const era = (data.era || "Desconocida").toLowerCase();
    let contenedor;

    if (era.includes("aurora")) contenedor = document.getElementById("era-aurora");
    else if (era.includes("despertar")) contenedor = document.getElementById("era-despertar");
    else if (era.includes("conocimiento")) contenedor = document.getElementById("era-conocimiento");
    else if (era.includes("poder")) contenedor = document.getElementById("era-poder");
    else return;

    const card = document.createElement("div");
    card.className = "cr-card";
    card.innerHTML = `
      <h3>${data.titulo || "Sin título"}</h3>
      <p><strong>Custodio:</strong> ${data.custodio || "—"}</p>
      <p>${data.resumen || ""}</p>
    `;
    contenedor.appendChild(card);
  });
}

/* ==========================================================
   INICIALIZACIÓN GENERAL
   ========================================================== */
window.addEventListener("DOMContentLoaded", cargarCronicas);
