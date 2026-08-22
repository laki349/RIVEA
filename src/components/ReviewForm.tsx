"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { deleteReview, reviewId, saveReview, useReviews } from "@/lib/reviews";

/**
 * 리뷰 작성·수정 — 주문 상세의 배송 완료 품목 아래에 펼쳐진다.
 *
 * 별도 화면으로 빼지 않은 이유: 리뷰를 쓰는 순간 사용자는 "이 주문의 이 상품"을
 * 보고 있다. 화면을 옮기면 무엇에 대한 리뷰였는지 다시 확인해야 한다.
 *
 * 저장 버튼은 있다. 프로필 설정과 달리 리뷰는 **남에게 보이는 글**이라,
 * 쓰는 도중의 문장이 자동으로 올라가면 안 된다.
 */
export default function ReviewForm({
  productId,
  productName,
  orderNo,
}: {
  productId: string;
  productName: string;
  orderNo: string;
}) {
  const reviews = useReviews();
  const existing = reviews.find((r) => r.id === reviewId(productId, orderNo));

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existing?.rating ?? 5);
  const [text, setText] = useState(existing?.text ?? "");

  // 이미 쓴 리뷰 — 접힌 상태에서 내용을 보여준다
  if (existing && !open) {
    return (
      <div className="mt-2 rounded border border-line px-3 py-[11px]">
        <div className="flex items-center justify-between">
          <StarRating value={existing.rating} size={15} />
          <button
            onClick={() => {
              setRating(existing.rating);
              setText(existing.text);
              setOpen(true);
            }}
            className="press py-1 pl-3 text-[14px] text-meta"
          >
            수정
          </button>
        </div>
        <p className="mt-[6px] whitespace-pre-line text-[14px] leading-[1.55] text-body">
          {existing.text}
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="press mt-2 h-11 w-full rounded border border-ink text-[15px] font-medium text-ink"
      >
        리뷰 쓰기
      </button>
    );
  }

  const tooShort = text.trim().length < 10;

  return (
    <div className="animate-rise mt-2 rounded border border-line p-[14px]">
      <p className="text-[15px] font-medium text-ink">{productName}</p>

      <div className="mt-2 flex items-center gap-2">
        {/* 음수 마진 — 별 버튼의 44px 여백이 카드 안쪽 정렬을 밀어내지 않게 */}
        <span className="-ml-[11px]">
          <StarRating value={rating} onChange={setRating} />
        </span>
        <span className="text-[14px] text-meta">{rating}점</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="어떻게 쓰셨는지, 어떤 점이 좋고 아쉬웠는지 적어주세요."
        aria-label="리뷰 내용"
        className="mt-2 w-full resize-none rounded border border-line px-3 py-[10px] text-[15px] leading-[1.6] text-ink placeholder:text-meta"
      />
      <p className="mt-1 text-[13px] text-meta">
        {tooShort ? `${10 - text.trim().length}자 더 쓰면 등록할 수 있어요` : `${text.trim().length}자`}
      </p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setOpen(false)}
          className="press h-12 flex-1 rounded-cta border border-line text-[15px] font-medium text-body"
        >
          취소
        </button>
        <button
          disabled={tooShort}
          onClick={() => {
            saveReview({ productId, orderNo, rating, text: text.trim() });
            setOpen(false);
          }}
          className="press h-12 flex-1 rounded-cta bg-ink text-[15px] font-medium text-on-ink disabled:opacity-40"
        >
          {existing ? "수정하기" : "등록하기"}
        </button>
      </div>

      {existing && (
        <button
          onClick={() => {
            deleteReview(existing.id);
            setOpen(false);
            setText("");
          }}
          className="press mt-2 h-11 w-full text-[14px] text-meta"
        >
          리뷰 삭제
        </button>
      )}
    </div>
  );
}
