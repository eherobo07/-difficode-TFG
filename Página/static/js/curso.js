document.addEventListener("DOMContentLoaded", () => {
  const barraLateral = document.getElementById("barra-lateral");
  const botonMenu = document.getElementById("menu-toggle");

  // ========= TOGGLE DEL ASIDE EN RESPONSIVE ========= //
  botonMenu.addEventListener("click", () => {
    barraLateral.classList.toggle("abierto");
    document.body.classList.toggle("menu-abierto");
  });

  // ========= CARGAR DATOS DEL CURSO ========= //
  fetch("/api/curso")
    .then((response) => {
      if (!response.ok) throw new Error("No se pudo cargar el curso");
      return response.json();
    })
    .then((data) => {
      renderizarModulosEnAside(data.modulos);
      renderizarContenidoPrincipal(data.modulos);
    })
    .catch((error) => {
      console.error("Error al cargar el curso:", error);
      document.querySelector("main").innerHTML =
        "<p>Error al cargar el curso.</p>";
    });

  // ========= RENDERIZAR MODULOS EN EL ASIDE ========= //
  function renderizarModulosEnAside(modulos) {
    const lista = document.querySelector("#barra-lateral ul");
    lista.innerHTML = ""; // Limpiar cualquier lista anterior

    modulos.forEach((modulo) => {
      const li = document.createElement("li");
      li.textContent = modulo.nombre;
      lista.appendChild(li);
    });
  }

  // ========= RENDERIZAR LAS BURBUJAS EN EL MAIN ========= //
  function renderizarContenidoPrincipal(modulos) {
    const main = document.querySelector("main");
    main.innerHTML = ""; // Limpiamos el main

    modulos.forEach((modulo) => {
      const seccionModulo = document.createElement("section");
      seccionModulo.classList.add("modulo");

      // === Título del módulo ===
      const titulo = document.createElement("h2");
      titulo.textContent = modulo.nombre;
      seccionModulo.appendChild(titulo);

      // === Contenedor de burbujas de teoría ===
      const teoriaContenedor = document.createElement("div");
      teoriaContenedor.classList.add("lecciones", "teoria");

      const teoriaTitulo = document.createElement("h3");
      teoriaTitulo.textContent = "Teoría";
      teoriaContenedor.appendChild(teoriaTitulo);

      const teoriaBurbujas = document.createElement("div");
      teoriaBurbujas.classList.add("burbujas");

      modulo.teorias.forEach((teoria) => {
        const burbuja = document.createElement("div");
        burbuja.classList.add("burbuja");
        burbuja.textContent = teoria.orden;
        burbuja.title = teoria.titulo;

        // Evento al hacer click en teoría
        burbuja.addEventListener("click", () => {
          window.location.href = `/teoria/${teoria.id}`;
        });

        teoriaBurbujas.appendChild(burbuja);
      });

      teoriaContenedor.appendChild(teoriaBurbujas);
      seccionModulo.appendChild(teoriaContenedor);

      // === Contenedor de burbujas de ejercicios ===
      const ejercicioContenedor = document.createElement("div");
      ejercicioContenedor.classList.add("lecciones", "ejercicios");

      const ejercicioTitulo = document.createElement("h3");
      ejercicioTitulo.textContent = "Ejercicios";
      ejercicioContenedor.appendChild(ejercicioTitulo);

      const ejercicioBurbujas = document.createElement("div");
      ejercicioBurbujas.classList.add("burbujas");

      modulo.ejercicios.forEach((ejercicio) => {
        const burbuja = document.createElement("div");
        burbuja.classList.add("burbuja");
        burbuja.textContent = ejercicio.id_teoria; // o ejercicio.orden si existiera

        // Colorear según estado
        if (ejercicio.estado === "bloqueado") {
          burbuja.classList.add("bloqueado");
        } else if (ejercicio.estado === "correcto") {
          burbuja.classList.add("correcto");
        } else if (ejercicio.estado === "incompleto") {
          burbuja.classList.add("incompleto");
        }

        // Solo permitir click si no está bloqueado
        if (ejercicio.estado !== "bloqueado") {
          burbuja.addEventListener("click", () => {
            window.location.href = `/ejercicio/${ejercicio.id}`;
          });
        } else {
          burbuja.title = "Completa el ejercicio anterior para desbloquear";
        }

        ejercicioBurbujas.appendChild(burbuja);
      });

      ejercicioContenedor.appendChild(ejercicioBurbujas);
      seccionModulo.appendChild(ejercicioContenedor);

      main.appendChild(seccionModulo);
    });
  }
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
        window.location.href = "/"; // Redirige al usuario después de eliminar la cuenta
      })
      .catch(() => {
        alert("Hubo un error al intentar borrar la cuenta.");
      });
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
document.addEventListener("DOMContentLoaded", async () => {
  const tituloCurso = document.getElementById("titulo-curso");
  const descripcionCurso = document.getElementById("descripcion-curso");
  const listaModulos = document.getElementById("lista-modulos");
  const contenedorTeoria = document.getElementById("burbujas-teoria");
  const contenedorEjercicios = document.getElementById("burbujas-ejercicios");
  const iconoPerfil = document.getElementById("icono-perfil");

  try {
    // 1. Obtener sesión y foto de perfil
    const resSesion = await fetch("/api/sesion");
    if (!resSesion.ok) throw new Error("No hay sesión activa");
    const usuario = await resSesion.json();
    window.usuarioActual = usuario;

    if (usuario.foto_perfil) {
      iconoPerfil.src = usuario.foto_perfil;
    }

    // 2. Obtener curso completo
    const resCurso = await fetch("/api/curso");
    if (!resCurso.ok) throw new Error("Error al cargar el curso");
    const curso = await resCurso.json();

    // 3. Cargar título y descripción
    tituloCurso.textContent = curso.nombre;
    descripcionCurso.textContent = curso.descripcion;

    // Solo procesamos el primer módulo por ahora
    const primerModulo = curso.modulos[0];
    if (!primerModulo) return;

    // 4. Mostrar los módulos en el <aside>
    curso.modulos.forEach((modulo, i) => {
      const li = document.createElement("li");
      li.textContent = `Módulo ${modulo.orden}`;
      listaModulos.appendChild(li);
    });

    // 5. Mostrar burbujas de teoría
    contenedorTeoria.innerHTML = "";
    //================================
    //COMENTADO PARA HACER LA TRAMPA DE NO CARGAR MÁS QUE EL 1, DESCOMENTAR EN FUTURO
    //================================

    primerModulo.teorias.forEach((teoria, index) => {
      const burbuja = document.createElement("div");
      burbuja.classList.add("burbuja", "incompleto");
      burbuja.textContent = index + 1;
      burbuja.title = teoria.titulo;
      burbuja.addEventListener("click", () => {
        if (teoria.id !== 1) {
          alert(
            "!difficode ALFA VERSION\nLección actualmente en desarrollo, gracias por tu paciencia."
          );
        } else {
          window.location.href = `/teoria/${teoria.id}`;
        }
      });
      contenedorTeoria.appendChild(burbuja);
    });

    // 6. Mostrar burbujas de ejercicios finales
    contenedorEjercicios.innerHTML = "";
    primerModulo.ejercicios.forEach((ejercicio, index) => {
      const burbuja = document.createElement("div");
      burbuja.classList.add("burbuja");

      if (ejercicio.estado === "bloqueado") {
        burbuja.classList.add("bloqueado");
      } else if (ejercicio.estado === "incompleto") {
        burbuja.classList.add("incompleto");
      } else if (ejercicio.estado === "correcto") {
        burbuja.classList.add("correcto");
      }

      burbuja.textContent = index + 1;
      burbuja.title = "Ejercicio final";

      // Redirige solo si NO está bloqueado
      if (ejercicio.estado !== "bloqueado") {
        burbuja.addEventListener("click", () => {
          if (ejercicio.id !== 1) {
            alert(
              "!difficode ALFA VERSION\nEjercicio actualmente en desarrollo, gracias por tu paciencia."
            );
          } else {
            window.location.href = `/ejercicio/${ejercicio.id}`;
          }
        });
      }

      contenedorEjercicios.appendChild(burbuja);
    });
  } catch (error) {
    alert("Error al cargar el curso. Redirigiendo...");
    window.location.href = "/";
  }
});
