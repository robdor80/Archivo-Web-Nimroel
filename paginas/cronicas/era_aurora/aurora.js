// ==========================================================
// CRÓNICAS — ERA DE LA AURORA
// Carga dinámica de registros desde Firestore
// ==========================================================

import { db } from "../firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Elementos del DOM
const contenedor = document.getElementById("contenedor-aurora");
const modal = document.getElementById("modal-cronica");
const cerrarModal = document.getElementById("cerrarModal");

// Cerrar modal
if (cerrarModal && modal) {
  cerrarModal.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}

// Mostrar datos en modal
function abrirModal(data) {
  document.getElementById("modal-titulo").textContent = data.titulo || "Sin título";
  document.getElementById("modal-era").textContent = data.era || "Desconocida";
  document.getElementById("modal-custodio").textContent = data.custodio || "—";
  document.getElementById("modal-resumen").textContent = data.resumen || "";

  const modalImagen = document.getElementById("modal-imagen");
  const sello = document.getElementById("modal-sello");
  const firma = document.getElementById("modal-firma");

  // Imagen principal en modal
  if (data.imagen) {
    modalImagen.src = data.imagen;
    modalImagen.style.display = "block";
  } else {
    modalImagen.src = "medios/img/placeholders/sin_imagen.webp";
    modalImagen.style.display = "block";
  }

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

// Cargar crónicas filtradas por Era
async function cargarCronicasAurora() {
  try {
    const q = query(collection(db, "cronicas"), where("era", "==", "Era de la Aurora"));
    const snapshot = await getDocs(q);

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

  } catch (error) {
    console.error("❌ Error al cargar las crónicas:", error);
  }
}

// Ejecutar carga
cargarCronicasAurora();
