
document.addEventListener("DOMContentLoaded", () => {
  // Mantener el estado del stream
  const liveText = document.getElementById("live-text");
  if (liveText) {
    liveText.textContent = "STREAMING";
  }

  // Elementos del sorteo
  const palabraInput = document.getElementById("sorteo-palabra");
  const cantidadInput = document.getElementById("sorteo-cantidad");
  const estado = document.getElementById("sorteo-estado");
  const contador = document.getElementById("sorteo-participantes");
  const lista = document.getElementById("sorteo-lista");
  const ganadoresBox = document.getElementById("sorteo-ganadores");
  const mensaje = document.getElementById("sorteo-mensaje");

  const abrirBtn = document.getElementById("sorteo-abrir");
  const cerrarBtn = document.getElementById("sorteo-cerrar");
  const elegirBtn = document.getElementById("sorteo-elegir");

  // Si la sección aún no existe, no ejecutar el sorteo
  if (
    !palabraInput || !cantidadInput || !estado ||
    !contador || !lista || !ganadoresBox ||
    !mensaje || !abrirBtn || !cerrarBtn || !elegirBtn
  ) return;

  let abierto = false;
  let palabra = "!tirri";
  let participantes = [];

  function mostrarEstado(texto) {
    estado.innerHTML = '<span class="status-dot"></span> ' + texto;
  }

  function actualizarContador() {
    contador.innerHTML =
      'PARTICIPANTES: <strong>' + participantes.length + '</strong>';
  }

  function mostrarParticipantes() {
    lista.innerHTML = "<h3>PARTICIPANTES</h3>";

    if (participantes.length === 0) {
      lista.innerHTML += "<p>Aún no hay participantes.</p>";
      return;
    }

    const ul = document.createElement("ul");

    participantes.forEach((nombre) => {
      const li = document.createElement("li");
      li.textContent = nombre;
      ul.appendChild(li);
    });

    lista.appendChild(ul);
  }

  function agregarParticipante(nombre) {
    nombre = nombre.trim().replace(/^@/, "");

    if (!nombre || !abierto) return;

    const repetido = participantes.some(
      (p) => p.toLowerCase() === nombre.toLowerCase()
    );

    if (repetido) {
      mensaje.textContent = "Ese usuario ya está participando.";
      return;
    }

    participantes.push(nombre);
    actualizarContador();
    mostrarParticipantes();
    mensaje.textContent = "Participante agregado en modo de prueba.";
  }

  abrirBtn.addEventListener("click", () => {
    const nuevaPalabra = palabraInput.value.trim();
    const cantidad = Number(cantidadInput.value);

    if (!nuevaPalabra) {
      mensaje.textContent = "Escribe una palabra para el sorteo.";
      palabraInput.focus();
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 100) {
      mensaje.textContent = "Elige entre 1 y 100 ganadores.";
      cantidadInput.focus();
      return;
    }

    palabra = nuevaPalabra;
    abierto = true;

    mostrarEstado("SORTEO ABIERTO · " + palabra);
    mensaje.textContent =
      "Sorteo abierto en modo de prueba. Toca el contador para agregar participantes.";
    ganadoresBox.innerHTML =
      "<h3>🏆 GANADORES</h3><p>Esperando el sorteo...</p>";
  });

  cerrarBtn.addEventListener("click", () => {
    abierto = false;
    mostrarEstado("SORTEO CERRADO");
    mensaje.textContent = "Sorteo cerrado. Ya no se aceptan participantes de prueba.";
  });

  // En modo de prueba, toca el contador para ingresar un usuario
  contador.style.cursor = "pointer";
  contador.title = "Toca para agregar un participante de prueba";

  contador.addEventListener("click", () => {
    if (!abierto) {
      mensaje.textContent = "Primero abre el sorteo.";
      return;
    }

    const nombre = prompt("Nombre del participante de prueba:");

    if (nombre !== null) {
      agregarParticipante(nombre);
    }
  });

  elegirBtn.addEventListener("click", () => {
    if (abierto) {
      mensaje.textContent = "Cierra el sorteo antes de elegir ganadores.";
      return;
    }

    if (participantes.length === 0) {
      mensaje.textContent = "Todavía no hay participantes.";
      return;
    }

    const cantidad = Number(cantidadInput.value);

    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 100) {
      mensaje.textContent = "Elige entre 1 y 100 ganadores.";
      return;
    }

    if (cantidad > participantes.length) {
      mensaje.textContent =
        "Hay menos participantes que ganadores solicitados.";
      return;
    }

    // Sorteo aleatorio sin repetir ganadores
    const disponibles = [...participantes];
    const ganadores = [];

    while (ganadores.length < cantidad) {
      const indice = Math.floor(Math.random() * disponibles.length);
      ganadores.push(disponibles.splice(indice, 1)[0]);
    }

    ganadoresBox.innerHTML = "<h3>🏆 GANADORES</h3>";

    const ul = document.createElement("ul");

    ganadores.forEach((nombre, i) => {
      const li = document.createElement("li");
      li.textContent = (i + 1) + ". " + nombre;
      ul.appendChild(li);
    });

    ganadoresBox.appendChild(ul);
    mensaje.textContent = "¡Sorteo realizado!";
  });

  actualizarContador();
  mostrarParticipantes();
  mostrarEstado("SORTEO CERRADO");
});
