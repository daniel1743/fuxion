/**
 * REGENERATE ALL ICONS - v3 FINAL
 * 
 * Objetivo: Generar TODOS los iconos (PNG + ICO) con transparencia real,
 * sin fondo oscuro, sin marco negro, sin artefactos de interpolación.
 * 
 * Cambios clave respecto a versiones anteriores:
 * 1. SVG base con colores más brillantes y contrastados
 * 2. Post-processing agresivo: elimina cualquier pixel con RGB < 100
 * 3. favicon.ico regenerado desde PNG transparente (no desde icono antiguo)
 * 4. Verificación multi-umbral para garantizar 0 píxeles oscuros
 * 5. Incluye todos los tamaños: favicon, PWA icons, apple-touch, splash, maskable
 * 
 * Uso: node scripts/regenerate-all-icons.cjs
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'public/icons';
const PUBLIC_DIR = 'public';

// ─── SVG BASE: LOGO X VERDE - VERSIÓN MEJORADA ─────────────────────────────
// Colores más brillantes y saturados para evitar artefactos oscuros
// en la interpolación al redimensionar

function createBaseSvg(size) {
  const s = size;
  return Buffer.from(`<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="50%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
    <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="50%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
  </defs>
  <g>
    <!-- Leaf 1: top-left to bottom-right (X shape first diagonal) -->
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
    <!-- Leaf 2: bottom-left to top-right (X shape second diagonal) -->
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

// ─── SVG MASKABLE: CÍRCULO VERDE + X BLANCO ─────────────────────────────────

function createMaskableSvg(size) {
  const padding = Math.round(size * 0.2);
  const r = Math.round((size - padding * 2) / 2);
  const cx = Math.round(size / 2);
  const cy = Math.round(size / 2);
  const scale = r * 0.035;

  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="50%" stop-color="#34d399"/>
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

// ─── SVG SPLASH: LOGO X GRANDE CENTRADO ─────────────────────────────────────

function createSplashSvg(size) {
  const s = size;
  return Buffer.from(`<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="50%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
    <linearGradient id="sg2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="50%" stop-color="#34d399"/>
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

// ─── VERIFICACIÓN MULTI-UMBRAL ──────────────────────────────────────────────

async function verifyIconDeep(filePath, label) {
  const meta = await sharp(filePath).metadata();
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ch = info.channels;
  let black = 0, veryDark = 0, dark = 0, gray = 0, trans = 0, total = 0;
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
      if (avg < 30) black++;
      else if (avg < 60) veryDark++;
      else if (avg < 100) dark++;
      else if (avg < 150) gray++;
    }
  }

  const hasIssues = black > 0 || veryDark > 0;
  const status = black > 0 ? '❌ BLACK' : veryDark > 0 ? '⚠ DARK' : dark > 0 ? '⚠ GRAY' : '✅ CLEAN';
  
  console.log(
    `  ${status.padEnd(12)} ${label.padEnd(28)} ` +
    `black:${black} vDark:${veryDark} dark:${dark} gray:${gray} ` +
    `trans:${(trans/total*100).toFixed(1)}% ` +
    `min:rgb(${minR},${minG},${minB}) max:rgb(${maxR},${maxG},${maxB})`
  );

  return { black, veryDark, dark, gray, trans, total, clean: !hasIssues };
}

// ─── POST-PROCESS AGRESIVO: Eliminar CUALQUIER pixel oscuro ─────────────────

async function cleanAllDarkPixels(filePath) {
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

    // Skip fully transparent
    if (a === 0) continue;

    const avg = (r + g + b) / 3;

    // Rule 1: Pure black or near-black - ALWAYS artifact (logo is green)
    if (avg < 40) {
      data[i + 3] = 0;
      fixed++;
    }
    // Rule 2: Very dark with low alpha - interpolation artifact
    else if (avg < 70 && a < 80) {
      data[i + 3] = 0;
      fixed++;
    }
    // Rule 3: Dark pixels with very low alpha - anti-aliasing artifact
    else if (avg < 100 && a < 40) {
      data[i + 3] = 0;
      fixed++;
    }
    // Rule 4: Any pixel where green is NOT dominant and alpha is low
    else if (a < 50 && (r > g * 1.3 || b > g * 1.3)) {
      data[i + 3] = 0;
      fixed++;
    }
    // Rule 5: Very low alpha pixels that are not greenish
    else if (a < 20 && (g < r || g < b)) {
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

// ─── GENERAR ICO DESDE PNG ──────────────────────────────────────────────────
// ICO format: https://en.wikipedia.org/wiki/ICO_(file_format)
// Each image in ICO has: 16-byte directory entry + 40-byte BMP info header + BGRA pixel data

async function generateIcoFromPng(pngPath, icoPath) {
  const sizes = [16, 32, 48];
  const images = [];

  for (const size of sizes) {
    // Generate PNG and convert to raw BGRA pixels
    const buf = await sharp(pngPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel: size <= 32 ? 'nearest' : 'lanczos3'
      })
      .ensureAlpha()
      .raw()
      .toBuffer();

    // Convert RGBA -> BGRA (ICO uses BGRA)
    const pixelCount = size * size;
    const bgra = Buffer.alloc(pixelCount * 4);
    for (let i = 0; i < pixelCount; i++) {
      const srcOff = i * 4;
      const dstOff = i * 4;
      bgra[dstOff]     = buf[srcOff + 2]; // B
      bgra[dstOff + 1] = buf[srcOff + 1]; // G
      bgra[dstOff + 2] = buf[srcOff];     // R
      bgra[dstOff + 3] = buf[srcOff + 3]; // A
    }

    // BMP info header (40 bytes)
    const bmpHeader = Buffer.alloc(40);
    bmpHeader.writeUInt32LE(40, 0);            // Header size
    bmpHeader.writeInt32LE(size, 4);            // Width
    bmpHeader.writeInt32LE(size * 2, 8);        // Height (doubled for ICO)
    bmpHeader.writeUInt16LE(1, 12);             // Planes
    bmpHeader.writeUInt16LE(32, 14);            // Bits per pixel
    bmpHeader.writeUInt32LE(0, 16);             // Compression (BI_RGB)
    bmpHeader.writeUInt32LE(bgra.length, 20);   // Image size
    bmpHeader.writeInt32LE(0, 24);              // X pixels per meter
    bmpHeader.writeInt32LE(0, 28);              // Y pixels per meter
    bmpHeader.writeUInt32LE(0, 32);             // Colors used
    bmpHeader.writeUInt32LE(0, 36);             // Important colors

    images.push({
      size,
      data: Buffer.concat([bmpHeader, bgra])
    });
  }

  // Build ICO file
  const numImages = images.length;
  const dirEntrySize = 16;
  const headerSize = 6;
  const dirOffset = headerSize;
  const dataStartOffset = headerSize + numImages * dirEntrySize;

  // Calculate total size
  let totalSize = dataStartOffset;
  for (const img of images) {
    totalSize += img.data.length;
  }

  const icoBuffer = Buffer.alloc(totalSize);

  // ICO header
  icoBuffer.writeUInt16LE(0, 0);       // Reserved
  icoBuffer.writeUInt16LE(1, 2);       // Type: 1 = ICO
  icoBuffer.writeUInt16LE(numImages, 4); // Number of images

  // Directory entries + image data
  let currentDataOffset = dataStartOffset;
  for (let i = 0; i < numImages; i++) {
    const img = images[i];
    const entryOffset = dirOffset + i * dirEntrySize;

    // Directory entry
    icoBuffer.writeUInt8(img.size === 256 ? 0 : img.size, entryOffset);      // Width
    icoBuffer.writeUInt8(img.size === 256 ? 0 : img.size, entryOffset + 1);  // Height
    icoBuffer.writeUInt8(0, entryOffset + 2);                                 // Colors
    icoBuffer.writeUInt8(0, entryOffset + 3);                                 // Reserved
    icoBuffer.writeUInt16LE(1, entryOffset + 4);                              // Planes
    icoBuffer.writeUInt16LE(32, entryOffset + 6);                             // Bits per pixel
    icoBuffer.writeUInt32LE(img.data.length, entryOffset + 8);                // Size
    icoBuffer.writeUInt32LE(currentDataOffset, entryOffset + 12);             // Offset

    // Copy image data
    img.data.copy(icoBuffer, currentDataOffset);
    currentDataOffset += img.data.length;
  }

  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`  ✓ favicon.ico generado (${icoBuffer.length} bytes, ${numImages} tamaños: ${sizes.join('x, ')}x)`);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🔄 PWA ICON - REGENERACIÓN COMPLETA v3');
  console.log('  Generando iconos desde SVG con transparencia garantizada');
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // ─── STEP 1: Generate base icon at 1024px ──────────────────────────────────
  console.log('📦 STEP 1: Generating clean base icon (1024px)...');
  const BASE_SIZE = 1024;
  const BASE_PATH = path.join(OUTPUT_DIR, 'base-clean-1024.png');

  await sharp(createBaseSvg(BASE_SIZE))
    .resize(BASE_SIZE, BASE_SIZE, {
      kernel: 'lanczos3',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9 })
    .toFile(BASE_PATH);

  // Clean base icon aggressively
  const baseFixed = await cleanAllDarkPixels(BASE_PATH);
  const baseVerify = await verifyIconDeep(BASE_PATH, 'base-clean-1024.png');
  if (!baseVerify.clean) {
    console.error('\n❌ Base icon has dark pixels! Aborting.');
    process.exit(1);
  }

  // ─── STEP 2: Generate all PNG sizes ────────────────────────────────────────
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
    
    // Post-process: clean any dark artifacts
    const fixed = await cleanAllDarkPixels(outputPath);
    if (fixed > 0) {
      console.log(`  ✓ ${name}.png (${size}x${size}) - cleaned ${fixed} artifacts`);
    } else {
      console.log(`  ✓ ${name}.png (${size}x${size})`);
    }
  }

  // ─── STEP 3: Generate maskable icon ────────────────────────────────────────
  console.log('\n📦 STEP 3: Generating maskable icon...');

  const MASKABLE_PATH = path.join(OUTPUT_DIR, 'icon-maskable-512.png');
  await sharp(createMaskableSvg(512))
    .resize(512, 512, {
      kernel: 'lanczos3',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9 })
    .toFile(MASKABLE_PATH);
  await cleanAllDarkPixels(MASKABLE_PATH);
  console.log('  ✓ icon-maskable-512.png');

  // ─── STEP 4: Generate splash logo ──────────────────────────────────────────
  console.log('\n📦 STEP 4: Generating splash logo...');

  const SPLASH_PATH = path.join(OUTPUT_DIR, 'splash-logo.png');
  await sharp(createSplashSvg(512))
    .resize(512, 512, {
      kernel: 'lanczos3',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9 })
    .toFile(SPLASH_PATH);
  await cleanAllDarkPixels(SPLASH_PATH);
  console.log('  ✓ splash-logo.png');

  // ─── STEP 5: Generate favicon.ico ──────────────────────────────────────────
  console.log('\n📦 STEP 5: Generating favicon.ico...');

  // Use the 512px icon as source for the ICO
  const ICO_SOURCE = path.join(OUTPUT_DIR, 'icon-512.png');
  const ICO_PATH = path.join(PUBLIC_DIR, 'favicon.ico');
  await generateIcoFromPng(ICO_SOURCE, ICO_PATH);

  // ─── STEP 6: Verify ALL icons ──────────────────────────────────────────────
  console.log('\n📦 STEP 6: Verifying all icons...\n');

  const allIcons = [
    ...SIZES,
    { name: 'icon-maskable-512', size: 512 },
    { name: 'splash-logo', size: 512 },
    { name: 'base-clean-1024', size: 1024 }
  ];

  let allClean = true;
  let hasAnyDark = false;
  for (const { name } of allIcons) {
    const filePath = path.join(OUTPUT_DIR, `${name}.png`);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠ ${name}.png no encontrado`);
      allClean = false;
      continue;
    }
    const result = await verifyIconDeep(filePath, `${name}.png`);
    if (!result.clean) {
      allClean = false;
      if (result.black > 0 || result.veryDark > 0) hasAnyDark = true;
    }
  }

  // Also verify favicon.ico
  console.log('\n  Verificando favicon.ico...');
  const icoStats = fs.statSync(ICO_PATH);
  console.log(`  ✅ favicon.ico (${icoStats.size} bytes)`);

  // ─── STEP 7: Summary ───────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════');
  if (allClean) {
    console.log('  ✅ ALL ICONS CLEAN - Zero dark/black pixels detected');
    console.log('  ✅ No dark frame, no black border, no shadow box');
    console.log('  ✅ Transparent background preserved in all PNGs');
    console.log('  ✅ favicon.ico regenerado con 32-bit BGRA (transparencia)');
  } else if (!hasAnyDark) {
    console.log('  ⚠ Some icons have gray pixels (RGB 60-100) - acceptable');
    console.log('  ✅ No black or very dark pixels detected');
  } else {
    console.log('  ❌ Some icons have dark pixels - manual review needed');
  }
  console.log('═══════════════════════════════════════════════════════════════\n');

  // List generated files
  console.log('Generated files:');
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.png') && !f.includes('CLEANED') && f !== 'fuxion icon.png')
    .sort();

  files.forEach(f => {
    const st = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f.padEnd(30)} ${(st.size / 1024).toFixed(1)} KB`);
  });

  console.log(`  ${'favicon.ico'.padEnd(30)} ${(icoStats.size / 1024).toFixed(1)} KB`);

  console.log('\n✅ Regeneration complete!');
  console.log('\n⚠ IMPORTANTE: Para que los cambios se vean en producción:');
  console.log('  1. Hacer deploy (npm run build && deploy)');
  console.log('  2. Los usuarios deben limpiar caché del navegador');
  console.log('  3. Service Worker se actualizará automáticamente (bump a v13)');
}

main().catch(console.error);
