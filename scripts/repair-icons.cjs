/**
 * PWA Icon Alpha Repair - Elimina fondo negro real del PNG
 * 
 * Estrategia:
 *   1. Cargar el icono fuente (fuxion icon.png)
 *   2. Detectar pixeles negros/casi-negros (RGB < 40)
 *   3. Convertir esos pixeles a transparentes (alpha = 0)
 *   4. Regenerar TODOS los iconos desde el icono limpio
 *   5. Post-process: limpiar artefactos de borde en imágenes redimensionadas
 *   6. Verificar que no queden pixeles negros
 * 
 * Uso: node scripts/repair-icons.cjs
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ─── CONFIGURACIÓN ───────────────────────────────────────────────────────────

const SOURCE_ICON = 'public/icons/fuxion icon.png';
const CLEANED_ICON = 'public/icons/fuxion icon CLEANED.png';
const OUTPUT_DIR = 'public/icons';

const BLACK_RGB_MAX = 40; // Pixels with R,G,B all < 40 are considered "black background"

const SIZES = [
  // Favicon sizes
  { name: 'favicon-16', size: 16 },
  { name: 'favicon-32', size: 32 },
  { name: 'favicon-48', size: 48 },
  { name: 'favicon-64', size: 64 },
  // Apple touch icons
  { name: 'apple-touch-icon', size: 180 },
  // PWA icons
  { name: 'icon-120', size: 120 },
  { name: 'icon-192', size: 192 },
  { name: 'icon-256', size: 256 },
  { name: 'icon-512', size: 512 },
];

const MASKABLE_SIZES = [
  { name: 'icon-maskable-512', size: 512 },
];

// Colors
const GREEN_PRIMARY = '#10b981';  // emerald-500
const WHITE = '#ffffff';

// ─── PIXEL-LEVEL ALPHA REPAIR ────────────────────────────────────────────────

/**
 * Remove black/near-black pixels by setting their alpha to 0.
 * This operates at the raw pixel buffer level for maximum precision.
 */
async function removeBlackBackground(inputPath, outputPath, threshold = BLACK_RGB_MAX) {
  console.log(`\n🔍 Processing: ${path.basename(inputPath)}`);
  
  const meta = await sharp(inputPath).metadata();
  console.log(`   Original: ${meta.width}x${meta.height}, alpha: ${meta.hasAlpha}, channels: ${meta.channels}`);
  
  // Get raw pixel data with alpha channel
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  
  console.log(`   Raw buffer: ${data.length} bytes, ${ch} channels`);
  
  // Count and fix black pixels
  let blackPixelsFound = 0;
  let blackPixelsFixed = 0;
  let totalPixels = 0;
  
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    totalPixels++;
    
    if (r < threshold && g < threshold && b < threshold) {
      blackPixelsFound++;
      if (a > 0) {
        data[i + 3] = 0;
        blackPixelsFixed++;
      }
    }
  }
  
  const blackPct = (blackPixelsFound / totalPixels * 100).toFixed(2);
  const fixedPct = (blackPixelsFixed / totalPixels * 100).toFixed(2);
  
  console.log(`   Black pixels found: ${blackPixelsFound}/${totalPixels} (${blackPct}%)`);
  console.log(`   Black pixels fixed: ${blackPixelsFixed} (${fixedPct}%)`);
  
  await sharp(data, {
    raw: { width: w, height: h, channels: ch }
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
  
  console.log(`   ✅ Cleaned image saved: ${path.basename(outputPath)}`);
  
  return {
    width: w, height: h,
    totalPixels, blackPixelsFound, blackPixelsFixed,
    blackPercent: parseFloat(blackPct)
  };
}

/**
 * Post-process a resized icon to remove any black artifacts introduced by interpolation.
 * This handles the anti-aliasing artifacts at the edges of the logo after resize.
 */
async function postProcessIcon(inputPath, threshold = BLACK_RGB_MAX) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  
  let blackPixelsFixed = 0;
  
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    
    // Fix black pixels that are not already transparent
    if (r < threshold && g < threshold && b < threshold && a > 0) {
      data[i + 3] = 0;
      blackPixelsFixed++;
    }
    
    // Also fix near-black pixels that have very low alpha (anti-aliasing artifacts)
    // These are pixels that got a dark tint from the interpolation
    if (a > 0 && a < 128 && r < 60 && g < 60 && b < 60) {
      data[i + 3] = 0;
      blackPixelsFixed++;
    }
  }
  
  if (blackPixelsFixed > 0) {
    await sharp(data, {
      raw: { width: w, height: h, channels: ch }
    })
      .png({ compressionLevel: 9 })
      .toFile(inputPath);
    
    console.log(`   🧹 Post-process: ${blackPixelsFixed} artifact pixels cleaned`);
  }
  
  return blackPixelsFixed;
}

// ─── ICON GENERATION ─────────────────────────────────────────────────────────

async function createMaskableIcon(size, outputPath) {
  const padding = Math.round(size * 0.2);
  const circleRadius = Math.round((size - padding * 2) / 2);
  const center = Math.round(size / 2);

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${center}" cy="${center}" r="${circleRadius}" fill="${GREEN_PRIMARY}" />
      <g transform="translate(${center}, ${center}) scale(${circleRadius * 0.035})">
        <path d="M-10,-14 C-6,-18 2,-18 6,-14 C10,-10 12,-2 8,4 C4,10 -4,14 -8,10 C-12,6 -14,-2 -10,-8 Z" 
              fill="${WHITE}" transform="rotate(-45)" />
        <path d="M0,0 L0,16" stroke="${WHITE}" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`  ✓ Maskable ${size}x${size} -> ${path.basename(outputPath)}`);
}

async function createIcon(sourcePath, outputPath, size) {
  await sharp(sourcePath)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: 'lanczos3'
    })
    .png({ 
      compressionLevel: 9,
      palette: false
    })
    .toFile(outputPath);

  console.log(`  ✓ ${size}x${size} -> ${path.basename(outputPath)}`);
}

// ─── VERIFICATION ────────────────────────────────────────────────────────────

async function verifyClean(filePath, threshold = BLACK_RGB_MAX) {
  try {
    const meta = await sharp(filePath).metadata();
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const ch = info.channels;
    let blackPixels = 0;
    let transparentPixels = 0;
    let totalPixels = 0;

    for (let i = 0; i < data.length; i += ch) {
      const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
      totalPixels++;
      if (a === 0) transparentPixels++;
      else if (r < threshold && g < threshold && b < threshold) blackPixels++;
    }

    const blackPct = (blackPixels / totalPixels * 100).toFixed(2);
    const transPct = (transparentPixels / totalPixels * 100).toFixed(2);

    const hasBlack = blackPixels > 0;
    const status = hasBlack ? '❌ HAS BLACK' : '✅ CLEAN';

    console.log(`  ${status} ${path.basename(filePath).padEnd(30)} black: ${blackPct}%  transparent: ${transPct}%`);

    return { clean: !hasBlack, blackPixels, transparentPixels, totalPixels };
  } catch (e) {
    console.error(`  ✗ ERROR verifying ${path.basename(filePath)}: ${e.message}`);
    return { clean: false, blackPixels: -1, transparentPixels: -1, totalPixels: 0 };
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🔧 PWA ICON ALPHA REPAIR');
  console.log('  Eliminando fondo negro real del PNG');
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (!fs.existsSync(SOURCE_ICON)) {
    console.error(`✗ Source icon not found: ${SOURCE_ICON}`);
    process.exit(1);
  }

  // Step 1: Clean source icon
  console.log('📦 STEP 1: Cleaning source icon (removing black pixels)...');
  const cleanResult = await removeBlackBackground(SOURCE_ICON, CLEANED_ICON, BLACK_RGB_MAX);
  
  console.log('\n📦 STEP 2: Verifying cleaned source...');
  const sourceVerify = await verifyClean(CLEANED_ICON, BLACK_RGB_MAX);
  
  if (!sourceVerify.clean) {
    console.error('\n❌ Source icon still has black pixels after cleaning!');
    process.exit(1);
  }

  // Step 3: Generate regular icons
  console.log('\n📦 STEP 3: Generating regular icons from cleaned source...');
  for (const { name, size } of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    await createIcon(CLEANED_ICON, outputPath, size);
  }

  // Step 4: Post-process resized icons to clean interpolation artifacts
  console.log('\n📦 STEP 4: Post-processing resized icons (cleaning artifacts)...');
  for (const { name } of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    if (fs.existsSync(outputPath)) {
      const fixed = await postProcessIcon(outputPath, BLACK_RGB_MAX);
      if (fixed > 0) {
        console.log(`   ✅ ${name}.png: ${fixed} artifacts cleaned`);
      }
    }
  }

  // Step 5: Generate maskable icons
  console.log('\n📦 STEP 5: Generating maskable icons...');
  for (const { name, size } of MASKABLE_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    await createMaskableIcon(size, outputPath);
  }

  // Step 6: Verify ALL generated icons
  console.log('\n📦 STEP 6: Verifying all generated icons...\n');
  
  const allIcons = [...SIZES, ...MASKABLE_SIZES];
  let allClean = true;
  
  for (const { name } of allIcons) {
    const filePath = path.join(OUTPUT_DIR, `${name}.png`);
    if (fs.existsSync(filePath)) {
      const result = await verifyClean(filePath, BLACK_RGB_MAX);
      if (!result.clean) allClean = false;
    } else {
      console.log(`  ⚠ File not found: ${name}.png`);
      allClean = false;
    }
  }

  // Step 7: Final summary
  console.log('\n📦 STEP 7: Final summary');
  console.log('═══════════════════════════════════════════════════════════════');
  
  if (allClean) {
    console.log('  ✅ ALL ICONS REPAIRED SUCCESSFULLY');
    console.log('  ✅ No black pixels remain');
    console.log('  ✅ Alpha transparency applied correctly');
  } else {
    console.log('  ⚠ Some icons may still have issues');
  }

  console.log(`\n  Source icon cleaned: ${cleanResult.blackPixelsFixed} black pixels → transparent`);
  console.log(`  Total icons regenerated: ${allIcons.length}`);
  console.log(`  Black threshold: RGB < ${BLACK_RGB_MAX}`);
  console.log(`  Output directory: ${OUTPUT_DIR}/`);

  console.log('\n📦 Generated files:');
  const generatedFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.png') && !f.includes('CLEANED'))
    .sort();
  
  generatedFiles.forEach(f => {
    const stats = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f.padEnd(30)} ${(stats.size / 1024).toFixed(1)} KB`);
  });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🔧 REPAIR COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
