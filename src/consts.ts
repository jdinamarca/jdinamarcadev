export const SITE = {
  title: "J. Dinamarca",
  role: "Arquitecto de Software Senior",
  tagline:
    "Investigación rigurosa y divulgación sobre tecnología. Diseño sistemas que sostienen, y escribo para que otros los entiendan.",
  description:
    "Portafolio y blog de J. Dinamarca, arquitecto de software senior. Investigación, arquitectura de sistemas y divulgación técnica.",
  author: "J. Dinamarca",
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
