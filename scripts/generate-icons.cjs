/**
 * PWA Icon Generator - Regenera todos los iconos con transparencia real
 * 
 * Usa sharp para procesamiento profesional de imágenes PNG con canal alpha.
 * 
 * Uso: node scripts/generate-icons.cjs
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ─── CONFIGURACIÓN ───────────────────────────────────────────────────────────

const SOURCE_ICON = 'public/icons/fuxion icon CLEANED.png';
const OUTPUT_DIR = 'public/icons';

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
const GREEN_DARK = '#047857';     // emerald-700
const WHITE = '#ffffff';

/**
 * Creates a maskable icon with proper padding (20% safe zone)
 * Uses a green circle with white "F" or leaf icon
 */
async function createMaskableIcon(size, outputPath) {
  const padding = Math.round(size * 0.2); // 20% padding per PWA guidelines
  const circleRadius = Math.round((size - padding * 2) / 2);
  const center = Math.round(size / 2);

  // Create SVG with green circle and white leaf/X icon
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Green circle background (safe zone) -->
      <circle cx="${center}" cy="${center}" r="${circleRadius}" fill="${GREEN_PRIMARY}" />
      
      <!-- White leaf/X icon in center -->
      <g transform="translate(${center}, ${center}) scale(${circleRadius * 0.035})">
        <!-- Leaf shape -->
        <path d="M-10,-14 C-6,-18 2,-18 6,-14 C10,-10 12,-2 8,4 C4,10 -4,14 -8,10 C-12,6 -14,-2 -10,-8 Z" 
              fill="${WHITE}" transform="rotate(-45)" />
        <!-- Stem -->
        <path d="M0,0 L0,16" stroke="${WHITE}" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath);

  console.log(`  ✓ Maskable ${size}x${size} -> ${path.basename(outputPath)}`);
}

/**
 * Creates a regular icon from source with transparency.
 * The source image has no alpha channel, so we composite it onto a transparent background.
 */
async function createIcon(sourcePath, outputPath, size) {
  // First, ensure the source has an alpha channel by adding one
  // Then resize with transparent background
  await sharp(sourcePath)
    .ensureAlpha()        // Add alpha channel (defaults to opaque white)
    .toColorspace('srgb') // Ensure sRGB colorspace
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
    })
    .png({ 
      compressionLevel: 9,
      palette: false      // Ensure full alpha, not palette-based
    })
    .toFile(outputPath);

  console.log(`  ✓ ${size}x${size} -> ${path.basename(outputPath)}`);
}

/**
 * Verify the generated PNG has alpha channel
 */
async function verifyAlpha(filePath) {
  try {
    const meta = await sharp(filePath).metadata();
    if (!meta.hasAlpha) {
      console.warn(`  ⚠ WARNING: ${path.basename(filePath)} missing alpha channel!`);
      return false;
    }
    // Also check that the image actually has transparent pixels
    const stats = await sharp(filePath).stats();
    const alphaStats = stats.channels[3]; // Alpha channel stats
    if (alphaStats && alphaStats.min < 255) {
      console.log(`  ✓ Alpha verified (min alpha: ${alphaStats.min})`);
    } else if (alphaStats) {
      console.log(`  ✓ Alpha channel present (fully opaque pixels)`);
    }
    return true;
  } catch (e) {
    console.error(`  ✗ ERROR verifying ${path.basename(filePath)}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  PWA Icon Generator - Transparencia Real');
  console.log('═══════════════════════════════════════════\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Verify source exists
  if (!fs.existsSync(SOURCE_ICON)) {
    console.error(`✗ Source icon not found: ${SOURCE_ICON}`);
    console.error('  Looking for alternative sources...');
    const files = fs.readdirSync('public').filter(f => 
      f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
    );
    files.forEach(f => console.error(`  - public/${f}`));
    process.exit(1);
  }

  const sourceMeta = await sharp(SOURCE_ICON).metadata();
  console.log(`Source: ${SOURCE_ICON}`);
  console.log(`  Size: ${sourceMeta.width}x${sourceMeta.height}`);
  console.log(`  Alpha: ${sourceMeta.hasAlpha}`);
  console.log(`  Format: ${sourceMeta.format}`);
  console.log(`  Channels: ${sourceMeta.channels}\n`);

  // Generate regular icons
  console.log('Generating regular icons...');
  for (const { name, size } of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    await createIcon(SOURCE_ICON, outputPath, size);
  }

  // Generate maskable icons
  console.log('\nGenerating maskable icons...');
  for (const { name, size } of MASKABLE_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    await createMaskableIcon(size, outputPath);
  }

  // Verify all generated icons
  console.log('\nVerifying alpha channels...');
  let allPass = true;
  const allIcons = [...SIZES, ...MASKABLE_SIZES];
  for (const { name } of allIcons) {
    const filePath = path.join(OUTPUT_DIR, `${name}.png`);
    if (fs.existsSync(filePath)) {
      const ok = await verifyAlpha(filePath);
      if (!ok) allPass = false;
    } else {
      console.warn(`  ⚠ File not found: ${name}.png`);
      allPass = false;
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════');
  if (allPass) {
    console.log('  ✅ ALL ICONS GENERATED WITH ALPHA');
  } else {
    console.log('  ⚠ Some icons may have issues');
  }
  console.log(`  Output: ${OUTPUT_DIR}/`);
  console.log(`  Total: ${allIcons.length} icons`);
  console.log('═══════════════════════════════════════════\n');

  // List generated files
  console.log('Generated files:');
  const generatedFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
  generatedFiles.sort().forEach(f => {
    const stats = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f.padEnd(30)} ${(stats.size / 1024).toFixed(1)} KB`);
  });
}

main().catch(console.error);
