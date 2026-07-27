import { StarIcon } from "./Icons";

// Curated review quotes — social proof with the target reader's voice.
const reviews: {
  quote: string;
  rating: number;
  who: string;
  product: string;
  brand: string;
}[] = [
  {
    quote:
      "팔자주름에 파운데이션이 끼어서 고민이었는데, 이건 정말 갈라지지 않고 매끈하게 유지돼요.",
    rating: 5,
    who: "50대 초반 · 건성",
    product: "노 크리즈 소프트 매트 쿠션",
    brand: "골든아워",
  },
  {
    quote:
      "기미가 옅게 비쳐서 늘 두껍게 발랐는데, 얇게 발라도 자연스럽게 덮여서 화장이 답답하지 않아요.",
    rating: 5,
    who: "40대 후반 · 복합성",
    product: "세븐데이 커버 파운데이션",
    brand: "베일",
  },
  {
    quote:
      "저녁마다 10분씩 쓴 지 두 달, 확실히 얼굴 라인이 또렷해진 느낌이라 계속 쓰게 돼요.",
    rating: 4,
    who: "50대 중반 · 중성",
    product: "리프트 프로 EMS 디바이스",
    brand: "루메아",
  },
];

export default function ReviewHighlight() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {reviews.map((r, i) => (
        <figure
          key={i}
          className="flex flex-col border-t-2 border-cocoa pt-5"
        >
          <span className="font-serif text-4xl leading-none text-gold-soft" aria-hidden>
            &ldquo;
          </span>
          <blockquote className="mt-2 flex-1 text-[14.5px] leading-relaxed text-cocoa">
            {r.quote}
          </blockquote>
          <div className="mt-4 flex items-center gap-1" aria-label={`별점 ${r.rating}점`}>
            {Array.from({ length: 5 }).map((_, s) => (
              <StarIcon
                key={s}
                className={`h-4 w-4 ${s < r.rating ? "text-gold" : "text-line-strong"}`}
              />
            ))}
          </div>
          <figcaption className="mt-3 border-t border-line pt-3 text-[12.5px] text-stone">
            <span className="font-medium text-taupe">{r.who}</span>
            <span className="mt-0.5 block">
              {r.brand} · {r.product}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
