import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// ===============================
// 🔥 CONFIGURACIÓN DE FIREBASE
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyD3NEbGcUwBxwoOGBPO8PukmPHcfl42bE8",
  authDomain: "cronicas-de-nimroel.firebaseapp.com",
  projectId: "cronicas-de-nimroel",
  storageBucket: "cronicas-de-nimroel.appspot.com", // ✅ corregido (.app → .appspot.com)
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
  if (!user || user.email !== "rob.dor.80@gmail.com") {
    console.warn("⚠️ Usuario no autorizado o sesión no iniciada.");
    window.location.href = "../../index.html";
  } else {
    console.log("✅ Usuario autenticado:", user.email);
  }
});

// ===============================
// 💾 GUARDAR CRÓNICA / DOCUMENTO
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const coleccion = document.getElementById("coleccion")?.value.trim().toLowerCase() || "cronicas";
  const documento = document.getElementById("documento").value.trim().toLowerCase();

  if (!coleccion || !documento) {
    mensaje.textContent = "⚠️ Debes indicar colección y documento.";
    return;
  }

  const datos = {
    titulo: document.getElementById("titulo").value.trim(),
    era: document.getElementById("era").value.trim(),
    año: document.getElementById("anio").value.trim(),
    fecha: document.getElementById("fecha").value.trim(),
    custodio: document.getElementById("custodio").value.trim(),
    traduccion: document.getElementById("traduccion").value.trim(),
    imagen: campos.imagen.value.trim(),
    resumen: document.getElementById("resumen").value.trim(),
    sello: campos.sello.value.trim(),
    firma: campos.firma.value.trim()
  };

  console.log(`📦 Intentando guardar en: ${coleccion}/${documento}`, datos);

  try {
    await setDoc(doc(db, coleccion, documento), datos);
    mensaje.textContent = `✅ Documento '${documento}' guardado correctamente en '${coleccion}'.`;
    console.log("✅ Guardado correctamente en Firestore.");

    form.reset();
    actualizarVistaPrevia("imagen");
    actualizarVistaPrevia("sello");
    actualizarVistaPrevia("firma");
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    mensaje.textContent = "❌ Error al guardar la crónica.";
  }
});

// ===============================
// 🚪 SALIR (Cerrar sesión)
// ===============================
btnSalir.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "../../index.html";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});

// ===============================
// 🌧️ LLUVIA DE RUNAS
// ===============================
const RUNAS = ["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛜ","ᛞ","ᛟ"];
function generarLluviaRunas() {
  const capa = document.getElementById("runas");
  capa.innerHTML = "";
  const cantidad = window.innerWidth < 768 ? 40 : 80;
  for (let i = 0; i < cantidad; i++) {
    const rune = document.createElement("div");
    rune.className = "runa";
    rune.textContent = RUNAS[Math.floor(Math.random() * RUNAS.length)];
    rune.style.left = Math.random() * 100 + "vw";
    rune.style.top = "-" + (Math.random() * 20 + 5) + "vh";
    rune.style.animationDuration = 4 + Math.random() * 6 + "s";
    rune.style.animationDelay = "-" + Math.random() * 10 + "s";
    capa.appendChild(rune);
  }
}
window.addEventListener("DOMContentLoaded", generarLluviaRunas);

// ===============================
// 🖼️ VISTA PREVIA
// ===============================
window.actualizarVistaPrevia = function (tipo) {
  const url = campos[tipo].value.trim();
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    vistas[tipo].src = url;
    botonesAbrir[tipo].disabled = false;
    botonesAbrir[tipo].onclick = () => window.open(url, "_blank");
  } else {
    vistas[tipo].src = "../../medios/img/runas/runa1.webp";
    botonesAbrir[tipo].disabled = true;
  }
};
