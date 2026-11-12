/**
 * API 配置文件
 *
 * 架构（2026-11 分离部署）：
 *   前端：liuhaotian.de5.net        → 腾讯 EdgeOne Pages（大陆访问快）
 *   后端：api.liuhaotian.de5.net    → Cloudflare Pages（API + 图片 + D1/KV）
 *   同域兜底：*.pages.dev / workers.dev / localhost → 走同源（后端也在那）
 *
 * 调试技巧：浏览器控制台执行
 *   localStorage.setItem('API_BASE_URL', 'https://某后端地址')  可临时切换后端
 */

// 从 localStorage 获取用户设置的后端地址（优先级最高，方便动态调试）
const CUSTOM_URL = localStorage.getItem('API_BASE_URL') || '';

// Cloudflare 后端地址（D1/KV 数据都在这里）
const CF_BACKEND = 'https://api.liuhaotian.cc.cd';

// Cloudflare 同源部署（pages.dev / workers.dev / localhost）→ 走同源；
// 其他域名（如 EdgeOne、de5.net）→ 跨域指向 Cloudflare API 子域
const IS_CF_HOST = location.hostname === 'localhost'
  || location.hostname.endsWith('.pages.dev')
  || location.hostname.endsWith('.workers.dev');

const API_BASE = CUSTOM_URL || (IS_CF_HOST ? '' : CF_BACKEND);

/**
 * 获取 API 完整 URL
 * @param {string} path - API 路径，如 '/api/public/work'
 * @returns {string} 完整 URL
 */
function apiUrl(path) {
  return API_BASE + path;
}

/**
 * API 请求自动重试（全局拦截）
 *
 * 背景：移动网络（联通蜂窝等）访问海外 API 入口偶发连接失败（浏览器报错 -6），
 *       重试一次通常即可恢复。
 * 策略：只重试 GET 请求（避免 POST/PUT/DELETE 重试造成内容重复提交），
 *       最多 3 次尝试，间隔 600ms / 1200ms。
 */
(function () {
  const origFetch = window.fetch ? window.fetch.bind(window) : null;
  if (!origFetch) return;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  window.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    if (!url.includes('/api/') || method !== 'GET') return origFetch(input, init);
    let lastErr;
    for (let i = 0; i < 3; i++) {
      try {
        return await origFetch(input, init);
      } catch (e) {
        lastErr = e;
        if (i < 2) await sleep(600 * (i + 1));
      }
    }
    throw lastErr;
  };
})();
