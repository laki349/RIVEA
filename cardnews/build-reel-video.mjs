// 실사 영상 배경 + 텍스트 오버레이 → 릴스 mp4
// 사용법: node build-reel-video.mjs reels/<슬러그>
//
// 스틸 버전(build-reel.mjs)과 차이:
//   배경이 정지 이미지가 아니라 무료 스톡 영상(Pexels)이다. 실제로 움직인다.
//   타 브랜드 광고 영상을 가져오는 건 저작권 침해다 — 반드시 라이선스가 명확한 소재만 쓴다.
import { execFileSync } from 'child_process';
import { readdirSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const dir = resolve(process.argv[2] ?? 'reels');
const out = resolve(dir, 'out');
const vidDir = resolve(dir, 'vid');
const tmp = resolve(out, '_tmp');
mkdirSync(tmp, { recursive: true });

const DUR  = [2.4, 2.8, 2.6, 3.2, 2.6];
const FADE = 0.35;
const FPS  = 30;

// style.md 5항 통일 그레이딩을 영상에 적용 — 출처가 달라도 한 세트로 읽히게 한다.
// 채도 0.58 · R×1.05 · B×0.93 · 대비 1.06 · 밝기 +0.02
const GRADE = 'eq=saturation=0.58:contrast=1.06:brightness=0.02,' +
              'colorchannelmixer=rr=1.05:gg=1.0:bb=0.93';

const scenes = readdirSync(out).filter(f => /^s\d+-ov\.png$/.test(f))
  .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
  .map(f => f.replace('-ov.png', ''));
if (!scenes.length) { console.error('out/에 s1-ov.png… 이 없습니다. capture-reels.mjs 먼저 실행하세요.'); process.exit(1); }

scenes.forEach((name, i) => {
  const d = DUR[i] ?? 2.6;
  const clip = resolve(vidDir, `${name}.mp4`);
  if (!existsSync(clip)) { console.error(`없음: vid/${name}.mp4`); process.exit(1); }
  // 영상이 짧으면 루프로 채운다. 앞 0.4s는 인코딩이 튀는 경우가 있어 건너뛴다.
  const filter =
    `[0:v]trim=start=0.4:duration=${d},setpts=PTS-STARTPTS,` +
    `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=${FPS},` +
    `${GRADE}[bg];[bg][1:v]overlay=0:0:format=auto,format=yuv420p[v]`;
  execFileSync('ffmpeg', ['-y',
    '-stream_loop', '-1', '-i', clip,
    '-loop', '1', '-t', String(d), '-i', resolve(out, `${name}-ov.png`),
    '-filter_complex', filter, '-map', '[v]', '-t', String(d),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-an',
    resolve(tmp, `v${i}.mp4`)], { stdio: 'ignore' });
  console.log(`v${i}  ${name}  ${d}s  실사 영상 배경 + 오버레이`);
});

const inputs = scenes.flatMap((_, i) => ['-i', resolve(tmp, `v${i}.mp4`)]);
let filter = '', prev = '0:v', acc = 0;
for (let i = 1; i < scenes.length; i++) {
  acc += DUR[i - 1] ?? 2.6;
  const offset = (acc - i * FADE).toFixed(3);
  const label = i === scenes.length - 1 ? 'v' : `x${i}`;
  filter += `[${prev}][${i}:v]xfade=transition=fade:duration=${FADE}:offset=${offset}[${label}];`;
  prev = label;
}
filter = filter.replace(/;$/, '');

const mp4 = resolve(out, 'reel-video.mp4');
execFileSync('ffmpeg', ['-y', ...inputs, '-filter_complex', filter, '-map', '[v]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', '-r', String(FPS), mp4], { stdio: 'ignore' });

const total = (DUR.slice(0, scenes.length).reduce((a, b) => a + b, 0) - (scenes.length - 1) * FADE).toFixed(1);
console.log(`\n완료 → ${mp4}`);
console.log(`길이 ${total}초 · 1080×1920 · ${FPS}fps · 무음`);
