import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const config = {
  maxDuration: 60,
};

const LOCAL_CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
];

async function getExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return chromium.executablePath();
  }

  const fs = await import('node:fs');
  return LOCAL_CHROME_PATHS.find((candidate) => fs.existsSync(candidate)) || chromium.executablePath();
}

function sanitizeFilename(filename = 'Plan_Bienestar_en_Claro.pdf') {
  return String(filename)
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 120) || 'Plan_Bienestar_en_Claro.pdf';
}

export default async function handler(req, res) {
  const startedAt = Date.now();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { html, filename = 'Plan_Bienestar_en_Claro.pdf' } = req.body || {};
  if (!html || typeof html !== 'string') {
    return res.status(400).json({ error: 'html es requerido para renderizar el PDF.' });
  }

  let browser;
  try {
    const executablePath = await getExecutablePath();
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 45_000,
    });

    await page.emulateMediaType('print');
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      const images = Array.from(document.images || []);
      await Promise.all(images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      }));
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    });

    console.info('[render-report-pdf] PDF generado', {
      elapsedMs: Date.now() - startedAt,
      bytes: pdfBuffer.length,
    });

    res.status(200);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizeFilename(filename)}"`);
    res.setHeader('Cache-Control', 'no-store');
    return res.end(pdfBuffer);
  } catch (error) {
    console.error('[render-report-pdf] Error generando PDF', {
      elapsedMs: Date.now() - startedAt,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      error: 'No se pudo renderizar el PDF limpio.',
      message: error.message,
      elapsed_ms: Date.now() - startedAt,
    });
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
