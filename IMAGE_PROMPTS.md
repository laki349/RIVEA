# 마춰케어 이미지 프롬프트 팩 (ChatGPT Plus용)

ChatGPT(GPT-4o 이미지)에 **복붙**해서 34장을 뽑기 위한 프롬프트 모음입니다.
사진 스타일을 통일하기 위해, **아래 "공통 스타일 블록"을 먼저 한 번 붙여넣고**,
그다음 각 프롬프트를 이어서 넣으세요. (또는 매 프롬프트 앞에 공통 블록을 붙여도 됩니다.)

---

## 사용법 (3단계)

1. ChatGPT에 아래 **[공통 스타일 블록]** 을 먼저 붙여넣고 "이 스타일을 계속 유지해줘"라고 말합니다.
2. 원하는 항목의 프롬프트를 붙여넣어 이미지를 생성합니다. (한 번에 2~4개씩 요청해도 됩니다.)
3. 생성된 이미지를 **지정된 파일명**으로 저장해 `public/images/` 폴더에 넣습니다.
   - 상품: `p01` ~ `p24`
   - 로고: `brand-lumea` 등
   - 배너: `hero`, `promo`
   - 확장자는 png / webp / jpg 아무거나 OK (넣은 뒤 알려주시면 데이터에 연결해 드립니다)

### 비율 안내
- **상품·로고 = 정사각형(1:1, 1024×1024)** 으로 요청하세요.
- **배너(hero, promo) = 가로형(landscape, 1536×1024)** 으로 요청하세요.
  화면에서는 자동으로 알맞게 잘려 들어가니 정확히 4:3/16:10이 아니어도 됩니다.

---

## [공통 스타일 블록] — 먼저 붙여넣기

```
You are shooting product imagery for "Mature Care", a premium curated home-care
beauty edit shop for women in their 40s–50s. Keep ALL images in one consistent
visual system:

- Palette: warm ivory, champagne beige, deep brown, with subtle antique-gold and
  muted-rose accents only. No bright pink, no neon, no cool blue tones.
- Lighting: soft, diffused studio light; gentle natural shadows; calm, trustworthy,
  quietly luxurious mood. Matte, refined finish.
- Background: minimal warm ivory / beige seamless surface with generous negative space.
- No text, no lettering, no logos, no watermark on the image (unless I explicitly ask
  for a logo). No busy props. Centered, editorial composition. Photorealistic, high detail.

Unless I say otherwise, produce a 1:1 square image.
```

---

## 상품 대표컷 24장 (1:1 정사각형)

> 파일명은 각 항목의 `pNN` 을 그대로 쓰세요. 예) `p01.png`

**p01** — Handheld EMS microcurrent facial lifting device, ergonomic wand with two
polished metal contact spheres, matte white body with rose-gold accents, standing
upright, single product hero shot on warm ivory background.

**p02** — Wireless LED light-therapy face mask, sleek elegant white and soft-rose
design, subtle warm glow, displayed at a gentle three-quarter angle on ivory background.

**p03** — Retinol night serum in a frosted amber glass dropper bottle with a brown-and-gold
minimalist label area (blank, no text), soft reflection, on warm beige background.

**p04** — Collagen firming face cream in a heavyweight frosted glass jar with a matte
champagne-gold lid, lid slightly ajar, creamy beige tones, on ivory background.

**p05** — Fermented essence toner in a tall slim glass bottle, warm amber liquid,
hanbang herbal mood, minimal blank label, on ivory background.

**p06** — Liquid cover foundation in a frosted glass bottle with a matte gold pump,
warm beige tone, elegant, single hero shot on ivory background.

**p07** — Twist-up stick concealer, uncapped showing a warm-beige creamy tip, slim
matte tube, on warm ivory background.

**p08** — Round cushion compact makeup case, matte deep-brown lid with a thin gold
rim, open showing the cushion inside, on ivory background.

**p09** — Makeup smoothing primer in a soft-matte squeeze tube, champagne-beige color,
lying at a slight angle, on ivory background.

**p10** — Boxed set of collagen sheet masks (a stack of folded sheet masks beside an
elegant beige box, blank label), soft and clean, on warm ivory background.

**p11** — Overnight repair sleeping pack in a wide frosted glass jar, pale cream gel
visible, matte gold lid, on ivory background.

**p12** — Tone-up sunscreen SPF50 in a soft squeeze tube, warm ivory-beige packaging,
clean minimal, standing upright on ivory background.

**p13** — Mineral sunscreen stick, twist-up balm stick in a slim champagne-beige case,
cap beside it, on warm ivory background.

**p14** — Low-irritation amino acid cleansing foam in a soft tube, gentle beige tone,
a small dollop of white foam beside it, on ivory background.

**p15** — Deep moisture cleansing balm in a frosted jar with a small wooden spatula
resting on top, warm cream texture, on ivory background.

**p16** — Inner-beauty low-molecular collagen powder: an elegant beige box with a few
single-serve stick sachets fanned in front (blank labels), on warm ivory background.

**p17** — Vitamin inner-beauty drink shots: several small glass bottles with warm
amber liquid grouped together (blank labels), soft reflections, on ivory background.

**p18** — Intensive eye repair cream in a small frosted jar with a tiny gold spatula,
delicate and premium, on warm ivory background.

**p19** — Handheld ultrasonic facial cleansing device with a soft silicone brush head,
matte white and rose-gold, upright, on warm ivory background.

**p20** — Tone-balancing BB cream in a slim tube with a matte gold cap, light beige,
lying at a slight angle, on ivory background.

**p21** — Hyaluronic hydrating ampoule in a clear glass dropper bottle, glossy clear
serum, fresh and dewy but still warm-toned, on ivory background.

**p22** — Neck & décolleté firming cream in an airless pump bottle, tall elegant
champagne-beige packaging, on warm ivory background.

**p23** — Boxed cica calming sheet masks (a soft-green-tinted sheet mask beside a calm
beige box, blank label), soothing mood, on warm ivory background.

**p24** — Brightening vitamin C spot serum in a frosted amber dropper bottle, warm
golden serum, minimal blank label, on ivory background.

---

## 브랜드 로고 8장 (1:1 정사각형)

> 로고는 텍스트가 깨질 수 있으니 **알파벳 이니셜 1글자 모노그램** 위주로 요청하는 것을 권장합니다.
> 파일명: `brand-<id>` 예) `brand-lumea.png`

**brand-lumea** (루메아) — Minimal luxury beauty monogram logo, a single elegant serif
letter "L", antique-gold on a soft ivory background, clinical-elegant, centered, 1:1.

**brand-maison-r** (메종로즈) — Elegant Parisian beauty monogram, a refined serif letter
"M" with a tiny rose motif, muted-rose and gold on ivory, centered, 1:1.

**brand-hansu** (한수) — Calm herbal beauty emblem, a single serif letter "H" with a
subtle leaf/brushstroke accent, olive and gold on ivory, centered, 1:1.

**brand-veil** (베일) — Soft minimalist monogram, a light serif letter "V" with a gentle
veil-like curve, taupe and gold on ivory, centered, 1:1.

**brand-atelier-n** (아틀리에느) — Clean modern monogram, a thin geometric letter "A",
deep-brown on ivory, minimalist, centered, 1:1.

**brand-golden-h** (골든아워) — Warm luxury emblem, a serif letter "G" with a subtle
golden-hour sun arc, antique-gold on ivory, centered, 1:1.

**brand-sooda** (수다) — Gentle skincare monogram, a soft rounded letter "S" with a tiny
water-drop accent, muted teal-gold on ivory, centered, 1:1.

**brand-vitagen** (비타젠) — Fresh nutrition monogram, a clean letter "V", warm-gold on
ivory with a subtle sparkle, centered, 1:1.

---

## 배너 2장 (가로형 landscape, 1536×1024로 요청)

**hero** — Editorial lifestyle scene: a graceful woman in her early 50s with healthy,
radiant skin sitting at a bright vanity in warm morning light, a few premium home-care
devices and skincare bottles softly arranged, ivory and champagne tones, calm and
aspirational, plenty of soft negative space, no text. Landscape.

**promo** — Moody editorial flatlay of cover-makeup products (a cushion compact and a
foundation bottle) on a warm dark-brown surface with soft golden side light, elegant
and premium, the products clearly lit against the darker background, no text. Landscape.

---

## 다 만든 뒤

`public/images/` 에 파일을 넣고, **확장자(png/webp/jpg)만 알려주세요.**
제가 상품 데이터(`catalog.ts`)와 배너 설정(`media.ts`)에 경로를 일괄로 연결하겠습니다.
일부만 먼저 채워도 나머지는 자동으로 MC 모노그램 플레이스홀더로 유지됩니다.
