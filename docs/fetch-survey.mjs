/**
 * 설문 응답 당겨오기
 *
 *   node docs/fetch-survey.mjs
 *
 * .env.local 에 SURVEY_API_URL / SURVEY_API_TOKEN 이 있어야 합니다.
 * 받은 응답은 docs/survey-responses.json 에 저장됩니다. (git 에는 안 올라갑니다)
 * 설계·배포 방법은 docs/survey-api.gs 위쪽 주석에 있습니다.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// pathname은 퍼센트 인코딩된다 — 경로의 공백이 %20이 돼서 .env.local 을 못 읽었다
const 루트 = fileURLToPath(new URL('..', import.meta.url));

function env() {
  try {
    const 원문 = readFileSync(루트 + '.env.local', 'utf8');
    return Object.fromEntries(
      원문
        .split('\n')
        .filter((줄) => 줄.includes('=') && !줄.trim().startsWith('#'))
        .map((줄) => {
          const i = 줄.indexOf('=');
          return [줄.slice(0, i).trim(), 줄.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
        })
    );
  } catch {
    return {};
  }
}

const { SURVEY_API_URL, SURVEY_API_TOKEN } = { ...env(), ...process.env };

if (!SURVEY_API_URL || !SURVEY_API_TOKEN) {
  console.error('.env.local 에 SURVEY_API_URL 과 SURVEY_API_TOKEN 을 넣어주세요.');
  console.error('만드는 법: docs/survey-api.gs 맨 위 주석');
  process.exit(1);
}

const url = `${SURVEY_API_URL}?token=${encodeURIComponent(SURVEY_API_TOKEN)}`;
const 응답 = await fetch(url, { redirect: 'follow' });
const 본문 = await 응답.text();

let 데이터;
try {
  데이터 = JSON.parse(본문);
} catch {
  console.error('JSON 이 아닌 게 왔습니다. 배포 설정(액세스 권한 「모든 사용자」)을 확인해주세요.');
  console.error(본문.slice(0, 400));
  process.exit(1);
}

if (데이터.error) {
  console.error('토큰이 맞지 않습니다:', 데이터.error);
  process.exit(1);
}

const 저장경로 = 루트 + 'docs/survey-responses.json';
writeFileSync(저장경로, JSON.stringify(데이터, null, 2));
console.log(`${데이터.제목} — 응답 ${데이터.전체응답수}건`);
console.log(`→ docs/survey-responses.json`);
