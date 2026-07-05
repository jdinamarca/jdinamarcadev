# AGENTS.md

Guía para que cualquier agente (humano o IA) trabaje en este proyecto sin
romper convenciones. Léela antes de editar.

## 0. Estado actual (leer primero)

Antes de cualquier tarea, lee **`docs/SESION.md`**: es la fuente de verdad de
en qué quedó la última sesión (qué se hizo, qué está a medias, qué sigue y las
decisiones clave). `docs/BACKLOG.md` es el backlog priorizado de más largo
alcance; `DECISIONS.md`, el historial de decisiones arquitectónicas. Si
`docs/SESION.md` no existe o está claramente desactualizado, no lo inventes:
dilo y propón actualizarlo (puedes usar `/fin` al cerrar la tarea).
Si sospechas que `SESION.md` está desactualizado o vas a retomar una tarea a
medias (p. ej., cierre abrupto sin `/fin`), verifica el estado real con
`git status --short` y `git log --oneline -5` antes de asumirlo.

## 1. Qué es esto

Sitio personal **portafolio + blog** de J. Dinamarca (arquitecto de software senior).
Stack: **Astro 7 + Tailwind v4 (via `@tailwindcss/vite`) + MDX + Fontsource**.
Contenido en MDX dentro de `src/content/` (sin CMS). Deploy estático pensado para
Vercel/Netlify.

## 2. Dirección de diseño (NO cambiar sin consenso)

**Dirección B — "Estructural / Blueprint"**: brutalismo suizo-técnico.
- La **grilla modular visible** es protagonista (no decorado).
- Tipografía neo-grotesque (**Geist**) + monoespaciada técnica (**JetBrains Mono**).
- Acento de **señal naranja** (`#FF5C00`) sobre tinta casi negra y concreto.
- Detalles memorables: **grilla reactiva al cursor**, **readout de coordenadas**
  (esquina inferior derecha), y **reglas que se "dibujan" al hacer scroll**.

## 3. Comandos

```bash
npm run dev      # servidor de desarrollo (http://localhost:4321)
npm run build    # astro check (tipos) + astro build  -> dist/
npm run preview  # sirve el build
npm run gen-og   # regenera public/og-default.png desde el SVG fuente
npm run astro    # acceso directo al CLI de Astro
```

- `build` corre `astro check`: debe quedar en **0 errores**.
- Para añadir dependencias, mantener `overrides.yaml = "^2.8.3"` para evitar el
  mismatch de `yaml` que arrastra Astro 7 (ver D-08/D-09). **No fijar Vite**: el
  override legacy `overrides.vite` quedó obsoleto tras la migración Astro 5→7.

## 4. Estructura

```
src/
├─ consts.ts                 # config del sitio, navegación, datos de autor
├─ content.config.ts         # schemas de collections (blog, projects)
├─ styles/global.css         # Tailwind v4 + tokens (@theme) + utilidades
├─ components/               # BaseHead, Header, Footer, CoordReadout,
│                            # SectionHeading, ProjectCard, FormattedDate
├─ layouts/
│  ├─ BaseLayout.astro       # <html>, header, footer, observer de reveal
│  └─ BlogPost.astro         # plantilla de post
├─ content/
│  ├─ blog/*.mdx             # entradas del blog
│  └─ projects/*.mdx         # casos de estudio
└─ pages/
   ├─ index.astro            # home
   ├─ sobre-mi.astro
   ├─ contacto.astro
   ├─ 404.astro
   ├─ rss.xml.ts
   ├─ blog/index.astro + [...slug].astro
   └─ proyectos/index.astro + [slug].astro
```

## 5. Sistema de diseño (tokens en `src/styles/global.css`)

Los tokens viven en el bloque `@theme` y generan utilidades de Tailwind
(`bg-concrete`, `text-ink`, `text-signal`, `font-mono`, etc.).

- **Color:** `concrete` (fondo), `paper` (superficie), `ink` (texto),
  `ink-soft`/`ink-faint` (secundario), `signal`/`signal-deep` (acento),
  `line` (reglas), `grid` (guías).
- **Tipografía fluida:** `--text-micro … --text-display` (clamp). Usar las
  utilidades/variables, **no tamaños sueltos en px**.
- **Tracking:** `--tracking-tight/-snug/-mono/-label`.
- **Radios:** cuasi nulos (brutalista): `--radius-xs: 2px`, `--radius-sm: 4px`.
- **Medida de lectura:** `--measure: 68ch` (envolver prosa).

Clases utilitarias a reusar: `.shell` (contenedor 12-col), `.label` (mono
mayúsculas), `.lead`, `.rule`, `.btn-signal`, `.btn-ghost`, `.plate`,
`.blueprint-grid`, `.reveal`, `.draw-rule`, `.focus-corners`, `.underline-signal`,
`.text-outline`, `.prose-blueprint`.

## 6. Convenciones de código

- **Sin comentarios** salvo que se pidan explícitamente.
- Componentes Astro: `interface Props` + destructuración de `Astro.props`.
- Estilos **scoped por componente** (`<style>`); tokens y utilidades globales en
  `global.css`. No duplicar valores hex sueltos: usar variables CSS.
- JS del cliente: **mínimo**, vanilla en `<script>` dentro del componente. Siempre
  tras `prefers-reduced-motion` (ver §7).
- TypeScript estricto; el alias `@/*` -> `src/*`.

## 7. Accesibilidad (obligatorio)

- **`prefers-reduced-motion: reduce`** debe desactivar toda animación/transición.
  Las clases `.reveal` y `.draw-rule` ya lo resuelven en CSS; cualquier nuevo
  efecto de JS debe comprobar `matchMedia("(prefers-reduced-motion: reduce)")`.
- **Foco visible**: se hereda del `:focus-visible` global (outline `signal`).
  No quitar `outline`.
- **Contraste AA mínimo**. `ink-faint` solo para metadatos pequeños no esenciales.
- El `CoordReadout` es `aria-hidden` (decorativo). Mantener skip-link y
  `aria-current` en navegación.
- Imágenes: `alt` descriptivo o `alt=""` si es decorativa.

## 8. Autoría de contenido

### Blog (`src/content/blog/*.mdx`)
Frontmatter requerido por `content.config.ts`:
`title, description, pubDate`. Opcionales: `updatedDate, tags[], draft,
heroImage, heroAlt, readingTime`. Los `draft: true` se excluyen en build.
Slug = nombre del archivo. Los posts se renderizan con `BlogPost.astro`.

### Proyectos (`src/content/projects/*.mdx`)
Frontmatter: `title, summary, year` (+ `order` para orden, `featured` para
destacar en home, `cover`, `stack[]`, `disciplines[]`, `client`, `role`,
`liveUrl`, `repoUrl`). El cuerpo MDX es el case study (Contexto → Decisión →
Resultado es el patrón recomendado).

### Imágenes de portada
Hoy son **SVG placeholder** en `/public/images/covers/` referenciados por path
(string). Para producción, migrar a `astro:assets` `<Image>` con imágenes
raster optimizadas: cambiar el schema a `image()` y usar `<Image>` en
`ProjectCard`/plantilla de proyecto.

## 9. Deploy

- Salida **estática** (`dist/`). Funciona en Vercel o Netlify sin config extra.
- `site` en `astro.config.mjs` define canonical/RSS/sitemap: actualizar al
  dominio real antes de deployar.
- Sin variables de entorno secretas en el repo.

## 10. Notas de estado

- Build verde: `astro check` 0 errores; 11 rutas generadas.
- El formulario de contacto usa `mailto:` como fallback sin backend. Para un
  envío real, conectar un endpoint (p. ej. Formspree/Resend) en `contacto.astro`.
- `og-default.png` se genera desde `public/og-default.svg` con `npm run gen-og`
  (usa `sharp`); regenerarlo tras cambiar el SVG.

## 11. Tooling de opencode (`.opencode/`)

El proyecto incluye automatizaciones de opencode. **No hay índice
autogenerado**: los propios archivos son la fuente de verdad. Cambios en estos
archivos requieren **reiniciar opencode** para tomar efecto.

| Tipo      | Dónde                                   | Se activa                          |
| --------- | --------------------------------------- | ---------------------------------- |
| Comando   | `.opencode/command/<nombre>.md`         | Al escribir `/<nombre>`            |
| Agente    | `.opencode/agent/<nombre>.md`           | Invocado por el agente principal   |
| Skill     | `.opencode/skills/<nombre>/SKILL.md`    | Solo, según el contexto de la tarea|
| Config    | `.opencode/opencode.json`               | Al arrancar opencode               |

### Comandos disponibles

- **`/audit`** (`command/audit.md`): diagnóstico de solo lectura (agente
  `explore`). Lee esta spec + `DECISIONS.md`, escanea `src/` y devuelve un
  backlog priorizado (P0–P3) de lo que falta construir/corregir. Úsalo para
  descubrir gaps antes de planear trabajo.
- **`/fin`** (`command/fin.md`): actualiza `docs/SESION.md` al cerrar una tarea
  o sesión, dejando un traspaso claro (qué se hizo, qué queda, dónde quedó todo)
  para que la próxima sesión arranque al día.

### Convención para añadir nuevos

- Un archivo por comando/agente/skill, en su carpeta correspondiente.
- Frontmatter obligatorio: `description` (y `agent`/`mode` según el tipo).
- Al crear uno nuevo, **regístralo en esta sección** para que quede visible.

