// Encapsulated Header
document.write(`
<header class="am-topbar am-topbar-fixed-top wos-header">
    <div class="am-container">
        <h1 class="am-topbar-brand">
            <a href="index.html"><img src="images/logo.png" alt=""></a>
        </h1>

        <button class="am-topbar-btn am-topbar-toggle am-btn am-btn-sm am-btn-warning am-show-sm-only"
            data-am-collapse="{target: '#collapse-head'}">
            <span class="am-sr-only">导航切换</span>
            <span class="am-icon-bars"></span>
        </button>

        <div class="am-collapse am-topbar-collapse" id="collapse-head">
            <ul class="am-nav am-nav-pills am-topbar-nav">
                <li><a href="index.html">首页</a></li>
                <li><a href="boke.html">博客</a></li>
                <li class="am-dropdown" data-am-dropdown>
                    <a class="am-dropdown-toggle" data-am-dropdown-toggle href="javascript:;">
                        小事 <span class="am-icon-caret-down"></span>
                    </a>
                    <ul class="am-dropdown-content">
                        <li><a href="https://link3.cc/xuwibanxia">🌊个人站下载</a></li>
                        <li><a href="tigoo.html">🐲奇瑞汽车工程密码</a></li>
                        <li><a href="http://tool.mkblog.cn/relax/">🦁放松一下</a></li>
                    </ul>
                </li>
                <li><a href="game.html">游戏</a></li>
                <li><a href="最近更新.html">更新</a></li>
                <li><a href="https://support.qq.com/product/374554">论坛</a></li>
            </ul>
            <div class="am-topbar-right">
                <a href="https://www.lanzouw.com/b02oefvsf"><button
                        class="am-btn am-btn-danger am-topbar-btn am-btn-sm"><span
                            class="am-icon-user"></span>下载文件</button></a>
            </div>
        </div>
    </div>
</header>
`);

// Highlight active menu item
(function() {
    var currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '/') currentPage = 'index.html';
    
    // Decode URI component in case filename has Chinese characters
    try {
        currentPage = decodeURIComponent(currentPage);
    } catch(e) {}

    var links = document.querySelectorAll('.am-nav.am-topbar-nav > li > a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.parentNode.classList.add('am-active');
        }
    }
})();
