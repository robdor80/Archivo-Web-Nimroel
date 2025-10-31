/* ==========================================================
   💧 SANTUARIO DE NIMROEL — SCRIPT PRINCIPAL COMPLETO (versión final)
   ========================================================== */

/* ----------------------------------------------------------
   ✨ RUNAS DEL SANTUARIO
   ---------------------------------------------------------- */
const RUNAS = [
  "ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ",
  "ᛁ","ᛃ","ᛇ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ",
  "ᛜ","ᛞ","ᛟ"
];

/* ----------------------------------------------------------
   🌌 GENERA LA LLUVIA DE RUNAS
   ---------------------------------------------------------- */
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
    const escala = 0.8 + Math.random() * 1.2;
    rune.style.fontSize = escala + "rem";
    capa.appendChild(rune);
  }

  // 🔁 Cambia algunas runas aleatoriamente
  setInterval(() => {
    const runasActivas = document.querySelectorAll("#runas .runa");
    if (runasActivas.length === 0) return;
    for (let i = 0; i < Math.min(8, runasActivas.length); i++) {
      const r = runasActivas[Math.floor(Math.random() * runasActivas.length)];
      r.textContent = RUNAS[Math.floor(Math.random() * RUNAS.length)];
    }
  }, 800);
}

// Regenerar al redimensionar
window.addEventListener("resize", () => {
  const capa = document.getElementById("runas");
  if (!capa) return;
  capa.innerHTML = "";
  generarLluviaRunas();
});

/* ----------------------------------------------------------
   🧭 DETECTOR DE ORIENTACIÓN
   ---------------------------------------------------------- */
function actualizarOrientacion() {
  const body = document.body;
  if (window.innerWidth > window.innerHeight) {
    body.classList.add("horizontal");
    body.classList.remove("vertical");
  } else {
    body.classList.add("vertical");
    body.classList.remove("horizontal");
  }
}
window.addEventListener("load", actualizarOrientacion);
window.addEventListener("resize", actualizarOrientacion);
window.addEventListener("orientationchange", actualizarOrientacion);

/* ----------------------------------------------------------
   🚀 INICIALIZACIÓN GENERAL
   ---------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  generarLluviaRunas();
  actualizarOrientacion();

  /* ==========================================================
     🍔 MENÚ HAMBURGUESA
     ========================================================== */
  const btnHamburguesa = document.getElementById("hamburguesa");
  const menu = document.getElementById("menu");

  if (btnHamburguesa && menu) {
    btnHamburguesa.addEventListener("click", () => {
      const abierto = btnHamburguesa.classList.toggle("abierto");
      menu.style.display = abierto ? "block" : "none";

      // 🔁 Reinicia el texto de música cuando se abre el menú
      if (abierto && enlaceMusica && !musicaActiva) {
        enlaceMusica.textContent = "Activar canto";
      }
    });
  }

  /* ==========================================================
     🎵 CANTO DEL SANTUARIO — ACTIVO EN TODAS LAS PLATAFORMAS
     ========================================================== */
  const audio1 = new Audio("../medios/audio/primer_canto.mp3");
const audio2 = new Audio("../medios/audio/segundo_canto.mp3");
  let musicaActiva = false;

  const enlaceMusica = document.querySelector('#menu a:nth-child(2)');
  const enlaceMusicaPc = document.getElementById("musicaPc");

  function activarCanto(enlace) {
    musicaActiva = true;
    enlace.textContent = "Canto activo";
    audio1.currentTime = 0;
    audio1.play().catch(() => {});
  }

  function desactivarCanto(enlace) {
    musicaActiva = false;
    enlace.textContent = "Canto silenciado";
    audio1.pause();
    audio2.pause();
  }

  // 🔁 Encadenar cantos para reproducción continua
  audio1.addEventListener("ended", () => {
    if (musicaActiva) {
      audio2.currentTime = 0;
      audio2.play();
    }
  });
  audio2.addEventListener("ended", () => {
    if (musicaActiva) {
      audio1.currentTime = 0;
      audio1.play();
    }
  });

  // 📱 Menú móvil/tablet
  if (enlaceMusica) {
    enlaceMusica.textContent = "Activar canto";
    enlaceMusica.addEventListener("click", (e) => {
      e.preventDefault();
      if (!musicaActiva) activarCanto(enlaceMusica);
      else desactivarCanto(enlaceMusica);
    });
  }

  // 💻 Menú PC (tres puntos) — versión sincronizada
  if (enlaceMusicaPc) {
    enlaceMusicaPc.textContent = "Activar canto";
    enlaceMusicaPc.addEventListener("click", (e) => {
      e.preventDefault();

      if (!musicaActiva) {
        activarCanto(enlaceMusicaPc);
      } else {
        desactivarCanto(enlaceMusicaPc);
        // 🔁 restablece el texto a “Activar canto” tras detenerse
        setTimeout(() => {
          enlaceMusicaPc.textContent = "Activar canto";
        }, 300);
      }
    });
  }

  /* ==========================================================
     ⚙️ MENÚ DE TRES PUNTOS — SOLO EN PC
     ========================================================== */
  const menuPcBtn = document.getElementById("menuPcPuntos");
  const menuPc = document.getElementById("menuPc");

  if (menuPcBtn && menuPc) {
    menuPcBtn.addEventListener("click", () => {
      const visible = menuPc.style.display === "block";
      menuPc.style.display = visible ? "none" : "block";
    });
  }
});

/* ==========================================================
   💻 DETECTOR DE ENTORNO DE ESCRITORIO
   ========================================================== */
if (window.innerWidth >= 1366 && window.innerHeight >= 700) {
  document.body.classList.add("desktop");
}
