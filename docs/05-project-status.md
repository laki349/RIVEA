# RIVEA — 프로젝트 현황 (다음 세션 빠른 인수인계용)

> 마지막 업데이트: 2026-07-28
> 이 문서 하나만 읽으면 지금까지 뭘 했고 다음에 뭘 하면 되는지 알 수 있게 정리.
> 기획/디자인 근거는 `docs/01~04`, 여긴 **현재 상태 + 다음 액션**만.

---

## 0. 한 줄 요약

**연세 AX 비즈니스 랩 프로젝트.** 중년 여성(40대+) 홈케어 중개형 마켓플레이스 앱 "RIVEA(리베아)". Next.js 정적 사이트로 완성해서 Firebase Hosting에 배포 완료, 실사 이미지까지 다 들어감. **지금 폰으로 열어볼 수 있는 상태.**

- **배포 URL**: https://rivea-app.web.app
- **로컬 실행**: `npm run dev` (포트 3000)
- **재배포**: 아래 "6. 재배포 방법" 참고

---

## 1. 사업 컨셉 (한 문단)

40대+ 여성 대상 홈케어 마켓플레이스. 올리브영/무신사처럼 **여러 브랜드가 입점**하는 중개형(자사 브랜드 아님). 차별화 2축: ① **고민 우선(concern-first) IA** — "세럼" 아니라 "기미·잡티"로 찾게 함, ② **루틴 세트** — 디바이스+화장품 번들 상품. 상세는 `docs/01-foundation.md`.

## 2. 디자인 언어 (사용자가 "이제까지 만든 것 중 최고"라고 검증함)

- **웜 뉴트럴 모노크롬**: 배경 순수 흰색, UI는 웜 그레이 스케일, 색은 상품 사진이 담당
- **유일한 유채색**: `rivea-rose #C13B54` — 로고 + 세일 숫자 + 찜 하트에만
- **각진 기조**: 라운드 `4px`(살짝만 눅임, 둥근 사각형 금지), **하단 CTA 버튼만 예외로 `14~16px` 둥글게**
- **풀블리드**: 히어로·상단 배너는 양옆 끝까지, 위아래 1px 선으로만 구분
- **직사각 상품 그리드**(지그재그 스타일), 상단 리스팅은 가로 스크롤 2단 탭
- 폰트 Pretendard 단일, 본문 16px+, 버튼 ≥48px (중년 가독성)
- 토큰 정의: `tailwind.config.ts` + `docs/03-design-system.md`

## 3. 기술 스택 & 아키텍처

- **Next.js 14 (App Router) + TypeScript + Tailwind**
- **전체 정적 export** (`next.config.mjs`의 `output: "export"`) — 서버 없음, 46페이지 전부 빌드타임 생성
  - 이래서 **Firebase Hosting 무료(Spark) 플랜**으로 배포 가능 (App Hosting/Blaze 유료 불필요)
  - 유일하게 서버 의존이었던 `category/[slug]`의 `searchParams`를 클라이언트 `useSearchParams`로 바꿔서 해결함
- **데이터**: 전부 더미, `src/data/catalog.ts` 한 파일 (브랜드 6·고민 7·상품 8·루틴세트 4)
- **장바구니**: `src/lib/cart.ts` — `localStorage` + `useSyncExternalStore`. 로그인/서버 없음, 브라우저 로컬에만 저장됨
- **이미지**: `public/images/{hero,product,routine,concern}/` 21장, 실사(챗지피티 생성). `ImageSlot` 컴포넌트가 src 있으면 실제 이미지, 없으면 회색 플레이스홀더로 폴백

## 4. 화면 현황 (전부 구현+배포 완료, 404 없음)

| 화면 | 경로 | 비고 |
|---|---|---|
| 홈 | `/` | 고민찾기→히어로→Pick→연령인기→베스트→신상→브랜드 |
| 카테고리 2단 | `/category` | 좌 레일 + 우 세부목록 |
| 상품목록 | `/category/[slug]` | 가로 2단탭 + 필터시트 + 정렬 |
| 상품상세 | `/product/[id]` | 혜택행 + 브랜드비교표 + 리뷰 |
| 고민상세 | `/concern/[slug]` | 설명 + 가로 루틴레일 + 관련단품 |
| 리베아's Pick | `/pick` | 루틴 세트 목록 |
| 루틴상세 | `/routine/[id]` | 사용순서 + 구성품 + 절감액 |
| 장바구니 | `/cart` | 브랜드별 배송그룹, 실기능 |
| 결제 | `/checkout` | 쿠폰/포인트, 동의 기본해제 |
| 주문완료 | `/order/complete` | 주문번호 생성 |
| 브랜드관/목록 | `/brand/[slug]`, `/brands` | 신뢰지표 4칸 |
| 검색 | `/search` | 실시간 필터 + 최근검색어 |
| 마이페이지 | `/mypage` | 등급카드, 퀵액션, 메뉴 |
| 찜 | `/wish` | **빈 상태만 있음, 하트 눌러도 반응 없음** ← 다음 할 일 |

## 5. 다음에 할 만한 것 (우선순위 순)

1. **찜(하트) 실기능** — 지금 유일하게 미완성. `cart.ts`처럼 `wish.ts` 스토어 만들고 `ProductCard`·상품상세·연령인기 하트 버튼에 연결하면 됨. 패턴은 이미 장바구니에서 검증됨.
2. **브랜드 로고 이미지** — 지금 브랜드는 이니셜 원(예: "라")으로만 표시. 원하면 로고 이미지 추가 가능(21장에는 없었음).
3. **실제 서비스화 시 필요한 것** (지금은 데모, 랩 발표용이면 우선순위 낮음):
   - Firestore로 데이터 이전 (지금은 `catalog.ts` 하드코딩)
   - Firebase Auth 로그인
   - 실제 PG 결제 연동 (사업자등록·통신판매업 신고 필요, 코드 밖 행정 절차)
   - 입점 브랜드 어드민 화면
   - 이때 서버 로직이 다시 필요해지면 App Hosting(Blaze)로 전환

## 6. 재배포 방법 (이미지/코드 수정 후)

```bash
cd "/Users/jinsihu/Desktop/workplace/mature care"
npm run build                                          # out/ 재생성 (필수! 빠뜨리면 이전 빌드가 배포됨)
npx -y firebase-tools@latest deploy --only hosting --project rivea-app
```

**주의 사항 (겪었던 삽질들)**:
- `firebase_init`(MCP 도구)을 다시 돌리면 `out/`에 Firebase 기본 웰컴 템플릿을 덮어씀 → 배포 전 `npm run build` 다시 하면 해결
- 이미지처럼 대용량 파일 많을 때 firebase-tools 배포가 `Body has already been read` 에러로 실패할 수 있음 → 재시도하거나 이미지 용량 줄이기 (지금은 1000px/품질78로 이미 최적화됨, `public/images` 총 2.2MB)
- MCP `firebase_deploy` 도구가 "no site name" assertion 에러를 냄 → CLI 직접 실행(`npx firebase-tools deploy`)이 더 안정적

## 7. 새 세션 시작 시 이 정도만 말하면 바로 이어짐

> "RIVEA 프로젝트 이어서 할게. docs/05-project-status.md 읽어봐."

이러면 사업 맥락·디자인 언어·기술 구조·남은 일까지 한 번에 파악 가능.
