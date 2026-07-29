const puppeteer = require('puppeteer-core');

const url = 'http://localhost:3000/';
const outDir = './auditorias';

async function findBrowser() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
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
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      headless: true,
    });
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForSelector('h1, .container', { timeout: 10000 }).catch(() => {});

  // Open the mobile menu by clicking the hamburger button
  const hamburger = await page.$('button[aria-label="Menú principal"]');
  if (hamburger) {
    await hamburger.click();
    await new Promise(r => setTimeout(r, 500));
  }

  // Take screenshot of the drawer
  await page.screenshot({
    path: `${outDir}/sidebar-after-375.png`,
    fullPage: true,
    type: 'png'
  });
  console.log('✅ sidebar-after-375.png');

  await browser.close();
})();
