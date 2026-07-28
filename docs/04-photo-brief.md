# RIVEA — 이미지 생성 브리프 (챗지피티 Pro용, 21장 전체)

> 작성일: 2026-07-28
> 목적: 앱에 필요한 이미지 21장을 **한 번에** 준비. 프롬프트 그대로 복붙, 앵글·구도·해상도까지 지정되어 있어 재작업 없음.
> 코드 기준: `src/data/catalog.ts`의 실제 상품·루틴·고민 데이터에 맞춰 프롬프트 작성됨.

---

## 0. 공통 스타일 규칙 (모든 프롬프트 맨 끝에 이미 포함되어 있음 — 절대 빼지 말 것)

```
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no logos, no watermark in image, photorealistic, high detail
```

**공통 원칙 3가지**
1. **여백 룰(중요)**: 피사체를 프레임 중앙에, 상하좌우 여백을 15% 이상 남겨서 구도 잡기. → 같은 사진이 정사각형/가로형으로 다르게 잘려도 안전함.
2. **모델(사람 등장 시)**: 한국인 45~58세 여성, 자연스러운 피부 질감(과도한 리터칭/광채 필터 금지), 화려한 메이크업 금지, 차분한 표정.
3. **인물 얼굴 전체가 특정 실존 인물처럼 보이지 않게** — "generic, non-celebrity looking Korean woman" 문구를 이미 프롬프트에 넣어둠.

**ChatGPT 이미지 생성 시 화면비 옵션 선택 기준**
| 종류 | 챗지피티에서 고를 옵션 |
|---|---|
| 상품 스튜디오컷 (8장) | **정사각형(1:1)** |
| 루틴 플랫레이 (4장) | **가로형(landscape, 3:2)** |
| 고민 무드 (7장) | **가로형(landscape, 3:2)** |
| 히어로 배너 (2장) | **가로형(landscape, 3:2)** |

---

## 1. 히어로 배너 — 2장

파일명: `hero-1.jpg`, `hero-2.jpg`
화면비: 가로형(3:2) · 구도: 인물은 프레임 좌측 또는 우측 1/3 지점에 배치(rule of thirds), 상단 2/3에 디테일 집중 — 하단은 앱에서 자동으로 어두운 그라데이션이 깔리니 하단이 다소 복잡해도 무방.

### hero-1.jpg
```
Korean woman in her early-to-mid 50s, generic non-celebrity looking, natural mature skin texture,
sitting at a vanity table, gently applying a few drops of serum to her cheek with her fingertips,
calm confident expression, looking at her own reflection in a round mirror,
warm ivory bedroom/bathroom background, morning soft window light from the side,
positioned in the left third of the frame, rule of thirds composition,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no logos, no watermark in image, photorealistic, high detail
```

### hero-2.jpg
```
Korean woman in her mid 50s, generic non-celebrity looking, natural mature skin texture,
holding a small handheld beauty device up to her jawline with one hand, eyes gently closed, serene expression,
warm beige interior background, soft afternoon light,
positioned in the right third of the frame, rule of thirds composition,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no logos, no watermark in image, photorealistic, high detail
```

---

## 2. 상품 스튜디오컷 — 8장 (사람 없음, 제품만)

화면비: **정사각형(1:1)** · 배경: 웜 베이지/아이보리 무지 배경 · 조명: 부드러운 스튜디오 라이트, 그림자는 옅게 오른쪽 아래로만.
**앵글은 제품 형태별로 2종류만 있으니 헷갈리지 마세요:**
- **보틀/튜브/스틱형** (p1, p3, p4, p5, p8) → **3/4 각도, 카메라가 제품 눈높이보다 15도 위에서**
- **디바이스형** (p2, p6, p7-스프레이 포함) → **3/4 각도, 카메라가 30도 위에서 내려다봐서 버튼·디테일이 보이게**

| 파일명 | 제품 (실제 데이터) | 형태 프롬프트 문구 |
|---|---|---|
| `product-p1.jpg` | 라비드 멜라 리페어 세럼 30ml | `amber glass dropper bottle with black cap, minimalist label` |
| `product-p2.jpg` | 오브제 리프팅 EMS 디바이스 | `sleek handheld EMS beauty device, rounded ergonomic shape, matte white/silver body with one button` |
| `product-p3.jpg` | 셀렌 비타 브라이트닝 앰플 50ml | `tall pump-bottle ampoule, frosted glass, minimal white label` |
| `product-p4.jpg` | 뮤엘 콜라겐 탄력 앰플 30ml | `short round ampoule bottle with dropper, soft pink-beige glass` |
| `product-p5.jpg` | 셀렌 데일리 선크림 SPF50+ 50ml | `sunscreen squeeze tube, matte white tube with minimal label, standing upright` |
| `product-p6.jpg` | 오브제 LED 색소 케어 디바이스 | `small handheld LED beauty device, oval panel with visible red light strip, matte white body` |
| `product-p7.jpg` | 온휴 두피 볼륨 앰플 토닉 | `spray-pump tonic bottle, tall cylindrical, frosted glass, minimal green-beige label` |
| `product-p8.jpg` | 비타랩 저분자 콜라겐 젤리스틱 30포 | `single collagen jelly stick sachet packet standing upright, small pastel-colored pouch, minimal design` |

### 공통 프롬프트 템플릿 (표의 문구를 `[ ]`에 넣어서 사용)
```
Product photography of [표의 형태 프롬프트 문구], centered on a plain warm ivory/beige background,
[3/4 각도, 카메라가 제품 눈높이보다 15도 위에서 / 3/4 각도, 카메라가 30도 위에서 내려다봐서 버튼·디테일이 보이게],
soft studio lighting from upper left, gentle soft shadow falling to the lower right, no harsh reflections,
no hands, no model, e-commerce product shot, generous even negative space margin around the product,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, no text, no logos, no watermark in image, photorealistic, high detail
```

---

## 3. 루틴 세트 플랫레이 — 4장

화면비: **가로형(3:2)** · 앵글: **탑다운(위에서 90도 수직으로 내려다보는 구도)** · 배경: 웜 베이지 리넨 천 또는 무광 아이보리 테이블 · 배치: 구성품을 대각선으로 리듬감 있게, 사람 손 없이.

| 파일명 | 루틴 | 실제 구성품 (순서대로) |
|---|---|---|
| `routine-r1.jpg` | 기미 집중 3단계 | 세럼(p1) + LED 디바이스(p6) + 선크림(p5) |
| `routine-r2.jpg` | 탄력 데일리 2단계 | 콜라겐 앰플(p4) + EMS 디바이스(p2) |
| `routine-r3.jpg` | 기미 입문 2단계 | 비타 브라이트닝 앰플(p3) + 선크림(p5) |
| `routine-r4.jpg` | 두피 볼륨 2단계 | 두피 토닉(p7) + 콜라겐 스틱(p8) |

### routine-r1.jpg
```
Top-down flat lay photography of 3 skincare items arranged in a diagonal rhythm on warm beige linen surface:
an amber glass dropper serum bottle, a small handheld LED beauty device, and a white sunscreen tube,
generous even negative space margin around the group, soft top-down natural light, minimal props, no hands, no text,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, no logos, no watermark in image, photorealistic, high detail
```

### routine-r2.jpg
```
Top-down flat lay photography of 2 skincare items arranged diagonally on warm beige linen surface:
a small round ampoule bottle with soft pink-beige glass, and a sleek white/silver handheld EMS beauty device,
generous even negative space margin around the group, soft top-down natural light, minimal props, no hands, no text,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, no logos, no watermark in image, photorealistic, high detail
```

### routine-r3.jpg
```
Top-down flat lay photography of 2 skincare items arranged diagonally on warm beige linen surface:
a tall frosted glass pump-bottle ampoule, and a white sunscreen squeeze tube,
generous even negative space margin around the group, soft top-down natural light, minimal props, no hands, no text,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, no logos, no watermark in image, photorealistic, high detail
```

### routine-r4.jpg
```
Top-down flat lay photography of 2 items arranged diagonally on warm beige linen surface:
a tall frosted glass spray-pump tonic bottle, and a single small pastel-colored collagen jelly stick sachet packet,
generous even negative space margin around the group, soft top-down natural light, minimal props, no hands, no text,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, no logos, no watermark in image, photorealistic, high detail
```

---

## 4. 고민별 무드 배너 — 7장 (얼굴 클로즈업, 전신 없음)

화면비: **가로형(3:2)** · 공통: 한국인 45~58세 여성, 특정 부위 매크로 클로즈업, 과도한 리터칭 없이 자연스러운 피부 질감(모공·잔주름 그대로).

| 파일명 | 고민 | 프레이밍 지시 |
|---|---|---|
| `concern-pigment.jpg` | 기미·잡티 | 뺨 클로즈업, 45도 측면 각도, 광대뼈 위 색소침착 부위 질감에 초점 |
| `concern-wrinkle.jpg` | 주름·탄력 | 눈가와 입가 클로즈업, 살짝 아래에서 위로 올려다보는 각도로 턱선 라인 강조 |
| `concern-dry.jpg` | 건조 | 입술 주변과 볼 클로즈업, 정면에 가까운 각도, 건조하고 결이 살아있는 자연 텍스처 |
| `concern-sun.jpg` | 자외선 | 쇄골과 목선 클로즈업, 위에서 살짝 내려다보는 각도, 창문 햇빛이 비스듬히 들어오는 느낌 |
| `concern-pore.jpg` | 모공 | 코 옆 볼 클로즈업, 측면 45도, 모공이 보일 정도의 매크로 초점 |
| `concern-scalp-hair.jpg` | 두피·헤어 | 정수리 헤어라인 클로즈업, 위에서 45도로 내려다보는 각도, 가르마 부분에 조명 집중 |
| `concern-inner.jpg` | 이너뷰티 | 클로즈업 아님 — 상반신 실루엣 정면, 한 손을 목이나 배 부근에 부드럽게 얹은 제스처, 은은한 역광 |

### 공통 프롬프트 템플릿
```
Close-up beauty photography of Korean woman in her 50s, generic non-celebrity looking,
[표의 프레이밍 지시], natural mature skin with visible pores and fine lines (not retouched to look young),
neutral calm expression, warm ivory background, soft diffused window light,
generous even negative space margin around the subject,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no logos, no watermark in image, photorealistic, high detail
```

---

## 5. 전달 체크리스트

- [ ] 해상도: 긴 변 기준 **최소 1600px 이상** (챗지피티 기본 출력이면 충분)
- [ ] 포맷: JPG
- [ ] 파일명: 위 표의 파일명 **그대로** (대소문자·하이픈 정확히)
- [ ] 개수 확인: 히어로 2 + 상품 8 + 루틴 4 + 고민 7 = **총 21장**
- [ ] 전달 방식: 폴더 하나에 모아서(zip이든 그냥 여러 장이든) 한 번에 주면 제가 `public/images/`에 배치하고 `ImageSlot` 자리를 실제 `<img>`로 교체

## 6. 완료 후 내가 할 일 (참고용)
사진 21장 받으면: `public/images/{hero,product,routine,concern}/` 구조로 저장 → `ImageSlot`을 조건부로 실제 이미지 있으면 `<Image>`(next/image, 정적 export 호환은 `unoptimized` 옵션 필요) 렌더하도록 컴포넌트 수정 → 전체 화면 재검증.
