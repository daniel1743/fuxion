/**
 * PWA ICON - VISUAL AUDIT DEEP
 * 
 * Detecta cualquier pixel oscuro en el borde/marco del icono
 * que sea visible al ojo humano, incluso si no es negro puro.
 * 
 * Uso: node scripts/visual-audit-icons.cjs
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = 'public/icons';

// Thresholds más realistas para detección visual
const DARK_THRESHOLD = 80;  // RGB < 80 es visiblemente oscuro
const VERY_DARK = 40;       // RGB < 40 es muy oscuro
const MID_DARK = 120;       // RGB < 120 es gris visible

async function deepAudit(filePath) {
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
  console.log(`  📊 ${fileName} (${w}x${h})`);
  console.log(`══════════════════════════════════════════════════`);

  // ─── 1. Análisis de borde exterior (outer ring) ──────────────
  // Analizar el borde en diferentes grosores
  for (const borderWidth of [1, 2, 3, 5, 10]) {
    let darkPixels = 0;
    let veryDarkPixels = 0;
    let midPixels = 0;
    let totalBorder = 0;
    let darkByChannel = { r: [], g: [], b: [] };

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const inBorder = (
          x < borderWidth || x >= w - borderWidth ||
          y < borderWidth || y >= h - borderWidth
        );
        if (!inBorder) continue;

        const idx = (y * w + x) * ch;
        const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
        totalBorder++;

        if (a > 0) {
          const avg = (r + g + b) / 3;
          if (avg < VERY_DARK) {
            veryDarkPixels++;
            darkPixels++;
            darkByChannel.r.push(r);
            darkByChannel.g.push(g);
            darkByChannel.b.push(b);
          } else if (avg < DARK_THRESHOLD) {
            darkPixels++;
            darkByChannel.r.push(r);
            darkByChannel.g.push(g);
            darkByChannel.b.push(b);
          } else if (avg < MID_DARK) {
            midPixels++;
          }
        }
      }
    }

    if (darkPixels > 0 || veryDarkPixels > 0) {
      const avgR = darkByChannel.r.length > 0 ? (darkByChannel.r.reduce((a,b) => a+b, 0) / darkByChannel.r.length).toFixed(1) : '-';
      const avgG = darkByChannel.g.length > 0 ? (darkByChannel.g.reduce((a,b) => a+b, 0) / darkByChannel.g.length).toFixed(1) : '-';
      const avgB = darkByChannel.b.length > 0 ? (darkByChannel.b.reduce((a,b) => a+b, 0) / darkByChannel.b.length).toFixed(1) : '-';
      console.log(`  Borde ${borderWidth}px: oscuros=${darkPixels}/${totalBorder} (${(darkPixels/totalBorder*100).toFixed(1)}%) | muy_oscuros=${veryDarkPixels} | grises=${midPixels} | avg_rgb=(${avgR},${avgG},${avgB})`);
    }
  }

  // ─── 2. Análisis de esquinas (5x5) ───────────────────────────
  const corners = {
    'top-left': { x: 0, y: 0 },
    'top-right': { x: Math.max(0, w-5), y: 0 },
    'bottom-left': { x: 0, y: Math.max(0, h-5) },
    'bottom-right': { x: Math.max(0, w-5), y: Math.max(0, h-5) }
  };

  for (const [name, pos] of Object.entries(corners)) {
    let darkCount = 0;
    let totalPx = 0;
    let samples = [];
    for (let y = pos.y; y < pos.y + 5 && y < h; y++) {
      for (let x = pos.x; x < pos.x + 5 && x < w; x++) {
        const idx = (y * w + x) * ch;
        const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
        totalPx++;
        if (a > 0) {
          const avg = (r + g + b) / 3;
          if (avg < DARK_THRESHOLD) darkCount++;
          if (samples.length < 3) samples.push(`rgb(${r},${g},${b})`);
        }
      }
    }
    if (darkCount > 0) {
      console.log(`  ⚠ Esquina ${name}: ${darkCount}/${totalPx} oscuros | muestras: ${samples.join(', ')}`);
    } else {
      console.log(`  ✅ Esquina ${name}: limpia`);
    }
  }

  // ─── 3. Mapa de densidad de borde (anillo exterior 10%) ──────
  const ringWidth = Math.round(Math.min(w, h) * 0.1);
  let ringDark = 0;
  let ringTotal = 0;
  let ringSamples = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const inRing = (
        x < ringWidth || x >= w - ringWidth ||
        y < ringWidth || y >= h - ringWidth
      );
      if (!inRing) continue;

      const idx = (y * w + x) * ch;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      ringTotal++;
      if (a > 0) {
        const avg = (r + g + b) / 3;
        if (avg < DARK_THRESHOLD) {
          ringDark++;
          if (ringSamples.length < 5) ringSamples.push(`rgb(${r},${g},${b})`);
        }
      }
    }
  }

  if (ringDark > 0) {
    console.log(`  ⚠ Anillo exterior 10%: ${ringDark} pixeles oscuros | muestras: ${ringSamples.join(', ')}`);
  } else {
    console.log(`  ✅ Anillo exterior 10%: limpio`);
  }

  // ─── 4. Análisis interior (centro 80%) ───────────────────────
  const innerX = Math.round(w * 0.1);
  const innerY = Math.round(h * 0.1);
  const innerW = Math.round(w * 0.8);
  const innerH = Math.round(h * 0.8);
  let innerDark = 0;
  let innerTotal = 0;

  for (let y = innerY; y < innerY + innerH && y < h; y++) {
    for (let x = innerX; x < innerX + innerW && x < w; x++) {
      const idx = (y * w + x) * ch;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      innerTotal++;
      if (a > 0 && (r + g + b) / 3 < DARK_THRESHOLD) innerDark++;
    }
  }

  if (innerDark > 0) {
    console.log(`  ⚠ Area interior 80%: ${innerDark} pixeles oscuros (posible marco interno)`);
  } else {
    console.log(`  ✅ Area interior 80%: limpia`);
  }

  // ─── 5. Estadísticas generales de color ──────────────────────
  let minR = 255, minG = 255, minB = 255;
  let maxR = 0, maxG = 0, maxB = 0;
  let totalVis = 0;
  let sumR = 0, sumG = 0, sumB = 0;

  for (let i = 0; i < data.length; i += ch) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (a > 0) {
      totalVis++;
      sumR += r; sumG += g; sumB += b;
      if (r < minR) minR = r;
      if (g < minG) minG = g;
      if (b < minB) minB = b;
      if (r > maxR) maxR = r;
      if (g > maxG) maxG = g;
      if (b > maxB) maxB = b;
    }
  }

  const avgR = (sumR / totalVis).toFixed(1);
  const avgG = (sumG / totalVis).toFixed(1);
  const avgB = (sumB / totalVis).toFixed(1);

  console.log(`  Colores: min_rgb(${minR},${minG},${minB}) max_rgb(${maxR},${maxG},${maxB}) avg_rgb(${avgR},${avgG},${avgB})`);

  // ─── 6. Detección de "cuadro negro" alrededor del logo ──────
  // Buscar si hay un rectángulo de pixeles oscuros formando un marco
  let frameDetected = false;
  let framePixels = 0;

  // Escanear filas horizontales en el borde superior e inferior
  for (let y of [0, 1, 2, h-3, h-2, h-1]) {
    if (y < 0 || y >= h) continue;
    let rowDark = 0;
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * ch;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a > 0 && (r + g + b) / 3 < DARK_THRESHOLD) rowDark++;
    }
    if (rowDark > w * 0.3) { // Más del 30% de la fila es oscura
      frameDetected = true;
      framePixels += rowDark;
    }
  }

  // Escanear columnas verticales en el borde izquierdo y derecho
  for (let x of [0, 1, 2, w-3, w-2, w-1]) {
    if (x < 0 || x >= w) continue;
    let colDark = 0;
    for (let y = 0; y < h; y++) {
      const idx = (y * w + x) * ch;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a > 0 && (r + g + b) / 3 < DARK_THRESHOLD) colDark++;
    }
    if (colDark > h * 0.3) {
      frameDetected = true;
      framePixels += colDark;
    }
  }

  if (frameDetected) {
    console.log(`  ❌ MARCO DETECTADO: ~${framePixels} pixeles oscuros formando borde`);
  } else {
    console.log(`  ✅ Sin marco detectado`);
  }

  return {
    fileName,
    hasFrame: frameDetected,
    framePixels,
    borderDark: ringDark,
    innerDark,
    minR, minG, minB, maxR, maxG, maxB,
    avgR, avgG, avgB
  };
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🔍 PWA ICON - DEEP VISUAL AUDIT');
  console.log('  Detectando marcos, bordes oscuros y sombras visibles');
  console.log('  Umbral oscuro: RGB < 80 (visible al ojo humano)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const files = [
    'icon-512.png',
    'icon-192.png',
    'apple-touch-icon.png',
    'favicon-32.png',
    'favicon-16.png',
    'icon-maskable-512.png',
    'base-clean-1024.png'
  ];

  const results = [];
  for (const file of files) {
    const filePath = path.join(ICONS_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log(`\n⚠ ${file} no encontrado`);
      continue;
    }
    try {
      const result = await deepAudit(filePath);
      results.push(result);
    } catch (e) {
      console.error(`  ✗ Error: ${e.message}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📋 RESUMEN FINAL');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let hasAnyIssue = false;
  for (const r of results) {
    const issues = [];
    if (r.hasFrame) issues.push('MARCO');
    if (r.borderDark > 10) issues.push(`BORDE(${r.borderDark}px)`);
    if (r.innerDark > 10) issues.push(`INTERIOR(${r.innerDark}px)`);
    
    const status = issues.length > 0 ? `❌ ${issues.join(' + ')}` : '✅ LIMPIO';
    if (issues.length > 0) hasAnyIssue = true;
    
    console.log(`  ${status.padEnd(40)} ${r.fileName.padEnd(25)} avg:rgb(${r.avgR},${r.avgG},${r.avgB})`);
  }

  if (hasAnyIssue) {
    console.log('\n⚠ Se detectaron problemas visuales en algunos iconos');
  } else {
    console.log('\n✅ Todos los iconos visualmente limpios');
  }
}

main().catch(console.error);
