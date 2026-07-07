/**
 * PWA ICON - CLEAN VISUAL REGENERATION v2
 * 
 * PROBLEMA REAL: El icono contiene un borde/marco/sombra negra como parte del diseño visible.
 * El script de alpha no lo detecta porque esos pixeles pertenecen al icono.
 * 
 * SOLUCIÓN: Crear una familia de iconos completamente nueva desde SVG,
 * con solo el logo X verde, sin marco negro, sin caja oscura.
 * 
 * v2: 
 * - SVG más robusto con colores más brillantes para evitar artefactos oscuros
 * - Post-processing más agresivo para eliminar artefactos de interpolación
 * - Incluye icon-120.png y splash-logo.png
 * - Verificación visual profunda (RGB<80)
 * 
 * Uso: node scripts/generate-clean-icons.cjs
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'public/icons';

// ─── SVG BASE: LOGO X VERDE SIN MARCO NEGRO ─────────────────────────────────
// Usamos colores más brillantes y saturados para evitar que la interpolación
// genere pixeles oscuros en los bordes del logo

function createBaseSvg(size) {
  const s = size;
  return Buffer.from(`<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
    <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
  </defs>
  <g>
    <!-- Leaf 1: top-left to bottom-right -->
    <path d="M${s*0.28},${s*0.18}
             C${s*0.36},${s*0.18} ${s*0.44},${s*0.26} ${s*0.5},${s*0.36}
             C${s*0.56},${s*0.26} ${s*0.64},${s*0.18} ${s*0.72},${s*0.18}
             C${s*0.78},${s*0.18} ${s*0.82},${s*0.22} ${s*0.82},${s*0.28}
             C${s*0.82},${s*0.36} ${s*0.74},${s*0.44} ${s*0.64},${s*0.5}
             C${s*0.74},${s*0.56} ${s*0.82},${s*0.64} ${s*0.82},${s*0.72}
             C${s*0.82},${s*0.78} ${s*0.78},${s*0.82} ${s*0.72},${s*0.82}
             C${s*0.64},${s*0.82} ${s*0.56},${s*0.74} ${s*0.5},${s*0.64}
             C${s*0.44},${s*0.74} ${s*0.36},${s*0.82} ${s*0.28},${s*0.82}
             C${s*0.22},${s*0.82} ${s*0.18},${s*0.78} ${s*0.18},${s*0.72}
             C${s*0.18},${s*0.64} ${s*0.26},${s*0.56} ${s*0.36},${s*0.5}
             C${s*0.26},${s*0.44} ${s*0.18},${s*0.36} ${s*0.18},${s*0.28}
             C${s*0.18},${s*0.22} ${s*0.22},${s*0.18} ${s*0.28},${s*0.18}Z"
         fill="url(#g1)"/>
    <!-- Leaf 2: bottom-left to top-right -->
    <path d="M${s*0.28},${s*0.82}
             C${s*0.36},${s*0.82} ${s*0.44},${s*0.74} ${s*0.5},${s*0.64}
             C${s*0.56},${s*0.74} ${s*0.64},${s*0.82} ${s*0.72},${s*0.82}
             C${s*0.78},${s*0.82} ${s*0.82},${s*0.78} ${s*0.82},${s*0.72}
             C${s*0.82},${s*0.64} ${s*0.74},${s*0.56} ${s*0.64},${s*0.5}
             C${s*0.74},${s*0.44} ${s*0.82},${s*0.36} ${s*0.82},${s*0.28}
             C${s*0.82},${s*0.22} ${s*0.78},${s*0.18} ${s*0.72},${s*0.18}
             C${s*0.64},${s*0.18} ${s*0.56},${s*0.26} ${s*0.5},${s*0.36}
             C${s*0.44},${s*0.26} ${s*0.36},${s*0.18} ${s*0.28},${s*0.18}
             C${s*0.22},${s*0.18} ${s*0.18},${s*0.22} ${s*0.18},${s*0.28}
             C${s*0.18},${s*0.36} ${s*0.26},${s*0.44} ${s*0.36},${s*0.5}
             C${s*0.26},${s*0.56} ${s*0.18},${s*0.64} ${s*0.18},${s*0.72}
             C${s*0.18},${s*0.78} ${s*0.22},${s*0.82} ${s*0.28},${s*0.82}Z"
         fill="url(#g2)"/>
  </g>
</svg>`);
}

// ─── SVG MASKABLE: CIRCULO VERDE + X BLANCO ─────────────────────────────────

function createMaskableSvg(size) {
  const padding = Math.round(size * 0.2);
  const r = Math.round((size - padding * 2) / 2);
  const cx = Math.round(size / 2);
  const cy = Math.round(size / 2);
  const scale = r * 0.035;

  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
  </defs>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#cg)"/>
  <g transform="translate(${cx},${cy}) scale(${scale})">
    <path d="M-12,-16 C-8,-20 0,-20 4,-16 C8,-12 10,-4 6,2 C2,8 -6,12 -10,8 C-14,4 -16,-4 -12,-10Z" fill="#ffffff" transform="rotate(-45)"/>
    <path d="M-12,16 C-8,20 0,20 4,16 C8,12 10,4 6,-2 C2,-8 -6,-12 -10,-8 C-14,-4 -16,4 -12,10Z" fill="#ffffff" transform="rotate(-45)"/>
  </g>
</svg>`);
}

// ─── SVG SPLASH: LOGO X VERDE GRANDE CENTRADO ───────────────────────────────

function createSplashSvg(size) {
  const s = size;
  return Buffer.from(`<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
    <linearGradient id="sg2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
  </defs>
  <g transform="scale(1.8) translate(${s*0.14},${s*0.14})">
    <path d="M${s*0.28},${s*0.18}
             C${s*0.36},${s*0.18} ${s*0.44},${s*0.26} ${s*0.5},${s*0.36}
             C${s*0.56},${s*0.26} ${s*0.64},${s*0.18} ${s*0.72},${s*0.18}
             C${s*0.78},${s*0.18} ${s*0.82},${s*0.22} ${s*0.82},${s*0.28}
             C${s*0.82},${s*0.36} ${s*0.74},${s*0.44} ${s*0.64},${s*0.5}
             C${s*0.74},${s*0.56} ${s*0.82},${s*0.64} ${s*0.82},${s*0.72}
             C${s*0.82},${s*0.78} ${s*0.78},${s*0.82} ${s*0.72},${s*0.82}
             C${s*0.64},${s*0.82} ${s*0.56},${s*0.74} ${s*0.5},${s*0.64}
             C${s*0.44},${s*0.74} ${s*0.36},${s*0.82} ${s*0.28},${s*0.82}
             C${s*0.22},${s*0.82} ${s*0.18},${s*0.78} ${s*0.18},${s*0.72}
             C${s*0.18},${s*0.64} ${s*0.26},${s*0.56} ${s*0.36},${s*0.5}
             C${s*0.26},${s*0.44} ${s*0.18},${s*0.36} ${s*0.18},${s*0.28}
             C${s*0.18},${s*0.22} ${s*0.22},${s*0.18} ${s*0.28},${s*0.18}Z"
         fill="url(#sg1)"/>
    <path d="M${s*0.28},${s*0.82}
             C${s*0.36},${s*0.82} ${s*0.44},${s*0.74} ${s*0.5},${s*0.64}
             C${s*0.56},${s*0.74} ${s*0.64},${s*0.82} ${s*0.72},${s*0.82}
             C${s*0.78},${s*0.82} ${s*0.82},${s*0.78} ${s*0.82},${s*0.72}
             C${s*0.82},${s*0.64} ${s*0.74},${s*0.56} ${s*0.64},${s*0.5}
             C${s*0.74},${s*0.44} ${s*0.82},${s*0.36} ${s*0.82},${s*0.28}
             C${s*0.82},${s*0.22} ${s*0.78},${s*0.18} ${s*0.72},${s*0.18}
             C${s*0.64},${s*0.18} ${s*0.56},${s*0.26} ${s*0.5},${s*0.36}
             C${s*0.44},${s*0.26} ${s*0.36},${s*0.18} ${s*0.28},${s*0.18}
             C${s*0.22},${s*0.18} ${s*0.18},${s*0.22} ${s*0.18},${s*0.28}
             C${s*0.18},${s*0.36} ${s*0.26},${s*0.44} ${s*0.36},${s*0.5}
             C${s*0.26},${s*0.56} ${s*0.18},${s*0.64} ${s*0.18},${s*0.72}
             C${s*0.18},${s*0.78} ${s*0.22},${s*0.82} ${s*0.28},${s*0.82}Z"
         fill="url(#sg2)"/>
  </g>
</svg>`);
}

// ─── VERIFICACION MEJORADA ───────────────────────────────────────────────────

async function verifyIcon(filePath, label) {
  const meta = await sharp(filePath).metadata();
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;

  let black = 0, veryDark = 0, dark = 0, trans = 0, total = 0;
  let minR = 255, minG = 255, minB = 255;
  let maxR = 0, maxG = 0, maxB = 0;

  for (let i = 0; i < data.length; i += ch) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    total++;
    if (a === 0) {
      trans++;
    } else {
      if (r < minR) minR = r;
      if (g < minG) minG = g;
      if (b < minB) minB = b;
      if (r > maxR) maxR = r;
      if (g > maxG) maxG = g;
      if (b > maxB) maxB = b;
      const avg = (r + g + b) / 3;
      if (avg < 40) black++;
      else if (avg < 80) veryDark++;
      else if (avg < 120) dark++;
    }
  }

  const status = black > 0 ? '❌ HAS BLACK' : veryDark > 0 ? '⚠ HAS DARK' : '✅ CLEAN';
  console.log(`  ${status.padEnd(16)} ${label.padEnd(25)} black:${black} vDark:${veryDark} dark:${dark} trans:${(trans/total*100).toFixed(1)}% min:rgb(${minR},${minG},${minB})`);

  return { black, veryDark, dark, trans, total, clean: black === 0 && veryDark === 0 };
}

// ─── POST-PROCESS MEJORADO: Eliminar artefactos de interpolación ────────────

async function cleanDarkArtifacts(filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const ch = info.channels;

  let fixed = 0;

  for (let i = 0; i < data.length; i += ch) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];

    // Skip fully transparent pixels
    if (a === 0) continue;

    const avg = (r + g + b) / 3;

    // Case 1: Pure black or near-black with any alpha - these are ALWAYS artifacts
    // because our logo is green, never black
    if (avg < 30) {
      data[i + 3] = 0; // Make transparent
      fixed++;
    }
    // Case 2: Very dark pixels with low alpha - interpolation artifacts
    else if (avg < 60 && a < 50) {
      data[i + 3] = 0;
      fixed++;
    }
    // Case 3: Dark pixels with very low alpha - anti-aliasing artifacts
    else if (avg < 80 && a < 20) {
      data[i + 3] = 0;
      fixed++;
    }
    // Case 4: Any pixel where green is not the dominant channel and alpha is low
    // This catches artifacts where the color shifted during interpolation
    else if (a < 30 && (r > g * 1.5 || b > g * 1.5)) {
      data[i + 3] = 0;
      fixed++;
    }
  }

  if (fixed > 0) {
    await sharp(data, {
      raw: { width: w, height: h, channels: ch }
    })
      .png({ compressionLevel: 9 })
      .toFile(filePath);
  }

  return fixed;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🔄 PWA ICON - CLEAN VISUAL REGENERATION v2');
  console.log('  Creando iconos desde SVG - Sin marco negro');
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // ─── Step 1: Generate base icon at 1024px ──────────────────────────────────
  console.log('📦 STEP 1: Generating clean base icon (1024px)...');
  const BASE_SIZE = 1024;
  const BASE_PATH = path.join(OUTPUT_DIR, 'base-clean-1024.png');

  await sharp(createBaseSvg(BASE_SIZE))
    .resize(BASE_SIZE, BASE_SIZE, {
      kernel: 'lanczos3',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9, colors: 256 })
    .toFile(BASE_PATH);

  const baseVerify = await verifyIcon(BASE_PATH, 'base-clean-1024.png');
  if (baseVerify.black > 0) {
    console.error('\n❌ Base icon has black pixels! Aborting.');
    process.exit(1);
  }

  // ─── Step 2: Generate all sizes ────────────────────────────────────────────
  console.log('\n📦 STEP 2: Generating all icon sizes...');

  const SIZES = [
    { name: 'favicon-16', size: 16 },
    { name: 'favicon-32', size: 32 },
    { name: 'favicon-48', size: 48 },
    { name: 'favicon-64', size: 64 },
    { name: 'icon-120', size: 120 },
    { name: 'apple-touch-icon', size: 180 },
    { name: 'icon-192', size: 192 },
    { name: 'icon-256', size: 256 },
    { name: 'icon-512', size: 512 },
  ];

  for (const { name, size } of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    
    // Use nearest neighbor for very small sizes to avoid interpolation artifacts
    const kernel = size <= 48 ? 'nearest' : 'lanczos3';
    
    await sharp(BASE_PATH)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel
      })
      .png({ compressionLevel: 9 })
      .toFile(outputPath);
    
    // Post-process: clean any dark artifacts from interpolation
    const fixed = await cleanDarkArtifacts(outputPath);
    if (fixed > 0) {
      console.log(`  ✓ ${name}.png (${size}x${size}) - cleaned ${fixed} artifacts`);
    } else {
      console.log(`  ✓ ${name}.png (${size}x${size})`);
    }
  }

  // ─── Step 3: Generate maskable icon ────────────────────────────────────────
  console.log('\n📦 STEP 3: Generating maskable icon...');

  const MASKABLE_PATH = path.join(OUTPUT_DIR, 'icon-maskable-512.png');
  await sharp(createMaskableSvg(512))
    .resize(512, 512, {
      kernel: 'lanczos3',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9 })
    .toFile(MASKABLE_PATH);
  await cleanDarkArtifacts(MASKABLE_PATH);
  console.log('  ✓ icon-maskable-512.png');

  // ─── Step 4: Generate splash logo ──────────────────────────────────────────
  console.log('\n📦 STEP 4: Generating splash logo...');

  const SPLASH_PATH = path.join(OUTPUT_DIR, 'splash-logo.png');
  await sharp(createSplashSvg(512))
    .resize(512, 512, {
      kernel: 'lanczos3',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9 })
    .toFile(SPLASH_PATH);
  await cleanDarkArtifacts(SPLASH_PATH);
  console.log('  ✓ splash-logo.png');

  // ─── Step 5: Verify ALL icons ──────────────────────────────────────────────
  console.log('\n📦 STEP 5: Verifying all icons...\n');

  const allIcons = [
    ...SIZES,
    { name: 'icon-maskable-512', size: 512 },
    { name: 'splash-logo', size: 512 }
  ];

  let allClean = true;
  for (const { name } of allIcons) {
    const filePath = path.join(OUTPUT_DIR, `${name}.png`);
    const result = await verifyIcon(filePath, `${name}.png`);
    if (result.black > 0 || result.veryDark > 0) allClean = false;
  }

  // ─── Step 6: Summary ───────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════');
  if (allClean) {
    console.log('  ✅ ALL ICONS CLEAN - Zero dark pixels detected');
    console.log('  ✅ No dark frame, no black border, no shadow box');
    console.log('  ✅ Transparent background preserved');
  } else {
    console.log('  ⚠ Some icons have issues - manual review needed');
  }
  console.log('═══════════════════════════════════════════════════════════════\n');

  // List generated files
  console.log('Generated files:');
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.png') && !f.includes('CLEANED') && f !== 'fuxion icon.png' && f !== 'fuxion icon CLEANED.png')
    .sort();

  files.forEach(f => {
    const st = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f.padEnd(30)} ${(st.size / 1024).toFixed(1)} KB`);
  });

  console.log('\n✅ Regeneration complete!');
}

main().catch(console.error);
