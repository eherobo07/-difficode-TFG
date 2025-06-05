// ===============================
// 1. CARGA DE DATOS DESDE LA API DE SESIÓN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/sesion")
    .then((res) => {
      if (!res.ok) throw new Error("Sesión no activa");
      return res.json();
    })
    .then((usuario) => {
      document.getElementById("nombre").value = usuario.nombre;
      document.getElementById("apellidos").value = usuario.apellidos;
      const fechaNacimiento = new Date(usuario.fecha_nacimiento);
      const fechaFormateada = fechaNacimiento.toISOString().split("T")[0];
      document.getElementById("fecha").value = fechaFormateada;
      document.getElementById("correo").value = usuario.correo;

      const rutaFoto = `${usuario.foto_perfil}`;
      document.getElementById("icono-perfil").src = rutaFoto;
      document.getElementById("foto-perfil-grande").src = rutaFoto;

      // Guardamos el id del usuario para posibles actualizaciones
      window.usuarioActual = usuario;
    })
    .catch(() => {
      window.location.href = "../index.html";
    });
});

// ===============================
// 2. BOTÓN EDITAR / GUARDAR
// ===============================
const btnEditarGuardar = document.getElementById("btn-editar-guardar");
const inputs = document.querySelectorAll(
  "#form-datos-personales input:not(#btn-editar-guardar)"
);
let modoEdicion = false;

btnEditarGuardar?.addEventListener("click", () => {
  modoEdicion = !modoEdicion;
  inputs.forEach((input) => (input.disabled = !modoEdicion));
  btnEditarGuardar.textContent = modoEdicion ? "Guardar" : "Editar";

  if (!modoEdicion) {
    // Guardar cambios
    const datosActualizados = {
      nombre: document.getElementById("nombre").value,
      apellidos: document.getElementById("apellidos").value,
      fecha_nacimiento: document.getElementById("fecha").value,
      correo: document.getElementById("correo").value,
      foto_perfil: window.usuarioActual.foto_perfil,
    };

    fetch(`/api/usuario/${window.usuarioActual.id_usuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosActualizados),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar los cambios");
        alert("Cambios guardados correctamente");
      })
      .catch(() => {
        alert("No se pudo guardar. Intenta de nuevo.");
      });
  }
});

// ===============================
// 3. CAMBIO DE FOTO DE PERFIL
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const popupFoto = document.getElementById("selector-foto");
  const cerrarBtn = popupFoto.querySelector(".cerrar");
  const imagenes = popupFoto.querySelectorAll(".galeria-fotos img");
  const fotoPerfil = document.getElementById("foto-perfil-grande");
  const iconoHeader = document.getElementById("icono-perfil");
  const botonAbrir = document.getElementById("btn-actualizar-foto");

  botonAbrir?.addEventListener("click", () => {
    popupFoto.classList.remove("oculto");
  });

  cerrarBtn?.addEventListener("click", () => {
    popupFoto.classList.add("oculto");
  });

  popupFoto.addEventListener("click", (e) => {
    if (e.target === popupFoto) popupFoto.classList.add("oculto");
  });

  imagenes.forEach((img) => {
    img.addEventListener("click", () => {
      const nuevaRuta = img.getAttribute("src");
      if (fotoPerfil) fotoPerfil.src = nuevaRuta;
      if (iconoHeader) iconoHeader.src = nuevaRuta;

      if (window.usuarioActual) {
        window.usuarioActual.foto_perfil = nuevaRuta.replace("../", "");
      }

      popupFoto.classList.add("oculto"); // Cierra al seleccionar

      // Añadir el mensaje de recordatorio
      alert("Recuerda darla a Editar y luego Guardar para guardar los cambios en tu foto");
    });
  });
});


// ===============================
// 4. MENÚ DESPLEGABLE Y FUNCIONES
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu-perfil");
  const iconoPerfil = document.getElementById("icono-perfil");
  const textoLogin = document.getElementById("texto-login");

  iconoPerfil?.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("oculto");
  });

  textoLogin?.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("oculto");
  });

  // Cierra el menú al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !iconoPerfil.contains(e.target)) {
      menu.classList.add("oculto");
    }
  });

  // Acciones del menú
  document
    .getElementById("ver-perfil")
    ?.addEventListener("click", () => location.reload());

  document.getElementById("ver-curso")?.addEventListener("click", () => {
    window.location.href = "/curso";
  });

  document
    .getElementById("informar-problema")
    ?.addEventListener("click", () => {
      document.getElementById("popup-problema").classList.remove("oculto");
    });

  document.getElementById("reiniciar-curso")?.addEventListener("click", () => {
    alert(
      "!difficode ALFA VERSION\nFunción en desarrollo, gracias por tu paciencia."
    );
  });

  document.getElementById("cerrar-sesion")?.addEventListener("click", () => {
    fetch("/api/logout").then(() => {
      window.location.href = "/";
    });
  });
});
document.getElementById("borrar-cuenta")?.addEventListener("click", () => {
  if (!window.usuarioActual) return;

  const confirmado = confirm(
    "⚠ Esta acción es irreversible. ¿Estás segur@ de que quieres borrar tu cuenta PERMANENTEMENTE?"
  );
  if (!confirmado) return;

  fetch(`/api/usuario/${window.usuarioActual.id_usuario}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("No se pudo borrar el usuario.");
      return fetch("/api/logout");
    })
    .then(() => {
      alert("Tu cuenta ha sido eliminada. ¡Hasta pronto!");
      window.location.href = "/";
    })
    .catch(() => {
      alert("Hubo un error al intentar borrar la cuenta.");
    });
});

// ===============================
// 5. POPUP - INFORMAR DE PROBLEMA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const popupProblema = document.getElementById("popup-problema");
  const cerrarPopup = document.querySelector(".cerrar-popup");
  const btnEnviar = document.getElementById("enviar-problema");
  const textarea = popupProblema.querySelector("textarea");

  cerrarPopup?.addEventListener("click", () => {
    popupProblema.classList.add("oculto");
  });

  btnEnviar?.addEventListener("click", () => {
    const texto = textarea.value.trim();

    if (texto === "") {
      alert("Por favor, describe el problema antes de enviar.");
      return;
    }

    textarea.value = "";
    alert("Reporte enviado. Muchas gracias.");
    popupProblema.classList.add("oculto");
  });
});
