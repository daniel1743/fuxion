import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURACIÓN
// ============================================
const INPUT_DIR = path.join(__dirname, '../public/img/productos');
const OUTPUT_DIR_MINI = path.join(__dirname, '../public/img/productos-mini');
const OUTPUT_DIR_TINY = path.join(__dirname, '../public/img/productos-tiny');

const SIZES = {
  MINI: 64,   // Para usar en el foro (64x64 px)
  TINY: 32,   // Super pequeño para emojis (32x32 px)
};

// ============================================
// CREAR CARPETAS DE SALIDA
// ============================================
if (!fs.existsSync(OUTPUT_DIR_MINI)) {
  fs.mkdirSync(OUTPUT_DIR_MINI, { recursive: true });
}
if (!fs.existsSync(OUTPUT_DIR_TINY)) {
  fs.mkdirSync(OUTPUT_DIR_TINY, { recursive: true });
}

// ============================================
// FUNCIÓN DE COMPRESIÓN
// ============================================
async function compressImage(inputPath, outputPath, size) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024).toFixed(2);

    await sharp(inputPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .webp({ quality: 80, effort: 6 }) // WebP ultra comprimido
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = (newStats.size / 1024).toFixed(2);
    const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)}`);
    console.log(`   Original: ${originalSize} KB → Nuevo: ${newSize} KB (${reduction}% reducción)`);

    return { originalSize, newSize, reduction };
  } catch (error) {
    console.error(`❌ Error procesando ${inputPath}:`, error.message);
    return null;
  }
}

// ============================================
// PROCESAR TODAS LAS IMÁGENES
// ============================================
async function processAllImages() {
  console.log('🚀 Iniciando compresión de imágenes de productos Fuxion...\n');

  const files = fs.readdirSync(INPUT_DIR).filter(file =>
    file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
  );

  console.log(`📦 Encontradas ${files.length} imágenes\n`);

  let totalOriginal = 0;
  let totalMini = 0;
  let totalTiny = 0;

  console.log('🔹 GENERANDO VERSIÓN MINI (64x64 px)...\n');
  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR_MINI, file.replace(/\.(png|jpg|jpeg)$/, '.webp'));

    const result = await compressImage(inputPath, outputPath, SIZES.MINI);
    if (result) {
      totalOriginal += parseFloat(result.originalSize);
      totalMini += parseFloat(result.newSize);
    }
  }

  console.log('\n🔸 GENERANDO VERSIÓN TINY (32x32 px)...\n');
  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR_TINY, file.replace(/\.(png|jpg|jpeg)$/, '.webp'));

    const result = await compressImage(inputPath, outputPath, SIZES.TINY);
    if (result) {
      totalTiny += parseFloat(result.newSize);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN FINAL:');
  console.log('='.repeat(60));
  console.log(`Total archivos procesados: ${files.length}`);
  console.log(`Tamaño original total: ${totalOriginal.toFixed(2)} KB`);
  console.log(`Tamaño MINI (64x64) total: ${totalMini.toFixed(2)} KB`);
  console.log(`Tamaño TINY (32x32) total: ${totalTiny.toFixed(2)} KB`);
  console.log(`\n💰 AHORRO DE ESPACIO:`);
  console.log(`   Mini: ${((1 - totalMini / totalOriginal) * 100).toFixed(1)}% menos`);
  console.log(`   Tiny: ${((1 - totalTiny / totalOriginal) * 100).toFixed(1)}% menos`);
  console.log('\n✅ ¡Compresión completada!');
  console.log(`\n📁 Archivos guardados en:`);
  console.log(`   ${OUTPUT_DIR_MINI}`);
  console.log(`   ${OUTPUT_DIR_TINY}`);
}

// ============================================
// EJECUTAR
// ============================================
processAllImages().catch(console.error);
