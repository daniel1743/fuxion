const puppeteer = require('puppeteer-core');

const url = 'http://localhost:3000/';
const outDir = './auditorias';

async function findBrowser() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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

  const viewports = [
    { name: 'home-375', w: 375, h: 812 },
    { name: 'home-1024', w: 1024, h: 900 },
    { name: 'home-1440', w: 1440, h: 1000 },
  ];

  for (const theme of ['light', 'dark']) {
    for (const vp of viewports) {
      await page.setViewport({ width: vp.w, height: vp.h });

      if (theme === 'dark') {
        await page.evaluate(() => {
          document.body.className = 'dark';
        });
      } else {
        await page.evaluate(() => {
          document.body.className = '';
        });
      }

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('h1, .container', { timeout: 10000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 2000));

      const filename = `${outDir}/home-${vp.name}-${theme}.png`;
      await page.screenshot({ path: filename, fullPage: true, type: 'png' });
      console.log(`✅ ${filename} (${vp.w}x${vp.h}) ${theme}`);
    }
  }

  await browser.close();
  console.log('Done!');
})();
