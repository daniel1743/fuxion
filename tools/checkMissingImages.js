/**
 * Script: Detectar imágenes faltantes en /public/img/productos
 * Uso: node tools/checkMissingImages.js
 */

import fs from "fs";
import path from "path";

// === CONFIGURACIÓN ===
const PRODUCT_IMAGE_MAP = {
  'PRUNEX 1': 'prunex-1.png',
  'LIQUID FIBER': 'liquid-fiber.png',
  'FLORA LIV': 'flora-liv.png',
  'BERRY BALANCE': 'berry-balance.png',
  'ALPHA BALANCE': 'alpha-balance.png',
  'REXET': 'rexet.png',

  'BIOPRO+ TECT': 'biopro+-tect.png',
  'BIOPROTEIN ACTIVE': 'bioprotein-active.png',

  'VITA XTRA T+': 'vita-xtra-t+.png',
  'VITAENERGIA': 'vitaenergia.png',
  'NUTRADAY': 'nutraday.png',

  'VERA+': 'vera+.png',
  'GANO+ CAPPUCCINO': 'gano+-cappuccino.png',

  'THERMO T3': 'thermo-t3.png',
  'NOCARB-T': 'nocarb-t.png',
  'BIOPRO+ FIT': 'biopro+-fit.png',
  'PROTEIN ACTIVE FIT': 'protein-active-fit.png',

  'YOUTH ELIXIR HGH': 'youth-elixir-hgh.png',
  'BEAUTY-IN': 'beauty-in.png',
  'PROBAL': 'probal.png',
  'PASSION': 'passion.png',
  'GOLDEN FLX': 'golden-flx.png',

  'ON': 'on.png',
  'NO STRESS': 'no-stress.png',

  'BIOPRO+ SPORT': 'biopro+-sport.png',
  'PRE SPORT': 'pre-sport.png',
  'POST SPORT': 'post-sport.png',

  'PACK 5/14': 'kit-514-active.png',
  'KIT 514 ACTIVE': 'kit-514-active.png',
  'KIT DETOX 5 DIAS': 'kit-detox-5-dias.png'
};


// === Función normalizadora ===
const normalizeName = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9+_-]/g, "");
};


// === Inicio del Script ===
const PRODUCTS_FOLDER = path.join(process.cwd(), "public", "img", "productos");

console.log("📁 Verificando carpeta:", PRODUCTS_FOLDER);

const existingFiles = fs.readdirSync(PRODUCTS_FOLDER);

const missing = [];
const found = [];
const normalizedSuggestions = [];

console.log("\n🔍 Comprobando imágenes...");

Object.entries(PRODUCT_IMAGE_MAP).forEach(([productName, filename]) => {
  const exists = existingFiles.includes(filename);

  if (exists) {
    found.push(filename);
  } else {
    missing.push({ productName, expected: filename });

    // Sugerencia basada en nombre normalizado
    const normalized = normalizeName(productName);
    normalizedSuggestions.push({
      productName,
      normalizedGuessPng: `${normalized}.png`,
      normalizedGuessJpg: `${normalized}.jpg`
    });
  }
});

// === RESULTADOS ===
console.log("\n==============================");
console.log("📦 RESULTADOS COMPLETOS");
console.log("==============================\n");

console.log("✅ Imágenes encontradas:");
console.table(found);

console.log("\n❌ Imágenes faltantes:");
console.table(missing);

console.log("\n🧩 Sugerencias alternativas según normalizador:");
console.table(normalizedSuggestions);

console.log("\n✨ Fin del análisis.");
