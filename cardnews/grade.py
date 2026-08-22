"""
raw-*.jpg → 1080×1350 크롭 + 통일 그레이딩.

사용법: python3 grade.py <에피소드폴더> [name=anchor ...]
  anchor: 크롭 세로 기준점 0.0(위)~1.0(아래). 기본 0.5(가운데)
          피사체가 아래쪽인 사진은 큰 값으로 준다.

그레이딩 수치는 style.md 5항 그대로다. 출처가 달라도 이걸 거치면 한 세트로 읽힌다.
  채도 0.58 · R×1.05+3 · B×0.93 · 대비 1.06 · 밝기 1.02
"""
import sys, os, glob
from PIL import Image, ImageEnhance

W, H = 1080, 1350
ep = sys.argv[1]
anchors = dict(kv.split("=") for kv in sys.argv[2:])

for raw in sorted(glob.glob(os.path.join(ep, "img", "raw-*.jpg"))):
    name = os.path.basename(raw)[4:-4]          # raw-01-cover.jpg → 01-cover
    a = float(anchors.get(name, 0.5))
    im = Image.open(raw).convert("RGB")

    # 4:5로 커버 크롭
    scale = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left = (im.width - W) // 2
    top = round((im.height - H) * a)
    im = im.crop((left, top, left + W, top + H))

    # 통일 그레이딩 (style.md 5항)
    im = ImageEnhance.Color(im).enhance(0.58)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.05 + 3)))
    b = b.point(lambda v: int(v * 0.93))
    im = Image.merge("RGB", (r, g, b))
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Brightness(im).enhance(1.02)

    out = os.path.join(ep, "img", name + ".jpg")
    im.save(out, quality=88, optimize=True)
    print(f"{name}  anchor={a}  → {im.size}")
