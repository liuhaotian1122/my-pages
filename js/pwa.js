/**
 * PWA 引导：动态注入 manifest + 注册 Service Worker + 轻量访问统计
 * （各页面在 body 末尾引入本文件即可，无需逐页修改 head）
 */
(function () {
    // 注入 manifest 链接（浏览器支持运行时插入的 manifest）
    if (!document.querySelector('link[rel="manifest"]')) {
        var link = document.createElement('link');
        link.rel = 'manifest';
        link.href = 'manifest.json';
        document.head.appendChild(link);
    }

    // 轻量访问统计：页面加载即上报一次 PV（归属地由后端边缘节点记录，不取个人信息）
    try {
        var TRACK_ORIGIN = 'https://api.liuhaotian.cc.cd'; // 与 js/api-config.js 保持一致
        var trackPayload = JSON.stringify({ path: location.pathname });
        if (navigator.sendBeacon) {
            // text/plain 避免 CORS 预检；后端直接按 JSON 解析
            navigator.sendBeacon(TRACK_ORIGIN + '/api/public/track',
                new Blob([trackPayload], { type: 'text/plain' }));
        } else {
            fetch(TRACK_ORIGIN + '/api/public/track', {
                method: 'POST', keepalive: true, body: trackPayload
            }).catch(function () {});
        }
    } catch (e) { /* 统计失败不影响页面 */ }

    // 注册 Service Worker（仅 HTTPS / localhost 生效）
    if ('serviceWorker' in navigator &&
        (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw.js').catch(function (err) {
                console.error('Service Worker 注册失败:', err);
            });
        });
    }
})();
