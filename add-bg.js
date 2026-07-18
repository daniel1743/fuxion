import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pwaDir = path.join(__dirname, 'public', 'branding', 'pwa');
const backupDir = path.join(__dirname, 'public', 'branding', 'pwa_backup');

async function addBackgroundToIcons() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const files = fs.readdirSync(pwaDir).filter(f => f.endsWith('.png'));
  
  for (const file of files) {
    const inputPath = path.join(pwaDir, file);
    const backupPath = path.join(backupDir, file);
    
    // Backup the original file
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
    }

    const { width, height } = await sharp(backupPath).metadata();
    
    // For maskable icons, we should use a solid background.
    // For apple-touch and standard icons, the user wants a background too.
    console.log(`Processing ${file} (${width}x${height})...`);
    
    // Create a solid background image
    const background = sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 252, g: 251, b: 248, alpha: 1 } // #FCFBF8
      }
    });

    // Composite the original image over the background
    await background
      .composite([{ input: backupPath, blend: 'over' }])
      .png()
      .toFile(inputPath);
      
    console.log(`Updated ${file} with solid background #FCFBF8.`);
  }
}

addBackgroundToIcons().catch(console.error);
