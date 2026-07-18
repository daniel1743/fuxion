const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcNormal = 'public/branding/branding fondo blanco.png';
const srcTrans = 'public/branding/branding transparente-1.png';

async function createBase64Svg(imagePath, outPath) {
  const meta = await sharp(imagePath).metadata();
  const buffer = await sharp(imagePath).png().toBuffer();
  const base64 = buffer.toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${meta.width} ${meta.height}">
    <image width="${meta.width}" height="${meta.height}" href="data:image/png;base64,${base64}"/>
  </svg>`;
  fs.writeFileSync(outPath, svg);
}

async function run() {
  console.log('Generating Logos...');
  const logosTrans = ['logo-primary', 'logo-light', 'logo-dark', 'logo-navbar', 'logo-footer', 'logo-horizontal', 'logo-square', 'isotype', 'logo-watermark'];
  for (const name of logosTrans) {
    await createBase64Svg(srcTrans, `public/branding/logo/${name}.svg`);
  }
  await createBase64Svg(srcNormal, `public/branding/logo/logo-print.svg`);
  
  console.log('Generating Favicons...');
  const faviconBuffer = await sharp(srcTrans).resize(256, 256).png().toBuffer();
  const faviconBase64 = faviconBuffer.toString('base64');
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
    <image width="256" height="256" href="data:image/png;base64,${faviconBase64}"/>
  </svg>`;
  fs.writeFileSync(`public/branding/favicon/favicon.svg`, faviconSvg);

  const faviconSizes = [16, 32, 48, 96];
  for (const size of faviconSizes) {
    await sharp(srcTrans).resize(size, size).png().toFile(`public/branding/favicon/favicon-${size}.png`);
  }
  
  // ICO generation is complex in node, so we'll just write the 32x32 png as an ico which most modern browsers support
  const icoBuffer = await sharp(srcTrans).resize(32, 32).png().toBuffer();
  fs.writeFileSync('public/branding/favicon/favicon.ico', icoBuffer);

  console.log('Generating Apple Icons...');
  await sharp(srcTrans).resize(180, 180).png().toFile('public/branding/pwa/apple-touch-icon.png');
  await sharp(srcTrans).resize(180, 180).png().toFile('public/branding/pwa/apple-touch-icon-180.png');

  console.log('Generating Android Icons...');
  const androidSizes = [72, 96, 128, 144, 152, 192, 384, 512];
  for (const size of androidSizes) {
    await sharp(srcTrans).resize(size, size).png().toFile(`public/branding/pwa/icon-${size}.png`);
  }

  console.log('Generating Maskable Icons...');
  // Maskable icons need 20% safe zone padding.
  for (const size of [192, 512]) {
    const innerSize = Math.floor(size * 0.8);
    await sharp(srcNormal)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .extend({
        top: Math.floor((size - innerSize) / 2),
        bottom: Math.ceil((size - innerSize) / 2),
        left: Math.floor((size - innerSize) / 2),
        right: Math.ceil((size - innerSize) / 2),
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(`public/branding/pwa/maskable-${size}.png`);
  }

  console.log('Generating Social Assets...');
  await sharp(srcNormal).resize(1200, 630, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile('public/branding/social/og-image.png');
  await sharp(srcNormal).resize(1200, 600, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile('public/branding/social/twitter-card.png');
  await sharp(srcNormal).resize(1080, 1080, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile('public/branding/social/share-image.png');

  console.log('All branding assets generated successfully.');
}

run().catch(console.error);
