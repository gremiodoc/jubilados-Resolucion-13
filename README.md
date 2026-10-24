# Listado de Jubilados — Resolución 13 · Agosto 2026

Sitio web estático para consultar si una cédula de identidad aparece en el **Listado de Jubilados de la Resolución N.º 013** del Ministerio del Poder Popular para la Educación.

![Vista previa del sitio](preview.png)

Incluye:

- Cintillo institucional con los logos del **MPPE** (izquierda) y **GD** (derecha).
- Cintillo azul: **“Listado de jubilados Resolución 13 Agosto 2026”**.
- Consulta por cédula con o sin puntos: `12.345.678` o `12345678`.
- Resultado afirmativo con color según el tipo de personal:
  - **D — Docente:** azul.
  - **A — Administrativo:** verde oscuro.
  - **O — Obrero:** naranja.
- Resultado negativo con una **X**, el mensaje correspondiente y un cuadro para realizar otra consulta.
- En resultados positivos, un enlace opcional abre la consulta de nombre de Sistema PNP en otra pestaña. La cédula no se comparte automáticamente.
- Diseño adaptable a teléfonos, tabletas y computadoras.
- Sin servidor, sin base de datos externa, sin dependencias, sin publicidad y sin conexiones a terceros.

**Base incluida (versión 3 actualizada):** 1.700 registros (1.592 docentes, 27 administrativos y 81 obreros), tomados del archivo `jubilados nueva 13.xlsx`.

---

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser público o privado; para GitHub Pages gratuito normalmente debe ser público).
2. Descomprime el ZIP en tu computadora.
3. Sube **el contenido** de la carpeta al repositorio, no el ZIP:
   - `index.html`
   - `assets/`
   - `README.md`
   - `robots.txt`
   - `.nojekyll`
4. En el repositorio entra a **Settings → Pages**.
5. En **Build and deployment**, selecciona **Deploy from a branch**.
6. Elige la rama **main** y la carpeta **/ (root)**. Guarda.
7. Espera uno o dos minutos. La dirección será similar a:

   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`

También funciona en Netlify, Vercel, Cloudflare Pages o cualquier servidor de archivos estáticos. No requiere compilación.

> **Importante:** si el repositorio se llama, por ejemplo, `jubilados`, la página quedará en `https://TU-USUARIO.github.io/jubilados/`. Todas las rutas del sitio son relativas, así que funcionan correctamente en esa subcarpeta.

---

## Estructura

```text
.
├── index.html
├── preview.png
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── img/
│   │   ├── apple-touch-icon.png
│   │   ├── favicon.png
│   │   ├── logo-gd.png
│   │   └── logo-mppe.png
│   └── js/
│       ├── app.js
│       └── data.js
├── herramientas/
│   └── generar_datos.py
├── robots.txt
├── .nojekyll
└── README.md
```

---

## Privacidad

- El sitio **no tiene backend**: la consulta se resuelve completamente en el navegador.
- `data.js` **no contiene cédulas en texto plano**. Guarda huellas de 64 bits agrupadas por tipo de personal.
- Aun así, un sitio estático puede ser consultado de forma automatizada. No debe utilizarse para publicar información que deba permanecer confidencial.
- La página incluye `noindex, nofollow` y `robots.txt` para reducir la indexación en buscadores, pero esto **no es un mecanismo de seguridad**.
- No se recopilan datos de los visitantes ni se envían consultas a ningún servidor.

---

## Actualizar la lista

El archivo `assets/js/data.js` se generó con `herramientas/generar_datos.py`. Para actualizarlo:

1. Instala Python 3 y `openpyxl`:
   ```bash
   pip install openpyxl
   ```
2. Ejecuta, desde la raíz del proyecto:
   ```bash
   python herramientas/generar_datos.py --xlsx "jubilados nueva 13.xlsx" --out assets/js/data.js --version 3
   ```
3. El script detecta automáticamente la hoja **Listado Completo** y las columnas de cédula y categoría. También valida los registros, evita cédulas duplicadas, comprueba que no haya colisiones y vuelve a escribir `data.js`.
4. Sube el nuevo `data.js` al repositorio.
5. Si reemplazas archivos en un repositorio ya publicado, aumenta el número de versión de la referencia a `data.js` dentro de `index.html` para evitar que los navegadores usen una copia antigua en caché.

El algoritmo de huella está documentado en el propio script y en `app.js`. Si se cambia el algoritmo, hay que regenerar `data.js` y actualizar `hashCedula()` en `app.js`.

---

## Créditos

- Logos institucionales: Ministerio del Poder Popular para la Educación (MPPE) y Gremio Docente (GD) Venezuela.
- Fuente de datos: `jubilados nueva 13.xlsx`, consolidado general de personal jubilado.
- Desarrollo: sitio estático HTML, CSS y JavaScript sin frameworks.

Uso informativo e institucional.
