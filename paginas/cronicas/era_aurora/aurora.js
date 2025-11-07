// ==========================================================
// CRÓNICAS — ERA DE LA AURORA
// Carga dinámica de registros desde Firestore
// ==========================================================

import { db } from "../../firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Elementos del DOM
const contenedor = document.getElementById("contenedor-aurora");
const modal = document.getElementById("modal-cronica");
const cerrarModal = document.getElementById("cerrarModal");

// ==========================================================
// 🔒 CERRAR MODAL
// ==========================================================
if (cerrarModal && modal) {
  cerrarModal.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}

// ==========================================================
// 🔍 MOSTRAR DATOS EN MODAL
// ==========================================================
function abrirModal(data) {
  document.getElementById("modal-titulo").textContent = data.titulo || "Sin título";
  document.getElementById("modal-era").textContent = data.era || "Desconocida";
  document.getElementById("modal-custodio").textContent = data.custodio || "—";
  document.getElementById("modal-resumen").textContent = data.resumen || "";

  const modalImagen = document.getElementById("modal-imagen");
  const sello = document.getElementById("modal-sello");
  const firma = document.getElementById("modal-firma");

  // Imagen principal
  if (data.imagen) {
    modalImagen.src = data.imagen;
  } else {
    modalImagen.src = "medios/img/placeholders/sin_imagen.webp";
  }
  modalImagen.style.display = "block";

  // Sello
  if (data.sello) {
    sello.src = data.sello;
    sello.style.display = "inline-block";
  } else {
    sello.style.display = "none";
  }

  // Firma
  if (data.firma) {
    firma.src = data.firma;
    firma.style.display = "inline-block";
  } else {
    firma.style.display = "none";
  }

  modal.classList.remove("hidden");
}

// ==========================================================
// 📜 CARGAR CRÓNICAS FILTRADAS POR ERA (RUTA ACTUALIZADA)
// ==========================================================
async function cargarCronicasAurora() {
  try {
    // ✅ Nueva ruta de colección según estructura: Nimroel / estructura / cronicas
    const cronicasRef = collection(db, "Nimroel", "estructura", "cronicas");
    const q = query(cronicasRef, where("era", "==", "Era de la Aurora"));
    const snapshot = await getDocs(q);

    contenedor.innerHTML = ""; // Limpia antes de renderizar

    if (snapshot.empty) {
      contenedor.innerHTML = `<p style="text-align:center;color:#a8bde2;">No hay crónicas registradas para esta era.</p>`;
      return;
    }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();

      const card = document.createElement("div");
      card.className = "cr-card";

      // Imagen o marcador
      const imagenSrc = data.imagen
        ? data.imagen
        : "medios/img/placeholders/sin_imagen.webp";

      card.innerHTML = `
        <div class="imagen-cronica">
          <img src="${imagenSrc}" alt="${data.titulo || "Sin título"}">
        </div>
        <h3>${data.titulo || "Sin título"}</h3>
        <p><strong>Custodio:</strong> ${data.custodio || "—"}</p>
        <p>${data.resumen || ""}</p>
      `;

      card.addEventListener("click", () => abrirModal(data));
      contenedor.appendChild(card);
    });

    console.log(`✅ Cargadas ${snapshot.size} crónicas de la Era de la Aurora.`);

  } catch (error) {
    console.error("❌ Error al cargar las crónicas:", error);
    contenedor.innerHTML = `<p style="text-align:center;color:#f99;">Error al cargar las crónicas.</p>`;
  }
}

// ==========================================================
// 🚀 EJECUTAR CARGA
// ==========================================================
window.addEventListener("DOMContentLoaded", cargarCronicasAurora);
