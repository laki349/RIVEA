import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-5xl font-semibold text-champagne">404</p>
      <h1 className="mt-4 text-xl font-semibold text-espresso">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-2 text-sm text-taupe">
        주소가 바뀌었거나 사라진 페이지예요.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-cocoa px-6 py-3 text-sm font-semibold text-ivory transition hover:bg-espresso"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
