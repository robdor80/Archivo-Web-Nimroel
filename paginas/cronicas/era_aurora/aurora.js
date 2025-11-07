// ==========================================================
// CRÓNICAS — ERA DE LA AURORA
// Carga dinámica de registros desde Firestore (versión mejorada)
// ==========================================================

// 🔥 Importar base de datos desde la raíz del repositorio
import { db } from "/Archivo-Web-Nimroel/firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
// 🪶 MOSTRAR DATOS EN MODAL (IMAGEN, SELLO, FIRMA)
// ==========================================================
function abrirModal(data) {
  document.getElementById("modal-titulo").textContent = data.titulo || "Sin título";
  document.getElementById("modal-era").textContent = data.era || "Desconocida";
  document.getElementById("modal-custodio").textContent = data.custodio || "—";
  document.getElementById("modal-resumen").textContent = data.resumen || "";

  const modalImagen = document.getElementById("modal-imagen");
  const sello = document.getElementById("modal-sello");
  const firma = document.getElementById("modal-firma");

  // === Imagen principal ===
  modalImagen.src = data.imagen || "medios/img/placeholders/sin_imagen.webp";
  modalImagen.style.display = "block";

  // === Sello del custodio ===
  if (data.sello) {
    if (data.sello.endsWith(".html")) {
      sello.outerHTML = `
        <iframe id="modal-sello" src="${data.sello}"
                style="width:120px;height:120px;border:none;border-radius:8px;"
                sandbox="allow-scripts allow-same-origin"></iframe>`;
    } else {
      sello.src = data.sello;
      sello.style.display = "inline-block";
    }
  } else {
    sello.style.display = "none";
  }

  // === Firma del custodio ===
  if (data.firma) {
    if (data.firma.endsWith(".html")) {
      firma.outerHTML = `
        <iframe id="modal-firma" src="${data.firma}"
                style="width:160px;height:100px;border:none;border-radius:8px;"
                sandbox="allow-scripts allow-same-origin"></iframe>`;
    } else {
      firma.src = data.firma;
      firma.style.display = "inline-block";
    }
  } else {
    firma.style.display = "none";
  }

  modal.classList.remove("hidden");
}

// ==========================================================
// 🌅 CARGAR CRÓNICAS DE LA ERA DE LA AURORA
// ==========================================================
async function cargarCronicasAurora() {
  try {
    const cronicasRef = collection(db, "Nimroel", "estructura", "cronicas");
    const snapshot = await getDocs(cronicasRef);

    console.log(`📚 Total de crónicas detectadas: ${snapshot.size}`);

    contenedor.innerHTML = "";
    let contador = 0;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const era = (data.era || "").toLowerCase().trim();

      if (era.includes("aurora")) {
        contador++;
        const card = document.createElement("div");
        card.className = "cr-card";

        const imagenSrc = data.imagen || "medios/img/placeholders/sin_imagen.webp";

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
      }
    });

    if (contador === 0) {
      contenedor.innerHTML = `<p style="text-align:center;color:#a8bde2;">No hay crónicas registradas para esta era.</p>`;
    } else {
      console.log(`✅ Mostrando ${contador} crónicas de la Era de la Aurora.`);
    }

  } catch (error) {
    console.error("❌ Error al cargar las crónicas:", error);
    contenedor.innerHTML = `<p style="text-align:center;color:#f99;">Error al cargar las crónicas.</p>`;
  }
}

// ==========================================================
// 🚀 INICIALIZACIÓN
// ==========================================================
window.addEventListener("DOMContentLoaded", cargarCronicasAurora);
