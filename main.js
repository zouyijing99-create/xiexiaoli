// 节能小屋设计师 - 主要JavaScript逻辑

// 全局变量
let chatHistory = [];
let isWaitingForResponse = false;
let activeConfig = null;

// 预设回答数据
const predefinedAnswers = {
    '目标': {
        title: '节能小屋设计目标',
        content: `
            <div class="space-y-3">
                <h4 class="font-semibold text-green-200">🏠 核心设计目标</h4>
                <ul class="space-y-2 text-sm">
                    <li>• <strong>减少能源消耗</strong>：通过优化设计和使用节能技术，降低建筑能耗20%以上</li>
                    <li>• <strong>降低碳排放</strong>：采用可再生能源，减少温室气体排放</li>
                    <li>• <strong>改善居住环境</strong>：提高室内舒适度和空气质量</li>
                    <li>• <strong>培养环保意识</strong>：通过实践学习可持续发展理念</li>
                    <li>• <strong>掌握工程方法</strong>：学习系统设计思维和项目管理技能</li>
                </ul>
                <div class="mt-4 p-3 bg-white/10 rounded-lg">
                    <p class="text-sm"><strong>💡 设计要点：</strong>成功的节能小屋设计需要平衡节能效果、成本控制、居住舒适度和技术创新四个维度。</p>
                </div>
            </div>
        `
    },
    '标准': {
        title: '节能小屋验收标准',
        content: `
            <div class="space-y-3">
                <h4 class="font-semibold text-blue-200">📊 综合评价体系</h4>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between items-center p-2 bg-white/10 rounded">
                        <span>🔋 节能效果 (30%)</span>
                        <span class="text-green-200">能耗降低20%+</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/10 rounded">
                        <span>⚙️ 技术应用 (25%)</span>
                        <span class="text-blue-200">技术创新性</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/10 rounded">
                        <span>🏗️ 模型质量 (20%)</span>
                        <span class="text-purple-200">工艺稳定性</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/10 rounded">
                        <span>💰 成本控制 (15%)</span>
                        <span class="text-orange-200">预算管理</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/10 rounded">
                        <span>😊 用户满意度 (10%)</span>
                        <span class="text-pink-200">居住体验</span>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-white/10 rounded-lg">
                    <p class="text-sm"><strong>🎯 评分标准：</strong>总分100分，80分以上为优秀，60-79分为良好，40-59分为合格。</p>
                </div>
            </div>
        `
    },
    '成功': {
        title: '成功设计的关键要素',
        content: `
            <div class="space-y-3">
                <h4 class="font-semibold text-yellow-200">⭐ 成功标准定义</h4>
                <div class="grid grid-cols-1 gap-3 text-sm">
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-green-200 mb-2">📈 节能效果显著</h5>
                        <p>能耗降低20%以上，保温隔热性能优异</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-blue-200 mb-2">🏠 居住体验良好</h5>
                        <p>室内环境舒适，用户满意度高</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-purple-200 mb-2">💡 创新设计合理</h5>
                        <p>技术应用具有创新性和实用性</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-orange-200 mb-2">💰 成本效益平衡</h5>
                        <p>项目成本控制在预算范围内</p>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
                    <p class="text-sm"><strong>🌟 成功秘诀：</strong>优秀的节能小屋设计需要在技术创新、经济可行性和用户体验之间找到最佳平衡点。</p>
                </div>
            </div>
        `
    },
    '限制': {
        title: '设计限制条件分析',
        content: `
            <div class="space-y-3">
                <h4 class="font-semibold text-red-200">⚠️ 主要限制因素</h4>
                <div class="space-y-3 text-sm">
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-orange-200 mb-2">🧱 材料限制</h5>
                        <p>可用材料的性能、成本、环保性要求</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-yellow-200 mb-2">⏰ 时间限制</h5>
                        <p>项目周期、制作时间、测试时间安排</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-red-200 mb-2">💸 成本限制</h5>
                        <p>预算约束、性价比要求</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-purple-200 mb-2">🔧 技术限制</h5>
                        <p>现有技术水平、制作工艺限制</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-blue-200 mb-2">📐 空间限制</h5>
                        <p>建筑尺寸、场地条件约束</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-green-200 mb-2">🌡️ 环境限制</h5>
                        <p>当地气候、地理条件影响</p>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-white/10 rounded-lg">
                    <p class="text-sm"><strong>💡 应对策略：</strong>通过创新设计思维，在限制条件下寻找最优解决方案，这正是工程设计的魅力所在！</p>
                </div>
            </div>
        `
    },
    '技术': {
        title: '常用节能技术',
        content: `
            <div class="space-y-3">
                <h4 class="font-semibold text-green-200">🔧 核心节能技术</h4>
                <div class="grid grid-cols-1 gap-3 text-sm">
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-blue-200 mb-2">🏠 墙体节能技术</h5>
                        <p>外墙保温、双层墙体、相变材料</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-green-200 mb-2">🪟 门窗节能技术</h5>
                        <p>双层玻璃、Low-E涂层、密封技术</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-yellow-200 mb-2">☀️ 太阳能利用</h5>
                        <p>太阳能热水、光伏发电、被动式太阳能</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-purple-200 mb-2">🤖 智能控制系统</h5>
                        <p>温控系统、照明控制、能源管理</p>
                    </div>
                    <div class="p-3 bg-white/10 rounded-lg">
                        <h5 class="font-medium text-orange-200 mb-2">🌬️ 通风系统</h5>
                        <p>自然通风、热回收通风、智能开窗</p>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg">
                    <p class="text-sm"><strong>🚀 技术选择：</strong>根据项目具体需求和条件，合理选择和组合不同的节能技术，达到最佳效果。</p>
                </div>
            </div>
        `
    }
};

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    loadChatHistory();
    setupScrollAnimations();
    if (window.ConfigManager) { activeConfig = ConfigManager.getActiveConfig() || null }
    window.addEventListener('apiConfigChanged', function(e){ activeConfig = e.detail || null; showNotification('API配置已更新，后续调用将使用最新配置', 'success') })
});

// 创建浮动粒子背景
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// 设置滚动动画
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    easing: 'easeOutQuart'
                });
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.hover\\:shadow-xl').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// 处理键盘输入
function handleKeyPress(event) {
    if (event.key === 'Enter' && !isWaitingForResponse) {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || isWaitingForResponse) return;
    
    // 添加用户消息到聊天
    addMessage(message, 'user');
    input.value = '';
    
    // 显示AI正在输入
    showTypingIndicator();
    fetchAIAndReply(message);
}

// 快速提问
function askQuickQuestion(type) {
    const questions = {
        '目标': '房屋节能改造设计要实现什么目标?',
        '限制': '房屋节能改造设计过程中有什么限制条件？',
        '成功': '如何算是成功？',
        '标准': '节能小屋的验收标准是什么？'
    };
    
    document.getElementById('messageInput').value = questions[type];
    sendMessage();
}

let featureOrder = ['goals','standards','success','constraints'];
let currentFeatureIndex = 0;
const featureDetails = {
    goals: `
        <div>
            <h3 class="text-2xl font-bold mb-4">核心功能模块</h3>
            <h4 class="text-lg font-semibold text-green-700 mb-2">1. 目标导向功能</h4>
            <div class="text-sm leading-relaxed">
                <p class="mb-2">功能描述：</p>
                <p>帮助学生明确节能小屋设计的目标和意义</p>
                <ul class="list-disc pl-5 mt-2">
                    <li>解释节能小屋设计的核心目标</li>
                    <li>阐述建筑节能的重要性和现实意义</li>
                    <li>介绍当前社会对节能建筑的需求和发展</li>
                </ul>
                <p class="mt-4 mb-2">具体内容：</p>
                <ul class="pl-5 mt-1">
                    <li class="text-green-700">✓ 减少能源消耗，降低碳排放</li>
                    <li class="text-green-700">✓ 改善居住环境，提高生活质量</li>
                    <li class="text-green-700">✓ 培养节能环保意识和创新思维</li>
                    <li class="text-green-700">✓ 掌握基础的工程设计方法</li>
                </ul>
            </div>
        </div>
    `,
    standards: `
        <div>
            <h3 class="text-2xl font-bold mb-4">核心功能模块</h3>
            <h4 class="text-lg font-semibold text-blue-700 mb-2">2. 验收标准</h4>
            <div class="text-sm leading-relaxed">
                <p class="mb-2">功能描述：</p>
                <p>提供面向学生的验收标准与评价指标</p>
                <ul class="list-disc pl-5 mt-2">
                    <li>明确节能效果与舒适性评价维度</li>
                    <li>定义结构、安全与可维护性要求</li>
                    <li>结合课程目标设置分级标准</li>
                </ul>
                <p class="mt-4 mb-2">关键指标：</p>
                <ul class="pl-5 mt-1">
                    <li class="text-blue-700">✓ 能耗降低幅度</li>
                    <li class="text-blue-700">✓ 居住舒适度提升</li>
                    <li class="text-blue-700">✓ 预算控制与可实施性</li>
                    <li class="text-blue-700">✓ 与课程目标的契合度</li>
                </ul>
            </div>
        </div>
    `,
    success: `
        <div>
            <h3 class="text-2xl font-bold mb-4">核心功能模块</h3>
            <h4 class="text-lg font-semibold text-purple-700 mb-2">3. 成功标准定义</h4>
            <div class="text-sm leading-relaxed">
                <p class="mb-2">功能描述：</p>
                <p>帮助学生理解成功的节能小屋设计标准</p>
                <ul class="list-disc pl-5 mt-2">
                    <li>提供成功案例分析</li>
                    <li>总结成功设计的关键要素</li>
                    <li>引导学生树立正确的成功观念</li>
                </ul>
                <p class="mt-4 mb-2">成功标准：</p>
                <ul class="pl-5 mt-1">
                    <li class="text-purple-700">✓ 节能效果显著改善(能耗降低20%+)</li>
                    <li class="text-purple-700">✓ 居住者满意度高(舒适度提升)</li>
                    <li class="text-purple-700">✓ 项目成本控制在预算范围内</li>
                    <li class="text-purple-700">✓ 设计方案具有创新性和可推广性</li>
                    <li class="text-purple-700">✓ 符合当地气候条件和使用需求</li>
                </ul>
            </div>
        </div>
    `,
    constraints: `
        <div>
            <h3 class="text-2xl font-bold mb-4">核心功能模块</h3>
            <h4 class="text-lg font-semibold text-orange-700 mb-2">4. 限制条件分析</h4>
            <div class="text-sm leading-relaxed">
                <p class="mb-2">功能描述：</p>
                <p>帮助学生识别和应对设计限制条件</p>
                <ul class="list-disc pl-5 mt-2">
                    <li>分析各种限制因素及其影响</li>
                    <li>提供应对策略和解决方案</li>
                    <li>培养学生的问题解决能力</li>
                </ul>
                <p class="mt-4 mb-2">主要限制条件：</p>
                <ul class="pl-5 mt-1">
                    <li class="text-orange-700">✓ 材料限制：性能/成本/环保性</li>
                    <li class="text-orange-700">✓ 时间限制：项目周期/制作/测试时间</li>
                    <li class="text-orange-700">✓ 成本限制：预算约束/性价比要求</li>
                    <li class="text-orange-700">✓ 技术限制：现有水平/工艺限制</li>
                    <li class="text-orange-700">✓ 空间限制：建筑尺寸/场地条件</li>
                    <li class="text-orange-700">✓ 环境限制：当地气候/地理条件</li>
                </ul>
            </div>
        </div>
    `
};

function openFeatureModal(key) {
    const modal = document.getElementById('featureModal');
    const content = document.getElementById('featureModalContent');
    currentFeatureIndex = featureOrder.indexOf(key);
    content.innerHTML = featureDetails[key] || '';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const panel = modal.querySelector('[role="dialog"]');
    if (panel) panel.focus();
}

function closeFeatureModal() {
    const modal = document.getElementById('featureModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function navigateFeatureModal(dir) {
    currentFeatureIndex = (currentFeatureIndex + dir + featureOrder.length) % featureOrder.length;
    const key = featureOrder[currentFeatureIndex];
    const content = document.getElementById('featureModalContent');
    content.innerHTML = featureDetails[key] || '';
}

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('featureModal');
    if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeFeatureModal();
        if (e.key === 'ArrowLeft') navigateFeatureModal(-1);
        if (e.key === 'ArrowRight') navigateFeatureModal(1);
    }
});

// 添加消息到聊天区域
function addMessage(content, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `message-bubble ${sender} text-white p-3 rounded-lg max-w-xs ${sender === 'user' ? 'ml-auto' : 'mr-auto'}`;
    messageDiv.innerHTML = `<p class="text-sm">${content}</p>`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 保存到历史记录
    chatHistory.push({ content, sender, timestamp: new Date() });
    saveChatHistory();
    
    // 动画效果
    anime({
        targets: messageDiv,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 300,
        easing: 'easeOutQuart'
    });
}

// 显示输入指示器
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'message-bubble ai text-white p-3 rounded-lg max-w-xs';
    typingDiv.innerHTML = `
        <div class="flex space-x-1">
            <div class="typing-indicator"></div>
            <div class="typing-indicator"></div>
            <div class="typing-indicator"></div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    isWaitingForResponse = true;
}

// 隐藏输入指示器
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isWaitingForResponse = false;
}

async function fetchAIAndReply(message) {
    try {
        const cfg = activeConfig || (window.ConfigManager ? ConfigManager.getActiveConfig() : null) || {};
        const model = cfg && cfg.model ? cfg.model : 'qwen-flash-2025-07-28';
        const temperature = cfg && cfg.temperature ? Number(cfg.temperature) : 0.7;
        const maxTokens = cfg && cfg.maxTokens ? Number(cfg.maxTokens) : 1024;
        const messages = [
            { role: 'system', content: '你是一位面向初中科学课程的节能小屋设计AI助手，回答要清晰、有条理、适合学生理解。' },
            { role: 'user', content: message }
        ];
        let data = null;
        if (cfg && cfg.apiKey && (cfg.endpoint || cfg.baseURL)) {
            data = await chatWithProvider(cfg, { messages, model, temperature, max_tokens: maxTokens });
        } else {
            data = await chatViaServer({ messages, model, temperature, max_tokens: maxTokens });
        }
        const text = (data && data.content) ? data.content : '';
        if (text) { if (window.ConfigManager && cfg) ConfigManager.saveLastValid(cfg) }
        hideTypingIndicator();
        addMessage(formatAIText(text || defaultFallback(message)), 'ai');
    } catch (e) {
        if (window.ConfigManager) {
            const last = ConfigManager.getLastValid();
            if (last && last.apiKey && (last.endpoint || last.baseURL)) {
                try {
                    const model = last.model || 'qwen-plus';
                    const temperature = Number(last.temperature || 0.7);
                    const maxTokens = Number(last.maxTokens || 1024);
                    const messages = [
                        { role: 'system', content: '你是一位面向初中科学课程的节能小屋设计AI助手，回答要清晰、有条理、适合学生理解。' },
                        { role: 'user', content: message }
                    ];
                    const data = await chatWithProvider(last, { messages, model, temperature, max_tokens: maxTokens });
                    const text = (data && data.content) ? data.content : '';
                    hideTypingIndicator();
                    addMessage(formatAIText(text || defaultFallback(message)), 'ai');
                    return;
                } catch (_) {}
            }
        }
        hideTypingIndicator();
        addMessage(defaultFallback(message), 'ai');
    }
}

async function chatViaServer(payload){
    const resp = await fetch('/api/chat', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(Object.assign({}, payload, { enable_thinking: true })) })
    if (!resp.ok) throw new Error('server_error')
    return await resp.json()
}

async function chatWithProvider(cfg, payload){
    const headers = { 'Content-Type':'application/json' }
    if (cfg.apiKey) headers['Authorization'] = 'Bearer '+cfg.apiKey
    const body = { model: payload.model, messages: payload.messages, temperature: payload.temperature, max_tokens: payload.max_tokens }
    let attempt = 0
    let delay = 200
    while (attempt < 3) {
        try {
            const ep = cfg.endpoint || (cfg.baseURL && String(cfg.baseURL).replace(/\/$/,'') + '/chat/completions')
            const resp = await fetch(ep, { method:'POST', headers: headers, body: JSON.stringify(body) })
            if (resp.status===401||resp.status===403) throw new Error('auth')
            if (!resp.ok) throw new Error('http')
            const data = await resp.json()
            const choice = data.choices && data.choices[0]
            const content = choice && (choice.message&&choice.message.content || choice.delta&&choice.delta.content) || ''
            const reasoning = choice && (choice.message&&choice.message.reasoning_content || choice.delta&&choice.delta.reasoning_content) || ''
            return { content: content, reasoning: reasoning }
        } catch(err) {
            attempt += 1
            if (attempt>=3) throw err
            await new Promise(function(r){ setTimeout(r, delay) })
            delay *= 2
        }
    }
}

function formatAIText(text) {
    const safe = String(text).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `
        <div class="space-y-3">
            <p>${safe}</p>
        </div>
    `;
}

function defaultFallback(message) {
    return `
        <div class="space-y-3">
            <p>关于“${message}”的问题，建议您从设计目标、技术选择、成本与体验平衡三个方面思考，并结合本页面的快速问题与学习资源进一步探索。</p>
        </div>
    `;
}

// 计算评估分数
 

// 保存聊天记录
function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// 加载聊天记录
function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        chatHistory = JSON.parse(saved);
        // 可以选择显示最近的聊天记录
    }
}

// 平滑滚动到元素
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 动画显示
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    // 3秒后自动消失
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                notification.remove();
            }
        });
    }, 3000);
}

// 导出聊天记录
function exportChatHistory() {
    const data = JSON.stringify(chatHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = '节能小屋设计对话记录.json';
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('聊天记录已导出', 'success');
}

// 清除聊天记录
function clearChatHistory() {
    if (confirm('确定要清除所有聊天记录吗？')) {
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        document.getElementById('chatMessages').innerHTML = '';
        showNotification('聊天记录已清除', 'info');
    }
}

// 响应式处理
window.addEventListener('resize', function() {
    // 处理响应式布局调整
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

// 页面卸载时保存数据
window.addEventListener('beforeunload', function() {
    saveChatHistory();
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    showNotification('页面出现错误，请刷新重试', 'error');
});

// 导出全局函数供HTML调用
window.handleKeyPress = handleKeyPress;
window.sendMessage = sendMessage;
window.askQuickQuestion = askQuickQuestion;
window.showNotification = showNotification;
