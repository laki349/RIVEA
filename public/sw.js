/**
 * RIVEA 서비스워커 — 설치된 앱이 오프라인에서도 열리게 한다.
 *
 * 전략을 둘로 나눈다.
 *  - **화면(navigate)**: 네트워크 먼저. 실패하면 캐시, 그것도 없으면 홈.
 *    캐시 먼저로 하면 배포해도 사용자가 옛 화면을 계속 본다 —
 *    이 앱은 데모 기간에 자주 배포하므로 그쪽이 더 위험하다.
 *  - **정적 자원(_next/static, images, icons)**: 캐시 먼저.
 *    `_next/static`은 파일명에 해시가 붙어 내용이 바뀌면 이름도 바뀐다.
 *
 * 버전을 올리면 activate에서 옛 캐시를 지운다. 배포 후 정리를 잊지 말 것.
 */
/**
 * ⚠️ 버전을 올리면 activate에서 옛 캐시를 통째로 지운다.
 * v2: HTML이 max-age=3600으로 캐시되던 문제를 firebase.json headers로 고치면서,
 *     이미 캐시에 박힌 옛 화면을 비우려고 올렸다.
 */
const VERSION = "rivea-v2";
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      // 하나라도 실패하면 설치 전체가 실패하므로 개별로 담는다
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // 다른 출처(구글 인증·폰트 CDN 등)는 건드리지 않는다
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match("/")))
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
            return res;
          })
      )
    );
  }
});
