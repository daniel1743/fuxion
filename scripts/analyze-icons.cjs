/**
 * PWA Icon Alpha Analyzer v2 - Detecta pixeles negros VISIBLES en iconos
 * 
 * v2: Solo cuenta pixeles negros que NO sean transparentes (alpha > 0)
 *     Esto evita falsos positivos de pixeles que ya fueron limpiados.
 * 
 * Uso: node scripts/analyze-icons.cjs
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = 'public/icons';
const BLACK_THRESHOLD = 40; // RGB < 40 considerado "negro"

async function analyzeIcon(filePath) {
  const meta = await sharp(filePath).metadata();
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const fileName = path.basename(filePath);

  console.log(`\n=== ${fileName} ===`);
  console.log(`  Size: ${w}x${h}, Channels: ${ch}, Alpha: ${meta.hasAlpha}`);

  // 1. Check corners (5x5 blocks) - only VISIBLE black pixels (alpha > 0)
  const corners = {
    'top-left': { x: 0, y: 0 },
    'top-right': { x: Math.max(0, w-5), y: 0 },
    'bottom-left': { x: 0, y: Math.max(0, h-5) },
    'bottom-right': { x: Math.max(0, w-5), y: Math.max(0, h-5) }
  };

  for (const [name, pos] of Object.entries(corners)) {
    let blackCount = 0;
    let totalPixels = 0;
    for (let y = pos.y; y < pos.y + 5 && y < h; y++) {
      for (let x = pos.x; x < pos.x + 5 && x < w; x++) {
        const idx = (y * w + x) * ch;
        const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
        if (a > 0 && r < BLACK_THRESHOLD && g < BLACK_THRESHOLD && b < BLACK_THRESHOLD) blackCount++;
        totalPixels++;
      }
    }
    if (blackCount > 0) {
      console.log(`  ⚠ Corner ${name}: ${blackCount}/${totalPixels} visible black pixels`);
    }
  }

  // 2. Count VISIBLE black pixels (alpha > 0 AND RGB < threshold)
  let visibleBlack = 0;
  let transparentPixels = 0;
  let totalPixelsAll = 0;
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    totalPixelsAll++;
    if (a === 0) {
      transparentPixels++;
    } else if (r < BLACK_THRESHOLD && g < BLACK_THRESHOLD && b < BLACK_THRESHOLD) {
      visibleBlack++;
    }
  }
  const blackPct = (visibleBlack / totalPixelsAll * 100).toFixed(2);
  const transPct = (transparentPixels / totalPixelsAll * 100).toFixed(2);
  
  if (visibleBlack > 0) {
    console.log(`  ❌ VISIBLE BLACK pixels: ${visibleBlack}/${totalPixelsAll} (${blackPct}%)`);
  } else {
    console.log(`  ✅ No visible black pixels`);
  }
  console.log(`  Transparent pixels: ${transparentPixels} (${transPct}%)`);

  // 3. Check border pixels (outer 3px) - only visible
  let borderBlack = 0;
  let borderTotal = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x < 3 || x >= w-3 || y < 3 || y >= h-3) {
        const idx = (y * w + x) * ch;
        const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
        if (a > 0 && r < BLACK_THRESHOLD && g < BLACK_THRESHOLD && b < BLACK_THRESHOLD) borderBlack++;
        borderTotal++;
      }
    }
  }
  if (borderBlack > 0) {
    console.log(`  ⚠ Border visible black pixels (outer 3px): ${borderBlack}/${borderTotal}`);
  }

  // 4. Alpha channel stats
  let minAlpha = 255, maxAlpha = 0;
  for (let i = 3; i < data.length; i += ch) {
    if (data[i] < minAlpha) minAlpha = data[i];
    if (data[i] > maxAlpha) maxAlpha = data[i];
  }
  console.log(`  Alpha: min=${minAlpha}, max=${maxAlpha}`);

  return {
    fileName,
    width: w,
    height: h,
    hasAlpha: meta.hasAlpha,
    visibleBlack,
    totalPixels: totalPixelsAll,
    blackPercent: parseFloat(blackPct),
    transparentPixels,
    borderBlack,
    minAlpha,
    maxAlpha
  };
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  PWA Icon Alpha Analyzer v2');
  console.log('  (Solo pixeles negros VISIBLES)');
  console.log('═══════════════════════════════════════════\n');

  const files = fs.readdirSync(ICONS_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();

  const results = [];
  for (const file of files) {
    const filePath = path.join(ICONS_DIR, file);
    try {
      const result = await analyzeIcon(filePath);
      results.push(result);
    } catch (e) {
      console.error(`  ✗ Error analyzing ${file}: ${e.message}`);
    }
  }

  console.log('\n═══════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('═══════════════════════════════════════════');
  let hasIssues = false;
  for (const r of results) {
    const status = r.visibleBlack > 0 ? '❌ HAS VISIBLE BLACK' : '✅ CLEAN';
    if (r.visibleBlack > 0) hasIssues = true;
    console.log(`  ${status.padEnd(22)} ${r.fileName.padEnd(30)} ${r.blackPercent}% visible black`);
  }

  if (hasIssues) {
    console.log('\n❌ VISIBLE BLACK PIXELS DETECTED - Repair needed');
  } else {
    console.log('\n✅ All icons are clean - no visible black pixels');
  }
}

main().catch(console.error);
