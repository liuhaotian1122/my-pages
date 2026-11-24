/**
 * 浩天的个人站 Service Worker
 *
 * 缓存策略：
 *   - 页面导航：stale-while-revalidate——缓存立即上屏（回访秒开），同时后台拉取最新版本更新缓存；
 *     首次访问无缓存时等待网络，断网回退首页（离线也能浏览看过的博客）
 *   - 公开 API（api.liuhaotian.cc.cd/api/public/*）：网络优先 + 缓存兜底
 *   - 本站静态资源 / CDN 样式字体 / R2 图片（/uploads/）：缓存优先
 *   - 管理接口（/api/content 等）与 POST 请求（点赞、浏览、弹幕）一律不拦截
 *
 * 更新缓存：修改本文件后把 VERSION 号 +1，旧缓存会在 activate 阶段自动清理。
 */

const VERSION = 'v11';
const PRECACHE = `my-pages-precache-${VERSION}`;
const RUNTIME = `my-pages-runtime-${VERSION}`;

// 注意：与 js/api-config.js 的 API 域名保持一致
const API_ORIGIN = 'https://api.liuhaotian.cc.cd';
const CDN_ORIGIN = 'https://cdn.staticfile.org';

// 预缓存核心页面与共享资源
const PRECACHE_URLS = [
  './', './index.html', './boke.html', './blog-detail.html', './suosui.html',
  './update.html', './annual-report.html', './food.html', './work.html',
  './jingli.html', './game.html', './Wechat.html',
  './assets/css/amazeui.min.css', './css/public.css', './css/darkmode.css', './css/xiaocheng.css',
  './css/gallery-viewer.css',
  './js/api-config.js', './js/header.js', './js/footer.js', './js/darkmode.js', './js/xiaocheng.js', './js/pwa.js',
  './assets/js/jquery.min.js', './assets/js/amazeui.min.js',
  './images/i/app.svg', './images/i/favicon.png', './images/star.png',
];

const OFFLINE_TEXT = '当前离线，且没有找到缓存内容';

// ==================== install：预缓存核心资源 ====================

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    // 单个资源失败不影响整体安装（cache.add 对 404 会抛错，这里逐个容忍）
    await Promise.allSettled(PRECACHE_URLS.map(u => cache.add(new Request(u, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

// ==================== activate：清理旧版本缓存 ====================

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k.startsWith('my-pages-') && k !== PRECACHE && k !== RUNTIME)
      .map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// ==================== fetch：请求分流 ====================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!/^https?:$/.test(url.protocol)) return;
  if (request.headers.has('Range')) return; // 视频等分段请求不拦截

  // API 域名：公开接口网络优先（离线可看），R2 图片缓存优先，其余（管理接口）不拦截
  if (url.origin === API_ORIGIN) {
    if (url.pathname.startsWith('/api/public/')) {
      event.respondWith(networkFirst(request));
    } else if (url.pathname.startsWith('/uploads/')) {
      event.respondWith(cacheFirst(request));
    }
    return;
  }

  // 本站：页面导航 SWR（缓存立即上屏 + 后台更新），静态资源缓存优先
  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate') {
      event.respondWith(staleWhileRevalidate(request, './index.html'));
    } else {
      event.respondWith(cacheFirst(request));
    }
    return;
  }

  // 外部 CDN（font-awesome 等字体样式）：缓存优先，保证断网页面样式完整
  if (url.origin === CDN_ORIGIN) {
    event.respondWith(cacheFirst(request));
  }
  // 其余跨域请求一律放行
});

// ==================== 策略实现 ====================

/** 网络优先：联网拿最新并更新缓存，断网回退缓存（fallbackUrl 为页面级兜底） */
async function networkFirst(request, fallbackUrl) {
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) {
      const cache = await caches.open(RUNTIME);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await caches.match(fallbackUrl);
      if (fallback) return fallback;
    }
    return new Response(OFFLINE_TEXT, { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}

/** 缓存优先：命中直接返回，未命中拉取并写入缓存 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const fresh = await fetch(request);
    if (fresh && (fresh.ok || fresh.type === 'opaque')) {
      const cache = await caches.open(RUNTIME);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (err) {
    return new Response(OFFLINE_TEXT, { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}

/** SWR：有缓存立即返回（回访秒开），同时后台拉取最新并更新缓存；
 *  无缓存时等待网络，失败则回退 fallbackUrl，再失败返回离线提示 */
async function staleWhileRevalidate(request, fallbackUrl) {
  const cached = await caches.match(request);
  const networkPromise = (async () => {
    try {
      const fresh = await fetch(request);
      if (fresh && fresh.ok) {
        const cache = await caches.open(RUNTIME);
        cache.put(request, fresh.clone());
      }
      return fresh;
    } catch (err) {
      return null;
    }
  })();

  if (cached) return cached;

  const fresh = await networkPromise;
  if (fresh) return fresh;
  if (fallbackUrl) {
    const fallback = await caches.match(fallbackUrl);
    if (fallback) return fallback;
  }
  return new Response(OFFLINE_TEXT, { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
