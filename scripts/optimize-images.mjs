#!/usr/bin/env node
/**
 * Image Optimization Script — Convert PNG → WebP for Tienda Fuxion Chile
 *
 * Usage:
 *   node scripts/optimize-images.mjs
 *   node scripts/optimize-images.mjs --dry-run   (preview only)
 *   node scripts/optimize-images.mjs --quality 80
 *
 * This script:
 * 1. Finds all PNG images in public directories
 * 2. Converts them to WebP at specified quality (default: 85%)
 * 3. Outputs to a parallel .webp directory structure
 * 4. Reports size savings
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// ── Parse args ────────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-n');
const qualityMatch = args.find(a => a.startsWith('--quality='));
const quality = qualityMatch ? parseInt(qualityMatch.split('=')[1], 10) : 85;

// ── Find all PNGs ─────────────────────────────────────────────
function findPngs(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPngs(fullPath));
    } else if (entry.isFile() && /\.(png|PNG)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

const pngFiles = findPngs(PUBLIC_DIR);
console.log(`\n📸 Found ${pngFiles.length} PNG files\n`);

if (pngFiles.length === 0) {
  console.log('No PNG files found. Nothing to convert.');
  process.exit(0);
}

// ── Process images ────────────────────────────────────────────
let processed = 0;
let totalOriginal = 0;
let totalConverted = 0;
const skipped = [];

for (const pngPath of pngFiles) {
  try {
    const stats = fs.statSync(pngPath);
    const originalSize = stats.size;
    totalOriginal += originalSize;

    // Build WebP path (same name, .webp extension)
    const webpPath = pngPath.replace(/\.png$/i, '.webp');
    const webpDir = path.dirname(webpPath);

    if (!dryRun && !fs.existsSync(webpDir)) {
      fs.mkdirSync(webpDir, { recursive: true });
    }

    if (dryRun) {
      // Estimate WebP size (WebP is typically 25-35% smaller than PNG)
      const estimatedWebp = Math.floor(originalSize * 0.3);
      const saved = originalSize - estimatedWebp;
      const pct = ((saved / originalSize) * 100).toFixed(0);
      console.log(`  [DRY RUN] ${path.relative(PUBLIC_DIR, pngPath)}`);
      console.log(`    ${formatBytes(originalSize)} → ~${formatBytes(estimatedWebp)} (${pct}% smaller)`);
      processed++;
      totalConverted += estimatedWebp;
      continue;
    }

    // Actual conversion
    await sharp(pngPath)
      .webp({ quality, effort: 6 })
      .toFile(webpPath);

    const convertedStats = fs.statSync(webpPath);
    const convertedSize = convertedStats.size;
    const saved = originalSize - convertedSize;
    const pct = ((saved / originalSize) * 100).toFixed(0);

    totalConverted += convertedSize;
    console.log(`  ✓ ${path.relative(PUBLIC_DIR, pngPath)}`);
    console.log(`    ${formatBytes(originalSize)} → ${formatBytes(convertedSize)} (${pct}% smaller)`);
    processed++;
  } catch (err) {
    skipped.push({ path: pngPath, error: err.message });
    console.error(`  ✗ ${path.relative(PUBLIC_DIR, pngPath)} — ${err.message}`);
  }
}

// ── Summary ───────────────────────────────────────────────────
console.log(`\n${'='.repeat(50)}`);
console.log(`Processed: ${processed}/${pngFiles.length} files`);
console.log(`Skipped: ${skipped.length} files`);
if (!dryRun) {
  const totalSaved = totalOriginal - totalConverted;
  const pct = ((totalSaved / totalOriginal) * 100).toFixed(1);
  console.log(`Total saved: ${formatBytes(totalSaved)} (${pct}% reduction)`);
}
console.log(`${'='.repeat(50)}\n`);

// ── Helper ────────────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}
