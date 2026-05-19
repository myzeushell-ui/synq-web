const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'video_frames');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:3000';

async function shot(page, name, waitMs = 600) {
  await new Promise(r => setTimeout(r, waitMs));
  await page.screenshot({ path: path.join(OUT, name), type: 'png' });
  console.log('✓', name);
}

async function clickNav(page, index) {
  await page.evaluate((i) => {
    document.querySelectorAll('nav button')[i].click();
  }, index);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 390, height: 844 }
  });

  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 15000 });

  // 01 – Home screen
  await shot(page, '01_home.png', 1200);

  // Scroll down on home to show insights
  await page.evaluate(() => { document.querySelector('[class*="overflow-y"]')?.scrollBy(0, 200); });
  await shot(page, '02_home_insights.png', 500);

  // Scroll back up
  await page.evaluate(() => { document.querySelector('[class*="overflow-y"]')?.scrollTo(0, 0); });

  // 03 – Voice modal — switch to English tab
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    btns.find(b => b.textContent.includes('🎙'))?.click();
  });
  await new Promise(r => setTimeout(r, 700));
  // Click the English language tab
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const enBtn = btns.find(b => b.textContent.includes('English') || b.textContent.includes('en'));
    enBtn?.click();
  });
  await shot(page, '03_voice_modal.png', 800);

  // Close
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find(b => b.textContent.includes('Cancel'))?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 04 – Thoughts tab
  await clickNav(page, 1);
  await shot(page, '04_thoughts.png', 800);

  // 05 – Emotions tab
  await clickNav(page, 3);
  await shot(page, '05_emotions.png', 800);

  // 06 – Breathing modal
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find(b => b.textContent.includes('Breathe'))?.click();
  });
  await shot(page, '06_breathing.png', 900);

  // Close breathing
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find(b => b.textContent.includes('Close'))?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 07 – Reminders tab
  await clickNav(page, 4);
  await shot(page, '07_reminders.png', 800);

  // 08 – Reminders calendar view
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const cal = btns.find(b => b.textContent.includes('▦') || b.textContent.includes('⊞') || b.textContent.includes('▩'));
    cal?.click();
  });
  await shot(page, '08_calendar.png', 700);

  // 09 – Desktop marketing view
  await page.setViewport({ width: 1280, height: 800 });
  await page.evaluate(() => window.location.reload());
  await new Promise(r => setTimeout(r, 2000));
  await shot(page, '09_desktop.png', 1000);

  await browser.close();
  console.log('\nAll frames saved to:', OUT);
})();
