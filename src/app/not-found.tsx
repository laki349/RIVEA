import Link from "next/link";
import Icon from "@/components/Icon";
import TabBar from "@/components/TabBar";

/**
 * 404. 커스텀이 없으면 호스팅 기본 화면이 뜨는데, 그건 발표 중에 보이면 안 된다.
 *
 * 「순서 검사」(/check)를 없애면서 만들었다. 그 화면이 하던 일은 「내 화장대」가
 * 그대로 하고 저장까지 하므로, 예전 링크로 들어온 사람을 거기로 안내한다.
 */
export default function NotFound() {
  return (
    <>
      <header className="sticky top-0 z-40 flex items-center border-b border-hairline bg-surface px-4 py-[13px]">
        <Link href="/" className="text-[21px] font-bold tracking-[0.12em] text-rose">
          RIVEA
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <span className="text-disabled">
          <Icon name="search" size={44} />
        </span>
        <p className="mt-4 text-[18px] font-bold text-ink">찾으시는 화면이 없어요</p>
        <p className="mt-2 text-[17px] leading-[1.6] text-meta">
          주소가 바뀌었거나 없어진 화면이에요.
          <br />
          쓰시던 제품의 조합은 「내 화장대」에서 보실 수 있어요.
        </p>
        <Link
          href="/shelf"
          className="press mt-6 flex h-12 items-center justify-center rounded-cta bg-ink px-7 text-[17px] font-medium text-on-ink"
        >
          내 화장대 열기
        </Link>
        <Link href="/" className="press mt-2 flex h-11 items-center text-[17px] text-body">
          홈으로
        </Link>
      </main>
      <TabBar />
    </>
  );
}
