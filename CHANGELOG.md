# Changelog

Registro de cambios del sitio personal (portafolio + blog) de J. Dinamarca.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).

## [0.1.0] - 2026-07-01

### Añadido
- **Scaffolding del proyecto**: Astro 5 + Tailwind v4 (`@tailwindcss/vite`) +
  MDX + Fontsource (Geist, JetBrains Mono). TypeScript estricto, alias `@/*`.
- **Sistema de diseño "Estructural / Blueprint"** (`src/styles/global.css`):
  - Tokens en `@theme`: color (`concrete`, `paper`, `ink`, `signal`…),
    escala tipográfica fluida (`clamp`), tracking, radios cuasi nulos.
  - Utilidades: `.shell`, `.label`, `.lead`, `.btn-signal`, `.btn-ghost`,
    `.plate`, `.blueprint-grid`, `.reveal`, `.draw-rule`, `.focus-corners`,
    `.underline-signal`, `.text-outline`, `.prose-blueprint`.
- **Layout base + componentes** (`src/layouts`, `src/components`):
  - `BaseLayout` con skip-link, `Header` (status-bar con `aria-current` y menú
    móvil accesible), `Footer`, `CoordReadout` (HUD de coordenadas, `aria-hidden`),
    `SectionHeading`, `ProjectCard`, `FormattedDate`, `BlogPost`.
- **Páginas (11 rutas)**:
  - `/` Home: hero con tipografía cinética, grilla reactiva al cursor, hoja de
    especificaciones con contador animado, proyectos destacados, posts recientes, CTA.
  - `/proyectos` + `/proyectos/[slug]`: índice + case studies con ficha técnica.
  - `/blog` + `/blog/[...slug]`: índice + posts MDX.
  - `/sobre-mi`, `/contacto` (formulario con fallback `mailto:`), `/404`, `/rss.xml`.
  - `sitemap-index.xml` automático.
- **Content collections** (`src/content.config.ts`): schemas de `blog` y `projects`.
- **Contenido de ejemplo**: 3 case studies + 2 entradas de blog, y 5 portadas
  SVG placeholder estilo lámina de plano.
- **Accesibilidad**: `prefers-reduced-motion` desactiva animaciones; foco visible
  con outline `signal`; contraste AA; `CoordReadout` decorativo.
- **`AGENTS.md`**: convenciones, comandos, estructura, notas de estado.

### Configuración
- `astro.config.mjs`: `site`, MDX, sitemap, Tailwind vía Vite, shiki `github-dark-dimmed`.
- `package.json`: `overrides.vite = "6.4.3"` para resolver el mismatch de tipos
  entre Astro y `@tailwindcss/vite`.
- `npm run build` = `astro check` (0 errores) + `astro build`.

### Por hacer
- `og-default.png` para Open Graph.
- Migrar portadas SVG → `astro:assets <Image>` (imágenes raster optimizadas).
- Conectar el formulario de contacto a un backend (Formspree/Resend).
- Ajustar `site` y datos de autor (`src/consts.ts`) al dominio/identidad reales.
