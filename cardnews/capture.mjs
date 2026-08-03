// 카드뉴스 HTML → PNG. 사용법: node capture.mjs <에피소드폴더>
import { chromium } from 'playwright';
import { mkdirSync, readdirSync } from 'fs';
import { resolve } from 'path';

const ep = resolve(process.argv[2] ?? 'episodes/260803_백세시대');
mkdirSync(resolve(ep, 'out'), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1080,height:1350}, deviceScaleFactor:1 });
await page.goto('file://' + resolve(ep, 'index.html'), { waitUntil:'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);

const ids = await page.$$eval('section.card', els => els.map(e => e.id));
for (const [i, id] of ids.entries()) {
  const n = String(i + 1).padStart(2, '0');
  await page.locator('#' + id).screenshot({ path: resolve(ep, `out/card-${n}.png`) });
}
await browser.close();
console.log(`${ids.length}장 캡처 완료 → ${ep}/out`);
console.log(readdirSync(resolve(ep,'out')).join('  '));
