/* ==========================================================
   📜 CRÓNICAS DEL SANTUARIO — CARGA DESDE FIRESTORE
   ========================================================== */

// 🧩 Importar conexión global a Firebase desde la raíz
import { db } from "/Archivo-Web-Nimroel/firebase-config.js";

// Importar solo las funciones necesarias de Firestore
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/* ==========================================================
   ⚙️ FUNCIÓN PRINCIPAL: CARGAR CRÓNICAS DESDE FIRESTORE
   ========================================================== */
async function cargarCronicas() {
  try {
    // 🔹 Nueva ruta unificada: colección "Nimroel/estructura/cronicas"
    const querySnapshot = await getDocs(collection(db, "Nimroel", "estructura", "cronicas"));

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const era = (data.era || "Desconocida").toLowerCase();
      let contenedor;

      // 🔍 Determina el contenedor según la era
      if (era.includes("aurora")) contenedor = document.getElementById("era-aurora");
      else if (era.includes("despertar")) contenedor = document.getElementById("era-despertar");
      else if (era.includes("conocimiento")) contenedor = document.getElementById("era-conocimiento");
      else if (era.includes("poder")) contenedor = document.getElementById("era-poder");
      else return; // si no encaja con ninguna era conocida, no mostrar

      // 🧱 Crear tarjeta visual de la crónica
      const card = document.createElement("div");
      card.className = "cr-card";
      card.innerHTML = `
        <h3>${data.titulo || "Sin título"}</h3>
        <p><strong>Custodio:</strong> ${data.custodio || "—"}</p>
        <p>${data.resumen || ""}</p>
      `;

      contenedor.appendChild(card);
    });

  } catch (error) {
    console.error("❌ Error al cargar crónicas:", error);
    const mensajeError = document.createElement("p");
    mensajeError.textContent = "⚠️ Error al cargar las crónicas.";
    mensajeError.style.color = "#0c3642";
    document.body.appendChild(mensajeError);
  }
}

/* ==========================================================
   🚀 INICIALIZACIÓN GENERAL
   ========================================================== */
window.addEventListener("DOMContentLoaded", cargarCronicas);
