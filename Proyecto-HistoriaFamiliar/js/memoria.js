// js/index.js
// Código único, robusto y seguro para index + otras páginas.
// Coloca este archivo en js/index.js y asegúrate de que index.html lo cargue con defer.

document.addEventListener('DOMContentLoaded', () => {
  console.log('index.js cargado — DOM listo');

  // ---- FORMULARIO DE RECUERDOS (solo en memoria.html) ----
  const form = document.getElementById('recuerdoForm');
  const input = document.getElementById('recuerdoInput');
  const lista = document.getElementById('recuerdosLista');

  if (form && input && lista) {
    console.log('Inicializando sección de recuerdos (LocalStorage).');
    const recuerdos = JSON.parse(localStorage.getItem('recuerdos')) || [];
    recuerdos.forEach(r => agregarRecuerdo(r));

    form.addEventListener('submit', e => {
      e.preventDefault();
      const texto = input.value.trim();
      if (texto) {
        recuerdos.push(texto);
        localStorage.setItem('recuerdos', JSON.stringify(recuerdos));
        agregarRecuerdo(texto);
        input.value = '';
      }
    });

    function agregarRecuerdo(texto) {
      const li = document.createElement('li');
      li.textContent = texto;
      lista.appendChild(li);
    }
  }

  // ---- BOTÓN "COMENZAR RECORRIDO" (index.html) ----
  const btnRecorrido = document.getElementById('btnRecorrido');
  const indiceSection = document.getElementById('indice-general');

  if (btnRecorrido) {
    btnRecorrido.addEventListener('click', ev => {
      ev.preventDefault();
      console.log('btnRecorrido clickeado');
      if (indiceSection) {
        indiceSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.log(
          'Sección indice-general no encontrada — redirigiendo a index.html#indice-general'
        );
        window.location.href = 'index.html#indice-general';
      }
    });
  }

  // ---- BOTÓN REVELAR FRASE (index.html) ----
  const btnFrase = document.getElementById('mostrarFrase');
  const fraseBlock = document.getElementById('fraseBonifacio');

  if (btnFrase) {
    btnFrase.addEventListener('click', ev => {
      ev.preventDefault();
      console.log('mostrarFrase clickeado');
      if (!fraseBlock) return;

      if (fraseBlock.classList.contains('visible')) return;
      fraseBlock.classList.remove('oculto');
      fraseBlock.classList.add('visible');

      const fullText = fraseBlock.textContent.trim();
      fraseBlock.textContent = '';
      let i = 0;
      const speed = 30;
      const timer = setInterval(() => {
        if (typeof fullText[i] === 'undefined') {
          clearInterval(timer);
          return;
        }
        fraseBlock.textContent += fullText[i];
        i++;
        if (i >= fullText.length) clearInterval(timer);
      }, speed);
    });
  }

  // ---- DESTACAR ENLACE ACTIVO EN NAVBAR ----
  try {
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length) {
      const current = window.location.pathname.split('/').pop() || 'index.html';
      navLinks.forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        if (
          href === current ||
          (href.endsWith('#indice-general') &&
            current === 'index.html' &&
            window.location.hash === '#indice-general')
        ) {
          a.classList.add('active-nav');
        } else {
          a.classList.remove('active-nav');
        }
      });
    }
  } catch (e) {
    console.warn('Error al intentar resaltar nav link:', e);
  }

  // ---- DESPLEGAR DETALLES DE EVENTOS EN LÍNEA DE TIEMPO VERTICAL ----
  const botones = document.querySelectorAll('.btn-vermas');
  if (botones.length) {
    botones.forEach(boton => {
      boton.addEventListener('click', () => {
        const evento = boton.closest('.evento');
        evento.classList.toggle('activo');
        boton.textContent = evento.classList.contains('activo') ? 'Ver menos' : 'Ver más';
      });
    });
  }

  // ---- NUEVA FUNCIÓN: LÍNEA DE TIEMPO HORIZONTAL INTERACTIVA ----
  const timeline = document.getElementById('timeline');
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');

  if (timeline && next && prev) {
    console.log('Inicializando línea de tiempo horizontal interactiva.');

    const scrollStep = 320; // ancho aprox. de cada evento + margen

    next.addEventListener('click', () => {
      timeline.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });

    prev.addEventListener('click', () => {
      timeline.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });

    // Efecto visual: resalta el evento más centrado al hacer scroll
    let scrollTimer;
    timeline.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const eventos = timeline.querySelectorAll('.timeline-event');
        let minDist = Infinity;
        let activo = null;
        const center = timeline.scrollLeft + timeline.clientWidth / 2;

        eventos.forEach(evento => {
          const rect = evento.getBoundingClientRect();
          const dist = Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2);
          if (dist < minDist) {
            minDist = dist;
            activo = evento;
          }
        });

        eventos.forEach(e => e.classList.remove('activo-timeline'));
        if (activo) activo.classList.add('activo-timeline');
      }, 100);
    });
  } else {
    console.log('No se detectó línea de tiempo horizontal en esta página.');
  }
  const btnBorrar = document.getElementById('borrarRecuerdos');
  if (btnBorrar) {
    btnBorrar.addEventListener('click', () => {
      localStorage.removeItem('recuerdos');
      const lista = document.getElementById('recuerdosLista');
      if (lista) lista.innerHTML = ''; // limpia la lista visualmente
      alert('✅ Todos los recuerdos han sido borrados.');
    });
  }
});
