const puppeteer = require('puppeteer-core');

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
  const fs = require('fs');
  for (const p of candidates) {
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
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      headless: true,
    });
  }

  const page = await browser.newPage();
  // Light mode — no theme cookie
  await page.setCookie({
    name: 'theme',
    value: 'light',
    domain: 'localhost',
    path: '/',
  });

  const viewports = [
    { name: 'home-320-light', w: 320, h: 700 },
    { name: 'home-375-light', w: 375, h: 812 },
    { name: 'home-768-light', w: 768, h: 1024 },
    { name: 'home-1024-light', w: 1024, h: 900 },
    { name: 'home-1440-light', w: 1440, h: 1000 },
    { name: 'home-390-light', w: 390, h: 844 },
    { name: 'home-412-light', w: 412, h: 915 },
    { name: 'home-1280-light', w: 1280, h: 900 },
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
