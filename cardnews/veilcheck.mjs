import { chromium } from 'playwright';
import { resolve } from 'path';
const ep = resolve(process.argv[2]);
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1080,height:1350} });
await p.goto('file://'+resolve(ep,'index.html'), { waitUntil:'networkidle' });
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(600);
const r = await p.$$eval('section.card', cards => cards.map(c=>{
  const t = c.getBoundingClientRect();
  const txEl = c.querySelector('.txt');
  // 사진 없는 카드(브랜드 아웃트로 등)는 검사 대상이 아니다
  if (!txEl || !c.querySelector('.veil:not(.thin)')) return { id:c.id, skip:true };
  const tx = txEl.getBoundingClientRect();
  const veils = [...c.querySelectorAll('.veil:not(.thin)')].map(v=>{
    const b=v.getBoundingClientRect();
    return {top:Math.round(b.top-t.top), bot:Math.round(b.bottom-t.top)};
  });
  return { id:c.id,
    txtTop:Math.round(tx.top-t.top), txtBot:Math.round(tx.bottom-t.top),
    veils, h:Math.round(t.height) };
}));
for(const x of r){
  if (x.skip) { console.log(`${x.id}  — 사진 없는 카드, 검사 생략`); continue; }
  const v=x.veils[0];
  // 베일 그라데이션은 끝으로 갈수록 0 → 실질 유효구간을 80%로 본다
  const isTop = v.top===0;
  const eff = isTop ? Math.round(v.bot*0.80) : Math.round(v.top + (v.bot-v.top)*0.20);
  const ok = isTop ? (x.txtBot <= eff) : (x.txtTop >= eff);
  console.log(`${x.id}  텍스트 ${x.txtTop}~${x.txtBot}  베일 ${v.top}~${v.bot}  유효한계 ${eff}  ${ok?'OK':'⚠ 텍스트가 베일 밖으로 나감'}`);
}
await b.close();
