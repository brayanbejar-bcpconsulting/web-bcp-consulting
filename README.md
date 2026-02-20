Aquí lo tienes en **formato Markdown listo para copiar y pegar** en tu `README.md`:

---

```md
# 📘 BCP Consulting — Arquitectura del Proyecto
Astro 5 + Tailwind v4 + MDX + SEO 2026 Ready

---

## 🏗 Stack Tecnológico

- **Framework:** Astro 5 (Static Output)
- **Estilos:** Tailwind CSS v4 (CSS-first con `@theme`)
- **Contenido:** MDX + Content Collections
- **SEO:** Sitemap segmentado + metadata dinámica
- **Tipado:** TypeScript estricto

---

# 📂 Estructura General (`src/`)

```

src/
├── assets/
├── components/
├── content/
├── layouts/
├── pages/
└── styles/

```

Cada carpeta tiene una responsabilidad clara.  
No mezclar responsabilidades.

---

# 📁 1️⃣ assets/

Recursos estáticos internos del proyecto.

```

assets/
├── icons/
└── images/

```

Uso:
- Imágenes
- SVGs
- Recursos visuales

⚠ Las fuentes van en `/public/fonts`, no aquí.

---

# 📁 2️⃣ components/

Componentes reutilizables del sistema.

```

components/
├── sections/
├── shared/
└── ui/

```

---

## 🔹 components/shared/

Componentes globales reutilizados en layouts:

- `BaseHead.astro` → SEO dinámico
- `Header.astro`
- `Footer.astro`
- `NavMobile.astro`

No deben contener lógica específica de páginas.

---

## 🔹 components/ui/

Componentes base del design system:

- `Button.astro`
- `HeadingSection.astro`
- `MainContainer.astro`

Deben ser:
- Reutilizables
- Desacoplados
- Atómicos o semiatómicos

---

## 🔹 components/sections/

Secciones completas de páginas.

Ejemplo futuro:
- `HeroSection.astro`
- `ServicesSection.astro`
- `CTASection.astro`

Son bloques estructurales.

---

# 📁 3️⃣ content/

Sistema editorial gestionado con Content Collections.

```

content/
│   config.ts
└── blog/
├── ejemplo.mdx
├── guias/
├── noticias/
└── ranking/

```

---

## 🔹 config.ts

Define el schema obligatorio para blog:

- `title`
- `description`
- `date`
- `type`
- `draft`
- `tags`

Si un post no cumple el schema → rompe el build.

Esto es intencional para mantener consistencia.

---

## 🔹 content/blog/

Contiene todo el contenido editorial.

Subcarpetas:

- `/guias`
- `/noticias`
- `/ranking`

Estas carpetas forman parte del slug.

Ejemplo:

```

content/blog/guias/ejemplo.mdx

```

Se renderiza como:

```

/blog/guias/ejemplo

```

Esto mejora la arquitectura SEO.

---

# 📁 4️⃣ layouts/

Layouts estructurales.

```

layouts/
├── BlogPostLayout.astro
└── MainLayout.astro

```

---

## 🔹 BlogPostLayout

- Encapsula estructura del post
- Usa `.prose`
- Maneja metadata SEO

---

## 🔹 MainLayout

Layout general del sitio:
- Header
- Footer
- Estructura base

---

# 📁 5️⃣ pages/

Sistema de rutas de Astro.

```

pages/
├── index.astro
├── sitemap.xml.ts
├── sitemap-pages-[page].xml.ts
├── sitemap-blog-[page].xml.ts
└── blog/
├── index.astro
└── [...slug].astro

```

---

## 🔹 index.astro

Home del sitio.

---

## 🔹 blog/index.astro

Listado del blog con paginación.

- Filtra drafts
- Ordena por fecha
- Soporta query `?page=`

---

## 🔹 blog/[...slug].astro

Renderiza posts anidados.

Permite rutas como:

```

/blog/noticias/post
/blog/guias/post
/blog/ranking/post

```

---

## 🔹 sitemap.xml.ts

Índice principal de sitemaps.

---

## 🔹 sitemap-pages-[page].xml.ts

Sitemap paginado de páginas estáticas.

---

## 🔹 sitemap-blog-[page].xml.ts

Sitemap paginado de artículos del blog.

Divide automáticamente cada 100 URLs.

---

# 📁 6️⃣ styles/

```

styles/
└── global.css

```

Contiene:

- Tailwind v4
- Tokens OKLCH
- Tipografía
- Prose customization
- Design system base

No crear múltiples archivos CSS innecesarios.

---

# 🧠 Flujo Correcto para Crear un Nuevo Post

1. Ir a:
```

src/content/blog/<categoria>/

````
2. Crear archivo `.mdx`
3. Incluir frontmatter obligatorio:

```mdx
---
title: ""
description: ""
date: 2026-01-01
type: "guias"
draft: false
---
````

4. Guardar.
5. Astro lo detecta automáticamente.

---

# 🚀 Reglas del Proyecto

✔ No crear rutas manuales dentro de pages para blog
✔ No romper el schema de content
✔ No usar client-side innecesario
✔ Mantener componentes desacoplados
✔ Respetar separación de carpetas

---

# 🧱 Arquitectura SEO

* URLs jerárquicas
* Slugs limpios
* Sitemap segmentado
* Metadata dinámica
* BaseHead centralizado
* Preparado para JSON-LD

---

# 📈 Escalabilidad

La estructura permite:

* Miles de posts
* Nuevas categorías
* Sidebar filtrable
* Internal linking automático
* Landing pages específicas
* Arquitectura programática

---

# 🎯 Resumen Mental del Proyecto

| Carpeta    | Responsabilidad     |
| ---------- | ------------------- |
| assets     | Recursos visuales   |
| components | UI y secciones      |
| content    | Contenido editorial |
| layouts    | Estructura base     |
| pages      | Rutas               |
| styles     | Sistema visual      |

---

# 🔥 Próximo Paso Estratégico

* Crear rutas `/blog/noticias`
* Crear rutas `/blog/guias`
* Crear rutas `/blog/ranking`
* Implementar sidebar filtrable
* Agregar JSON-LD automático
* Implementar breadcrumbs estructurados

```
```
