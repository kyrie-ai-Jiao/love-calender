// ===== 恋爱日历 Service Worker =====
// 缓存策略：预缓存关键页面 → 访问时缓存优先 → 离线可用

const CACHE_NAME = "love-calendar-v1";

// ===== 安装时预缓存关键资源 =====
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/love-calender/",
        "/love-calender/settings/",
        "/love-calender/album/",
        "/love-calender/wishes/",
        "/love-calender/checkin/",
        "/love-calender/timeline/",
        "/love-calender/manifest.json",
        "/love-calender/icons/icon.svg",
      ]);
    })
  );
  // 立即激活，不等待旧 SW
  self.skipWaiting();
});

// ===== 激活时清理旧缓存 =====
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ===== 拦截请求：缓存优先策略 =====
self.addEventListener("fetch", (event) => {
  // 只处理 GET 请求
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // 缓存命中：直接返回，同时在后台更新缓存
        const fetchPromise = fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        }).catch(() => {});
        return cached;
      }

      // 缓存未命中：请求网络
      return fetch(event.request)
        .then((response) => {
          if (!response.ok) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => {
          // 离线且无缓存 → 返回首页
          return caches.match("/love-calender/");
        });
    })
  );
});
