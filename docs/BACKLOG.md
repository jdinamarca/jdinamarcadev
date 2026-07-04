# Backlog

Estado auditado el 2026-07-02 contra `AGENTS.md`, `DECISIONS.md` y `CHANGELOG.md`.
Prioridades: **P1** (bloqueante / rompe convención o accesibilidad), **P2** (importante
para producción), **P3** (nice-to-have / deuda técnica menor).

---

## 🔥 En progreso
- (nada activo)

---

## 📋 Por hacer

### P1 — Alta prioridad
- (nada pendiente)

### P2 — Media
- [ ] **[Perf/a11y] Migrar portadas SVG placeholder → `astro:assets <Image>`.** Hoy son
      SVG por path (D-06); se pierde optimización y `alt` estructurado. Cambiar el schema
      a `image()` en `content.config.ts` y usar `<Image>` en `ProjectCard` y
      `proyectos/[slug].astro`.
- [ ] **[Deploy] Confirmar identidad y dominio reales.** `site: https://jdinamarca.dev`,
      `email: hola@jdinamarca.dev` y datos de autor parecen placeholders. Verificar antes
      de deployar: RSS, canonical y sitemap dependen de `site`.

### P3 — Baja / deuda técnica
- [ ] **[UX] Tagbar de `/blog` no filtra.** Las etiquetas son `<span>` decorativas
      (`blog/index.astro`): parecen clicables pero no enlazan. Convertirlas en links a
      `/blog/tag/:tag` (con su ruta) o quitar la apariencia interactiva.
- [ ] **[Testing] No hay tests ni runner.** Sin script `test` ni archivos `*.test.ts`.
      Añadir mínimo: `readingTime` (`blog/[...slug].astro`), `FormattedDate` y validación
      de frontmatter de collections.
- [ ] **[Perf menor] `CoordReadout` registra listeners en móvil** pese a estar
      `display:none` bajo 768px. Guardar el registro de `mousemove`/`scroll` tras el mismo
      `matchMedia`.
- [ ] **[Contenido] `readingTime` puede inflarse** porque cuenta markup/código de MDX
      (`post.body.split(/\s+/)`). Considerar texto plano para el conteo.
- [ ] **[UX] Animar el formulario de contacto (micro-interacciones blueprint).** Hoy los
      inputs y el botón son estáticos. Añadir vida sin romper el brutalismo: label que
      "flota"/sube al enfocar, línea de `signal` que se dibuja bajo el campo activo,
      estado de envío con pulso/scan, y confirmación de éxito animada (check que se
      "dibuja"). Todo tras `prefers-reduced-motion` (mostrar estado final estático).

---

## 🐛 Bugs conocidos
- (nada activo)

---

## 🔒 Seguridad
- `npm audit`: **0 vulnerabilidades** (verificado 2026-07-02).
- Sin secrets/variables en el repo. Sin acciones pendientes.

---

## 🎨 UX/UI
- [ ] Tagbar de `/blog` no funcional (ver P3).
- [ ] Revisar contraste del `border-color` de foco de inputs una vez restaurado el outline.
- [ ] Animar el formulario de contacto (ver P3): micro-interacciones blueprint.

---

## ✅ Completado (verificado en esta auditoría)
- [x] **[Feature] Backend del formulario de contacto (Resend).** Serverless function
      `api/contact.ts` (SDK `resend`, `reply_to` al visitante, honeypot, validación)
      registrada en Vercel vía `vercel.json`; `contacto.astro` envía por `fetch` con
      fallback `mailto:` en errores 5xx/red. Env var `RESEND_API_KEY` (Vercel) +
      dominio verificado en Resend. Resuelve D-07.
- [x] **[Docs] `AGENTS.md` sincronizado con el stack real.** §1 Astro 5→7; §3 nota de
      override `overrides.yaml ^2.8.3` (no fijar Vite) + `npm run gen-og`; §10 describe
      la generación del OG.
- [x] **[SEO/Social] `og-default.png` creado.** SVG fuente (`public/og-default.svg`) +
      raster 1200×630 generado vía `sharp` (`scripts/gen-og.mjs`, `npm run gen-og`).
      Estética blueprint: grilla, marco, esquineros de foco `signal` y tipografía
      Geist/JetBrains Mono. `BaseHead.astro` ya lo referenciaba.
- [x] **[Bug a11y] Outline de foco restaurado en inputs de contacto.** Cambiado
      `:focus` → `:focus-visible` y eliminado `outline: none` en `contacto.astro`,
      para que vuelva a aplicar el outline `signal` global (AGENTS.md §7).
- [x] Build verde: `astro check` 0 errores · 11 rutas · `npm audit` 0.
- [x] Stack: Astro 7 + Tailwind v4 (`@tailwindcss/vite`) + MDX + Fontsource (D-02, D-09).
- [x] Sistema de diseño "Estructural / Blueprint" + tokens en `@theme` (D-01/D-03/D-04).
- [x] `BaseLayout` + `Header` (con `aria-current` y menú móvil accesible) + `Footer` +
      `CoordReadout` (`aria-hidden`).
- [x] Páginas: `/`, `/proyectos` (+ `[slug]`), `/blog` (+ `[...slug]`), `/sobre-mi`,
      `/contacto`, `/404`, `/rss.xml`, `sitemap-index.xml`.
- [x] Content collections con schemas Zod (`blog`, `projects`).
- [x] Detalles memorables detrás de `prefers-reduced-motion`: grilla reactiva, readout,
      reglas en scroll, contador animado (D-05).
- [x] Skip-link y foco visible global `:focus-visible` (`signal`).
- [x] Migración de seguridad Astro 5→7 + `overrides.yaml ^2.8.3` (D-08/D-09).
- [x] Contenido de ejemplo: 3 case studies + 2 posts + 5 covers SVG; los 3 proyectos
      marcados `featured` (el home los renderiza correctamente).
