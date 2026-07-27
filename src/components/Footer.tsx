import Link from "next/link";
import { categories } from "@/data/catalog";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-cream/60">
      <div className="shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-xl font-semibold text-espresso">리베아 Rebea</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-taupe">
              피부 고민별로, 홈케어 기기와 화장품을 브랜드 넘나들며 한 루틴으로
              골라주는 곳. 리베아 Pick으로 시작하세요.
            </p>
            <p className="mt-4 text-xs text-stone">
              * 본 사이트는 디자인 프로토타입이며 모든 상품은 예시 데이터입니다.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-cocoa">카테고리</p>
            <ul className="space-y-2 text-sm text-taupe">
              {categories.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="transition hover:text-cocoa">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-cocoa">고객 안내</p>
            <ul className="space-y-2 text-sm text-taupe">
              <li>전 상품 무료배송</li>
              <li>7일 무료 반품</li>
              <li>브랜드 공식 정품 보장</li>
              <li>평일 오후 2시 이전 당일 출고</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-xs text-stone">
          © {new Date().getFullYear()} Mature Care. Prototype for demonstration.
        </div>
      </div>
    </footer>
  );
}
