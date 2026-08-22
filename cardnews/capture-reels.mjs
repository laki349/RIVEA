// 릴스 장면을 배경/텍스트 두 레이어로 캡처 (1080x1920)
// 왜 분리하나: 카드 전체를 줌하면 텍스트가 화면 밖으로 잘린다.
// 배경만 움직이고 텍스트는 고정해야 한다.
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
const dir = resolve(process.argv[2] ?? 'reels');
const out = resolve(dir, 'out');
mkdirSync(out, { recursive: true });

const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1080,height:1920}, deviceScaleFactor:1 });
await p.goto('file://'+resolve(dir,'index.html'), { waitUntil:'networkidle' });
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(1000);
const ids = await p.$$eval('section.scene', els=>els.map(e=>e.id));

// 1) 배경 레이어 — 텍스트/프레임 숨김
await p.addStyleTag({ content: '.txt,.frame{visibility:hidden !important}' });
for (const id of ids) await p.locator('#'+id).screenshot({ path: resolve(out,`${id}-bg.png`) });

// 2) 텍스트 레이어 — 사진/베일 숨기고 배경 투명하게 (스틸 배경용)
await p.addStyleTag({ content: `
  .txt,.frame{visibility:visible !important}
  .scene img{display:none !important}
  .veil{display:none !important}
  html,body,.scene{background:transparent !important}
` });
for (const id of ids) await p.locator('#'+id).screenshot({ path: resolve(out,`${id}-fg.png`), omitBackground:true });

// 3) 오버레이 레이어 — 베일 + 텍스트를 한 장으로 (영상 배경용).
//    영상 위에 이것만 올리면 베일·프레임·텍스트가 한 번에 얹힌다.
await p.addStyleTag({ content: '.veil{display:block !important}' });
for (const id of ids) await p.locator('#'+id).screenshot({ path: resolve(out,`${id}-ov.png`), omitBackground:true });

await b.close();
console.log(`${ids.length}개 장면 × 2레이어 캡처: ${ids.join(' ')}`);
