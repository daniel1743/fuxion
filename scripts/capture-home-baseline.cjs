const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const url = 'http://localhost:3000/';
const outDir = './auditorias';

async function findBrowser() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Chromium\\Application\\chrome.exe',
    'C:\\Program Files\\Chromium\\Application\\chrome.exe',
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  ];

  for (const p of candidates) {
    const fs = require('fs');
    if (fs.existsSync(p)) return p;
  }
  return null;
}

(async () => {
  const browserPath = await findBrowser();

  let browser;
  if (browserPath) {
    browser = await puppeteer.launch({
      executablePath: browserPath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      headless: true,
    });
  } else {
    // Try downloading Chromium
    try {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        headless: true,
      });
    } catch (e) {
      console.error('Could not launch browser:', e.message);
      process.exit(1);
    }
  }

  const page = await browser.newPage();
  await page.setCookie({
    name: 'theme',
    value: 'dark',
    domain: 'localhost',
    path: '/',
  });

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

  for (const vp of viewports) {
    await page.setViewport({ width: vp.w, height: vp.h });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('h1, .container', { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    const filename = `${outDir}/${vp.name}.png`;
    await page.screenshot({ path: filename, fullPage: true, type: 'png' });
    console.log(`✅ ${filename} (${vp.w}x${vp.h})`);
  }

  await browser.close();
  console.log('Done!');
})();
