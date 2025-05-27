// ===============================
// CARGA DE DATOS DESDE EL JSON
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // 1. VERIFICAR USUARIO LOGUEADO
  // ============================
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!usuarioLogueado) {
    window.location.href = "../index.html"; // redirigir si no hay sesión
    return;
  }

  // ============================
  // 2. CARGAR DATOS DEL USUARIO DESDE JSON
  // ============================
  fetch("../data/usuarios.json")
    .then(res => res.json())
    .then(usuarios => {
      const usuario = usuarios.find(u => u.id === usuarioLogueado.id);
      if (usuario) {
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('apellidos').value = usuario.apellidos;
        document.getElementById('fecha').value = usuario.fecha_nacimiento;
        document.getElementById('correo').value = usuario.correo;

        const rutaFoto = "../img/profile/" + usuario.foto;
        document.getElementById('icono-perfil').src = rutaFoto;
        document.getElementById('foto-perfil-grande').src = rutaFoto;
      } else {
        alert("No se pudo encontrar la información del usuario.");
      }
    });
});

// ===============================
// BOTÓN EDITAR / GUARDAR
// ===============================

const btnEditarGuardar = document.getElementById('btn-editar-guardar');
const inputs = document.querySelectorAll('#form-datos-personales input:not(#btn-editar-guardar)');
let modoEdicion = false;

btnEditarGuardar.addEventListener('click', () => {
  modoEdicion = !modoEdicion;

  inputs.forEach(input => {
    input.disabled = !modoEdicion;
  });

  btnEditarGuardar.textContent = modoEdicion ? 'Guardar' : 'Editar';
});



// ============================
// 7. ACTUALIZACIÓN DE FOTO DE PERFIL
// ============================

document.addEventListener("DOMContentLoaded", () => {
  const popupFoto = document.getElementById("selector-foto"); // Modal de selección
  const cerrarBtn = popupFoto.querySelector(".cerrar");       // Botón X
  const imagenes = popupFoto.querySelectorAll(".galeria-fotos img"); // Fotos disponibles
  const fotoPerfil = document.getElementById("foto-perfil-grande");  // Foto grande (main)
  const iconoHeader = document.getElementById("icono-perfil");       // Icono del header
  const botonAbrir = document.getElementById("btn-actualizar-foto"); // Botón para abrir modal

  // Abrir el modal
  botonAbrir?.addEventListener("click", () => {
    popupFoto.classList.remove("oculto");
  });

  // Cerrar modal con la X
  cerrarBtn?.addEventListener("click", () => {
    popupFoto.classList.add("oculto");
  });

  // Cerrar si se hace clic fuera del contenido
  popupFoto.addEventListener("click", (e) => {
    if (e.target === popupFoto) {
      popupFoto.classList.add("oculto");
    }
  });

  // Selección de nueva imagen
  imagenes.forEach(img => {
    img.addEventListener("click", () => {
      const nuevaRuta = img.getAttribute("src"); // Ruta completa, ej. ../img/profile/mcDuck.jpeg

      // Actualizar imágenes visibles
      if (fotoPerfil) fotoPerfil.src = nuevaRuta;
      if (iconoHeader) iconoHeader.src = nuevaRuta;

      // Actualizar en localStorage
      let usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
      if (usuario) {
        const partes = nuevaRuta.split("/");
        usuario.foto = partes[partes.length - 1]; // Solo el nombre del archivo
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));

      }

      // Cerrar modal
      popupFoto.classList.add("oculto");
    });
  });
});

// ============================
// 8. MENÚ DESPLEGABLE
// ============================

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu-perfil");
  const iconoPerfil = document.getElementById("icono-perfil");

  // Mostrar/ocultar menú
  iconoPerfil?.addEventListener("click", () => {
    menu.classList.toggle("oculto");
  });

  // Opción: Ver información personal
  document.getElementById("ver-perfil")?.addEventListener("click", () => {
    location.reload();
  });

  // Opción: Ver mi curso
  document.getElementById("ver-curso")?.addEventListener("click", () => {
    window.location.href = "curso.html"; // O la ruta que uses luego
  });

  // Opción: Informa de un problema
  document.getElementById("informar-problema")?.addEventListener("click", () => {
    document.getElementById("popup-problema").classList.remove("oculto");
  });

  // Opción: Reiniciar curso (alerta)
  document.getElementById("reiniciar-curso")?.addEventListener("click", () => {
    alert("¡difficode ALFA VERSION!\nFunción en desarrollo, gracias por tu paciencia.");
  });

  // Opción: Cerrar sesión
  document.getElementById("cerrar-sesion")?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "../index.html"; // O página de login real
  });

  // Cerrar popup de reporte
  document.querySelector(".cerrar-popup")?.addEventListener("click", () => {
    document.getElementById("popup-problema").classList.add("oculto");
  });

  // Enviar problema (sin funcionalidad real)
  document.getElementById("enviar-problema")?.addEventListener("click", () => {
    alert("¡Gracias por informar! Revisaremos tu reporte pronto.");
    document.getElementById("popup-problema").classList.add("oculto");
  });
});
