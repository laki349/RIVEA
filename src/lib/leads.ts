import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "./firebase";

/**
 * `/lp` 랜딩의 진단 신청 저장.
 *
 * 서버가 없다(정적 export). 그래서 브라우저에서 Firestore로 바로 쓴다.
 * 보호는 두 겹이다:
 *  ① firestore.rules — leads는 **create만** 열려 있고 read/update/delete는 전부 막혀 있다.
 *     남이 남의 연락처를 읽어가면 그 순간 개인정보 사고다.
 *  ② 익명 인증 — 규칙에서 request.auth를 요구해 완전 무인증 쓰기를 막는다.
 *     게스트 진입에 이미 쓰고 있는 그 익명 로그인이다(§0-D).
 *
 * ⚠️ 연락처가 들어가므로 이 컬렉션은 개인정보다. 콘솔에서 열람 권한을 좁히고,
 *    회신이 끝난 건은 지운다. 폼에 적어둔 보유기간(6개월)이 약속이지 장식이 아니다.
 */

export type ContactType = "email" | "phone";

export type LeadInput = {
  /** 쓰고 있는 제품 1~3개. 빈 칸은 호출 전에 걸러서 보낸다 */
  products: string[];
  contact: string;
  contactType: ContactType;
  /** 개인정보 수집 동의. false면 애초에 제출 버튼이 안 눌린다 */
  agreed: true;
  /** 유입 경로 — ?ref=insta, ?ref=card 처럼 붙여 보낸다. 없으면 "direct" */
  ref: string;
};

export const MAX_PRODUCT_LEN = 60;
export const MAX_CONTACT_LEN = 100;

/** 이메일은 형식이 틀리면 회신이 못 가므로 최소한만 본다. 과하게 막으면 실제 주소가 걸린다 */
export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/**
 * 휴대폰 — 하이픈·공백을 섞어 적는 사람이 많다. 숫자만 남겨서 10~11자리인지 본다.
 * 40대+ 대상이라 입력 형식을 강제하면 그 자리에서 이탈한다.
 */
export const normalizePhone = (v: string) => v.replace(/[^0-9]/g, "");
export const isValidPhone = (v: string) => {
  const d = normalizePhone(v);
  return d.length >= 10 && d.length <= 11 && d.startsWith("0");
};

/**
 * ⚠️ 타임아웃이 반드시 필요하다.
 *
 * Firestore 웹 SDK는 쓰기를 **로컬 큐에 넣고 조용히 재시도**한다. 그래서 API가 꺼져 있거나
 * 네트워크가 끊긴 상태에서 `addDoc`의 프로미스가 거부되지 않고 그냥 매달린다.
 * 화면은 "보내는 중…"에서 영원히 멈추고, 사용자는 자기가 뭘 잘못했는지 모른 채 나간다.
 * 실제로 이 랜딩을 만들다가 그 상태를 재현했다(Firestore API 미활성 · 403).
 *
 * 그래서 실패를 눈에 보이게 만든다. 큐에 남은 쓰기는 나중에 연결이 살아나면
 * 저절로 올라가므로, 타임아웃이 데이터를 버리는 건 아니다.
 */
const SUBMIT_TIMEOUT_MS = 12_000;

const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([
    p,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms),
    ),
  ]);

export async function submitLead(input: LeadInput) {
  // 익명 uid가 없으면 규칙에서 막힌다. 이미 로그인한 사람은 그 uid를 그대로 쓴다
  if (!auth.currentUser) await withTimeout(signInAnonymously(auth), SUBMIT_TIMEOUT_MS);

  const products = input.products
    .map((p) => p.trim().slice(0, MAX_PRODUCT_LEN))
    .filter(Boolean)
    .slice(0, 3);

  await withTimeout(
    addDoc(collection(db, "leads"), {
      products,
      contact: input.contact.trim().slice(0, MAX_CONTACT_LEN),
      contactType: input.contactType,
      agreed: true,
      ref: input.ref.slice(0, 40),
      uid: auth.currentUser?.uid ?? null,
      createdAt: serverTimestamp(),
    }),
    SUBMIT_TIMEOUT_MS,
  );
}
