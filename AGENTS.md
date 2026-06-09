# AGENTS.md — Guía para Agentes de IA

Este archivo describe la arquitectura del proyecto **Dangel & Damián Store** para que cualquier agente de IA (Antigravity, Copilot, Cursor, etc.) pueda entender, modificar y extender el proyecto de forma coherente.

---

## 🧭 Propósito del Proyecto

Landing page **informativa y de alto impacto visual** para el negocio Dangel & Damián Store (Venezuela). **No es una tienda con carrito de compras**. Su función es:

1. Presentar la marca con elegancia y sofisticación
2. Mostrar las categorías de productos (sábanas, perfumes, moda)
3. Exhibir las mejores marcas del mercado venezolano 2026
4. Dirigir al visitante a contactar por **WhatsApp**

---

## 📁 Arquitectura de Archivos

```
dangel-damian-store/
├── index.html      # Única página — toda la UI está aquí
├── style.css       # Sistema de diseño completo (tokens + componentes)
├── script.js       # Lógica de interacción (sin frameworks)
├── logo.jpg        # Logo oficial — no reemplazar sin aprobación
├── images/         # Recursos visuales adicionales
├── README.md       # Documentación de usuario
└── AGENTS.md       # Este archivo
```

> ⚠️ **No hay framework (React, Vue, etc.)**. Es HTML + CSS + JS puro. No añadir bundlers ni dependencias npm sin aprobación explícita.

---

## 🎨 Sistema de Diseño (Design Tokens)

Todos los valores de diseño están en **variables CSS** al inicio de `style.css`. **Siempre usar los tokens**, nunca valores crudos.

```css
/* Colores principales */
--navy-deep:   #080e1c   /* Fondo más oscuro */
--navy:        #0d1526   /* Fondo principal */
--navy-mid:    #111d35
--navy-light:  #1a2a4a
--gold:        #c9a84c   /* Acento principal */
--gold-light:  #e0c06a
--gold-dark:   #a07830
--gold-dim:    rgba(201,168,76,0.15)
--gold-glow:   rgba(201,168,76,0.3)
--cream:       #f5efe0   /* Texto principal */
--cream-dim:   #d4c9af   /* Texto secundario */
--text-light:  rgba(245,239,224,0.75)

/* Tipografía */
--font-serif:  'Cormorant Garamond', Georgia, serif   /* Títulos */
--font-sans:   'Montserrat', Arial, sans-serif         /* Cuerpo */

/* Utilitarios */
--radius:      12px
--radius-lg:   20px
--transition:  0.35s cubic-bezier(0.4,0,0.2,1)
--shadow-gold: 0 8px 40px rgba(201,168,76,0.2)
--shadow-card: 0 20px 60px rgba(0,0,0,0.4)
```

---

## 🧩 Estructura HTML — Secciones

La página sigue este orden de secciones:

| Selector / ID      | Componente                | Clase principal          |
|--------------------|---------------------------|--------------------------|
| `nav.navbar`       | Barra de navegación fija  | `.navbar`                |
| `section#hero`     | Hero principal            | `.hero`                  |
| `div.ornamental-divider` | Separador decorativo | `.ornamental-divider`   |
| `section#nosotros` | Quiénes somos             | `.about`                 |
| `section#categorias` | Categorías de productos | `.categories`            |
| `section#marcas`   | Mejores marcas 2026       | `.brands`                |
| `section.promise-strip` | Franja de promesas   | `.promise-strip`         |
| `section#contacto` | Contacto                  | `.contact`               |
| `footer.footer`    | Pie de página             | `.footer`                |
| `a.float-wa`       | Botón flotante WhatsApp   | `.float-wa`              |
| `button.scroll-top`| Botón volver arriba       | `.scroll-top`            |

---

## 🔗 WhatsApp — Número y Links

El número de contacto es: **+58 424-3752134**  
Formato URL WhatsApp: `https://wa.me/584243752134`

Los IDs únicos de cada botón de WhatsApp son:

| ID del elemento        | Ubicación                        |
|------------------------|----------------------------------|
| `#nav-whatsapp`        | Navbar (botón "Escríbenos")      |
| `#hero-whatsapp`       | Hero (botón "Consultar Ahora")   |
| `#cta-sabanas`         | Card Sábanas                     |
| `#cta-perfumes`        | Card Perfumes                    |
| `#cta-moda`            | Card Moda                        |
| `#contact-whatsapp-btn`| Sección Contacto                 |
| `#float-whatsapp`      | Botón flotante                   |

> Si el número de WhatsApp cambia, actualizar **todos** los `href` que contengan `wa.me/58...`.

---

## ⚙️ JavaScript — Funcionalidades

Toda la lógica está en `script.js`. Sin dependencias externas.

| Funcionalidad             | Descripción                                                    |
|---------------------------|----------------------------------------------------------------|
| **Navbar scroll**         | Agrega `.scrolled` al `nav` cuando `scrollY > 60`             |
| **Menú móvil**            | Toggle de clase `.open` en `.mobile-menu` via `#hamburger`    |
| **Scroll to top**         | Botón `#scrollTop` aparece con `.visible` al scroll > 400px   |
| **Reveal on scroll**      | `IntersectionObserver` agrega `.visible` a elementos `.reveal` |
| **Brands tabs**           | Botones `.tab-btn` con `data-tab` controlan paneles `#panel-*`|
| **Parallax hero**         | `heroContent` se desplaza al hacer scroll en el hero          |
| **Active link highlight** | Links del nav se colorean según la sección visible            |
| **Cursor glow cards**     | Mouse move en `.cat-card` y `.brand-card` registra `--mx/--my`|

---

## 📐 Patrones de Componentes

### Botón Primario (Dorado)
```html
<a href="..." class="btn-gold">Texto del botón</a>
<!-- Variante grande -->
<a href="..." class="btn-gold btn-large">Texto</a>
```

### Botón Secundario (Contorno)
```html
<a href="..." class="btn-outline">Texto del botón</a>
```

### Sección Header (Etiqueta + Título)
```html
<div class="section-header">
  <span class="section-tag">Etiqueta pequeña</span>
  <h2 class="section-title">Título principal</h2>
  <p class="section-desc">Descripción opcional</p>
</div>
```

### Tarjeta de Categoría
```html
<div class="cat-card" id="cat-[nombre]">
  <div class="cat-glow"></div>
  <div class="cat-icon-wrap"><!-- SVG --></div>
  <h3>Nombre</h3>
  <p>Descripción</p>
  <div class="cat-tags"><span>Tag1</span></div>
  <a href="https://wa.me/..." class="cat-cta" id="cta-[nombre]">Consultar →</a>
</div>
```

### Tarjeta de Marca
```html
<div class="brand-card">
  <div class="brand-initial">L</div><!-- Primera letra -->
  <div class="brand-info">
    <strong>Nombre Marca</strong>
    <span>Descripción corta</span>
    <div class="brand-stars">★★★★★</div>
  </div>
</div>
```

---

## 🚫 Restricciones Importantes

1. **No eliminar el logo** (`logo.jpg`) — es el asset de identidad principal
2. **No cambiar la paleta de colores** sin aprobación — es la identidad visual del negocio
3. **No convertir a SPA/framework** sin requerimiento explícito del usuario
4. **No añadir animaciones excesivas** que afecten la legibilidad o el rendimiento
5. **No reemplazar las fuentes Google Fonts** (Cormorant Garamond + Montserrat)
6. **Mantener todos los IDs únicos** en elementos interactivos (requerimiento de accesibilidad y testing)

---

## ✅ Checklist al Hacer Cambios

- [ ] ¿Usé tokens CSS (`--gold`, `--navy`, etc.) en lugar de valores crudos?
- [ ] ¿Verifiqué que el diseño sigue siendo responsivo en mobile?
- [ ] ¿Los nuevos botones de WhatsApp apuntan al número correcto?
- [ ] ¿Los nuevos elementos interactivos tienen `id` únicos?
- [ ] ¿El HTML mantiene la jerarquía semántica (`h1` → `h2` → `h3`)?
- [ ] ¿Las animaciones tienen `transition` o `animation` definidos en CSS?
- [ ] ¿El texto nuevo usa `--font-serif` para títulos y `--font-sans` para cuerpo?

---

## 🌐 Despliegue

El proyecto está publicado en GitHub:  
**Repo**: `icompsoluciones-dev/dangel-damian-store`  
**Rama principal**: `main`

Para desplegar en **GitHub Pages**:
1. Settings → Pages → Source: `main` → `/ (root)`
2. La URL será: `https://icompsoluciones-dev.github.io/dangel-damian-store/`

---

*Última actualización: Junio 2026 · Generado por Antigravity AI*
