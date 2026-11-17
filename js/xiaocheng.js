/**
 * 小橙 · AI 管家 —— 全站共享挂载脚本
 *
 * 在页面 </body> 前引入本文件即可（放在 js/pwa.js 之前）：
 *   <script src="js/xiaocheng.js"></script>
 *
 * 职责：
 *   1. 自动注入小橙的样式链接（css/xiaocheng.css）与 DOM（悬浮按钮 + 聊天窗 + 每日欢迎气泡）
 *   2. 接管全部聊天逻辑：后端 AI 代理、站内搜索、语音对话、聊天记忆、每日欢迎语
 *
 * 依赖：无（不依赖 jQuery / AmazeUI / api-config.js，均做了兜底）
 * 注意：若页面已存在 id="aiChatWindow" 的聊天窗（如旧版内联实现），本脚本自动跳过，不会重复挂载
 */
(function () {
    // 已有聊天窗（旧版内联实现或重复引入）则不重复挂载
    if (document.getElementById('aiChatWindow')) return;

    // ---------- 0. 路径与 API 兜底 ----------
    // 根据当前 script 的 src 推算站点根路径，兼容子目录页面（如 heart/）
    var mySrc = (document.currentScript && document.currentScript.src) || '';
    var rootPrefix = '';
    try {
        var dir = mySrc.slice(0, mySrc.lastIndexOf('/') + 1); // .../js/
        rootPrefix = dir.replace(/js\/?$/, '');               // 站点根
    } catch (e) { /* 取不到时按根路径处理 */ }

    // API 地址：优先复用 js/api-config.js 的 apiUrl()，未引入的页面走 Cloudflare 后端兜底
    var xcApiUrl = (typeof apiUrl === 'function') ? apiUrl : function (path) {
        return 'https://api.liuhaotian.cc.cd' + path;
    };

    // ---------- 1. 注入样式 ----------
    if (!document.querySelector('link[data-xiaocheng]')) {
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = rootPrefix + 'css/xiaocheng.css';
        css.setAttribute('data-xiaocheng', '1');
        document.head.appendChild(css);
    }

    // ---------- 2. 注入 DOM ----------
    document.body.insertAdjacentHTML('beforeend', [
        // 小橙每日欢迎语气泡
        '<div class="ai-greeting-bubble" id="aiGreetingBubble" style="display:none">',
        '    <button class="ai-greeting-close" id="aiGreetingClose" title="关闭">×</button>',
        '    <div class="ai-greeting-text" id="aiGreetingText"></div>',
        '</div>',
        '',
        '<div class="ai-chat-button-wrapper" id="aiButtonWrapper">',
        '    <div class="ai-toggle-hide" id="aiToggleHide" title="隐藏AI助手">',
        '        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '            <polyline points="9 18 15 12 9 6"></polyline>',
        '        </svg>',
        '    </div>',
        '    <div class="ai-chat-button" id="aiChatButton" title="AI智能客服">',
        '        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 48 48" fill="none">',
        '            <rect x="10" y="14" width="28" height="24" rx="4" fill="white" stroke="white" stroke-width="1.5"/>',
        '            <line x1="24" y1="8" x2="24" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/>',
        '            <circle cx="24" cy="6" r="2" fill="white"/>',
        '            <rect x="16" y="22" width="6" height="8" rx="3" fill="#ff9a56"/>',
        '            <rect x="26" y="22" width="6" height="8" rx="3" fill="#ff9a56"/>',
        '            <path d="M18 34 L30 34" stroke="#ff9a56" stroke-width="2" stroke-linecap="round"/>',
        '            <rect x="8" y="20" width="3" height="8" rx="1.5" fill="white"/>',
        '            <rect x="37" y="20" width="3" height="8" rx="1.5" fill="white"/>',
        '        </svg>',
        '    </div>',
        '    <div class="ai-chat-label">智能服务</div>',
        '</div>',
        '',
        '<div class="ai-chat-window" id="aiChatWindow">',
        '    <div class="ai-chat-header">',
        '        <div class="ai-chat-header-left">',
        '            <div class="ai-chat-avatar">🍊</div>',
        '            <div class="ai-chat-info">',
        '                <h3>小橙 · AI 管家</h3>',
        '                <p>在线为您服务</p>',
        '            </div>',
        '        </div>',
        '        <div class="ai-chat-header-right">',
        '            <div class="ai-chat-clear-btn" id="aiChatClear" title="清空聊天记录" style="display:none">',
        '                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '                    <polyline points="3 6 5 6 21 6"></polyline>',
        '                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',
        '                </svg>',
        '            </div>',
        '            <div class="ai-chat-speak-btn" id="aiSpeakToggle" title="朗读小橙的回复" style="display:none">',
        '                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>',
        '                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>',
        '                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>',
        '                </svg>',
        '            </div>',
        '            <div class="ai-chat-close" id="aiChatClose">',
        '                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '                    <line x1="18" y1="6" x2="6" y2="18"></line>',
        '                    <line x1="6" y1="6" x2="18" y2="18"></line>',
        '                </svg>',
        '            </div>',
        '        </div>',
        '    </div>',
        '',
        '    <div class="ai-chat-messages" id="aiChatMessages">',
        '        <div class="ai-message">',
        '            <div class="message-avatar">🍊</div>',
        '            <div class="message-content">',
        '                嗨～我是小橙，浩天站的 AI 管家 🍊<br>',
        '                可以让我播报新博客、送节日祝福，也可以随便聊！',
        '                <div class="quick-replies">',
        '                    <button class="quick-reply-btn" onclick="sendQuickReply(\'播报一下最新的博客文章！\')">📢 播报新博客</button>',
        '                    <button class="quick-reply-btn" onclick="startArticleSearch()">🔍 找文章</button>',
        '                    <button class="quick-reply-btn" onclick="sendQuickReply(\'今天有什么节日吗？\')">🎉 节日问候</button>',
        '                    <button class="quick-reply-btn" onclick="sendQuickReply(\'介绍一下这个网站吧\')">✨ 介绍网站</button>',
        '                </div>',
        '                <small style="color:#999;display:block;margin-top:8px">💡 试试随便聊点什么吧～</small>',
        '            </div>',
        '        </div>',
        '    </div>',
        '',
        '    <div class="ai-chat-input-area">',
        '        <button class="ai-mic-btn" id="aiMicBtn" title="语音输入" style="display:none">',
        '            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>',
        '                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>',
        '                <line x1="12" y1="19" x2="12" y2="23"></line>',
        '                <line x1="8" y1="23" x2="16" y2="23"></line>',
        '            </svg>',
        '        </button>',
        '        <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="输入您的问题..." />',
        '        <button class="ai-chat-send" id="aiChatSend">',
        '            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '                <line x1="22" y1="2" x2="11" y2="13"></line>',
        '                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>',
        '            </svg>',
        '        </button>',
        '    </div>',
        '</div>'
    ].join('\n'));

    // ---------- 3. 聊天逻辑（自 index.html 原版迁移） ----------
    var aiButtonWrapper = document.getElementById('aiButtonWrapper');
    var aiToggleHide = document.getElementById('aiToggleHide');
    var chatButton = document.getElementById('aiChatButton');
    var chatWindow = document.getElementById('aiChatWindow');
    var chatClose = document.getElementById('aiChatClose');
    var chatInput = document.getElementById('aiChatInput');
    var chatSend = document.getElementById('aiChatSend');
    var chatMessages = document.getElementById('aiChatMessages');

    // 隐藏/显示AI按钮
    aiToggleHide.addEventListener('click', function (e) {
        e.stopPropagation();
        var isHiding = !aiButtonWrapper.classList.contains('hidden');
        aiButtonWrapper.classList.toggle('hidden');

        // 更新提示文字
        aiToggleHide.title = isHiding ? '显示AI助手' : '隐藏AI助手';

        // 如果正在隐藏，同时关闭对话框
        if (isHiding && chatWindow.classList.contains('active')) {
            chatWindow.classList.remove('active');
        }

        // 保存状态到localStorage
        localStorage.setItem('aiButtonHidden', aiButtonWrapper.classList.contains('hidden'));
    });

    // 页面加载时恢复隐藏状态
    if (localStorage.getItem('aiButtonHidden') === 'true') {
        aiButtonWrapper.classList.add('hidden');
        aiToggleHide.title = '显示AI助手';
    }

    // 打开/关闭聊天窗口
    chatButton.addEventListener('click', function (e) {
        e.stopPropagation();
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', function () {
        chatWindow.classList.remove('active');
    });

    // 发送消息函数
    async function sendMessage() {
        var message = chatInput.value.trim();
        if (message === '') return;

        // 🔍 找文章模式：下一条消息走站内搜索
        if (searchMode) {
            searchMode = false;
            chatInput.placeholder = '输入您的问题...';
            addMessage(escapeChatHtml(message), 'user');
            chatInput.value = '';
            showTypingIndicator();
            try {
                var data = await searchArticles(message);
                hideTypingIndicator();
                addMessage(renderSearchResults(data), 'ai');
            } catch (error) {
                console.error('站内搜索失败:', error);
                hideTypingIndicator();
                addMessage('😅 ' + escapeChatHtml((error && error.message) || '搜索失败，请稍后再试'), 'ai');
            }
            return;
        }

        // 添加用户消息
        addMessage(message, 'user');
        chatInput.value = '';

        // 显示输入中状态
        showTypingIndicator();

        // 调用AI获取回复
        try {
            var aiResponse = await getAIResponse(message);

            // 模拟思考延迟，让体验更自然
            var thinkingTime = Math.min(500 + message.length * 50, 2000);
            await new Promise(function (resolve) { setTimeout(resolve, thinkingTime); });

            hideTypingIndicator();
            addMessage(aiResponse, 'ai');
        } catch (error) {
            console.error('消息发送失败:', error);
            hideTypingIndicator();
            addMessage('😅 ' + ((error && error.message) || '服务开小差了，请稍后再试') + '<br><small style="color:#999">稍后重试，或到弹幕页留言告诉站长～</small>', 'ai');
        }
    }

    // 添加消息到聊天窗口
    function addMessage(text, sender, opts) {
        var messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message' + (sender === 'user' ? ' user' : '');

        var avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🍊';

        var content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = text;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);

        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 朗读开关打开时，读出小橙的回复（恢复历史记录时静默）
        if (sender !== 'user' && !(opts && opts.silent)) speakText(text);
    }

    // 显示输入中状态
    function showTypingIndicator() {
        var typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-message';
        typingDiv.innerHTML =
            '<div class="message-avatar">🍊</div>' +
            '<div class="message-content typing-indicator active">' +
            '    <span class="typing-dot"></span>' +
            '    <span class="typing-dot"></span>' +
            '    <span class="typing-dot"></span>' +
            '</div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 隐藏输入中状态
    function hideTypingIndicator() {
        var typingMessage = chatMessages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    // 对话历史记录
    var conversationHistory = [];

    // AI 回复逻辑 —— 走后端代理 /api/public/ai/chat，API 密钥保存在 Cloudflare 环境变量
    async function getAIResponse(message) {
        // 记入对话历史（后端只取最近 8 条作为上下文）
        conversationHistory.push({ role: 'user', content: message });
        var res = await fetch(xcApiUrl('/api/public/ai/chat'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: conversationHistory.slice(-8) })
        });
        var data = await res.json();
        if (!res.ok || !data.reply) {
            throw new Error(data.error || 'AI 服务繁忙，请稍后再试');
        }
        conversationHistory.push({ role: 'assistant', content: data.reply });
        saveChatHistory();
        return renderReply(data.reply);
    }

    // AI 回复渲染：先转义防 XSS，再把 Markdown 链接变成可点击 <a>（小橙的博客播报就靠它）
    function renderReply(text) {
        var escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*+/g, '');
        return escaped
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#ff9a56">$1</a>')
            .replace(/\n/g, '<br>');
    }

    // 快捷回复
    window.sendQuickReply = function (text) {
        chatInput.value = text;
        sendMessage();
    };

    // ---------- 智能站内搜索（🔍 找文章）----------
    var searchMode = false;

    // 点「🔍 找文章」进入搜索模式，下一句输入当作搜索词
    window.startArticleSearch = function () {
        searchMode = true;
        chatWindow.classList.add('active');
        chatInput.placeholder = '🔍 输入想找的文章主题，回车搜索…';
        chatInput.focus();
        addMessage('告诉我你想找什么吧～比如「有没有关于旅行的文章」，我来帮你翻全站 📖', 'ai');
    };

    // 聊天窗内渲染用的转义（用户输入的搜索词会回显）
    function escapeChatHtml(text) {
        return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // 调后端 AI 站内搜索
    async function searchArticles(query) {
        var res = await fetch(xcApiUrl('/api/public/ai/search'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });
        var data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || '搜索服务开小差了，请稍后再试');
        }
        return data;
    }

    // 渲染搜索结果：开场白 + 文章链接卡片列表（子目录页面自动补根路径）
    function renderSearchResults(data) {
        var html = renderReply(data.reply || '');
        if (Array.isArray(data.matches) && data.matches.length) {
            html += '<div class="ai-search-results">' + data.matches.map(function (m) {
                var reason = m.reason
                    ? '<small style="color:#999;display:block">' + escapeChatHtml(m.reason) + '</small>'
                    : '';
                return '<a class="ai-search-item" href="' + rootPrefix + 'blog-detail.html?id=' + encodeURIComponent(m.id)
                    + '" target="_blank" rel="noopener">《' + escapeChatHtml(m.title) + '》' + reason + '</a>';
            }).join('') + '</div>';
        }
        return html;
    }

    // 发送按钮点击事件
    chatSend.addEventListener('click', sendMessage);

    // 回车发送
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 防止聊天窗口点击事件冒泡
    chatWindow.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // 点击页面其他地方关闭聊天窗口
    document.addEventListener('click', function (e) {
        if (!aiButtonWrapper.contains(e.target) && !chatWindow.contains(e.target)) {
            if (chatWindow.classList.contains('active')) {
                chatWindow.classList.remove('active');
            }
        }
    });

    // ---------- 每日欢迎语 ----------
    var greetingBubble = document.getElementById('aiGreetingBubble');
    var greetingText = document.getElementById('aiGreetingText');
    var greetingClose = document.getElementById('aiGreetingClose');
    var greetingShown = false;

    function hideGreeting() {
        if (greetingBubble) greetingBubble.style.display = 'none';
    }

    function showGreeting(text) {
        if (!greetingBubble || !greetingText || !text) return;
        greetingText.textContent = text;
        greetingBubble.style.display = 'block';
        greetingShown = true;
        // 15 秒后自动收起，避免打扰
        setTimeout(hideGreeting, 15000);
    }

    if (greetingClose) {
        greetingClose.addEventListener('click', function (e) {
            e.stopPropagation();
            hideGreeting();
        });
    }

    // 点气泡直接找小橙聊天
    if (greetingBubble) {
        greetingBubble.addEventListener('click', function () {
            hideGreeting();
            chatWindow.classList.add('active');
            chatInput.focus();
        });
    }

    chatButton.addEventListener('click', hideGreeting);

    // 每天每个浏览器只弹一次（欢迎语本身由后端按天缓存，全站共享一条）
    var greetToday = aiBeijingToday();
    if (localStorage.getItem('aiGreetSeen') !== greetToday
        && localStorage.getItem('aiButtonHidden') !== 'true') {
        fetch(xcApiUrl('/api/public/ai/daily-greeting'))
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (data) {
                if (!data || !data.text || greetingShown) return;
                localStorage.setItem('aiGreetSeen', greetToday);
                setTimeout(function () { showGreeting(data.text); }, 1200);
            })
            .catch(function () { /* 欢迎语失败不影响页面 */ });
    }

    // 用北京时间判断「今天」，与后端每日缓存对齐（Workers 跑在 UTC）
    function aiBeijingToday() {
        return new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
    }

    // ---------- 语音对话：🔊 朗读回复 + 🎤 语音输入（不支持时按钮自动隐藏）----------
    var speakToggle = document.getElementById('aiSpeakToggle');
    var speakEnabled = false;
    if (speakToggle && 'speechSynthesis' in window) {
        speakToggle.style.display = 'flex';
        speakEnabled = localStorage.getItem('aiSpeakOn') === 'true';
        if (speakEnabled) speakToggle.classList.add('on');

        speakToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            speakEnabled = !speakEnabled;
            speakToggle.classList.toggle('on', speakEnabled);
            localStorage.setItem('aiSpeakOn', speakEnabled);
            if (!speakEnabled) window.speechSynthesis.cancel();
        });
    }

    // 朗读 AI 回复（去掉 HTML 标签和 emoji，读起来更自然）
    function speakText(html) {
        if (!speakEnabled || !('speechSynthesis' in window)) return;
        var clean = String(html)
            .replace(/<[^>]+>/g, '')
            .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        if (!clean) return;
        window.speechSynthesis.cancel();
        var utter = new SpeechSynthesisUtterance(clean);
        utter.lang = 'zh-CN';
        utter.rate = 1.05;
        var zhVoice = window.speechSynthesis.getVoices().find(function (v) {
            return /^zh\b|zh[_-]CN/i.test(v.lang);
        });
        if (zhVoice) utter.voice = zhVoice;
        window.speechSynthesis.speak(utter);
    }

    // 🎤 语音输入：识别结果填入输入框并自动发送
    var micBtn = document.getElementById('aiMicBtn');
    var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (micBtn && SpeechRec) {
        micBtn.style.display = 'flex';
        var recog = new SpeechRec();
        recog.lang = 'zh-CN';
        recog.interimResults = false;
        var listening = false;

        micBtn.addEventListener('click', function () {
            if (listening) { recog.stop(); return; }
            try { recog.start(); } catch (err) { /* 重复启动忽略 */ }
        });

        function stopListening() {
            listening = false;
            micBtn.classList.remove('recording');
            chatInput.placeholder = '输入您的问题...';
        }

        recog.onstart = function () {
            listening = true;
            micBtn.classList.add('recording');
            chatInput.placeholder = '正在听你说…';
        };
        recog.onend = stopListening;
        recog.onerror = stopListening;
        recog.onresult = function (e) {
            var said = e.results && e.results[0] && e.results[0][0]
                && e.results[0][0].transcript.trim();
            if (said) {
                chatInput.value = said;
                sendMessage();
            }
        };
    } else if (micBtn) {
        micBtn.style.display = 'none';
    }

    // ---------- 聊天记忆：localStorage 持久化，刷新后小橙接着聊 ----------
    var HISTORY_KEY = 'aiChatHistory';
    var HISTORY_MAX = 16; // 本地最多存 16 条；发给后端时只取最近 8 条作上下文

    function saveChatHistory() {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(conversationHistory.slice(-HISTORY_MAX)));
        } catch (e) { /* 隐私模式等存储失败不影响聊天 */ }
    }

    function loadChatHistory() {
        try {
            var saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
            if (!Array.isArray(saved)) return [];
            return saved
                .filter(function (m) {
                    return m && (m.role === 'user' || m.role === 'assistant')
                        && typeof m.content === 'string' && m.content.trim();
                })
                .slice(-HISTORY_MAX);
        } catch (e) { return []; }
    }

    var clearChatBtn = document.getElementById('aiChatClear');
    if (clearChatBtn) {
        // 初始欢迎气泡（含快捷按钮），清空后原样放回
        var welcomeHTML = chatMessages.innerHTML;

        clearChatBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!confirm('清空和小橙的聊天记录？清空后 Ta 就不记得之前聊过什么啦～')) return;
            conversationHistory = [];
            try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
            chatMessages.innerHTML = welcomeHTML;
            clearChatBtn.style.display = 'none';
        });

        // 启动时恢复上一轮对话（回显消息，静默不朗读；放在朗读初始化之后避免变量未就绪）
        var restored = loadChatHistory();
        if (restored.length) {
            conversationHistory = restored;
            restored.forEach(function (m) {
                if (m.role === 'user') {
                    addMessage(escapeChatHtml(m.content), 'user', { silent: true });
                } else {
                    addMessage(renderReply(m.content), 'ai', { silent: true });
                }
            });
            clearChatBtn.style.display = 'flex';
        }
    }
})();
