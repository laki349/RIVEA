import { TruckIcon, ShieldIcon, ReturnIcon } from "./Icons";

// 원형 아이콘 3단 카드(= AI 티) 대신, 가는 한 줄 띠.
// 아이콘과 텍스트를 인라인으로, 얇은 구분선으로만 나눈다.
const items = [
  { Icon: TruckIcon, text: "하나만 주문해도 무료배송" },
  { Icon: ShieldIcon, text: "공식 입점 브랜드 정품 보장" },
  { Icon: ReturnIcon, text: "7일 무료 반품" },
];

export default function TrustBar() {
  return (
    <ul className="no-scrollbar -mx-5 flex items-center gap-x-6 gap-y-2 overflow-x-auto whitespace-nowrap border-y border-line px-5 py-3.5 text-[13.5px] text-taupe sm:mx-0 sm:justify-center sm:gap-x-10 sm:px-0">
      {items.map(({ Icon, text }, i) => (
        <li key={text} className="flex items-center">
          {i > 0 && <span className="mr-6 hidden h-3 w-px bg-line-strong sm:mr-10 sm:block" />}
          <Icon className="mr-2 h-4 w-4 text-gold" />
          {text}
        </li>
      ))}
    </ul>
  );
}
