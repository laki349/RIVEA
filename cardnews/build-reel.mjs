// 릴스 장면 PNG → mp4
// 사용법: node build-reel.mjs [reels폴더]
// 정지 이미지를 그냥 붙이면 죽은 영상처럼 보인다 → 느린 줌(켄번즈) + 크로스페이드.
import { execFileSync } from 'child_process';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const dir = resolve(process.argv[2] ?? 'reels');
const out = resolve(dir, 'out');
const tmp = resolve(dir, 'out/_tmp');
mkdirSync(tmp, { recursive: true });

// 장면별 길이(초). 첫 장면은 짧게 — 3초 이탈률이 도달을 가른다.
const DUR  = [2.4, 2.8, 2.6, 3.2, 2.6];
const FADE = 0.35;
const FPS  = 30;

const scenes = readdirSync(out).filter(f => /^s\d+-bg\.png$/.test(f))
  .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
  .map(f => f.replace('-bg.png', ''));
if (!scenes.length) { console.error('out/에 s1-bg.png… 이 없습니다. capture-reels.mjs 먼저 실행하세요.'); process.exit(1); }

// 1) 장면마다 느린 줌 클립 생성. 방향을 번갈아 줘서 반복되어 보이지 않게 한다.
scenes.forEach((name, i) => {
  const d = DUR[i] ?? 2.6;
  const frames = Math.round(d * FPS);
  // 배경만 줌한다. 1.2배로 키운 뒤 z를 1.20↔1.30으로 움직이고, 장면마다 방향을 바꾼다.
  const z = i % 2 === 0 ? `z='1.20+0.10*on/${frames}'` : `z='1.30-0.10*on/${frames}'`;
  // [0]=배경(줌) → [1]=텍스트(고정) 오버레이. 텍스트는 절대 잘리지 않는다.
  const filter =
    `[0:v]scale=1296:2304,zoompan=${z}:d=1:x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':` +
    `s=1080x1920:fps=${FPS}[bg];[bg][1:v]overlay=0:0:format=auto,format=yuv420p[v]`;
  execFileSync('ffmpeg', ['-y',
    '-loop', '1', '-t', String(d), '-i', resolve(out, `${name}-bg.png`),
    '-loop', '1', '-t', String(d), '-i', resolve(out, `${name}-fg.png`),
    '-filter_complex', filter, '-map', '[v]',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    resolve(tmp, `clip${i}.mp4`)], { stdio: 'ignore' });
  console.log(`clip${i}  ${name}  ${d}s  배경 ${i % 2 === 0 ? 'zoom in' : 'zoom out'} · 텍스트 고정`);
});

// 2) 크로스페이드로 이어 붙인다. offset은 누적 길이에서 페이드만큼 당긴다.
const inputs = scenes.flatMap((_, i) => ['-i', resolve(tmp, `clip${i}.mp4`)]);
let filter = '', prev = '0:v', acc = 0;
for (let i = 1; i < scenes.length; i++) {
  acc += DUR[i - 1] ?? 2.6;
  const offset = (acc - i * FADE).toFixed(3);
  const label = i === scenes.length - 1 ? 'v' : `x${i}`;
  filter += `[${prev}][${i}:v]xfade=transition=fade:duration=${FADE}:offset=${offset}[${label}];`;
  prev = label;
}
filter = filter.replace(/;$/, '');

const mp4 = resolve(out, 'reel.mp4');
execFileSync('ffmpeg', ['-y', ...inputs, '-filter_complex', filter, '-map', '[v]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', '-r', String(FPS), mp4], { stdio: 'ignore' });

const total = (DUR.slice(0, scenes.length).reduce((a, b) => a + b, 0) - (scenes.length - 1) * FADE).toFixed(1);
console.log(`\n완료 → ${mp4}`);
console.log(`길이 ${total}초 · 1080×1920 · ${FPS}fps · 무음(음원은 인스타 앱에서 붙인다)`);
