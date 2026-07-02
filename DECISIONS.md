# Decisiones (ADR-light)

Registro de las decisiones de diseño y arquitectura clave del proyecto, con su
contexto y justificación. Estilo ADR liviano (no dogmático).

---

## D-01 — Dirección de arte: "Estructural / Blueprint"

**Decisión:** Adoptar un lenguaje visual suizo-brutalista técnico, con la grilla
modular visible como protagonista.

**Contexto:** Se pidieron 3 direcciones de arte para un sitio portafolio + blog de
un arquitecto de software. Las opciones eran: (A) Archivista editorial,
(B) Estructural/Blueprint, (C) Dev-nativo/Consola.

**Justificación:** La metáfora de "arquitecto" encaja con mostrar la estructura
con honestidad. Refuerza la marca de rigor técnico e investigación, y ofrece
detalles memorables intencionales (grilla reactiva, readout de coordenadas,
reglas que se dibujan en scroll) sin caer en lo decorativo.

---

## D-02 — Stack: Astro + Tailwind v4 + MDX (sin CMS)

**Decisión:** Astro estático con contenido MDX en `src/content/`, Tailwind v4 vía
`@tailwindcss/vite`, sin librerías de UI ni CMS externo.

**Justificación:** Rendimiento (HTML estático, JS mínimo), autoría en el repo
(versionado, sin vendor lock-in) y control total del sistema de diseño.
Tailwind v4 da tokens-first vía `@theme` sin capa de runtime.

---

## D-03 — Tipografía: Geist + JetBrains Mono

**Decisión:** Geist (neo-grotesque) para display/UI; JetBrains Mono para
metadatos, coordenadas y etiquetas técnicas.

**Justificación:** Geist es una neo-grotesque moderna y con carácter, sin caer en
el genérico Inter. La mono técnica refuerza la estética de plano/CAD y diferencia
los datos del contenido. Ambas se sirven vía Fontsource (self-hosted, sin
red externa, privacy-friendly y rápidas).

---

## D-04 — Acento de señal naranja `#FF5C00`

**Decisión:** Un único acento de color: naranja de seguridad, sobre tinta casi
negra (`#0E0E0E`) y concreto gris (`#E8E8E6`).

**Justificación:** El naranja de señal evoca marcaje técnico y alertas
(atención intencional, no decorativa). Limitar la paleta a un solo acento
refuerza la disciplina brutalista y mantiene el contraste AA.

---

## D-05 — Detalles memorables, todos detrás de `prefers-reduced-motion`

**Decisión:** Tres gestos distintivos: (1) resplandor reactivo al cursor en el
hero, (2) `CoordReadout` con X/Y + scroll %, (3) reglas que se "dibujan" en scroll.

**Justificación:** Cada gesto refuerza la metáfora de plano/lámina técnica
(intencionalidad, no ornamento). Todos se desactivan con
`prefers-reduced-motion: reduce`; el `CoordReadout` es `aria-hidden` por ser
decorativo, y el foco visible se preserva.

---

## D-06 — Portadas como SVG placeholder (no `astro:assets`)

**Decisión:** Las portadas son SVG estáticos en `/public/images/covers/`
referenciados por path (string), en lugar de `image()` + `<Image>`.

**Contexto:** Fase de scaffolding sin assets raster disponibles.

**Justificación:** Garantiza un build verde sin binarios pesados y permite
previsualizar de inmediato.
**Trade-off / deuda:** se pierde optimización de imágenes.
**Revertir:** cambiar el schema a `image()` en `content.config.ts` y usar
`<Image>` en `ProjectCard` y la plantilla de proyecto (ver AGENTS.md §8).

---

## D-07 — Formulario de contacto con fallback `mailto:`

**Decisión:** El formulario de `/contacto` construye un `mailto:` en el cliente;
no hay backend.

**Justificación:** Despliegue 100% estático, sin coste ni secrets.
**Deuda:** Para envío real, conectar un endpoint (Formspree/Resend) en
`contacto.astro`.

---

## D-08 — `overrides.vite = "6.4.3"` (obsoleto en 0.1.1)

**Decisión (0.1.0):** Fijar Vite a 6.4.3 para resolver el mismatch de tipos.

**Contexto:** `@tailwindcss/vite` admite Vite 5–8; npm resolvió Vite 8 en la raíz,
mientras Astro 5 usaba Vite 6, provocando un error de tipos en `astro check`.

**Revertido en 0.1.1:** al subir a Astro 7 (que requiere Vite ^8), ambos paquetes
comparten Vite 8 y se deduplican, eliminando el conflicto. El override se quitó.

---

## D-09 — Actualización de seguridad a Astro 7 (0.1.1)

**Decisión:** Migrar de Astro 5 a **Astro 7.0.5** (+ `@astrojs/mdx` 7) y aplicar
`overrides.yaml ^2.8.3`.

**Contexto:** `npm audit` reportó 5 vulnerabilidades (1 HIGH en `astro`: XSS en
`define:vars`, server islands, slot names, spread props y SSRF en error pages).
No existía parche para 5.x/6.x.

**Justificación:** La única versión parcheada es 7.x. Al ser un proyecto recién
scaffoldeado, el salto de major es de bajo riesgo y deja `audit` en 0.
`yaml` se arregló con un override puntual (lib pura, API estable en 2.x) en
lugar de degradar `@astrojs/check`.

