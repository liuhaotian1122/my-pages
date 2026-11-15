/**
 * PWA 引导：动态注入 manifest + 注册 Service Worker
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
