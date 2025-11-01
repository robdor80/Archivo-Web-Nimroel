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
// 💾 GUARDAR DOCUMENTO (solo CRÓNICAS)
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const coleccion = "cronicas"; // 🔒 Colección fija
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
    imagen: campos.imagen.value.trim(),
    resumen: document.getElementById("resumen").value.trim(),
    sello: campos.sello.value.trim(),
    firma: campos.firma.value.trim()
  };

  console.log(`📦 Intentando guardar en: ${coleccion}/${documento}`, datos);

  try {
    await setDoc(doc(db, coleccion, documento), datos);
    mensaje.textContent = `✅ Crónica '${documento}' guardada correctamente en '${coleccion}'.`;
    console.log("✅ Guardado correctamente en Firestore.");
    form.reset();
    actualizarVistaPrevia("imagen");
    actualizarVistaPrevia("sello");
    actualizarVistaPrevia("firma");
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    mensaje.textContent = "❌ Error al guardar la crónica. Revisa consola.";
  }
});

// ===============================
// 🚪 SALIR (Cerrar sesión)
// ===============================
btnSalir.addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("🔒 Sesión cerrada correctamente.");
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
  if (!capa) return;
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
// 🖼️ VISTA PREVIA CON "?" CUANDO NO HAY IMAGEN
// ===============================
window.actualizarVistaPrevia = function (tipo) {
  const url = campos[tipo].value.trim();
  const vista = vistas[tipo];
  const boton = botonesAbrir[tipo];

  // Quitar estilos previos
  vista.classList.remove("sin-vista-previa");
  vista.removeAttribute("src");
  vista.textContent = "";

  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    // ✅ URL válida: mostrar imagen real
    vista.src = url;
    boton.disabled = false;
    boton.onclick = () => window.open(url, "_blank");
  } else {
    // ❌ No hay imagen válida: mostrar un “?”
    vista.classList.add("sin-vista-previa");
    vista.textContent = "?";
    vista.style.display = "flex";
    vista.style.alignItems = "center";
    vista.style.justifyContent = "center";
    vista.style.fontSize = "3rem";
    vista.style.color = "rgba(12, 54, 66, 0.6)";
    vista.style.fontWeight = "bold";
    vista.style.textShadow = "0 0 6px rgba(100, 200, 255, 0.3)";
    boton.disabled = true;
  }
};
