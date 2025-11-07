// ==========================================================
// 🏛️ FORMULARIO DE CRÓNICAS — ARCHIVO DEL CUSTODIO
// Crea, edita y busca crónicas dentro de Firestore
// ==========================================================

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, getDoc, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// ==========================================================
// 🔥 CONFIGURACIÓN DE FIREBASE (usa siempre una sola instancia)
// ==========================================================
const firebaseConfig = {
  apiKey: "AIzaSyD3NEbGcUwBxwoOGBPO8PukmPHcfl42bE8",
  authDomain: "cronicas-de-nimroel.firebaseapp.com",
  projectId: "cronicas-de-nimroel",
  storageBucket: "cronicas-de-nimroel.appspot.com",
  messagingSenderId: "689465837057",
  appId: "1:689465837057:web:aecddb8b4a247bfe0de200"
};

// Evita inicializaciones duplicadas
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ==========================================================
// 🔐 VERIFICAR SESIÓN ACTIVA
// ==========================================================
const form = document.getElementById("formCronica");
const mensaje = document.getElementById("mensaje");
const btnSalir = document.getElementById("btnSalir");

onAuthStateChanged(auth, (user) => {
  if (user && user.email === "rob.dor.80@gmail.com") {
    console.log("✅ Sesión activa:", user.email);
    mensaje.textContent = `🔓 Sesión activa como ${user.email}`;
  } else {
    console.warn("🚫 No hay sesión activa. Redirigiendo...");
    mensaje.textContent = "🚫 No hay sesión activa. Inicia sesión en el Santuario.";
    setTimeout(() => (window.location.href = "../../index.html"), 2000);
  }
});

// ==========================================================
// 🖼️ REFERENCIAS DE CAMPOS E IMÁGENES
// ==========================================================
const campos = {
  imagen: document.getElementById("imagen"),
  sello: document.getElementById("sello"),
  firma: document.getElementById("firma"),
};
const vistas = {
  imagen: document.getElementById("preview-imagen"),
  sello: document.getElementById("preview-sello"),
  firma: document.getElementById("preview-firma"),
};
const botonesAbrir = {
  imagen: document.getElementById("abrir-imagen"),
  sello: document.getElementById("abrir-sello"),
  firma: document.getElementById("abrir-firma"),
};

// ==========================================================
// 🖼️ FUNCIÓN DE VISTA PREVIA DE IMÁGENES O FIRMAS HTML
// ==========================================================
function actualizarVistaPrevia(tipo) {
  const url = campos[tipo].value.trim();
  const vista = vistas[tipo];
  const boton = botonesAbrir[tipo];

  if (!url) {
    vista.innerHTML = "?";
    boton.disabled = true;
    return;
  }

  // 💡 Si la URL es una página HTML, la mostramos en un iframe animado
  if (url.endsWith(".html")) {
    vista.innerHTML = `
      <iframe src="${url}" 
              style="width:100%;height:160px;border:none;border-radius:8px;"
              sandbox="allow-scripts allow-same-origin"></iframe>`;
    boton.disabled = false;
    boton.onclick = () => window.open(url, "_blank");
    return;
  }

  // 🖼️ Si es una imagen normal, mostramos la vista previa como siempre
  vista.innerHTML = `<img src="${url}" alt="vista previa" style="max-width:100%;max-height:100%;border-radius:8px;">`;
  boton.disabled = false;
  boton.onclick = () => window.open(url, "_blank");
}

// ==========================================================
// 🔢 GENERAR SIGUIENTE ID AUTOMÁTICO
// ==========================================================
async function generarSiguienteID(eraSeleccionada) {
  const coleccion = collection(db, "Nimroel", "estructura", "cronicas");
  const eraKey = eraSeleccionada.toLowerCase().replace("era de la ", "").trim();
  const prefijo = `${eraKey}_`;

  try {
    const snap = await getDocs(coleccion);
    let maxNumero = 0;

    snap.forEach((docSnap) => {
      const id = docSnap.id;
      if (id.startsWith(prefijo)) {
        const partes = id.split("_");
        const numero = parseInt(partes[1], 10);
        if (!isNaN(numero) && numero > maxNumero) {
          maxNumero = numero;
        }
      }
    });

    const siguiente = (maxNumero + 1).toString().padStart(3, "0");
    const nuevoID = `${prefijo}${siguiente}`;
    document.getElementById("documento").value = nuevoID;
  } catch (error) {
    console.error("❌ Error al generar siguiente ID:", error);
  }
}

document.getElementById("era").addEventListener("change", (e) => {
  generarSiguienteID(e.target.value);
});
window.addEventListener("DOMContentLoaded", () => {
  generarSiguienteID(document.getElementById("era").value);
});

// ==========================================================
// 💾 GUARDAR CRÓNICA EN FIRESTORE
// ==========================================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const documento = document.getElementById("documento").value.trim().toLowerCase();
  if (!documento) {
    mensaje.textContent = "⚠️ Debes indicar un nombre de documento (por ejemplo: aurora_005).";
    return;
  }

  const datos = {
    titulo: document.getElementById("titulo").value.trim(),
    era: document.getElementById("era").value.trim(),
    año: document.getElementById("anio").value.trim(),
    fecha: document.getElementById("fecha").value.trim(),
    custodio: document.getElementById("custodio").value.trim(),
    traduccion: document.getElementById("traduccion").value.trim(),
    item: document.getElementById("item").value.trim(),
    item2: document.getElementById("item2").value.trim(),
    imagen: campos.imagen.value.trim(),
    resumen: document.getElementById("resumen").value.trim(),
    sello: campos.sello.value.trim(),
    firma: campos.firma.value.trim(),
  };

  console.log(`📦 Intentando guardar en: Nimroel/estructura/cronicas/${documento}`, datos);

  try {
    await setDoc(doc(db, "Nimroel", "estructura", "cronicas", documento), datos);
    mensaje.textContent = `✅ Crónica '${documento}' guardada correctamente.`;
    form.reset();
    ["imagen", "sello", "firma"].forEach(actualizarVistaPrevia);
    generarSiguienteID(document.getElementById("era").value);
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    mensaje.textContent = "❌ Error al guardar la crónica. Revisa consola.";
  }
});

// ==========================================================
// 📜 CARGAR CRÓNICA EXISTENTE
// ==========================================================
async function cargarCronica(id) {
  try {
    const ref = doc(db, "Nimroel", "estructura", "cronicas", id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      Object.keys(data).forEach((campo) => {
        if (document.getElementById(campo)) {
          document.getElementById(campo).value = data[campo] || "";
        }
      });

      ["imagen", "sello", "firma"].forEach(actualizarVistaPrevia);
      mensaje.textContent = `✅ Crónica '${id}' cargada correctamente.`;
    } else {
      mensaje.textContent = "⚠️ No se encontró la crónica.";
    }
  } catch (error) {
    console.error("❌ Error al cargar crónica:", error);
  }
}

// ==========================================================
// 🔍 BUSCADOR DE CRÓNICAS
// ==========================================================
function normalizarTexto(texto) {
  return texto ? texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
}

async function buscarCronicas() {
  const input = document.getElementById("buscar");
  const contenedor = document.getElementById("resultados-busqueda");
  const texto = normalizarTexto(input.value.trim());
  contenedor.innerHTML = "";
  if (texto.length < 2) return;

  try {
    const snap = await getDocs(collection(db, "Nimroel", "estructura", "cronicas"));
    const resultados = [];

    snap.forEach((docSnap) => {
      const id = docSnap.id || "";
      const data = docSnap.data() || {};
      const camposIndexados = [
        id, data.titulo, data.era, data.año, data.fecha,
        data.custodio, data.traduccion, data.item, data.item2, data.resumen
      ];

      if (camposIndexados.some((c) => normalizarTexto(String(c || "")).includes(texto))) {
        resultados.push({ id, titulo: data.titulo || "(Sin título)", era: data.era || "" });
      }
    });

    const unicos = new Map();
    resultados.forEach((r) => unicos.set(r.id, r));

    if (unicos.size === 0) {
      contenedor.innerHTML = `<p style="color:#0c3642; text-align:center;">Sin resultados.</p>`;
      return;
    }

    unicos.forEach((r) => {
      const div = document.createElement("div");
      div.className = "resultado-item";
      div.textContent = `${r.id} — ${r.titulo}`;
      div.title = r.era;
      div.onclick = () => {
        document.getElementById("documento").value = r.id;
        cargarCronica(r.id);
        contenedor.innerHTML = "";
        input.value = "";
      };
      contenedor.appendChild(div);
    });
  } catch (error) {
    console.error("❌ Error al buscar crónicas:", error);
    contenedor.innerHTML = `<p style="color:#0c3642; text-align:center;">Error al buscar.</p>`;
  }
}

document.getElementById("buscar").addEventListener("input", buscarCronicas);
