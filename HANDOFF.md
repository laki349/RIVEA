# RIVEA — 인수인계 (다른 환경에서 이어서 작업할 때 이 파일부터)

> 최종 갱신: **2026-08-23** · 브랜치 `feat/outbound-catalog` · 배포 https://rivea-app.web.app
> 이 파일은 **지금 상태 + 왜 그렇게 정했는가 + 다음에 뭘 하나**만 담는다.
> 세부 근거는 `docs/`에 있고, 어느 문서를 언제 읽는지는 §8 문서 지도에 있다.
> `docs/05-project-status.md`는 **8/19까지의 이력**이다. 그 뒤 작업(8/20~23)은 이 파일에만 있다.

---

## 1. 한 줄로

연세 AX 비즈니스 랩 프로젝트. **40대+ 여성 홈케어 중개형 마켓플레이스 「RIVEA(리베아)」.**
Next.js 정적 export → Firebase Hosting. 지금 폰으로 열어볼 수 있는 상태다.
**목표 마감은 2026-09-02 피칭데이.** 그 전까지 필요한 건 코드가 아니라 **숫자와 관찰**이다.

| | |
|---|---|
| 로컬 경로 | `/Users/jinsihu/Desktop/workplace/mature care` |
| 배포 URL | https://rivea-app.web.app (Firebase 프로젝트 `rivea-app`) |
| 스택 | Next.js 14 App Router · TypeScript · Tailwind · Firebase(Auth 익명·Firestore·Hosting) |
| 렌더링 | **전체 정적 export** (`output: "export"`) — 서버 없음. 그래서 Spark(무료) 플랜으로 돈다 |
| 로컬 실행 | `npm run dev` (3000) |
| 계정 분리 | Claude는 **학교 계정**(`yonsei063@ormbiz.co.kr` · org `yonsei ax camp`), Firebase·GitHub는 **개인 계정**(`sihujin107@gmail.com` · `laki349`). **앱과 데이터는 학교 계정과 무관하다** |
| 상태 저장 | 대부분 `localStorage` + 계정 스코프(`src/lib/scope.ts`). 서버 저장은 leads·events뿐 |

---

## 2. 지금 상태 (2026-08-23 기준)

**작업 브랜치는 `feat/outbound-catalog`이고 `main`에 아직 머지하지 않았다.**

최근 흐름 (8/20 → 8/23)

| 커밋 | 무엇 |
|---|---|
| `9cfad5a` | 계측·고민 강화·실사진 필드 (아웃바운드 준비) |
| `806c204` | 계측을 실제 화면에 심음 + 성분 근거표 |
| `c2dd4c2` | 실제 제품 사진 17종 + 논문 근거를 화면에 |
| `5abfe4d` | **아웃바운드 링크 + 판정 카드 — 4단계 퍼널을 닫음** |
| `ff7d404`~`ab7653e` | QA 5건 수정 (아래 §5) + 본문 글자 전 구간 +2px |
| `10343c7` | 루틴 화면 마감 3건 — 저녁 안내문 고민별 분기 · 두피 제품 2개까지 · 빈자리 문장 반복 제거 |

**커밋 안 된 작업(working tree)**

- `cardnews/` — `style.md` **§9 정보 밀도 규칙 신설**(6항의 「최소한만」을 정보형 회차에서 뒤집음),
  `CLAUDE.md` 해당 항목 폐기 표시, 회차 `260829_성분표3줄` 재작업.

→ 이어서 작업할 사람은 **이 덩어리를 먼저 커밋 또는 정리**하고 시작한다.

**⚠️ 원격 백업이 비어 있다.** `origin/main`(github.com/laki349/RIVEA)은 8/22의 `init` 커밋에서 멈춰 있고,
**로컬에만 63개 커밋(7/28~8/24)이 있다.** 이 노트북이 유일한 사본이다. 다른 환경으로 옮기기 전에
`git push`부터 한다.

---

## 3. 이 프로젝트에서 이미 확정된 판단 (되풀이해서 논쟁하지 말 것)

검증 순서 규칙: **설문 n=32(`docs/15`) → 대면 n=6(`docs/12`) → 문헌(`docs/07`).**
큰 표본이 이기되, **40대에 관한 것만은 대면이 이긴다.**

**살아남은 것**
- 진입은 **고민**이다 — 1순위 88%, 강제 단일선택 72%. concern-first IA는 데이터로 지지된다.
- 이탈은 **효과**다 — 「효과가 있는 건지 없는 건지 모르겠다」 **72%**, 방치·폐기 56%.
  이게 A′(효과 판정 루프)의 근거이자 앱의 중심 축이다.
- 커머스 신규 기능 요청은 「딱히 없다」 41%. → **결제를 우리가 받지 않고 공식몰로 내보낸다**(아웃바운드).

**죽은 것 — 근거 없음. 피칭 방어선으로 쓰지 않는다**
1. 「순서·병용 판정이 대체 불가능한 자산」 — 기기 보유자의 순서 혼란 리프트 **0** (`docs/15` §5).
   `rules.ts`는 처방 안쪽에서 계속 돌지만 **진입점·피칭 근거로 쓰지 않는다.**
2. 「캡쳐해놓고 못 찾는다」가 화장대의 진입 동기 — 1/32(3%). 단 **40대 셀은 미판별**(`docs/15` §1-2).

**설계 원칙 (코드 곳곳의 판단 기준)**
- **파생할 수 있는 건 저장하지 않는다.** 체크포인트(14·28일)는 시작일에서 파생하고,
  화장대는 주문에서 파생하고, 등급은 주문에서 파생한다. **사용자가 만든 답만 저장한다.**
- **모르겠다는 답을 반드시 남긴다.** 없으면 모르는 사람이 아무거나 눌러 데이터가 거짓이 된다.
- **홈에 배너를 늘리지 않는다.** 판정은 「슬롯」이다 — 답할 게 있을 때만 나타나고 답하면 사라진다.
- **40대+ 대상**이므로 본문 글자·터치 타깃을 줄이는 방향의 변경은 하지 않는다(전 구간 +2px 이력).

---

## 4. 앱 구조 지도

```
src/
├── app/          라우트 (정적 export 105 페이지)
├── components/   화면 부품 (VerdictCard·VerdictSlot·OutboundLink·ActiveBars 등)
├── data/
│   ├── catalog.ts     고민 7 · 브랜드 18 · 카테고리 8 · 상품 33(실측 25) · 루틴세트 10
│   ├── actives.ts     성분 정보 + 논문 근거(evidence). 3종(알부틴·펩타이드·판테놀) 미작성
│   ├── regimen.ts     제품 → 단계(세안·토너·세럼·크림·선크림·두피·이너)
│   ├── interactions.ts 성분 병용 안내
│   └── magazine.ts    매거진 기사
└── lib/
    ├── prescribe.ts   고민 → 아침·저녁·주간·고민전용 처방
    ├── verdict.ts     14·28일 체크포인트 파생 + 판정 답 저장
    ├── shelf.ts       내 화장대(쓰고 있는 것) + 시작 시점
    ├── events.ts      계측 (아래 §5)
    ├── rules.ts       순서·병용 규칙 엔진
    ├── orders/cart/wish/reviews/repurchase/wallet/profile/recent/leads
    └── scope.ts       계정별 localStorage 키 + 게스트 승계
```

**핵심 화면 흐름 (4단계 퍼널과 같다)**

```
고민 고르기(/, /concern/[slug])
   → 처방 보기(/my-routine)
   → 화장대에 등록(/shelf, 「언제부터 썼나」 3지선다)
   → 14·28일 판정 카드(홈 슬롯 + 화장대 안)
   → 공식몰로 나가기(OutboundLink, 결제는 우리가 받지 않음)
```

---

## 5. 계측 — 9/2 피칭의 실탄

`src/lib/events.ts` · Firestore `events` 컬렉션 · **익명 인증 + create만 허용**(`firestore.rules`).
**개인정보 0필드**: 익명 uid · 이벤트명 · 값 하나 · 세션id · ref · 시각까지만.

| 이벤트 | 뜻 |
|---|---|
| `app_open` | 세션 시작 = **퍼널의 분모** (세션당 1건, sessionStorage로 보장) |
| `concern_select` → `prescription_view` → `shelf_add` → `verdict_answer` | 4단계 퍼널 |
| `outbound_click` | 공식몰 이동 = **제조사 입점 협상 재료** |
| `product_view` | 부수 지표 |

- 이벤트 이름을 **아무 데서나 지어내지 않는다.** `EventName` 타입에 없는 문자열을 쓰면 집계가 갈라진다.
- ⚠️ 배포할 때 `--only hosting`만 하면 **규칙이 안 올라간다.** 규칙을 고쳤으면
  `--only firestore:rules`를 같이 배포한다.
- 8/23 라이브에서 한 세션 안에 4단계 전 구간이 실제로 기록되는 것을 확인했다
  (`.gstack/qa-reports/qa-report-rivea-app-2026-08-23.md` 하단).

**아웃바운드를 저쪽도 알아보게 한다 (2026-08-24)**
`OutboundLink`가 링크에 `utm_source=rivea&utm_medium=referral&utm_campaign=product_detail&utm_content=<제품id>`를
붙인다. 우리 `outbound_click`만 있으면 협상 자리에서 그건 「우리 주장」이지만, UTM이 붙으면
같은 방문이 **브랜드 자기 애널리틱스에 `rivea / referral`로 잡혀** 저쪽 데이터로 검증된다.
uid·sid는 넣지 않는다 — URL은 저쪽 서버 로그에 남으므로 우리 DB와 성격이 다르다.
이미 `utm_source`가 있는 링크(저쪽이 준 제휴 링크)는 덮어쓰지 않는다.

**집계는 스크립트로 꺼낸다**

```bash
node docs/fetch-events.mjs --days=7
```

4단계 퍼널 도달률(세션 기준) · 아웃바운드 클릭을 **브랜드별·제품별**로 · 유입 경로를 출력한다.
규칙이 `events`의 read를 막아뒀으므로 **서비스 계정 키**가 필요하다(발급법은 스크립트 상단 주석).
키는 `service-account.json`으로 루트에 두고 **절대 커밋하지 않는다**(`.gitignore` 등록됨).

**8/23 QA에서 잡은 것 (전부 수정·검증 완료, 건강 점수 85 → 99)**
1. `app_open`이 페이지마다 찍혀 **분모가 거짓**이었다 → sessionStorage로 이동 (`eefbacf`)
2. 목록에서 고른 제품에 시작 시점을 안 물어 **실험 기간 내 판정이 영영 0**이었다 (`cf2aca4`)
3. 28일에 답하면 14일 카드가 뒤따라 떴다 (`ff7d404`)
4. 본문 글자가 대상 연령대에 작았다 → 12~24px 구간 +2px, 67개 파일 (`42f1a0d`)
5. 두피·이너뷰티 고민이 처방에서 통째로 무시됐다 → `CONCERN_STEPS` 신설 (`ab7653e`)

**이월(버그 아님, 콘텐츠 공백)** — 실사진 8종 미확보 · 성분 근거 3종 미작성.
**판단 대기** — 상품 상세에 CTA가 셋이다(공식몰 + 장바구니 + 바로구매). 결제를 안 받기로 했는데
장바구니가 남아 있다. **9/2 데모에서 결제를 보여줄지 아웃바운드만 남길지는 제품 판단**이라 QA가 정하지 않았다.

---

## 6. 카드뉴스 라인 (앱과 분리)

`cardnews/`는 인스타 매거진 제작 라인이다. **앱 코드와 무관하고 `package.json`도 별도**(Playwright).
회차 18개. 규칙은 `cardnews/CLAUDE.md`, 디자인 단일 기준은 `cardnews/style.md`.

절대 규칙 몇 개만 옮기면:
- 브랜딩은 **앞뒤 표지에만**. 본문 카드에 브랜드·구매 링크를 넣지 않는다.
- **이미지 생성 AI로 카드를 만들지 않는다.** HTML/CSS + Playwright 캡처.
- 사진은 **Unsplash / Pexels만.** 타 브랜드 로고가 읽히면 크롭으로 제외.
- 만들고 나면 `measure.mjs`·`veilcheck.mjs` 통과 필수, PNG는 컨택트 시트로 눈으로 확인.
- **2026-08-23 변경**: 정보형 회차는 「카드는 최소한만」을 뒤집는다. **카드가 자족해야 저장된다**(`style.md` §9).
  길어지면 문장을 줄이지 말고 **카드를 쪼갠다.**

---

## 7. 재배포 · 로컬

```bash
cd "/Users/jinsihu/Desktop/workplace/mature care"
npm run build
npx -y firebase-tools@latest deploy --only hosting --project rivea-app
```

규칙까지 바꿨다면:

```bash
npx -y firebase-tools@latest deploy --only hosting,firestore:rules --project rivea-app
```

**겪은 삽질 (반복하지 말 것)**
- `npm run dev`가 켜진 채로 `npm run build`를 돌리면 dev가 쓰던 청크를 지운다.
  증상은 `Cannot find module './vendor-chunks/next.js'` + **CSS가 전부 빠진 화면**. 코드 결함이 아니다.
- `npm run build`를 빼먹으면 **이전 빌드가 배포된다.**
- MCP `firebase_deploy` 도구는 "no site name" 에러를 낸다 → CLI 직접 실행이 안정적.
- `firebase_init`을 다시 돌리면 `out/`을 Firebase 웰컴 템플릿으로 덮어쓴다 → 다시 빌드하면 해결.

---

## 8. 문서 지도 — 무엇을 언제 읽나

| 파일 | 언제 |
|---|---|
| **이 파일 (`HANDOFF.md`)** | 항상 먼저 |
| `docs/05-project-status.md` | 8/19까지의 상세 이력 · 화면별 구현 메모 · 초기 결함 목록 |
| `docs/16-roadmap-0902.md` | **9/2까지 무엇을 어떤 순서로** — 트랙 A(전화)/B(외출)/C(코딩), 날짜별 표, 안 하는 것 |
| `docs/15-survey-findings.md` | **설문 n=32 판정표.** 가설이 죽고 산 근거. 숫자를 인용할 땐 여기서 |
| `docs/12-interview-findings.md` | 대면 n=6. 40대 관련은 여기가 우선 |
| `docs/07-validation-findings.md` | 문헌 + n=1. 가장 약한 근거 |
| `docs/17-ingredient-evidence.md` | **성분 근거표(A~R 등급).** 숫자를 화면·카드뉴스에 쓰기 전 반드시 확인 |
| `docs/01-foundation.md` | 사업 기획 원본 |
| `docs/02·03·04·06` | 와이어프레임 · 디자인 시스템 · 사진 브리프 · 매거진 표지 브리프 |
| `docs/08-cardnews-research.md` | 카드뉴스 방법론 근거 |
| `docs/09·11` | 인터뷰 스크립트 · 제조사 통화 스크립트 |
| `docs/10-keyword-findings.md` | 검색 키워드 조사 |
| `docs/13·14` | 설문 v2 설계 · 카테고리 네이밍 |
| `docs/ir/` | IR 덱(html·pptx) + **국표원 공급자 컨택리스트 66곳** |
| `.gstack/qa-reports/` | 최근 QA 리포트 + 스크린샷 |

---

## 9. 남은 일 (9/2까지)

`docs/16` 기준으로, 코딩(트랙 C)은 거의 끝났고 **남은 건 대부분 앉아서 하는 코딩이 아니다.**

**해야 하는 것**
1. 🚶 **무개입 관찰 3명 이상** (미용실·문화센터. 말 걸지 않는다 — 안내하면 관찰이 아니라 데모다)
2. 🚶 **40대 설문 8명** 추가 (누적 12명). 50대는 더 받아도 88%·72%가 안 바뀐다
3. 📞 제조사 통화 — ★4 개발비·손익분기 숫자가 **3.5억 요청 전체의 근거**다
4. 💻 **덱 5장** — 04 판정표 / 12 The Ask 재배치 / 05→12 연결 / 관찰 1장 / 4단계 도달률 1장
5. 💻 성분 근거 3종(알부틴·펩타이드·판테놀) · 실사진 8종 — 콘텐츠 공백 메우기
6. 💻 상품 상세 CTA 3개 문제 결정 (결제를 데모에 남길 것인가)

**안 하는 것 (14일 · 1인)**
콜드메일 대량 발송 · 입점 계약 · 사업자등록 · 커머스 신규 기능 · 저장·재발견을 첫 화면으로 승격 ·
병용·순서를 진입점이나 피칭 방어선으로 쓰는 것 · 사용법 영상 · `/gift` 승격(9/2 이후).

**피칭에서의 태도**: 가설 두 개가 죽은 걸 숨기지 않는다.
**회수 전에 기준을 정해놓고 자기 가설을 죽인 기록이 이 프로젝트에서 가장 강한 카드다.**

---

## 10. 새 환경에서 시작하는 법

```
"RIVEA 프로젝트 이어서 할게. HANDOFF.md 읽어줘."
```

그다음 필요에 따라: 숫자를 다루면 `docs/15`, 일정을 다루면 `docs/16`,
성분 문구를 쓰면 `docs/17`, 카드뉴스면 `cardnews/CLAUDE.md` + `cardnews/style.md`.
