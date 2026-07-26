import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const url = 'http://localhost:3000/';
const outDir = './auditorias';
const viewports = [
  { name: 'home-320-baseline', w: 320, h: 700 },
  { name: 'home-375-baseline', w: 375, h: 812 },
  { name: 'home-768-baseline', w: 768, h: 1024 },
  { name: 'home-1024-baseline', w: 1024, h: 900 },
  { name: 'home-1440-baseline', w: 1440, h: 1000 },
  { name: 'home-390-baseline', w: 390, h: 844 },
  { name: 'home-412-baseline', w: 412, h: 915 },
  { name: 'home-1280-baseline', w: 1280, h: 900 },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromium.getPath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage();

  // Set dark mode via cookie
  await page.setCookie({
    name: 'theme',
    value: 'dark',
    domain: 'localhost',
    path: '/',
  });

  for (const vp of viewports) {
    await page.setViewport({ width: vp.w, height: vp.h });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for main content to render
    await page.waitForSelector('h1, .container', { timeout: 10000 }).catch(() => {});

    // Wait a bit for animations
    await new Promise(r => setTimeout(r, 2000));

    const filename = `${outDir}/${vp.name}.png`;
    await page.screenshot({ path: filename, fullPage: true, type: 'png' });
    console.log(`✅ ${filename} (${vp.w}x${vp.h})`);
  }

  await browser.close();
  console.log('Done!');
})();
