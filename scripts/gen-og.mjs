import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const svgPath = resolve(root, "public/og-default.svg");
const outPath = resolve(root, "public/og-default.png");

const WIDTH = 1200;
const HEIGHT = 630;

async function fontFace(family, modPath, weight) {
  try {
    const buf = await readFile(resolve(root, "node_modules", modPath));
    const b64 = buf.toString("base64");
    return `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${b64}) format("woff2");font-weight:${weight};font-style:normal;font-display:block;}`;
  } catch {
    return "";
  }
}

const svg = await readFile(svgPath, "utf8");

const style = (
  await fontFace(
    "Geist Variable",
    "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
    "100 900",
  )
) + (
  await fontFace(
    "JetBrains Mono Variable",
    "@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
    "100 800",
  )
);

const idx = svg.indexOf(">");
const svgWithFonts =
  style.length > 0
    ? svg.slice(0, idx + 1) + `<style>${style}</style>` + svg.slice(idx + 1)
    : svg;

await sharp(Buffer.from(svgWithFonts), { density: 144 })
  .resize(WIDTH, HEIGHT, { fit: "fill" })
  .png()
  .toFile(outPath);

const meta = await sharp(outPath).metadata();
console.log(`✓ OG image → public/og-default.png (${meta.width}×${meta.height})`);
