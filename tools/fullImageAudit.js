/**
 * AUDITORÍA COMPLETA DE IMÁGENES
 * Compara EXACTAMENTE lo que el código espera vs lo que existe
 */

import fs from "fs";
import path from "path";

// ============================================
// MAPEO DEL CÓDIGO (copiado de imageUtils.js)
// ============================================
const PRODUCT_IMAGE_MAP = {
  // Sistema Base - Limpia tu Cuerpo
  'PRUNEX 1': 'prunex-1.png',
  'LIQUID FIBER': 'liquid-fiber.png',
  'FLORA LIV': 'flora-liv.png',
  'BERRY BALANCE': 'berry-balance.png',
  'ALPHA BALANCE': 'alpha-balance.png',
  'BALANCE': 'alpha-balance.png',
  'REXET': 'rexet.png',

  // Sistema Base - Nutre y Regenera
  'BIOPRO+ TECT': 'biopro+-tect.png',
  'BIOPROTEIN ACTIVE': 'bioprotein-active.png',

  // Sistema Base - Revitaliza tu Energía
  'VITA XTRA T+': 'vita-xtra-t+.png',
  'VITAENERGÍA': 'vitaenergia.png',
  'VITAENERGIA': 'vitaenergia.png',
  'NUTRADAY': 'nutraday.png',

  // Línea Inmunológica
  'VERA+': 'vera+.png',
  'GANO+ CAPPUCCINO': 'gano+-cappuccino.png',

  // Línea Control de Peso
  'THERMO T3': 'thermo-t3.png',
  'NOCARB-T': 'nocarb-t.png',
  'BIOPRO+ FIT': 'biopro+-fit.png',
  'PROTEIN ACTIVE FIT': 'protein-active-fit.png',

  // Línea Anti-Edad
  'YOUTH ELIXIR HGH': 'youth-elixir-hgh.png',
  'BEAUTY-IN': 'beauty-in.png',
  'COOL AGE': 'beauty-in.png',
  'PROBAL': 'probal.png',
  'PASSION': 'passion.png',
  'GOLDEN FLX': 'golden-flx.png',

  // Línea Vigor Mental
  'ON': 'on.png',
  'NO STRESS': 'no-stress.png',
  'OFF': 'no-stress.png',

  // Línea Sport
  'BIOPRO+ SPORT': 'biopro+-sport.png',
  'PRE SPORT': 'pre-sport.png',
  'POST SPORT': 'post-sport.png',

  // Kits
  'PACK 5/14': 'kit-514-active.png',
  'KIT 514 ACTIVE': 'kit-514-active.png',
  'KIT DETOX 5 DIAS': 'kit-detox-5-dias.png',
};

// ============================================
// FUNCIÓN NORMALIZADORA (copiada del código)
// ============================================
const normalizeProductName = (productName) => {
  if (!productName || typeof productName !== 'string') {
    return '';
  }

  return productName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Espacios a guiones
    .replace(/á/g, 'a')              // Tildes
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9+_-]/g, '');  // Solo letras, números, +, _, -
};

// ============================================
// AUDITORÍA
// ============================================
const PRODUCTS_FOLDER = path.join(process.cwd(), "public", "img", "productos");

console.log("🔍 AUDITORÍA COMPLETA DE IMÁGENES");
console.log("==================================\n");
console.log("📁 Carpeta:", PRODUCTS_FOLDER);

// Leer archivos reales
const existingFiles = fs.readdirSync(PRODUCTS_FOLDER);
console.log(`\n📦 Archivos encontrados: ${existingFiles.length}`);
console.log(existingFiles.sort().join('\n'));

console.log("\n\n═══════════════════════════════════════════");
console.log("🧪 ANÁLISIS DETALLADO POR PRODUCTO");
console.log("═══════════════════════════════════════════\n");

const results = {
  correctos: [],
  faltantes: [],
  problemasPlaceholder: [],
  archivosExtra: [...existingFiles] // Copia para ir eliminando
};

// Analizar cada entrada del mapeo
Object.entries(PRODUCT_IMAGE_MAP).forEach(([productName, expectedFile]) => {
  const exists = existingFiles.includes(expectedFile);
  const normalized = normalizeProductName(productName);

  const status = {
    productName,
    expectedFile,
    exists,
    normalized,
    normalizedPng: `${normalized}.png`,
    normalizedJpg: `${normalized}.jpg`,
  };

  if (exists) {
    results.correctos.push(status);
    // Eliminar de archivos extra
    const idx = results.archivosExtra.indexOf(expectedFile);
    if (idx > -1) results.archivosExtra.splice(idx, 1);
  } else {
    results.faltantes.push(status);
  }

  // Verificar el placeholder
  if (expectedFile === 'vitaenergia.png' && !exists) {
    results.problemasPlaceholder.push(status);
  }
});

// ============================================
// REPORTES
// ============================================

console.log("✅ PRODUCTOS CON IMAGEN CORRECTA:");
console.log("─────────────────────────────────");
if (results.correctos.length > 0) {
  results.correctos.forEach(({ productName, expectedFile }) => {
    console.log(`  ✓ ${productName.padEnd(25)} → ${expectedFile}`);
  });
  console.log(`\n  Total: ${results.correctos.length}/${Object.keys(PRODUCT_IMAGE_MAP).length}`);
} else {
  console.log("  ⚠️  ¡NINGUNA IMAGEN COINCIDE!");
}

console.log("\n\n❌ PRODUCTOS CON IMAGEN FALTANTE:");
console.log("─────────────────────────────────");
if (results.faltantes.length > 0) {
  results.faltantes.forEach(({ productName, expectedFile, normalizedPng }) => {
    console.log(`  ✗ ${productName.padEnd(25)} → ❌ ${expectedFile}`);
    console.log(`    Normalizado esperaría: ${normalizedPng}`);
  });
  console.log(`\n  Total faltantes: ${results.faltantes.length}`);
} else {
  console.log("  ✓ Todas las imágenes existen");
}

console.log("\n\n🚨 PROBLEMA CRÍTICO - PLACEHOLDER:");
console.log("─────────────────────────────────");
const placeholderExists = existingFiles.includes('vitaenergia.png');
console.log(`El código usa como placeholder: vitaenergia.png`);
console.log(`¿Existe el archivo? ${placeholderExists ? '✅ SÍ' : '❌ NO - ¡PROBLEMA CRÍTICO!'}`);

if (results.problemasPlaceholder.length > 0) {
  console.log("\n⚠️  PRODUCTOS QUE DEPENDEN DEL PLACEHOLDER FALTANTE:");
  results.problemasPlaceholder.forEach(({ productName }) => {
    console.log(`  - ${productName}`);
  });
}

console.log("\n\n📂 ARCHIVOS EXTRA (no mapeados en el código):");
console.log("─────────────────────────────────");
if (results.archivosExtra.length > 0) {
  results.archivosExtra.forEach(file => {
    console.log(`  ⚠️  ${file} (existe pero no está en PRODUCT_IMAGE_MAP)`);
  });
  console.log(`\n  Total sin mapear: ${results.archivosExtra.length}`);
} else {
  console.log("  ✓ No hay archivos extra");
}

console.log("\n\n═══════════════════════════════════════════");
console.log("📊 RESUMEN EJECUTIVO");
console.log("═══════════════════════════════════════════");
console.log(`✅ Imágenes correctas:     ${results.correctos.length}/${Object.keys(PRODUCT_IMAGE_MAP).length}`);
console.log(`❌ Imágenes faltantes:     ${results.faltantes.length}`);
console.log(`📂 Archivos sin mapear:    ${results.archivosExtra.length}`);
console.log(`🚨 Placeholder funcional:  ${placeholderExists ? 'SÍ ✅' : 'NO ❌ - ¡CRÍTICO!'}`);

console.log("\n\n🎯 DIAGNÓSTICO:");
if (results.faltantes.length === 0 && placeholderExists) {
  console.log("  ✅ TODO ESTÁ PERFECTO - Las imágenes deberían funcionar en producción");
} else if (!placeholderExists) {
  console.log("  🚨 PROBLEMA CRÍTICO: El placeholder no existe");
  console.log("     → Todas las imágenes faltantes mostrarán 404");
  console.log("     → Acción requerida: renombrar o crear vitaenergia.png");
} else if (results.faltantes.length > 0) {
  console.log("  ⚠️  HAY IMÁGENES FALTANTES");
  console.log("     → Estos productos mostrarán el placeholder");
  console.log("     → Acción requerida: agregar o renombrar archivos");
}

console.log("\n✨ Fin del análisis\n");
