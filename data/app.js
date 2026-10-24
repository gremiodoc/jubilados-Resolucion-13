/**
 * Listado de Jubilados - Resolución 13 Agosto 2026
 * Ministerio del Poder Popular para la Educación
 * Lógica de Consulta y Control de Pantallas
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const formPrincipal = document.getElementById('form-consulta-principal');
  const inputPrincipal = document.getElementById('input-cedula-principal');
  const btnConsultarPrincipal = document.getElementById('btn-consultar-principal');

  const contenedorBusqueda = document.getElementById('search-container');
  const contenedorAfirmativo = document.getElementById('resultado-afirmativo');
  const contenedorNegativo = document.getElementById('resultado-negativo');

  const formSecundario = document.getElementById('form-consulta-secundario');
  const inputSecundario = document.getElementById('input-cedula-secundario');
  const btnConsultarSecundario = document.getElementById('btn-consultar-secundario');

  const btnOtraConsulta = document.getElementById('btn-otra-consulta');
  const btnImprimir = document.getElementById('btn-imprimir');

  // Campos de resultado afirmativo
  const badgeTipoPersonal = document.getElementById('badge-tipo-personal');
  const valorCedulaAfirmativo = document.getElementById('valor-cedula-afirmativo');
  const valorNumeroGeneral = document.getElementById('valor-numero-general');
  const valorCategoriaAfirmativo = document.getElementById('valor-categoria-afirmativo');

  // Campos de resultado negativo
  const cedulaNoEncontradaSpan = document.getElementById('cedula-no-encontrada');

  // Formateador de Cédula con puntos (ej: 12.345.678)
  function formatearCedulaConPuntos(numero) {
    if (!numero) return '';
    const str = numero.toString().replace(/\D/g, '');
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Quitar clases de tema de pantalla
  function limpiarTemasDePantalla() {
    document.body.classList.remove('pantalla-azul', 'pantalla-verde-oscuro', 'pantalla-naranja');
  }

  // Función Principal de Consulta
  function realizarConsulta(valorInput) {
    if (!valorInput) {
      alert('Por favor, escribe un número de cédula de identidad para realizar la consulta.');
      return;
    }

    // Extraer solo dígitos numéricos para búsqueda exacta
    const digitos = valorInput.toString().replace(/\D/g, '');

    if (!digitos || digitos.length < 4) {
      alert('La cédula ingresada debe contener al menos 4 dígitos.');
      return;
    }

    // Buscar en la base de datos
    const registro = window.JUBILADOS_DATA ? window.JUBILADOS_DATA[digitos] : null;

    if (registro) {
      // ====================================================================
      // CASO AFIRMATIVO
      // ====================================================================
      limpiarTemasDePantalla();

      // Aplicar color de pantalla según el renglón:
      // Docentes: Pantalla Azul
      // Administrativos: Pantalla Verde Oscuro
      // Obreros: Naranja
      if (registro.tipo === 'D') {
        document.body.classList.add('pantalla-azul');
        badgeTipoPersonal.className = 'tipo-personal-badge badge-docente';
        badgeTipoPersonal.innerHTML = '🎓 TIPO: Docente (D)';
      } else if (registro.tipo === 'A') {
        document.body.classList.add('pantalla-verde-oscuro');
        badgeTipoPersonal.className = 'tipo-personal-badge badge-administrativo';
        badgeTipoPersonal.innerHTML = '🏢 TIPO: Administrativo (A)';
      } else if (registro.tipo === 'O') {
        document.body.classList.add('pantalla-naranja');
        badgeTipoPersonal.className = 'tipo-personal-badge badge-obrero';
        badgeTipoPersonal.innerHTML = '🛠️ TIPO: Obrero (O)';
      }

      // Cargar datos en la tarjeta
      valorCedulaAfirmativo.textContent = registro.cedula;
      valorNumeroGeneral.textContent = `N° ${registro.num}`;
      valorCategoriaAfirmativo.textContent = registro.categoria;

      // Mostrar contenedor afirmativo y ocultar los demás
      contenedorBusqueda.style.display = 'none';
      contenedorNegativo.classList.remove('visible');
      contenedorAfirmativo.classList.add('visible');

      // Lanzar confeti celebratorio
      lanzarConfeti();

      // Scroll suave hacia el resultado
      window.scrollTo({ top: 180, behavior: 'smooth' });

    } else {
      // ====================================================================
      // CASO NEGATIVO
      // ====================================================================
      limpiarTemasDePantalla();

      // Formatear la cédula consultada con prefijo V- y puntos
      const cedulaFormateada = `V-${formatearCedulaConPuntos(digitos)}`;
      cedulaNoEncontradaSpan.textContent = cedulaFormateada;

      // Mostrar contenedor negativo
      contenedorBusqueda.style.display = 'none';
      contenedorAfirmativo.classList.remove('visible');
      contenedorNegativo.classList.add('visible');

      // Limpiar y enfocar el input del segundo cuadro para nueva consulta
      if (inputSecundario) {
        inputSecundario.value = '';
        setTimeout(() => inputSecundario.focus(), 250);
      }

      // Scroll suave hacia el resultado negativo
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  }

  // Restablecer al cuadro inicial
  function volverAEstadoInicial() {
    limpiarTemasDePantalla();
    contenedorAfirmativo.classList.remove('visible');
    contenedorNegativo.classList.remove('visible');
    contenedorBusqueda.style.display = 'block';
    inputPrincipal.value = '';
    inputPrincipal.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Event Listeners para Formulario Principal
  if (formPrincipal) {
    formPrincipal.addEventListener('submit', (e) => {
      e.preventDefault();
      realizarConsulta(inputPrincipal.value);
    });
  }

  if (btnConsultarPrincipal) {
    btnConsultarPrincipal.addEventListener('click', (e) => {
      e.preventDefault();
      realizarConsulta(inputPrincipal.value);
    });
  }

  // Event Listeners para Formulario Secundario (Dentro del caso Negativo)
  if (formSecundario) {
    formSecundario.addEventListener('submit', (e) => {
      e.preventDefault();
      realizarConsulta(inputSecundario.value);
    });
  }

  if (btnConsultarSecundario) {
    btnConsultarSecundario.addEventListener('click', (e) => {
      e.preventDefault();
      realizarConsulta(inputSecundario.value);
    });
  }

  // Botón "Hacer otra consulta" en afirmativo
  if (btnOtraConsulta) {
    btnOtraConsulta.addEventListener('click', () => {
      volverAEstadoInicial();
    });
  }

  // Botón de imprimir / guardar comprobante
  if (btnImprimir) {
    btnImprimir.addEventListener('click', () => {
      window.print();
    });
  }

  // Chips de ejemplos rápidos para probar fácilmente
  document.querySelectorAll('.format-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const ejemplo = chip.getAttribute('data-ejemplo');
      if (contenedorBusqueda.style.display !== 'none') {
        inputPrincipal.value = ejemplo;
        realizarConsulta(ejemplo);
      } else if (contenedorNegativo.classList.contains('visible')) {
        inputSecundario.value = ejemplo;
        realizarConsulta(ejemplo);
      }
    });
  });

  // Enfocar input al cargar la página
  if (inputPrincipal) {
    inputPrincipal.focus();
  }
});

// ==========================================================================
// ANIMACIÓN DE CONFETI LIVIANA (100% Nativa HTML5 Canvas sin librerías externas)
// ==========================================================================
function lanzarConfeti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const piezas = [];
  const cantidad = 90;
  const colores = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#ffffff', '#f43f5e'];

  for (let i = 0; i < cantidad; i++) {
    piezas.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      tamano: Math.random() * 8 + 6,
      color: colores[Math.floor(Math.random() * colores.length)],
      velocidadY: Math.random() * 4 + 2,
      velocidadX: Math.random() * 3 - 1.5,
      rotacion: Math.random() * 360,
      velocidadRotacion: Math.random() * 8 - 4
    });
  }

  let animId;
  let fotogramas = 0;

  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let piezasActivas = 0;

    piezas.forEach(p => {
      p.y += p.velocidadY;
      p.x += p.velocidadX;
      p.rotacion += p.velocidadRotacion;

      if (p.y < canvas.height + 20) {
        piezasActivas++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotacion * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.tamano / 2, -p.tamano / 2, p.tamano, p.tamano * 0.6);
        ctx.restore();
      }
    });

    fotogramas++;
    if (piezasActivas > 0 && fotogramas < 260) {
      animId = requestAnimationFrame(animar);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animId);
    }
  }

  animar();
}
