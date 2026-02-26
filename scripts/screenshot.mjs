/**
 * Scatta screenshot dell'app con Puppeteer dopo aver atteso il caricamento dati.
 * Usa il Chrome già installato sul sistema (no download aggiuntivi).
 *
 * Uso: node scripts/screenshot.mjs
 */
import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'screenshots');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5174';

const TABS = [
  { id: 'overview',    label: 'Panoramica', file: 'overview.png',    clickText: null },
  { id: 'predictions', label: 'Previsioni', file: 'predictions.png', clickText: 'Previsioni' },
  { id: 'insights',   label: 'Insights',   file: 'insights.png',    clickText: 'Insights' },
];

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  console.log('🚀 Avvio Chrome headless...');
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    defaultViewport: { width: 1400, height: 860 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 860, deviceScaleFactor: 2 });

  console.log(`📡 Navigo a ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });

  // Aspetta che sparisca il loading spinner (attende che appaia la tab bar o la dashboard)
  console.log('⏳ Attendo caricamento dati Appwrite...');
  try {
    await page.waitForFunction(
      () => !document.querySelector('body')?.innerText?.includes('Loading expenses'),
      { timeout: 20000, polling: 500 }
    );
  } catch {
    console.log('⚠️  Timeout attesa dati — scatto comunque');
  }
  await wait(1200); // animazioni CSS

  for (const tab of TABS) {
    if (tab.clickText) {
      // Clicca sul pulsante tab
      const btn = await page.evaluateHandle((text) => {
        const buttons = [...document.querySelectorAll('button')];
        return buttons.find(b => b.innerText.includes(text));
      }, tab.clickText);
      if (btn && btn.asElement()) {
        await btn.asElement().click();
        await wait(800); // attende animazione tab
      }
    }

    const filePath = path.join(OUT, tab.file);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`✅ Screenshot salvato: ${tab.file}`);
  }

  await browser.close();
  console.log('\n🎉 Tutti gli screenshot completati!');
  console.log(`📁 Cartella: ${OUT}`);
})();
