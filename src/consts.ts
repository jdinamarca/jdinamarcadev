export const SITE = {
  title: "Jason Dinamarca",
  role: "Ingeniería de software · IA aplicada",
  tagline:
    "Diseño sistemas sólidos y exploro cómo la IA los hace mejores. Todo contado en simple.",
  description:
    "Portafolio y blog de Jason Dinamarca. Ingeniería de software e IA aplicada: arquitectura de sistemas, LLMs y divulgación técnica.",
  author: "Jason Dinamarca",
  email: "hola@jdinamarca.dev",
  locale: "es",
  /** Coordenadas "ficticias" mostradas en el readout técnico */
  coords: { x: "33.453 S", y: "70.663 W" },
  social: [
    { label: "GitHub", href: "https://github.com/jdinamarca" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jdinamarca" },
    { label: "RSS", href: "/rss.xml" },
  ],
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: "Inicio", href: "/" },
  { label: "Portafolio", href: "/proyectos" },
  { label: "Blog", href: "/blog" },
  { label: "Sobre mí", href: "/sobre-mi" },
  { label: "Contacto", href: "/contacto" },
];

/** Paths activos para resaltar en el header */
export const PATH_GROUPS = {
  "/proyectos": ["/proyectos"],
  "/blog": ["/blog"],
  "/sobre-mi": ["/sobre-mi"],
  "/contacto": ["/contacto"],
} as const;
