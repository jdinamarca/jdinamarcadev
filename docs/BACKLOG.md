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
- [ ] **[SEO/Social] `og-default.png` inexistente.** `BaseHead.astro` referencia
      `/og-default.png` pero no está en `/public`. Los shares Open Graph/Twitter caen sin
      imagen. Añadir asset 1200×630 con la estética blueprint (ya anotado en AGENTS.md §10
      y CHANGELOG "Por hacer").
- [ ] **[Docs] Deriva entre `AGENTS.md` y el stack real.** §2/§3 dicen "Astro 5" y
      "mantener `overrides.vite = "6.4.3"`", pero el proyecto ya es **Astro 7.0.5** con
      `overrides.yaml ^2.8.3` (ver D-08/D-09 y CHANGELOG 0.1.1). Actualizar §2, §3 y §10
      para que ningún agente vuelva a fijar Vite.

### P2 — Media
- [ ] **[Feature] Backend del formulario de contacto.** Hoy es fallback `mailto:`
      (D-07). Conectar un endpoint real (Formspree/Resend) en `contacto.astro`.
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

---

## ✅ Completado (verificado en esta auditoría)
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
