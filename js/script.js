/* =====================================================
   PORTAFOLIO MARTA CARO
   ===================================================== */

/* =====================================================
   1. CARRUSEL INFINITO
   ===================================================== */

const cards = document.querySelectorAll(".card");

const indicators = document.querySelectorAll(".indicator");

const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");

const navButtons = document.querySelectorAll("[data-slide]");

let currentIndex = 2;

const totalCards = cards.length;

/* -----------------------------------------------------
   Actualizar carrusel
   ----------------------------------------------------- */

function updateCarousel() {
  cards.forEach((card, index) => {
    card.classList.remove("active", "left", "right", "far-left", "far-right");

    let difference = index - currentIndex;

    /*
     * HACEMOS EL CARRUSEL CIRCULAR
     */

    if (difference > totalCards / 2) {
      difference -= totalCards;
    }

    if (difference < -totalCards / 2) {
      difference += totalCards;
    }

    if (difference === 0) {
      card.classList.add("active");
    } else if (difference === -1) {
      card.classList.add("left");
    } else if (difference === 1) {
      card.classList.add("right");
    } else if (difference < -1) {
      card.classList.add("far-left");
    } else {
      card.classList.add("far-right");
    }
  });

  /*
   * Indicadores
   */

  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentIndex);
  });
}

/* =====================================================
   SIGUIENTE
   ===================================================== */

function nextSlide() {
  currentIndex++;

  /*
   * AQUÍ ESTÁ LA CLAVE DEL CARRUSEL INFINITO
   */

  if (currentIndex >= totalCards) {
    currentIndex = 0;
  }

  updateCarousel();
}

/* =====================================================
   ANTERIOR
   ===================================================== */

function previousSlide() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = totalCards - 1;
  }

  updateCarousel();
}

nextBtn.addEventListener("click", nextSlide);

prevBtn.addEventListener("click", previousSlide);

/* =====================================================
   NAVEGACIÓN SUPERIOR
   ===================================================== */

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = parseInt(button.dataset.slide);

    currentIndex = target;

    updateCarousel();
  });
});

/* =====================================================
   TECLADO
   ===================================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextSlide();
  }

  if (event.key === "ArrowLeft") {
    previousSlide();
  }
});

/* =====================================================
   SWIPE PARA CELULAR
   ===================================================== */

let touchStartX = 0;

let touchEndX = 0;

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;

  handleSwipe();
});

function handleSwipe() {
  const difference = touchStartX - touchEndX;

  if (Math.abs(difference) < 50) {
    return;
  }

  if (difference > 0) {
    nextSlide();
  } else {
    previousSlide();
  }
}

/* =====================================================
   INICIALIZAR
   ===================================================== */

updateCarousel();

/* =====================================================
   2. PUNTILLISMO DE LA FOTO
   ===================================================== */

const canvas = document.getElementById("portraitCanvas");

const ctx = canvas.getContext("2d");

const image = document.getElementById("sourcePhoto");

/*
 * CONFIGURACIÓN DEL PUNTILLISMO
 */

const settings = {
  /*
   * Menor = más puntos
   *
   * 3 = muy detallado
   * 4 = recomendado
   * 5 = menos puntos
   */

  gap: 4,

  /*
   * Tamaño máximo de cada punto
   */

  maxRadius: 2.5,

  /*
   * Color adicional para darle
   * apariencia tecnológica
   */

  neon: true,
};

/* =====================================================
   CUANDO LA FOTO CARGUE
   ===================================================== */

image.addEventListener("load", () => {
  createPortrait();
});

/*
 * También intentamos cargarla
 * por si ya estaba cargada.
 */

if (image.complete) {
  createPortrait();
}

/* =====================================================
   CREAR PUNTILLISMO
   ===================================================== */

function createPortrait() {
  const container = document.querySelector(".portrait-container");

  const width = container.clientWidth;

  const height = container.clientHeight;

  canvas.width = width;

  canvas.height = height;

  /*
   * Canvas temporal
   */

  const tempCanvas = document.createElement("canvas");

  const tempCtx = tempCanvas.getContext("2d");

  /*
   * Mantener proporción
   */

  const imageRatio = image.naturalWidth / image.naturalHeight;

  const canvasRatio = width / height;

  let drawWidth;

  let drawHeight;

  let offsetX;

  let offsetY;

  if (imageRatio > canvasRatio) {
    drawHeight = height;

    drawWidth = height * imageRatio;

    offsetX = (width - drawWidth) / 2;

    offsetY = 0;
  } else {
    drawWidth = width;

    drawHeight = width / imageRatio;

    offsetX = 0;

    offsetY = (height - drawHeight) / 2;
  }

  tempCanvas.width = width;

  tempCanvas.height = height;

  /*
   * Fondo transparente
   */

  tempCtx.clearRect(0, 0, width, height);

  /*
   * Dibujar foto temporal
   */

  tempCtx.drawImage(
    image,

    offsetX,
    offsetY,

    drawWidth,
    drawHeight,
  );

  /*
   * Obtener píxeles
   */

  const pixels = tempCtx.getImageData(0, 0, width, height).data;

  /*
   * Limpiar canvas final
   */

  ctx.clearRect(0, 0, width, height);

  /*
   * Dibujar cada punto
   */

  for (let y = 0; y < height; y += settings.gap) {
    for (let x = 0; x < width; x += settings.gap) {
      const index = (y * width + x) * 4;

      const red = pixels[index];

      const green = pixels[index + 1];

      const blue = pixels[index + 2];

      const alpha = pixels[index + 3];

      /*
       * Si no existe píxel
       */

      if (alpha < 30) {
        continue;
      }

      /*
       * Luminosidad
       */

      const brightness = (red + green + blue) / 3;

      /*
       * No dibujar zonas
       * completamente oscuras
       */

      if (brightness < 18) {
        continue;
      }

      /*
       * Tamaño del punto
       *
       * Las zonas claras
       * tienen puntos más grandes.
       */

      const radius = (brightness / 255) * settings.maxRadius;

      /*
       * Color original
       */

      let r = red;

      let g = green;

      let b = blue;

      /*
       * Mezclar con colores
       * tecnológicos
       */

      if (settings.neon) {
        /*
         * Azul/cian
         */

        r = Math.floor(red * 0.25);

        g = Math.floor(green * 0.65 + 120);

        b = Math.floor(blue * 0.75 + 80);

        /*
         * Evitar valores > 255
         */

        r = Math.min(255, r);

        g = Math.min(255, g);

        b = Math.min(255, b);
      }

      /*
       * Dibujar punto
       */

      ctx.beginPath();

      ctx.arc(x, y, radius, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(${r},${g},${b},0.88)`;

      ctx.fill();
    }
  }

  /*
   * Añadir pequeños puntos
   * de color morado/cian
   */

  addNeonParticles(width, height);
}

/* =====================================================
   PARTÍCULAS NEÓN
   ===================================================== */

function addNeonParticles(width, height) {
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * width;

    const y = Math.random() * height;

    const radius = Math.random() * 1.5;

    /*
     * Solo algunos puntos
     * decorativos
     */

    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    const usePurple = Math.random() > 0.65;

    if (usePurple) {
      ctx.fillStyle = "rgba(170,90,255,0.65)";
    } else {
      ctx.fillStyle = "rgba(0,220,255,0.65)";
    }

    ctx.fill();
  }
}

/* =====================================================
   REDIMENSIONAR VENTANA
   ===================================================== */

window.addEventListener("resize", () => {
  createPortrait();
});

/* =====================================================
   3. ANIMACIÓN DE PUNTOS
   ===================================================== */

let animationFrame;

function animatePortrait() {
  /*
   * Por ahora regeneramos
   * algunos puntos de forma suave.
   *
   * Esto evita que el efecto
   * consuma demasiado.
   */

  animationFrame = requestAnimationFrame(animatePortrait);
}

animatePortrait();

/* =====================================================
   4. MÁS PROYECTOS
   ===================================================== */

const moreProjects = document.getElementById("moreProjects");

const projectsModal = document.getElementById("projectsModal");

const closeModal = document.getElementById("closeModal");

moreProjects.addEventListener("click", () => {
  projectsModal.classList.add("show");
});

closeModal.addEventListener("click", () => {
  projectsModal.classList.remove("show");
});

/*
 * Cerrar haciendo clic fuera
 */

projectsModal.addEventListener("click", (event) => {
  if (event.target === projectsModal) {
    projectsModal.classList.remove("show");
  }
});
