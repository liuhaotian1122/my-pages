/**
 * API 配置文件
 *
 * 当前架构：前后端部署在同一 Cloudflare Pages 域名下
 *   静态页面 + /api/*、/uploads/* 由 Pages Functions 处理（见 functions/[[path]].js）
 *   → 同源访问，API_BASE 为空字符串即可
 *
 * 调试技巧：浏览器控制台执行
 *   localStorage.setItem('API_BASE_URL', 'https://某后端地址')  可临时切换后端
 */

// 从 localStorage 获取用户设置的后端地址（优先级最高，方便动态调试）
const CUSTOM_URL = localStorage.getItem('API_BASE_URL') || '';

// 同源部署：默认空字符串；localStorage 里设置了地址则走跨域
const API_BASE = CUSTOM_URL;

/**
 * 获取 API 完整 URL
 * @param {string} path - API 路径，如 '/api/public/work'
 * @returns {string} 完整 URL
 */
function apiUrl(path) {
  return API_BASE + path;
}



