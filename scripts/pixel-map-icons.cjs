/**
 * PWA ICON - PIXEL MAP GENERATOR
 * 
 * Genera un mapa de dónde están los pixeles oscuros/negros
 * para entender visualmente si forman un marco o son artefactos.
 * 
 * Uso: node scripts/pixel-map-icons.cjs
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = 'public/icons';

async function generatePixelMap(filePath) {
  const meta = await sharp(filePath).metadata();
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const fileName = path.basename(filePath);

  console.log(`\n══════════════════════════════════════════════════`);
  console.log(`  🗺️  PIXEL MAP: ${fileName} (${w}x${h})`);
  console.log(`══════════════════════════════════════════════════`);

  // ─── 1. Find ALL non-transparent pixels with their positions ──
  // We'll look for dark pixels (RGB < 80) and map their locations
  const darkPixels = [];
  const veryDarkPixels = [];
  const blackPixels = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * ch;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      
      if (a === 0) continue;
      
      const avg = (r + g + b) / 3;
      
      if (avg < 40) {
        blackPixels.push({ x, y, r, g, b, a });
      } else if (avg < 80) {
        veryDarkPixels.push({ x, y, r, g, b, a });
      } else if (avg < 120) {
        darkPixels.push({ x, y, r, g, b, a });
      }
    }
  }

  console.log(`  Pixeles negros (RGB<40): ${blackPixels.length}`);
  console.log(`  Pixeles muy oscuros (RGB<80): ${veryDarkPixels.length}`);
  console.log(`  Pixeles grises (RGB<120): ${darkPixels.length}`);

  // ─── 2. If black pixels exist, show their positions ───────────
  if (blackPixels.length > 0) {
    console.log(`\n  📍 Posiciones de pixeles NEGROS (RGB<40):`);
    
    // Group by proximity to detect patterns
    const edgePixels = blackPixels.filter(p => 
      p.x < 5 || p.x >= w-5 || p.y < 5 || p.y >= h-5
    );
    const innerPixels = blackPixels.filter(p => 
      p.x >= 5 && p.x < w-5 && p.y >= 5 && p.y < h-5
    );
    
    console.log(`    En borde (outer 5px): ${edgePixels.length}`);
    console.log(`    En interior: ${innerPixels.length}`);
    
    // Show first 20 black pixels with positions
    const showPixels = blackPixels.slice(0, 30);
    for (const p of showPixels) {
      const location = (p.x < 5 || p.x >= w-5 || p.y < 5 || p.y >= h-5) ? 'BORDE' : 'INTERIOR';
      console.log(`    (${p.x},${p.y}) rgb(${p.r},${p.g},${p.b}) alpha=${p.a} [${location}]`);
    }
    if (blackPixels.length > 30) {
      console.log(`    ... y ${blackPixels.length - 30} más`);
    }

    // Check if black pixels form a continuous border
    if (edgePixels.length > 0) {
      // Check each side
      const top = blackPixels.filter(p => p.y < 5);
      const bottom = blackPixels.filter(p => p.y >= h-5);
      const left = blackPixels.filter(p => p.x < 5);
      const right = blackPixels.filter(p => p.x >= w-5);
      
      console.log(`\n  📐 Distribución en bordes:`);
      console.log(`    Superior: ${top.length} pixeles`);
      console.log(`    Inferior: ${bottom.length} pixeles`);
      console.log(`    Izquierdo: ${left.length} pixeles`);
      console.log(`    Derecho: ${right.length} pixeles`);
      
      if (top.length > 5 && bottom.length > 5 && left.length > 5 && right.length > 5) {
        console.log(`  ❌ DIAGNÓSTICO: Los pixeles negros forman un MARCO COMPLETO alrededor del icono`);
      } else if (edgePixels.length > 0) {
        console.log(`  ⚠ DIAGNÓSTICO: Pixeles negros en borde pero no forman marco completo (artefactos de interpolación)`);
      }
    }
  }

  // ─── 3. Show very dark pixel positions ───────────────────────
  if (veryDarkPixels.length > 0) {
    console.log(`\n  📍 Posiciones de pixeles MUY OSCUROS (RGB 40-80):`);
    const edgeVD = veryDarkPixels.filter(p => 
      p.x < 5 || p.x >= w-5 || p.y < 5 || p.y >= h-5
    );
    const innerVD = veryDarkPixels.filter(p => 
      p.x >= 5 && p.x < w-5 && p.y >= 5 && p.y < h-5
    );
    console.log(`    En borde: ${edgeVD.length}`);
    console.log(`    En interior: ${innerVD.length}`);
    
    const showVD = veryDarkPixels.slice(0, 20);
    for (const p of showVD) {
      const location = (p.x < 5 || p.x >= w-5 || p.y < 5 || p.y >= h-5) ? 'BORDE' : 'INTERIOR';
      console.log(`    (${p.x},${p.y}) rgb(${p.r},${p.g},${p.b}) alpha=${p.a} [${location}]`);
    }
    if (veryDarkPixels.length > 20) {
      console.log(`    ... y ${veryDarkPixels.length - 20} más`);
    }
  }

  // ─── 4. Generate ASCII art of the icon (for small icons) ──────
  if (w <= 64 && h <= 64) {
    console.log(`\n  🎨 Mapa ASCII (cada pixel = 2 chars):`);
    console.log(`  Legend: █=negro ▓=oscuro ▒=gris ░=claro ·=transparente`);
    console.log('');
    
    for (let y = 0; y < h; y++) {
      let line = '  ';
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * ch;
        const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
        
        if (a === 0) {
          line += '· ';
        } else {
          const avg = (r + g + b) / 3;
          if (avg < 40) line += '██';
          else if (avg < 80) line += '▓▓';
          else if (avg < 120) line += '▒▒';
          else if (avg < 180) line += '░░';
          else line += '  ';
        }
      }
      console.log(line);
    }
  }

  return {
    fileName,
    blackPixels: blackPixels.length,
    veryDarkPixels: veryDarkPixels.length,
    darkPixels: darkPixels.length,
    hasFrame: blackPixels.filter(p => p.x < 5 || p.x >= w-5 || p.y < 5 || p.y >= h-5).length > 20
  };
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🗺️  PWA ICON - PIXEL MAP GENERATOR');
  console.log('  Mapeando posición exacta de pixeles oscuros');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const files = [
    'icon-512.png',
    'icon-192.png',
    'apple-touch-icon.png',
    'favicon-32.png',
    'favicon-16.png',
    'base-clean-1024.png'
  ];

  for (const file of files) {
    const filePath = path.join(ICONS_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log(`\n⚠ ${file} no encontrado`);
      continue;
    }
    try {
      await generatePixelMap(filePath);
    } catch (e) {
      console.error(`  ✗ Error: ${e.message}`);
    }
  }
}

main().catch(console.error);
