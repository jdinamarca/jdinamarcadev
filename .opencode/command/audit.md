---
description: Descubre qué falta construir o pulir en el sitio (backlog priorizado de gaps).
agent: explore
---

Actúa como auditor de gaps del sitio. Lee primero la especificación del
proyecto para entender qué debería existir y luego escanea el código real.
Devuelve un **backlog priorizado** de lo que falta construir, corregir o
completar.

## Fuentes de verdad (lee en este orden)

1. `AGENTS.md` — especificación: estructura esperada, stack, sistema de diseño,
   accesibilidad obligatoria, y especialmente la sección **"10. Notas de
   estado"** (lista TODOs conocidos).
2. `DECISIONS.md` — decisiones pendientes de ejecutar.
3. `CHANGELOG.md` — qué se ha hecho y qué quedó aplazado.
4. `src/consts.ts` y `src/content.config.ts` — config y schemas.

## Qué buscar (cubre TODAS estas categorías)

- **Assets faltantes**: archivos referenciados pero inexistentes (p. ej.
  `og-default.png`, portadas de proyectos/blog, favicon).
- **Funcionalidades incompletas**: formularios sin backend (mailto fallback),
  integraciones conectadas solo a medias, TODO/FIXME en el código.
- **Contenido**: collections vacías o con una sola entrada, páginas placeholder
  o con poco contenido, frontmatter que no cumple el schema.
- **Accesibilidad**: faltan `alt`, `aria-*` mal usados, animaciones sin
  `prefers-reduced-motion`, foco no visible, contraste dudoso, skip-link.
- **Consistencia de diseño**: uso de valores hex sueltos en vez de tokens,
  componentes sin estilos scoped, clases utilitarias no documentadas en
  `AGENTS.md`.
- **SEO/metadatos**: `site` URL real vs placeholder, canonical, Open Graph,
  sitemap, RSS, títulos/descripciones por página.
- **Build/correctitud**: rutas rotas, enlaces internos muertos, dependencias
  sin usar, scripts que podrían fallar.

## Cómo trabajar

- Sé exhaustivo pero conciso. Usa lectura y búsqueda en paralelo.
- NO edites nada: esto es solo diagnóstico. El agente `explore` es de solo
  lectura.
- Si ejecutas `npm run build` o `grep`/ripgrep para validar, reporta el
  resultado.

## Formato de salida obligatorio

Una tabla o lista agrupada por prioridad. Para cada item:

| Prioridad | Categoría | Hallazgo | Dónde | Acción sugerida |

- **P0 — roto/bloqueante** (no compila, ruta 404, leak de datos)
- **P1 — incompleto/visible** (funcionalidad a medias, página vacía)
- **P2 — pulido/SEO/a11y** (mejora incremental)
- **P3 — nice-to-have** (migraciones futuras ya anotadas en Notas de estado)

Termina con un resumen de 2-3 líneas: cuántos P0/P1 hay y cuál sería el
siguiente paso recomendado.

$ARGUMENTS
