document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // 1. REDIRECCIÓN SI YA HAY SESIÓN
  // ============================
  fetch("/api/sesion")
    .then(res => {
      if (res.ok) return res.json();
      throw new Error("No hay sesión activa");
    })
    .then(() => {
      window.location.href = "/perfil";
    })
    .catch(() => {
      // No hay sesión, continuar
    });

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

  cambiarFrase();
  setInterval(cambiarFrase, 20000);

  // ============================
  // 3. MANEJO DE POPUP Y FORMULARIOS
  // ============================
  const popup = document.getElementById("popup");
  const cerrarPopupBtn = document.querySelector(".cerrar");
  const formContainer = document.getElementById("formulario-autenticacion");
  const botonLogin = document.getElementById("btn-iniciar-sesion");
  const iconoLogin = document.getElementById("login-status");
  const linkRegistro = document.getElementById("link-registro");

  function abrirPopup() {
    popup.classList.remove("oculto");
    document.body.classList.add("menu-abierto");
  }

  function cerrarPopup() {
    popup.classList.add("oculto");
    document.body.classList.remove("menu-abierto");
  }

  if (cerrarPopupBtn) {
    cerrarPopupBtn.addEventListener("click", cerrarPopup);
  }

  popup.addEventListener("click", (e) => {
    if (e.target === popup) cerrarPopup();
  });

  function mostrarFormulario(tipo) {
    // Cierra menú lateral si está abierto
    const barraLateral = document.getElementById("barra-lateral");
    const menuToggle = document.getElementById("menu-toggle");

    if (barraLateral?.classList.contains("abierto")) {
      barraLateral.classList.remove("abierto");
      document.body.classList.remove("menu-abierto");
      menuToggle?.classList.remove("oculto");
    }

    abrirPopup();
    formContainer.innerHTML = "";

    if (tipo === "login") {
      formContainer.innerHTML = `
        <h2>Iniciar sesión</h2>
        <input type="email" id="correo" placeholder="Correo electrónico" required />
        <input type="password" id="contraseña" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>`;
      formContainer.onsubmit = manejarLogin;
    } else {
      formContainer.innerHTML = `
        <h2>Registro</h2>
        <input type="text" id="nombre" placeholder="Nombre" required />
        <input type="text" id="apellidos" placeholder="Apellidos" />
        <input type="date" id="fecha" required />
        <input type="email" id="correo" placeholder="Correo electrónico" required />
        <input type="password" id="contraseña" placeholder="Contraseña" required />
        <button type="submit">Crear cuenta</button>`;
      formContainer.onsubmit = manejarRegistro;
    }
  }

  // Eventos de acceso al formulario
  [iconoLogin, botonLogin].forEach(el => {
    if (el) {
      el.addEventListener("click", () => {
        botonLogin.classList.add("animar", "clicked");
        setTimeout(() => {
          botonLogin.classList.remove("animar", "clicked");
        }, 300);
        mostrarFormulario("login");
      });
    }
  });

  if (linkRegistro) {
    linkRegistro.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarFormulario("registro");
    });
  }

  const accesos = [
    document.getElementById("icono-perfil"),
    document.getElementById("texto-identificate"),
    document.querySelector("#acceso button"),
    document.querySelector("#identificate-text"),
    document.querySelector("#identificate-img")
  ];

  accesos.forEach(el => {
    if (el) {
      el.addEventListener("click", () => {
        mostrarFormulario("login");
        abrirPopup();
      });
    }
  });

  // ============================
  // 4. LOGIN Y REGISTRO CON BACKEND REAL
  // ============================
  function manejarLogin(e) {
    e.preventDefault();

    const datos = {
      correo: document.getElementById("correo").value,
      contraseña: document.getElementById("contraseña").value
    };

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    })
      .then(res => {
        if (!res.ok) throw new Error("Login incorrecto");
        return res.json();
      })
      .then(() => {
        window.location.href = "/perfil";
      })
      .catch(() => {
        alert("Correo o contraseña incorrectos");
      });
  }

  function manejarRegistro(e) {
    e.preventDefault();

    const nuevoUsuario = {
      nombre: document.getElementById("nombre").value,
      apellidos: document.getElementById("apellidos").value,
      fecha_nacimiento: document.getElementById("fecha").value,
      correo: document.getElementById("correo").value,
      contraseña: document.getElementById("contraseña").value,
      foto_perfil: "img/profile/perfil_default.png"
    };

    fetch("/api/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoUsuario)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error en el registro");
        return res.json();
      })
      .then(() => {
        alert("Usuario registrado correctamente. Ahora inicia sesión.");
        cerrarPopup();
      })
      .catch(() => {
        alert("Error al registrar. Intenta con otro correo.");
      });
  }

  // ============================
  // 5. CARRUSEL AUTOMÁTICO Y MANUAL
  // ============================
  const imagenes = document.querySelectorAll("#carrusel img");
  let indiceActual = 0;
  let intervalo;

  function mostrarImagenActiva() {
    imagenes.forEach((img, index) => {
      img.classList.toggle("activo", index === indiceActual);
    });
  }

  function siguienteImagen() {
    indiceActual = (indiceActual + 1) % imagenes.length;
    mostrarImagenActiva();
  }

  function anteriorImagen() {
    indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
    mostrarImagenActiva();
  }

  function iniciarRotacion() {
    intervalo = setInterval(siguienteImagen, 5000);
  }

  function reiniciarIntervalo() {
    clearInterval(intervalo);
    iniciarRotacion();
  }

  document.getElementById("siguiente")?.addEventListener("click", () => {
    siguienteImagen();
    reiniciarIntervalo();
  });

  document.getElementById("anterior")?.addEventListener("click", () => {
    anteriorImagen();
    reiniciarIntervalo();
  });

  mostrarImagenActiva();
  iniciarRotacion();

  // ============================
  // 6. MENÚ LATERAL RESPONSIVO
  // ============================
  const menuToggle = document.getElementById("menu-toggle");
  const barraLateral = document.getElementById("barra-lateral");

  menuToggle?.addEventListener("click", () => {
    barraLateral.classList.toggle("abierto");
    document.body.classList.toggle("menu-abierto");
    menuToggle.classList.toggle("oculto");
  });

  document.addEventListener("click", (e) => {
    if (
      barraLateral?.classList.contains("abierto") &&
      !barraLateral.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      barraLateral.classList.remove("abierto");
      document.body.classList.remove("menu-abierto");
      menuToggle.classList.remove("oculto");
    }
  });
});
