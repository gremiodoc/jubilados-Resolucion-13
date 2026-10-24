/* ==========================================================================
   Listado de Jubilados — Resolución N.º 013 · Agosto 2026
   Consulta local por cédula de identidad.
   No requiere servidor, base de datos ni conexión a Internet.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ Datos */

  var DATA = window.JUBILADOS || {};

  var TYPES = {
    D: { name: "Docente", letter: "D", className: "docente" },
    A: { name: "Administrativo", letter: "A", className: "administrativo" },
    O: { name: "Obrero", letter: "O", className: "obrero" }
  };

  var CODES = ["D", "A", "O"];

  /* Índice: hash de 64 bits -> tipo de personal */
  var INDEX = new Map();

  CODES.forEach(function (code) {
    var list = Array.isArray(DATA[code]) ? DATA[code] : [];
    list.forEach(function (hash) {
      if (typeof hash === "string" && hash.length === 16) {
        INDEX.set(hash, code);
      }
    });
  });

  /* ------------------------------------------------------------------ Iconos */

  var ICONS = {
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M20 6.6 9.7 17 4.5 11.8"></path></svg>',
    cross:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M6 6l12 12M18 6 6 18"></path></svg>',
    search:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4.5 4.5"></path></svg>'
  };

  /* ------------------------------------------------------------------ Elementos */

  var form = document.getElementById("consulta-form");
  var input = document.getElementById("cedula");
  var inputWrap = document.getElementById("input-wrap");
  var errorBox = document.getElementById("cedula-error");
  var submitButton = document.getElementById("btn-consultar");
  var resultBox = document.getElementById("resultado");
  var consultaSection = document.getElementById("consulta");

  if (!form || !input || !resultBox) {
    return;
  }

  var mainContext = {
    form: form,
    input: input,
    wrap: inputWrap,
    error: errorBox
  };

  /* ------------------------------------------------------------------ Utilidades */

  function onlyDigits(value) {
    return String(value == null ? "" : value).replace(/[^0-9]/g, "");
  }

  function formatCedula(digits) {
    return String(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function pad8(number) {
    return ("00000000" + (number >>> 0).toString(16)).slice(-8);
  }

  /**
   * Huella determinista de 64 bits (dos variantes FNV-1a).
   * Debe coincidir exactamente con la función usada para generar data.js.
   */
  function hashCedula(digits) {
    var h1 = 0x811c9dc5;
    var h2 = 0x9747b28c;

    for (var i = 0; i < digits.length; i += 1) {
      var c = digits.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
      h2 = Math.imul(h2 ^ c, 0x5bd1e995) >>> 0;
      h2 = (h2 ^ (h2 >>> 15)) >>> 0;
    }

    h1 = (h1 ^ (h1 >>> 16)) >>> 0;
    h1 = Math.imul(h1, 0x85ebca6b) >>> 0;
    h1 = (h1 ^ (h1 >>> 13)) >>> 0;

    h2 = (h2 ^ (h2 >>> 13)) >>> 0;
    h2 = Math.imul(h2, 0xc2b2ae35) >>> 0;
    h2 = (h2 ^ (h2 >>> 16)) >>> 0;

    return pad8(h1) + pad8(h2);
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function scrollToElement(element) {
    if (!element || typeof element.scrollIntoView !== "function") {
      return;
    }
    element.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start"
    });
  }

  function focusWithoutScroll(element) {
    if (!element) {
      return;
    }
    try {
      element.focus({ preventScroll: true });
    } catch (error) {
      element.focus();
    }
  }

  /* ------------------------------------------------------------------ Validación */

  function validate(digits) {
    if (!digits) {
      return "Escribe tu cédula de identidad para continuar.";
    }
    if (digits.length < 5) {
      return "La cédula debe tener al menos 5 dígitos. Ejemplo: 12.345.678";
    }
    if (digits.length > 9) {
      return "La cédula no puede tener más de 9 dígitos. Ejemplo: 12.345.678";
    }
    return "";
  }

  function clearError(context) {
    if (context.error) {
      context.error.textContent = "";
      context.error.hidden = true;
    }
    if (context.wrap) {
      context.wrap.classList.remove("is-invalid");
    }
    if (context.input) {
      context.input.removeAttribute("aria-invalid");
    }
  }

  function showError(context, message) {
    if (context.error) {
      context.error.textContent = message;
      context.error.hidden = false;
    }
    if (context.wrap) {
      context.wrap.classList.add("is-invalid");
    }
    if (context.input) {
      context.input.setAttribute("aria-invalid", "true");
      focusWithoutScroll(context.input);
    }
  }

  /* ------------------------------------------------------------------ Render: encontrado */

  function renderFound(digits, code) {
    var type = TYPES[code];
    var cedula = "V-" + formatCedula(digits);

    var html =
      '<section class="result result--' + type.className + '" data-letter="' + type.letter + '" ' +
      'role="group" aria-label="Resultado de la consulta">' +
        '<div class="result__top">' +
          '<span class="result__check">' + ICONS.check + "</span>" +
          '<p class="result__kicker">Registro encontrado</p>' +
        "</div>" +
        '<h2 class="result__title" id="result-title" tabindex="-1">FELICIDADES USTED ESTÁ JUBILADO</h2>' +
        '<p class="result__subtitle">La cédula consultada aparece en el Listado de Jubilados de la Resolución N.º 013.</p>' +
        '<dl class="result__details">' +
          '<div class="detail">' +
            "<dt>Tipo de Personal</dt>" +
            '<dd><span class="detail__type"><span class="type-letter" aria-hidden="true">' + type.letter + "</span>" +
            "<span>" + type.name + " (" + type.letter + ")</span></span></dd>" +
          "</div>" +
          '<div class="detail">' +
            "<dt>Cédula de Identidad</dt>" +
            "<dd>" + cedula + "</dd>" +
          "</div>" +
          '<div class="detail">' +
            "<dt>Estatus</dt>" +
            "<dd>Jubilado</dd>" +
          "</div>" +
        "</dl>" +
        '<div class="result__actions">' +
          '<a class="btn btn--light" href="https://www.sistemaspnp.com/cedula/" target="_blank" rel="noopener noreferrer" ' +
            'title="Abre el sitio externo Sistema PNP en una pestaña nueva">' +
            ICONS.search + "<span>Consultar nombre en sitio externo</span>" +
          "</a>" +
          '<button class="btn btn--light" id="btn-otra" type="button">' +
            ICONS.search + "<span>Realizar otra consulta</span>" +
          "</button>" +
        "</div>" +
      "</section>";

    resultBox.innerHTML = html;

    var againButton = document.getElementById("btn-otra");
    if (againButton) {
      againButton.addEventListener("click", resetConsultation);
    }

    var heading = resultBox.querySelector(".result__title");
    focusWithoutScroll(heading);
    window.requestAnimationFrame(function () {
      scrollToElement(resultBox);
    });
  }

  /* ------------------------------------------------------------------ Render: no encontrado */

  function renderNotFound(digits) {
    var cedula = "V-" + formatCedula(digits);

    var html =
      '<section class="result result--negative" role="group" aria-label="Resultado de la consulta">' +
        '<div class="neg-mark" aria-hidden="true">' + ICONS.cross + "</div>" +
        '<p class="result__kicker result__kicker--negative">Consulta finalizada</p>' +
        '<h2 class="result__title result__title--negative" id="result-title" tabindex="-1">Usted no aparece en la lista</h2>' +
        '<p class="result__text">La cédula <strong>' + cedula + "</strong> no se encuentra registrada en El Listado Jubilados.</p>" +
        '<div class="retry">' +
          '<h3 class="retry__title">Consultar otra cédula</h3>' +
          '<form class="retry__form" id="retry-form" novalidate autocomplete="off">' +
            '<div class="consulta__row">' +
              '<div class="input-wrap" id="retry-wrap">' +
                '<span class="input-prefix" aria-hidden="true">V-</span>' +
                '<input class="input-cedula" id="retry-cedula" name="retry-cedula" type="text" ' +
                  'inputmode="numeric" enterkeyhint="search" autocomplete="off" autocapitalize="off" ' +
                  'spellcheck="false" maxlength="16" placeholder="12.345.678" ' +
                  'aria-label="Cédula de Identidad" aria-required="true" required ' +
                  'aria-describedby="retry-hint retry-error">' +
              "</div>" +
              '<button class="btn btn--primary" type="submit">' +
                ICONS.search + "<span>Consultar</span>" +
              "</button>" +
            "</div>" +
            '<p class="hint" id="retry-hint">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5.5M12 7.6v.1"></path></svg>' +
              "<span>Puedes escribir con puntos (12.345.678) o sin ellos (12345678)</span>" +
            "</p>" +
            '<p class="error" id="retry-error" role="alert" aria-live="assertive" hidden></p>' +
          "</form>" +
        "</div>" +
      "</section>";

    resultBox.innerHTML = html;

    var retryForm = document.getElementById("retry-form");
    var retryInput = document.getElementById("retry-cedula");
    var retryWrap = document.getElementById("retry-wrap");
    var retryError = document.getElementById("retry-error");

    var retryContext = {
      form: retryForm,
      input: retryInput,
      wrap: retryWrap,
      error: retryError
    };

    if (retryForm && retryInput) {
      retryInput.addEventListener("input", function () {
        cleanInput(retryInput);
        clearError(retryContext);
      });

      retryInput.addEventListener("blur", function () {
        formatInput(retryInput);
      });

      retryForm.addEventListener("submit", function (event) {
        event.preventDefault();
        runQuery(retryContext);
      });
    }

    var heading = resultBox.querySelector(".result__title");
    focusWithoutScroll(heading);
    window.requestAnimationFrame(function () {
      scrollToElement(resultBox);
    });
  }

  /* ------------------------------------------------------------------ Consulta */

  function runQuery(context) {
    if (!INDEX.size) {
      showError(
        context,
        "No se pudo cargar la nómina de jubilados. Recarga la página e inténtalo nuevamente."
      );
      return;
    }

    clearError(context);

    var digits = onlyDigits(context.input.value);
    var problem = validate(digits);

    if (problem) {
      showError(context, problem);
      return;
    }

    // Oculta el teclado móvil antes de mostrar el resultado.
    if (typeof context.input.blur === "function") {
      context.input.blur();
    }

    context.input.value = formatCedula(digits);

    // Mantiene sincronizado el formulario principal cuando se consulta
    // desde el cuadro secundario del resultado negativo.
    if (context.input !== input) {
      input.value = formatCedula(digits);
      clearError(mainContext);
    }

    var code = INDEX.get(hashCedula(digits));

    if (code && TYPES[code]) {
      renderFound(digits, code);
    } else {
      renderNotFound(digits);
    }
  }

  function resetConsultation() {
    resultBox.innerHTML = "";
    input.value = "";
    clearError(mainContext);
    focusWithoutScroll(input);
    scrollToElement(consultaSection);
  }

  function cleanInput(target) {
    var cleaned = target.value.replace(/[^0-9.\s-]/g, "");
    if (cleaned !== target.value) {
      target.value = cleaned;
    }
  }

  function formatInput(target) {
    var digits = onlyDigits(target.value);
    if (digits.length >= 5 && digits.length <= 9) {
      target.value = formatCedula(digits);
    }
  }

  /* ------------------------------------------------------------------ Eventos principales */

  input.addEventListener("input", function () {
    cleanInput(input);
    clearError(mainContext);
  });

  input.addEventListener("blur", function () {
    formatInput(input);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    runQuery(mainContext);
  });

  /* ------------------------------------------------------------------ Estado inicial */

  if (!INDEX.size) {
    input.disabled = true;
    if (submitButton) {
      submitButton.disabled = true;
    }
    showError(
      mainContext,
      "No se pudo cargar la nómina de jubilados. Verifica que el archivo data.js esté junto a la página."
    );
  }
})();
