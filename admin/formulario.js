import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, getDoc, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// ===============================
// 🔥 CONFIGURACIÓN DE FIREBASE
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyD3NEbGcUwBxwoOGBPO8PukmPHcfl42bE8",
  authDomain: "cronicas-de-nimroel.firebaseapp.com",
  projectId: "cronicas-de-nimroel",
  storageBucket: "cronicas-de-nimroel.appspot.com",
  messagingSenderId: "689465837057",
  appId: "1:689465837057:web:aecddb8b4a247bfe0de200"
};

// ===============================
// ⚙️ INICIALIZACIÓN
// ===============================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById("formCronica");
const mensaje = document.getElementById("mensaje");
const btnSalir = document.getElementById("btnSalir");

// ===============================
// 🖼️ REFERENCIAS
// ===============================
const campos = {
  imagen: document.getElementById("imagen"),
  sello: document.getElementById("sello"),
  firma: document.getElementById("firma")
};
const vistas = {
  imagen: document.getElementById("preview-imagen"),
  sello: document.getElementById("preview-sello"),
  firma: document.getElementById("preview-firma")
};
const botonesAbrir = {
  imagen: document.getElementById("abrir-imagen"),
  sello: document.getElementById("abrir-sello"),
  firma: document.getElementById("abrir-firma")
};

// ===============================
// 🔐 VERIFICAR SESIÓN
// ===============================
onAuthStateChanged(auth, (user) => {
  if (user && user.email === "rob.dor.80@gmail.com") {
    console.log("✅ Sesión activa:", user.email);
    mensaje.textContent = `🔓 Sesión activa como ${user.email}`;
  } else {
    console.warn("🚫 No hay sesión activa. Redirigiendo...");
    mensaje.textContent = "🚫 No hay sesión activa. Inicia sesión en el Santuario.";
    setTimeout(() => {
      window.location.href = "../../index.html";
    }, 2000);
  }
});

// ===============================
// 🔢 GENERAR SIGUIENTE ID AUTOMÁTICO
// ===============================
async function generarSiguienteID(eraSeleccionada) {
  const coleccion = collection(db, "Nimroel", "estructura", "cronicas"); // ✅ RUTA CORREGIDA
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
  const eraInicial = document.getElementById("era").value;
  generarSiguienteID(eraInicial);
});

// ===============================
// 💾 GUARDAR DOCUMENTO
// ===============================
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
    firma: campos.firma.value.trim()
  };

  console.log(`📦 Intentando guardar en: Nimroel/estructura/cronicas/${documento}`, datos);

  try {
    await setDoc(doc(db, "Nimroel", "estructura", "cronicas", documento), datos); // ✅ RUTA CORREGIDA
    mensaje.textContent = `✅ Crónica '${documento}' guardada correctamente.`;
    form.reset();
    actualizarVistaPrevia("imagen");
    actualizarVistaPrevia("sello");
    actualizarVistaPrevia("firma");
    generarSiguienteID(document.getElementById("era").value);
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    mensaje.textContent = "❌ Error al guardar la crónica. Revisa consola.";
  }
});

// ===============================
// 📜 CARGAR CRÓNICA EXISTENTE
// ===============================
async function cargarCronica(id) {
  try {
    const ref = doc(db, "Nimroel", "estructura", "cronicas", id); // ✅ RUTA CORREGIDA
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();

      document.getElementById("documento").value = id;
      document.getElementById("titulo").value = data.titulo || "";
      document.getElementById("era").value = data.era || "";
      document.getElementById("anio").value = data.año || "";
      document.getElementById("fecha").value = data.fecha || "";
      document.getElementById("custodio").value = data.custodio || "";
      document.getElementById("traduccion").value = data.traduccion || "";
      document.getElementById("item").value = data.item || "";
      document.getElementById("item2").value = data.item2 || "";
      document.getElementById("imagen").value = data.imagen || "";
      document.getElementById("resumen").value = data.resumen || "";
      document.getElementById("sello").value = data.sello || "";
      document.getElementById("firma").value = data.firma || "";

      actualizarVistaPrevia("imagen");
      actualizarVistaPrevia("sello");
      actualizarVistaPrevia("firma");

      mensaje.textContent = `✅ Crónica '${id}' cargada correctamente.`;
    } else {
      mensaje.textContent = "⚠️ No se encontró la crónica.";
    }
  } catch (error) {
    console.error("❌ Error al cargar crónica:", error);
  }
}

// ===============================
// 🔎 BUSCADOR DE CRÓNICAS
// ===============================
function normalizarTexto(texto) {
  return texto
    ? texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    : "";
}

async function buscarCronicas() {
  const input = document.getElementById("buscar");
  const contenedor = document.getElementById("resultados-busqueda");
  const texto = normalizarTexto(input.value.trim());

  contenedor.innerHTML = "";
  if (texto.length < 2) return;

  try {
    const snap = await getDocs(collection(db, "Nimroel", "estructura", "cronicas")); // ✅ RUTA CORREGIDA
    const resultados = [];

    snap.forEach((docSnap) => {
      const id = docSnap.id || "";
      const data = docSnap.data() || {};

      const camposIndexados = [
        id,
        data.titulo,
        data.era,
        data.año,
        data.fecha,
        data.custodio,
        data.traduccion,
        data.item,
        data.item2,
        data.resumen
      ];

      const coincide = camposIndexados.some(c =>
        normalizarTexto(String(c || "")).includes(texto)
      );

      if (coincide) {
        resultados.push({
          id,
          titulo: data.titulo || "(Sin título)",
          era: data.era || ""
        });
      }
    });

    const unicos = new Map();
    resultados.forEach(r => unicos.set(r.id, r));

    if (unicos.size === 0) {
      contenedor.innerHTML = `<p style="color:#0c3642; text-align:center;">Sin resultados.</p>`;
      return;
    }

    unicos.forEach(r => {
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
