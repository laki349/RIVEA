import { chromium } from 'playwright';
import { resolve } from 'path';
const ep = resolve(process.argv[2]);
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1080,height:1350} });
await p.goto('file://'+resolve(ep,'index.html'), { waitUntil:'networkidle' });
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(600);
const r = await p.$$eval('section.card', cards => cards.map(c=>{
  const blk = c.querySelector('.content') || c.querySelector('.over') || c.querySelector('.txt');
  const last = blk.lastElementChild || blk;
  const cb = c.getBoundingClientRect(), lb = last.getBoundingClientRect();
  return { id:c.id, bottomGap: Math.round(cb.bottom - lb.bottom), overflow: c.scrollHeight>c.clientHeight };
}));
console.log(r.map(x=>`${x.id}  하단여백 ${String(x.bottomGap).padStart(4)}px  ${x.overflow?'⚠ OVERFLOW':''}`).join('\n'));
await b.close();
