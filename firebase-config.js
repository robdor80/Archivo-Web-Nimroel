// Importar módulos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase (usa tus propios datos)
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "cronicas-de-nimroel.firebaseapp.com",
  projectId: "cronicas-de-nimroel",
  storageBucket: "cronicas-de-nimroel.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234"
  };

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Prueba de lectura desde Firestore ---
async function leerMensaje() {
  const querySnapshot = await getDocs(collection(db, "pruebas"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}

// Ejecutar prueba al cargar
leerMensaje();
