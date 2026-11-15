/* ============================================================
   全站深色模式脚本
   - 优先级：localStorage('site-theme') > 系统偏好 > 默认浅色
   - 各页 <head> 中的防闪脚本负责提前设置 data-theme，
     本脚本负责：切换按钮、写入偏好、跟随系统变化
   ============================================================ */
(function () {
    var KEY = 'site-theme';

    function systemDark() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function stored() {
        try {
            var v = localStorage.getItem(KEY);
            return (v === 'dark' || v === 'light') ? v : null;
        } catch (e) { return null; }
    }

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateBtn();
    }

    function updateBtn() {
        var btn = document.getElementById('dm-toggle');
        if (!btn) return;
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        btn.textContent = dark ? '☀️' : '🌙';
        btn.title = dark ? '切换为浅色模式' : '切换为深色模式';
    }

    function toggle() {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(KEY, next); } catch (e) {}
        // 柔和过渡
        var html = document.documentElement;
        html.classList.add('dm-anim');
        setTimeout(function () { html.classList.remove('dm-anim'); }, 400);
        apply(next);
    }

    function ensureBtn() {
        if (document.getElementById('dm-toggle')) return;
        var btn = document.createElement('button');
        btn.id = 'dm-toggle';
        btn.setAttribute('aria-label', '切换深色模式');
        btn.addEventListener('click', toggle);
        document.body.appendChild(btn);
        updateBtn();
    }

    // 无手动偏好时，跟随系统实时变化
    if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var onChange = function () {
            if (!stored()) apply(systemDark() ? 'dark' : 'light');
        };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
    }

    // 兜底同步（防止个别页面漏加防闪脚本）
    apply(stored() || (systemDark() ? 'dark' : 'light'));

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureBtn);
    } else {
        ensureBtn();
    }
})();
