// ─────────────────────────────────────────────────────────────
// "고민(Concern)" 택소노미 — 단일 소스(single source of truth).
//
// 배경: 같은 고민이 코드 곳곳에서 다른 표기로 흩어져 있었다.
//   상품 태그   : 처짐 / 탄력저하 / 기미 / 잡티 / 건조 / 민감 …
//   ConcernFinder: 탄력 저하 / 속건조 / 예민함 / 기미·잡티 …
//   Pick 인덱스  : 탄력 / 검버섯 …
// → 이 파일이 "표준 고민"을 정의하고, 나머지 표기를 alias 로 흡수한다.
//   화면·필터·Pick·상품태그는 모두 여기를 참조한다.
// ─────────────────────────────────────────────────────────────
import { products, type Product } from "./catalog";

export interface Concern {
  slug: string; // URL·앵커·필터에 쓰는 안정적 id
  name: string; // 표준 표기(화면 노출)
  hint: string; // ConcernFinder 등에서 쓰는 한 줄 설명
  aliases: string[]; // 데이터에 흩어진 다른 표기(상품 태그·Pick concern·옛 라벨)
}

// 표시 순서 = 이 배열 순서. (콘텐츠가 있는 고민을 앞쪽에)
export const concerns: Concern[] = [
  { slug: "wrinkle", name: "주름", hint: "끼지 않는 베이스부터", aliases: ["주름"] },
  { slug: "spot", name: "기미·잡티", hint: "옅게 만드는 케어", aliases: ["기미", "잡티", "검버섯"] },
  { slug: "firmness", name: "탄력", hint: "집에서 하는 리프팅", aliases: ["탄력", "탄력저하", "탄력 저하", "처짐"] },
  { slug: "dryness", name: "속건조", hint: "겉돌지 않는 보습", aliases: ["건조", "속건조"] },
  { slug: "dullness", name: "칙칙함", hint: "브라이트닝 케어", aliases: ["칙칙함"] },
  { slug: "sensitive", name: "예민함", hint: "순한 진정·세안", aliases: ["민감", "예민함"] },
  { slug: "pore", name: "모공", hint: "매끈한 결 정돈", aliases: ["모공"] },
];

// 라벨(표준명·slug·alias 무엇이든) → 표준 고민 조회용 인덱스
const byLabel = new Map<string, Concern>();
for (const c of concerns) {
  byLabel.set(c.slug, c);
  byLabel.set(c.name, c);
  for (const a of c.aliases) byLabel.set(a, c);
}

// ── Helpers ──────────────────────────────────────────────────
export const concernBySlug = (slug: string) =>
  concerns.find((c) => c.slug === slug);

/** 어떤 표기(상품 태그·Pick concern·옛 라벨)든 표준 고민으로 해석. */
export const resolveConcern = (label: string): Concern | undefined =>
  byLabel.get(label.trim());

/** 한 상품이 가진 고민을 표준 slug 로 중복 없이 반환. */
export const productConcernSlugs = (p: Product): string[] => {
  const set = new Set<string>();
  for (const label of p.concerns) {
    const c = resolveConcern(label);
    if (c) set.add(c.slug);
  }
  return Array.from(set);
};

export const productMatchesConcern = (p: Product, slug: string): boolean =>
  productConcernSlugs(p).includes(slug);

/** 특정 고민을 다루는 상품 전체 (마켓플레이스 비교용). */
export const productsByConcern = (slug: string): Product[] =>
  products.filter((p) => productMatchesConcern(p, slug));

/** 주어진 상품 목록에 실제로 존재하는 표준 고민을 마스터 순서대로. (카테고리 필터용) */
export const concernsInProducts = (list: Product[]): Concern[] => {
  const present = new Set<string>();
  for (const p of list) for (const s of productConcernSlugs(p)) present.add(s);
  return concerns.filter((c) => present.has(c.slug));
};
