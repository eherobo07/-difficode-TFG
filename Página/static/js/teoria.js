document.addEventListener("DOMContentLoaded", async () => {
  const menu = document.getElementById("menu-perfil");
  const iconoPerfil = document.getElementById("icono-perfil");
  const textoLogin = document.getElementById("texto-login");

  try {
    // 1. Obtener sesión del usuario
    const resSesion = await fetch("/api/sesion");
    if (!resSesion.ok) throw new Error("No hay sesión activa");
    const usuario = await resSesion.json();
    window.usuarioActual = usuario;

    // 2. Verificar si el usuario tiene foto de perfil
    if (usuario.foto_perfil) {
      // Asegurarse de que la ruta de la foto es correcta
      if (!usuario.foto_perfil.startsWith('/static')) {
        usuario.foto_perfil = `../${usuario.foto_perfil}`;
      }
      iconoPerfil.src = usuario.foto_perfil; // Actualiza la imagen del perfil
    } else {
      iconoPerfil.src = "/static/img/perfil_default.png"; // Usa imagen predeterminada si no tiene foto
    }
  } catch (error) {
    console.error("Error al obtener sesión o foto de perfil:", error);
    iconoPerfil.src = "/static/img/perfil_default.png"; // Usamos la imagen predeterminada si falla la carga
  }


  // Funcionalidades del menú desplegable
  iconoPerfil?.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("oculto");
  });

  textoLogin?.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("oculto");
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !iconoPerfil.contains(e.target)) {
      menu.classList.add("oculto");
    }
  });

  document.getElementById("ver-perfil")?.addEventListener("click", () => {
    window.location.href = "/perfil";
  });

  document.getElementById("ver-curso")?.addEventListener("click", () => {
    window.location.href = "/curso";
  });

  document.getElementById("informar-problema")?.addEventListener("click", () => {
    alert("!difficode INFORMA:\nEsta función solo está disponible desde curso o perfil, gracias por tu comprensión.");
  });

  document.getElementById("reiniciar-curso")?.addEventListener("click", () => {
    alert("!difficode ALFA VERSION\nFunción en desarrollo, gracias por tu paciencia.");
  });

  document.getElementById("cerrar-sesion")?.addEventListener("click", () => {
    fetch("/api/logout").then(() => {
      window.location.href = "/";
    });
  });

  document.getElementById("borrar-cuenta")?.addEventListener("click", () => {
    if (!window.usuarioActual) return;

    const confirmado = confirm("⚠ Esta acción es irreversible. ¿Estás segur@ de que quieres borrar tu cuenta PERMANENTEMENTE?");
    if (!confirmado) return;

    fetch(`/api/usuario/${window.usuarioActual.id_usuario}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo borrar el usuario.");
        return fetch("/api/logout");
      })
      .then(() => {
        alert("Tu cuenta ha sido eliminada. ¡Hasta pronto!");
        window.location.href = "/"; // Redirige al usuario después de eliminar la cuenta
      })
      .catch(() => {
        alert("Hubo un error al intentar borrar la cuenta.");
      });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const botonVolver = document.getElementById("volver-curso");

  if (botonVolver) {
    botonVolver.addEventListener("click", () => {
      window.location.href = "/curso";  // Redirige a la página del curso
    });
  }
});
