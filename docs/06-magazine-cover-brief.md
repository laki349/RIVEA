# RIVEA — 매거진 표지 이미지 브리프 (챗지피티 Pro용, 6장)

> 작성일: 2026-07-29
> 목적: 매거진 기사 6편의 **표지 화보** 준비. `docs/04-photo-brief.md`(21장)의 후속.
> 코드 기준: `src/data/magazine.ts`의 실제 기사 6편에 맞춰 작성됨.

---

## 0. 왜 이미지에 글자를 넣지 않는가 (먼저 읽기)

진짜 매거진 표지는 타이포가 핵심인데, **이미지 생성 AI는 한글을 거의 항상 깨뜨린다.**
그래서 이 브리프는 **글자 없는 화보만** 만들고, 제목·분류·발행호는 앱에서 CSS로 얹는다.

- 한글이 Pretendard로 정확하게 렌더됨 (깨진 글자 없음)
- 제목을 고쳐도 이미지를 다시 안 만들어도 됨
- 지금 `나이별 가이드`의 타이포 블록 카드가 이미 이 방식이고, 모노크롬으로도 표지처럼 선다

**그래서 모든 프롬프트에 `no text, no letters, no typography` 가 들어가 있다. 절대 빼지 말 것.**

---

## 1. 공통 스타일 규칙 (모든 프롬프트 맨 끝에 이미 포함 — 빼지 말 것)

`04-photo-brief.md`와 동일한 블록을 쓴다. 앱 전체 톤이 갈라지면 안 되니까.

```
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no letters, no typography, no logos, no watermark in image, photorealistic, high detail
```

**추가 원칙 3가지**

1. **여백 룰**: 기존 브리프와 동일. 상하좌우 15% 이상 여백. 카드가 3:4로도 3:2로도 잘려도 안전하게.
2. **인물 최소화**: 고민 사진(`concern-*.jpg`)에 이미 인물이 많다. 매거진 표지는 **정물·매크로·빛** 중심으로 가서 고민 페이지와 시각적으로 구분한다. 6장 중 인물은 1장뿐(`mag-age45`).
3. **저채도 강제**: 표지는 타이포와 경쟁하면 안 된다. `desaturated`, `muted` 를 프롬프트에 넣어 채도를 눌렀다. RIVEA의 유일한 유채색은 `rivea-rose`이고 그건 앱에서 얹는다.

**챗지피티 화면비 선택**

| 용도 | 파일 | 챗지피티 옵션 |
|---|---|---|
| 성분 섹션 포스터 (3장) | `mag-niacinamide` · `mag-ceramide` · `mag-uv` | **세로형(2:3)** |
| 가이드 섹션 배경 (3장) | `mag-age45` · `mag-device` · `mag-inner` | **가로형(3:2)** |

**저장 위치**: `public/images/magazine/` (새로 만들면 됨)
**용량**: 기존과 동일하게 가로 1000px 리사이즈 + 품질 78로 압축

---

## 2. 성분 섹션 포스터 — 3장 (세로 2:3, 인물 없음)

용도: 매거진 색인의 `INGREDIENT` 가로 레일 포스터 카드.
제목은 **이미지 아래**에 들어가니까 화면 전체를 화보로 꽉 채워도 된다.
콘셉트: 성분 하나를 주제로 한 **매크로 정물**. 실제 뷰티 매거진의 성분 특집 화보 느낌.

### mag-niacinamide.jpg — 나이아신아마이드 (색소 관리)
```
Extreme macro still life of a single amber glass dropper suspended above a smooth ivory surface,
one clear viscous serum droplet hanging at the tip about to fall, second droplet already spread
into a perfect shallow circle on the surface catching a thin highlight,
shallow depth of field, the dropper tip in sharp focus and background falling into soft warm blur,
composition centered with generous empty space around the subject,
muted desaturated warm ivory and honey-amber palette only, no bright colors,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no letters, no typography, no logos, no watermark in image, photorealistic, high detail
```

### mag-ceramide.jpg — 세라마이드 (장벽·보습)
```
Extreme macro still life showing the concept of a protective barrier holding water,
a thick matte cream spread into a smooth even layer across a warm greige stone surface,
several perfectly round water beads resting on top of the cream layer without sinking in,
each bead catching a small crisp specular highlight, one bead slightly larger in the foreground,
side raking light from the left revealing the soft texture of the cream surface,
composition centered with generous empty space around the subject,
muted desaturated warm greige and soft white palette only, no bright colors,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no letters, no typography, no logos, no watermark in image, photorealistic, high detail
```

### mag-uv.jpg — 실내 자외선 (선케어)
```
Editorial still life about indoor sunlight, a plain unbranded white sunscreen tube lying on a warm
ivory table exactly on the boundary between bright window light and shadow,
a hard geometric window-frame shadow line cutting diagonally across the frame and across the tube,
half of the tube brightly lit and half in soft shadow, dust motes faintly visible in the light beam,
sheer white curtain edge blurred at the top of the frame,
composition centered with generous empty space around the subject,
muted desaturated warm ivory and pale sand palette only, no bright colors,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no letters, no typography, no logos, no watermark in image, photorealistic, high detail
```

---

## 3. 가이드 섹션 배경 — 3장 (가로 3:2)

용도: `GUIDE` 섹션의 타이포 블록 카드 **배경**. 큰 국문 타이포가 위에 얹힌다.

**이 3장은 규칙이 다르다. 반드시 지킬 것:**
- **하단 절반이 비어야 한다.** 카드의 타이포(`45세 전후` 등)가 좌측 하단에 앉는다.
  프롬프트에 `lower half of the frame is empty and uncluttered` 를 넣어뒀다.
- **저대비·저채도로 더 강하게.** 앱에서 톤 오버레이(불투명도 82~88%)를 깔아 대비 4.5:1을 보장하지만,
  원본이 이미 조용해야 오버레이를 얇게 쓸 수 있다. `very low contrast`, `hazy` 포함.
- 주제가 읽히는 요소는 **상단 1/3**에만.

### mag-age45.jpg — 45세 전후 (유일하게 인물 있음)
```
Korean woman in her mid 40s, generic non-celebrity looking, natural mature skin texture with visible
fine lines, no heavy makeup, calm neutral expression, seen in soft profile from the shoulders up,
positioned in the upper right third of the frame and cropped so the lower half of the frame is
empty warm wall background,
lower half of the frame is empty and uncluttered, plain warm greige wall with a gentle light gradient,
very low contrast, hazy soft light, almost monochrome,
muted desaturated warm greige palette only, no bright colors,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no letters, no typography, no logos, no watermark in image, photorealistic, high detail
```

### mag-device.jpg — EMS와 LED (기기 고르기)
```
Two unbranded handheld home beauty devices lying flat on a warm greige linen surface, shot from
directly above, arranged side by side in the upper third of the frame with a clear gap between them,
one device a smooth matte white T-shaped roller, the other a slim white wand with a faint warm
amber light strip, both minimal and logo-free,
lower half of the frame is empty and uncluttered, plain warm linen texture only,
very low contrast, hazy soft light, almost monochrome,
muted desaturated warm greige and off-white palette only, no bright colors,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no letters, no typography, no logos, no watermark in image, photorealistic, high detail
```

### mag-inner.jpg — 8주 기준 (이너뷰티)
```
Minimal still life about a daily habit over time, a row of small identical unbranded white sachets
laid out in a straight line across the upper third of the frame on a warm ivory surface,
shot from slightly above, the row receding toward the right edge and falling out of focus,
one sachet in the foreground slightly separated from the row, a plain clear glass of water blurred
far in the background,
lower half of the frame is empty and uncluttered, plain warm ivory surface only,
very low contrast, hazy soft light, almost monochrome,
muted desaturated warm ivory and pale sand palette only, no bright colors,
warm neutral tone (not cool blue-white studio light), soft diffused natural window light around 3500-4000K,
minimal editorial photography, no purple/violet/pink color cast, no glossy over-styled stock-photo look,
premium dermocosmetic brand aesthetic, mature and calm mood (not youthful K-beauty gloss),
no text, no letters, no typography, no logos, no watermark in image, photorealistic, high detail
```

---

## 4. 배치 완료 기록 (2026-07-29)

6장 모두 생성·검수·배치 완료. 실제 진행에서 브리프와 달라진 점을 남긴다.

1. `public/images/magazine/` 에 파일명 그대로 저장 ✓
2. **리사이즈·압축 불필요했음** — 받은 파일이 이미 가로 1000px, 20~140KB였다.
   (성분 3장 1000×1500, 가이드 3장 1000×667. 6장 합계 435KB)
3. `src/data/magazine.ts` 기사 6편에 `image` 경로 연결 ✓
   `home-device-basics`가 임시로 쓰던 `product-p2.jpg`도 전용 표지로 교체.
4. **가이드 카드: 톤 오버레이 대신 하단 그라데이션 스크림으로 변경.**
   브리프 계획은 톤 오버레이(불투명도 82~88%)였는데, 받은 가이드 3장이 모두 밝은 톤이라
   어두운 톤을 덮으면 사진이 거의 보이지 않았다. 그래서 앱 히어로와 동일한
   `bg-gradient-to-t from-[rgba(28,24,21,0.78)] to-transparent` 를 써서
   사진은 상단에서 그대로 보이고 흰 글자는 어두워진 하단에서 대비를 확보하도록 했다.
   (흰색 21px bold on 약 rgb(70,62,55) ≈ 7.5:1, WCAG AA 통과)
   → 하단 절반을 비우라는 3절 규칙이 여기서 맞물렸다. **다음 호 표지도 이 규칙을 유지할 것.**

**이미지가 없어도 앱은 안 깨진다.** `ImageSlot`이 `src`가 없거나 404면 회색 플레이스홀더로 폴백한다.
다음 호(Vol. 2) 표지를 만들 때도 이 브리프의 1~3절을 그대로 재사용하면 된다.

---

## 5. 품질 체크 (받은 이미지 검수 기준)

- [ ] 글자·로고가 이미지에 하나도 없는가 (있으면 재생성)
- [ ] 채도가 낮은가 — 파랑·핑크·보라 기미가 없는가
- [ ] 가이드 3장: **하단 절반이 비어 있는가** (타이포 들어갈 자리)
- [ ] 제품에 브랜드 로고가 안 붙어 있는가 (실제 브랜드처럼 보이면 안 됨)
- [ ] `mag-age45`: 특정 실존 인물처럼 보이지 않는가, 과도한 리터칭이 없는가
- [ ] 기존 21장과 색온도가 붙는가 (나란히 놓고 비교)
