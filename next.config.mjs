/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 정적 export — 무료 Firebase Hosting(Spark)에 배포하기 위함.
  // 서버가 필요한 기능(API 라우트·요청별 동적 렌더링) 없음 확인됨.
  output: "export",
};

export default nextConfig;
