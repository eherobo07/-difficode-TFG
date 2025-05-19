console.log("✅ index.js cargado correctamente");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM cargado correctamente");

  // ============================
  // 1. REDIRECCIÓN SI YA HAY SESIÓN
  // ============================
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (usuario) {
    window.location.href = "pages/perfil.html";
    return; // Evita seguir ejecutando el resto
  }

  // ============================
  // 2. FRASES PROMOCIONALES ALEATORIAS
  // ============================
  const frases = [
    "Aprender a programar nunca fue tan fácil.",
    "Domina la lógica. Domina el código.",
    "Tu primer paso hacia la programación empieza aquí.",
    "Haz clic, piensa, programa.",
    "Convierte ideas en algoritmos.",
  ];
  const fraseElemento = document.getElementById("frase-catchy");
  let frasesIndex = 0;

  function cambiarFrase() {
    fraseElemento.textContent = frases[frasesIndex];
    frasesIndex = (frasesIndex + 1) % frases.length;
  }

  cambiarFrase(); // Primera carga
  setInterval(cambiarFrase, 20000); // Cada 20 segundos

  // ============================
  // 3. ANIMACIÓN BOTÓN LOGIN
  // ============================
  const iconoLogin = document.getElementById("login-status");
  const botonLogin = document.getElementById("btn-iniciar-sesion");

  iconoLogin.addEventListener("click", () => {
    botonLogin.classList.add("animar");
    setTimeout(() => {
      botonLogin.classList.remove("animar");
    }, 300);
  });

  // ============================
  // 4. ABRIR Y CERRAR POPUP
  // ============================
  const popup = document.getElementById("popup");
  const cerrarPopup = document.querySelector(".cerrar");
  const linkRegistro = document.getElementById("link-registro");

  // Asegurar que el popup esté oculto al inicio
  popup.classList.add("oculto");

  // Mostrar formularios según botón
  botonLogin.addEventListener("click", () => mostrarFormulario("login"));
  linkRegistro.addEventListener("click", (e) => {
    e.preventDefault(); // prevenir navegación por el <a>
    mostrarFormulario("registro");
  });

  cerrarPopup.addEventListener("click", () => {
    popup.classList.add("oculto");
  });

  // Cerrar el popup haciendo clic fuera del contenido
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.add("oculto");
    }
  });

  // ============================
  // 5. MOSTRAR FORMULARIO LOGIN / REGISTRO
  // ============================
  function mostrarFormulario(tipo) {
    popup.classList.remove("oculto");
    const form = document.getElementById("formulario-autenticacion");
    form.innerHTML = "";

    if (tipo === "login") {
      form.innerHTML = `
        <h2>Iniciar sesión</h2>
        <input type="email" id="correo" placeholder="Correo electrónico" required />
        <input type="password" id="contraseña" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      `;
      form.onsubmit = manejarLogin;
    } else {
      form.innerHTML = `
        <h2>Registro</h2>
        <input type="text" id="nombre" placeholder="Nombre" required />
        <input type="text" id="apellidos" placeholder="Apellidos" />
        <input type="date" id="fecha" required />
        <input type="email" id="correo" placeholder="Correo electrónico" required />
        <input type="password" id="contraseña" placeholder="Contraseña" required />
        <button type="submit">Crear cuenta</button>
      `;
      form.onsubmit = manejarRegistro;
    }
  }

  // ============================
  // 6. SIMULAR LOGIN CON JSON LOCAL
  // ============================
  function manejarLogin(e) {
    e.preventDefault();
    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contraseña").value;

    fetch("data/usuarios.json")
      .then(res => res.json())
      .then(usuarios => {
        const usuario = usuarios.find(
          u => u.correo === correo && u.contraseña === contraseña
        );

        if (usuario) {
          localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
          window.location.href = "pages/perfil.html";
        } else {
          alert("Correo o contraseña incorrectos");
        }
      });
  }

  // ============================
  // 7. SIMULAR REGISTRO (NO SE GUARDA EN BACKEND)
  // ============================
  function manejarRegistro(e) {
    e.preventDefault();

    const nuevoUsuario = {
      id: Date.now(),
      nombre: document.getElementById("nombre").value,
      apellidos: document.getElementById("apellidos").value,
      fecha_nacimiento: document.getElementById("fecha").value,
      correo: document.getElementById("correo").value,
      contraseña: document.getElementById("contraseña").value,
      foto: "perfil_default.png",
      cursos: [1]
    };

    localStorage.setItem("usuarioLogueado", JSON.stringify(nuevoUsuario));
    window.location.href = "pages/perfil.html";
  }

  // ============================
  // 8. CARRUSEL AUTOMÁTICO
  // ============================
  let indiceActual = 0;
  const imagenes = document.querySelectorAll("#carrusel img");

  function mostrarSiguienteImagen() {
    imagenes[indiceActual].classList.remove("activo");
    indiceActual = (indiceActual + 1) % imagenes.length;
    imagenes[indiceActual].classList.add("activo");
  }

  setInterval(mostrarSiguienteImagen, 5000);
});

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const barraLateral = document.getElementById('barra-lateral');
  const body = document.body;

  menuToggle.addEventListener('click', () => {
    barraLateral.classList.add('abierto');
    body.classList.add('menu-abierto');
    menuToggle.classList.add('oculto');
  });

  document.addEventListener('click', (e) => {
    if (
      barraLateral.classList.contains('abierto') &&
      !barraLateral.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      barraLateral.classList.remove('abierto');
      body.classList.remove('menu-abierto');
      menuToggle.classList.remove('oculto');
    }
  });
});


function abrirPopup() {
  document.getElementById('popup').classList.remove('oculto');
  document.body.classList.add('menu-abierto');

  // Añadir clase de animación al botón
  document.getElementById('btn-iniciar-sesion').classList.add('clicked');
}

function cerrarPopup() {
  document.getElementById('popup').classList.add('oculto');
  document.body.classList.remove('menu-abierto');

  // Remover clase de animación al botón
  document.getElementById('btn-iniciar-sesion').classList.remove('clicked');
}

// Añadir animación al hacer clic en la foto de perfil o el texto de "Identifícate"
document.getElementById('icono-perfil').addEventListener('click', () => {
  abrirPopup();
  document.getElementById('btn-iniciar-sesion').classList.add('clicked');
});

document.getElementById('texto-identificate').addEventListener('click', () => {
  abrirPopup();
  document.getElementById('btn-iniciar-sesion').classList.add('clicked');
});

document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('barra-lateral').classList.toggle('abierto');
});
document.addEventListener("DOMContentLoaded", () => {
  const accesoBtn = document.querySelector("#acceso button");
  const identificateText = document.querySelector("#identificate-text"); // Si es un texto clicable
  const identificateImg = document.querySelector("#identificate-img"); // Si es una imagen clicable
  const popup = document.querySelector("#popup"); // Asumimos que el popup está en el HTML
  const loginForm = document.querySelector("#login-form"); // El formulario de inicio de sesión
  const registerForm = document.querySelector("#register-form"); // El formulario de registro

  // Función que abre el popup de inicio de sesión
  const abrirPopupLogin = () => {
    // Asegurarse de que siempre se muestra el formulario de inicio de sesión
    if (registerForm) {
      registerForm.style.display = "none"; // Ocultamos el formulario de registro
    }
    if (loginForm) {
      loginForm.style.display = "block"; // Aseguramos que el formulario de inicio de sesión esté visible
    }

    // Abrir el popup (suponiendo que es visible)
    popup.style.display = "block"; // Muestra el popup
  };

  // Asociamos la función a los elementos que deben abrir el popup
  if (accesoBtn) accesoBtn.addEventListener("click", abrirPopupLogin);
  if (identificateText) identificateText.addEventListener("click", abrirPopupLogin);
  if (identificateImg) identificateImg.addEventListener("click", abrirPopupLogin);
});
