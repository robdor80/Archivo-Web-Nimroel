import { db } from "/Archivo-Web-Nimroel/firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

async function probarConexion() {
  const contenedor = document.getElementById("contenedor-aurora");
  contenedor.innerHTML = "<p style='color:#a8bde2;text-align:center'>🔍 Probando conexión con Firestore...</p>";

  try {
    // Probar la ruta Nimroel / estructura / cronicas
    const ref = collection(db, "Nimroel", "estructura", "cronicas");
    const snapshot = await getDocs(ref);

    console.log("📘 Total documentos encontrados:", snapshot.size);

    if (snapshot.empty) {
      contenedor.innerHTML = "<p style='color:#a8bde2;text-align:center'>⚠️ No se encontraron crónicas en esta ruta.</p>";
      return;
    }

    // Mostrar los IDs encontrados en consola
    snapshot.forEach(doc => {
      console.log("🗂️ Documento:", doc.id, doc.data());
    });

    // Mostrar un resumen visible en la web
    let html = "<h3 style='text-align:center;color:#a8bde2'>✅ Conexión OK</h3><ul style='color:#a8bde2'>";
    snapshot.forEach(doc => {
      const d = doc.data();
      html += `<li>${doc.id} — ${d.titulo || "(sin título)"} — ${d.era}</li>`;
    });
    html += "</ul>";
    contenedor.innerHTML = html;

  } catch (err) {
    console.error("❌ Error al conectar con Firestore:", err);
    contenedor.innerHTML = `<p style='color:#f99;text-align:center'>❌ Error: ${err.message}</p>`;
  }
}

window.addEventListener("DOMContentLoaded", probarConexion);
