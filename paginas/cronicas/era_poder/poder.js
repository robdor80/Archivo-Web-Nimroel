import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { app } from "../firebase-config.js";

const db = getFirestore(app);

const contenedor = document.getElementById("contenedor-poder");
const modal = document.getElementById("modal-cronica");
const cerrarModal = document.getElementById("cerrarModal");

cerrarModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });

function abrirModal(data) {
  document.getElementById("modal-titulo").textContent = data.titulo || "Sin título";
  document.getElementById("modal-era").textContent = data.era || "Desconocida";
  document.getElementById("modal-custodio").textContent = data.custodio || "—";
  document.getElementById("modal-resumen").textContent = data.resumen || "";

  const sello = document.getElementById("modal-sello");
  const firma = document.getElementById("modal-firma");

  sello.src = data.sello || "";
  sello.style.display = data.sello ? "inline-block" : "none";

  firma.src = data.firma || "";
  firma.style.display = data.firma ? "inline-block" : "none";

  modal.classList.remove("hidden");
}

async function cargarCronicas() {
  const q = query(collection(db, "cronicas"), where("era", "==", "Era del Poder"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "cr-card";
    card.innerHTML = `
      <h3>${data.titulo || "Sin título"}</h3>
      <p><strong>Custodio:</strong> ${data.custodio || "—"}</p>
      <p>${data.resumen || ""}</p>
    `;
    card.addEventListener("click", () => abrirModal(data));
    contenedor.appendChild(card);
  });
}

cargarCronicas();
