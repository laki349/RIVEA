import { SearchIcon } from "@/components/Icons";

const popular = [
  "리프팅 디바이스",
  "기미 커버 쿠션",
  "레티놀 세럼",
  "LED 마스크",
  "콜라겐 크림",
  "주름 안착 프라이머",
  "저자극 클렌저",
  "이너뷰티 콜라겐",
];

export default function SearchPage() {
  return (
    <div className="shell py-8">
      <h1 className="font-serif text-2xl font-semibold text-espresso">검색</h1>

      <form
        action="#"
        role="search"
        className="mt-4 flex items-center gap-2 rounded-full border border-line-strong bg-white px-4 py-3 shadow-soft focus-within:border-gold"
      >
        <SearchIcon className="h-5 w-5 text-stone" />
        <input
          type="search"
          autoFocus
          aria-label="상품 검색"
          placeholder="찾으시는 상품을 입력하세요"
          className="w-full bg-transparent text-[15px] text-cocoa outline-none placeholder:text-stone"
        />
      </form>

      <section className="mt-8">
        <p className="mb-3 text-sm font-semibold text-cocoa">인기 검색어</p>
        <div className="flex flex-wrap gap-2">
          {popular.map((k, i) => (
            <button
              key={k}
              type="button"
              className="rounded-full border border-line-strong bg-white px-3.5 py-2 text-[13.5px] text-taupe transition hover:border-gold hover:text-cocoa"
            >
              <span className="mr-1.5 font-semibold text-gold">{i + 1}</span>
              {k}
            </button>
          ))}
        </div>
      </section>

      <p className="mt-10 text-center text-sm text-stone">
        * 검색 기능은 프로토타입에서 아직 연결되지 않았어요.
      </p>
    </div>
  );
}
