// 프로필 마크 캡처 (1080x1080 정사각)
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
const dir = resolve('profile');
mkdirSync(resolve(dir,'out'), { recursive:true });
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1080,height:1080}, deviceScaleFactor:1 });
await p.goto('file://'+resolve(dir,'index.html'), { waitUntil:'networkidle' });
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(1500);
const ids = await p.$$eval('section.mark', els=>els.map(e=>e.id));
for (const id of ids) await p.locator('#'+id).screenshot({ path: resolve(dir,`out/${id}.png`) });
await b.close();
console.log(ids.length+'개 캡처: '+ids.join(' '));
