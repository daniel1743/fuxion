const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'public', 'images', 'articles');
const DST_DIR = path.join(__dirname, '..', 'public', 'images', 'articles-webp');

// Ensure destination dir
if (!fs.existsSync(DST_DIR)) fs.mkdirSync(DST_DIR, { recursive: true });

const files = fs.readdirSync(SRC_DIR).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
console.log(`Found ${files.length} images to convert\n`);

let processed = 0;
let totalOriginal = 0;
let totalConverted = 0;

async function convert() {
  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const baseName = path.basename(file, path.extname(file));
    const dstPath = path.join(DST_DIR, `${baseName}.webp`);

    const stats = fs.statSync(srcPath);
    const origSize = stats.size;
    totalOriginal += origSize;

    try {
      await sharp(srcPath)
        .resize(1200, 630, {
          fit: 'cover',
          position: 'center',
          kernel: sharp.kernel.lanczos3,
        })
        .webp({ quality: 80, smartSubsample: true })
        .toFile(dstPath);

      const convStats = fs.statSync(dstPath);
      const convSize = convStats.size;
      totalConverted += convSize;
      const savings = ((1 - convSize / origSize) * 100).toFixed(0);

      console.log(`✓ ${file.padEnd(50)} ${origSize / 1024 / 1024 > 1 ? (origSize / 1024 / 1024).toFixed(1) + 'MB' : (origSize / 1024).toFixed(0) + 'KB'} → ${convSize / 1024 / 1024 > 1 ? (convSize / 1024 / 1024).toFixed(1) + 'MB' : (convSize / 1024).toFixed(0) + 'KB'} (${savings}% reduction)`);
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }

    processed++;
  }

  console.log(`\nDone! ${processed}/${files.length} converted`);
  console.log(`Total: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalConverted / 1024 / 1024).toFixed(1)}MB (${((1 - totalConverted / totalOriginal) * 100).toFixed(0)}% saved)`);
}

convert();
