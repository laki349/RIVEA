import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Firebase 초기화.
 *
 * 이 설정값은 비밀이 아니다 — 웹 앱용 공개 식별자이고, 클라이언트 번들에 그대로 들어간다.
 * 실제 보호는 Firebase 콘솔의 승인된 도메인 + 보안 규칙이 담당한다.
 * 정적 export(output: "export")라서 서버가 없고, 인증은 전부 브라우저에서 돈다.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDoZyw0j1lypI7516Is_wdP0b4NK1NqLVk",
  authDomain: "rivea-app.firebaseapp.com",
  projectId: "rivea-app",
  storageBucket: "rivea-app.firebasestorage.app",
  messagingSenderId: "725223203103",
  appId: "1:725223203103:web:7508e8dfb6d318b543502a",
};

// Fast Refresh로 모듈이 다시 평가될 때 중복 초기화되지 않게 방어
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
