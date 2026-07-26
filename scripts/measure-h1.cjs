const puppeteer = require('puppeteer-core');

const url = 'http://localhost:3000/';

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
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForSelector('h1, .container', { timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  const measurements = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const footer = document.querySelector('footer');
    const lastSection = sections[sections.length - 1];

    if (!footer || !lastSection) return { error: 'Missing elements' };

    const lastRect = lastSection.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    return {
      lastSectionBottom: lastRect.bottom,
      footerTop: footerRect.top,
      distance: footerRect.top - lastRect.bottom,
      footerPaddingTop: parseInt(getComputedStyle(footer).paddingTop),
      footerPaddingBottom: parseInt(getComputedStyle(footer).paddingBottom),
      footerMarginTop: parseInt(getComputedStyle(footer).marginTop),
      bodyHeight: document.body.scrollHeight,
    };
  });

  console.log(JSON.stringify(measurements, null, 2));

  // Also measure MobileBottomNav overlap
  const bottomNav = await page.evaluate(() => {
    const nav = document.querySelector('nav[role="navigation"], .fixed.bottom-0');
    if (!nav) return { found: false };
    const rect = nav.getBoundingClientRect();
    return { found: true, top: rect.top, height: rect.height };
  });

  console.log('MobileBottomNav:', JSON.stringify(bottomNav));

  await browser.close();
})();
