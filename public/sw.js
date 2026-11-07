const CACHE = 'yocim-nexus-v2';
const ASSETS = ['/', '/index.html', '/manifest.json', '/yocim.png', '/favicon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

async function handleFetch(request) {
  // 同源静态资源：缓存优先，后台更新
  const cached = await caches.match(request);
  if (cached) {
    fetch(request)
      .then((res) => {
        if (res && res.ok) {
          return caches.open(CACHE).then((c) => c.put(request, res.clone()));
        }
      })
      .catch(() => {});
    return cached;
  }

  try {
    const res = await fetch(request);
    // 只缓存有效的同源响应，失败的或不透明响应不写入缓存
    if (res && res.ok) {
      const clone = res.clone();
      caches.open(CACHE)
        .then((c) => c.put(request, clone))
        .catch(() => {});
    }
    return res;
  } catch {
    // 网络不可用且无缓存时返回合法 Response，避免未捕获异常
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  // 跨域请求（如外部字体/CDN）交给浏览器原生处理，不拦截
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    handleFetch(e.request).catch(
      () => new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
    )
  );
});
