const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, '../public/branding/mujer logo.svg');
const outDir = path.join(__dirname, '../public/branding/pwa');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Android Maskable Icons Safe Zone:
// The icon needs a background color (usually) and the logo should fit within the inner 80% safe zone.
// Standard icon padding is typically around 10-15%.
// For maskable, the safe zone is a circle with radius 40% of the image size.
const processIcons = async () => {
  try {
    console.log('Auditing and Regenerating PWA Icons from master SVG...');
    
    const svgBuffer = fs.readFileSync(svgPath);

    // 1. icon-192.png (Transparent background, standard padding)
    console.log('Generating icon-192.png...');
    await sharp(svgBuffer)
      .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outDir, 'icon-192.png'));

    // 2. icon-512.png (Transparent background, standard padding)
    console.log('Generating icon-512.png...');
    await sharp(svgBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outDir, 'icon-512.png'));

    // For maskable icons, we need to ensure the logo is scaled down 
    // to fit perfectly within the 80% safe zone of the maskable canvas.
    // Also, maskable icons usually require a solid background color.
    // The background color of our splash screen is #FCFBF8
    
    // We create a composite: A solid #FCFBF8 background with the resized SVG on top.
    const createMaskable = async (size) => {
      // Safe zone is usually 80% of the size. Let's make the logo 75% to be safe and beautiful.
      const logoSize = Math.floor(size * 0.75);
      
      const resizedSvg = await sharp(svgBuffer)
        .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: '#FCFBF8'
        }
      })
      .composite([{ input: resizedSvg, gravity: 'center' }])
      .png()
      .toFile(path.join(outDir, `maskable-${size}.png`));
    };

    console.log('Generating maskable-192.png...');
    await createMaskable(192);

    console.log('Generating maskable-512.png...');
    await createMaskable(512);

    console.log('✅ All icons generated successfully!');

  } catch (error) {
    console.error('Error generating icons:', error);
  }
};

processIcons();
