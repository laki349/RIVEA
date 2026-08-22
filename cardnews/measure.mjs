import { chromium } from 'playwright';
import { resolve } from 'path';
const ep = resolve(process.argv[2]);
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1080,height:1350} });
await p.goto('file://'+resolve(ep,'index.html'), { waitUntil:'networkidle' });
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(600);
const r = await p.$$eval('section.card', cards => cards.map(c=>{
  // 카드 구조가 회차마다 조금씩 다르다. 브랜드 아웃트로는 `.outro-in`뿐이라
  // 예전엔 여기서 blk이 null이 되어 스크립트가 통째로 죽었다(CLAUDE.md "자주 났던 실수").
  // 못 찾으면 죽이지 말고 그 카드만 건너뛴다 — 검사 하나 때문에 전부 못 보는 게 더 나쁘다.
  const blk = c.querySelector('.content') || c.querySelector('.over')
           || c.querySelector('.txt') || c.querySelector('.outro-in');
  const overflow = c.scrollHeight > c.clientHeight;
  if (!blk) return { id:c.id, skip:true, overflow };
  const last = blk.lastElementChild || blk;
  const cb = c.getBoundingClientRect(), lb = last.getBoundingClientRect();
  return { id:c.id, bottomGap: Math.round(cb.bottom - lb.bottom), overflow };
}));
console.log(r.map(x => x.skip
  ? `${x.id}  텍스트 블록 없음 — 여백 검사 생략  ${x.overflow?'⚠ OVERFLOW':''}`
  : `${x.id}  하단여백 ${String(x.bottomGap).padStart(4)}px  ${x.overflow?'⚠ OVERFLOW':''}`).join('\n'));
await b.close();
