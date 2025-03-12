// HTML模板
const html = `<!DOCTYPE html>
<html lang="zh" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>云剪贴板</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        /* 深色模式样式 */
        .dark body { background-color: #1a1a1a; color: #e5e5e5; }
        .dark .bg-white { background-color: #2d2d2d; }
        .dark .text-gray-800 { color: #e5e5e5; }
        .dark .text-gray-700 { color: #d1d1d1; }
        .dark input, .dark textarea, .dark select {
            background-color: #3d3d3d;
            border-color: #4a4a4a;
            color: #e5e5e5;
        }
        .dark input:focus, .dark textarea:focus, .dark select:focus {
            border-color: #6366f1;
        }
        #result {
            white-space: pre;
            overflow-x: auto;
            max-width: 100%;
            padding: 1rem 1.25rem;
            line-height: 1.6;
            font-family: monospace;
            font-size: 0.9375rem;
            border-radius: 0.5rem;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            color: #495057;
            margin: 0.75rem 0;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .dark #result {
            background-color: #2d3748;
            border-color: #4a5568;
            color: #e2e8f0;
        }
        
        #result::-webkit-scrollbar {
            height: 8px;
        }

        #result::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        #result::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }

        #result::-webkit-scrollbar-thumb:hover {
            background: #666;
        }

        .dark #result::-webkit-scrollbar-track {
            background: #374151;
        }

        .dark #result::-webkit-scrollbar-thumb {
            background: #4b5563;
        }

        .dark #result::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
        }
        
        .fade-in { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .shake { animation: shake 0.5s; }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .tooltip {
            position: absolute;
            background: #333;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .tooltip.show {
            opacity: 1;
        }
        #latencyIndicator {
            position: fixed;
            bottom: 60px;
            right: 20px;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        .dark .latency-good {
            background-color: rgba(16, 185, 129, 0.2);
        }
        .dark .latency-medium {
            background-color: rgba(245, 158, 11, 0.2);
        }
        .dark .latency-poor {
            background-color: rgba(239, 68, 68, 0.2);
        }
        #themeToggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .dark #themeToggle {
            background-color: #3d3d3d;
            color: #e5e5e5;
        }
        
        /* 页脚样式 */
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            background-color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(5px);
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            z-index: 900;
        }
        
        .dark .footer {
            background-color: rgba(45, 45, 45, 0.9);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* 为底部固定元素留出空间 */
        .container {
            padding-bottom: 60px;
        }

        #resultContainer {
            width: 100%;
            max-width: 100%;
            margin-top: 1rem;
        }

        .result-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            padding: 0 0.25rem;
        }

        .result-label {
            font-size: 0.875rem;
            font-weight: 600;
            color: #4b5563;
        }

        .dark .result-label {
            color: #e5e7eb;
        }

        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .action-button {
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.375rem;
            transition: all 0.2s;
        }

        .copy-button {
            background-color: #e0f2fe;
            color: #0284c7;
            border: 1px solid #bae6fd;
        }

        .copy-button:hover {
            background-color: #bae6fd;
        }

        .delete-button {
            background-color: #fee2e2;
            color: #ef4444;
            border: 1px solid #fecaca;
        }

        .delete-button:hover {
            background-color: #fecaca;
        }

        .dark .copy-button {
            background-color: rgba(2, 132, 199, 0.2);
            border-color: rgba(2, 132, 199, 0.3);
        }

        .dark .delete-button {
            background-color: rgba(239, 68, 68, 0.2);
            border-color: rgba(239, 68, 68, 0.3);
        }

        #content {
            white-space: pre;
            min-height: 100px;
            font-family: monospace;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen transition-colors duration-200">
    <!-- 主题切换按钮 -->
    <div id="themeToggle" class="bg-white shadow-md cursor-pointer">
        <i class="fas fa-sun text-yellow-500 dark:hidden"></i>
        <i class="fas fa-moon text-blue-500 hidden dark:inline"></i>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">云剪贴板</h1>
        
        <!-- 新建剪贴内容 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="key">
                    标识符
                </label>
                <input type="text" id="key" 
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入唯一标识符">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="content">
                    内容
                </label>
                <textarea id="content" rows="4" 
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入要保存的内容"></textarea>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="expiration">
                    过期时间
                </label>
                <select id="expiration" 
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="3600">1小时</option>
                    <option value="86400" selected>24小时</option>
                    <option value="604800">7天</option>
                    <option value="2592000">30天</option>
                </select>
            </div>
            <button onclick="saveContent()" 
                class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                保存
            </button>
        </div>

        <!-- 获取剪贴内容 -->
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="fetchKey">
                    获取内容
                </label>
                <div class="flex gap-2">
                    <input type="text" id="fetchKey" 
                        class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="输入要获取的内容的标识符">
                    <button onclick="fetchContent()" 
                        class="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200">
                        获取
                    </button>
                </div>
            </div>
            <div id="resultContainer" class="hidden">
                <div class="result-header">
                    <span class="result-label">获取的内容：</span>
                    <div class="action-buttons">
                        <button onclick="copyContent()" 
                            class="copy-button action-button">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button onclick="deleteContent()" 
                            class="delete-button action-button">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="result-wrapper">
                    <div id="result"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- 延迟指示器 -->
    <div id="latencyIndicator" class="hidden">
        <i class="fas fa-signal mr-2"></i>
        <span id="latencyValue"></span>
    </div>

    <!-- 页脚信息 -->
    <footer class="footer">
        <div class="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
            <span>服务提供：<a href="https://github.com/dookcss/Web-Clipboard" target="_blank" class="text-blue-500 hover:text-blue-600">dookcss</a></span>
            <span class="mx-2">|</span>
            <span>Powered by <a href="https://workers.cloudflare.com" target="_blank" class="text-blue-500 hover:text-blue-600">Cloudflare Workers</a></span>
            <span class="mx-2">|</span>
            <span>© 2025</span>
        </div>
    </footer>

    <script>
        // 主题管理
        const html = document.documentElement;
        const themeToggle = document.getElementById('themeToggle');
        
        // 检查本地存储的主题设置
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            html.className = savedTheme;
        } else {
            // 检查系统主题偏好
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                html.className = 'dark';
            } else {
                html.className = 'light';
            }
        }

        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {  // 只在没有手动设置主题时响应
                html.className = e.matches ? 'dark' : 'light';
            }
        });

        // 主题切换按钮点击事件
        themeToggle.addEventListener('click', () => {
            if (html.className === 'dark') {
                html.className = 'light';
                localStorage.setItem('theme', 'light');
            } else {
                html.className = 'dark';
                localStorage.setItem('theme', 'dark');
            }
        });

        const API_URL = window.location.href;
        let currentKey = '';

        // 延迟测量函数
        async function measureLatency(callback) {
            const startTime = performance.now();
            try {
                await callback();
                const endTime = performance.now();
                const latency = Math.round(endTime - startTime);
                updateLatencyIndicator(latency);
            } catch (error) {
                console.error('延迟测量失败:', error);
            }
        }

        // 更新延迟指示器
        function updateLatencyIndicator(latency) {
            const indicator = document.getElementById('latencyIndicator');
            const valueSpan = document.getElementById('latencyValue');
            
            indicator.classList.remove('hidden', 'latency-good', 'latency-medium', 'latency-poor');
            
            if (latency < 150) {
                indicator.classList.add('latency-good');
                valueSpan.style.color = '#10B981'; // 绿色
                valueSpan.textContent = '延迟: ' + latency + 'ms (优)';
            } else if (latency <= 250) {
                indicator.classList.add('latency-medium');
                valueSpan.style.color = '#F59E0B'; // 黄色
                valueSpan.textContent = '延迟: ' + latency + 'ms (中)';
            } else {
                indicator.classList.add('latency-poor');
                valueSpan.style.color = '#EF4444'; // 红色
                valueSpan.textContent = '延迟: ' + latency + 'ms (差)';
            }

            // 图标颜色也跟随变化
            const icon = indicator.querySelector('.fa-signal');
            icon.style.color = valueSpan.style.color;
        }

        async function saveContent() {
            const key = document.getElementById('key').value.trim();
            const value = document.getElementById('content').value.trim();
            const expirationTtl = parseInt(document.getElementById('expiration').value);

            if (!key || !value) {
                alert('请填写标识符和内容！');
                return;
            }

            try {
                await measureLatency(async () => {
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key, value, expirationTtl })
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        alert('保存成功！');
                        document.getElementById('key').value = '';
                        document.getElementById('content').value = '';
                    } else {
                        alert('保存失败：' + result.message);
                    }
                });
            } catch (error) {
                alert('操作失败：' + error.message);
            }
        }

        async function fetchContent() {
            const key = document.getElementById('fetchKey').value.trim();
            if (!key) {
                alert('请输入要获取的内容的标识符！');
                return;
            }

            currentKey = key;
            const resultContainer = document.getElementById('resultContainer');
            const resultDiv = document.getElementById('result');
            
            try {
                await measureLatency(async () => {
                    const response = await fetch(API_URL + key);
                    const data = await response.json();
                    
                    resultContainer.classList.remove('hidden');
                    if (response.ok && data.value) {
                        resultDiv.classList.remove('bg-red-50', 'border-red-200', 'text-red-700');
                        resultDiv.classList.add('bg-gray-50', 'border-gray-200', 'text-gray-700');
                        resultDiv.textContent = data.value;
                    } else {
                        resultDiv.classList.remove('bg-gray-50', 'border-gray-200', 'text-gray-700');
                        resultDiv.classList.add('bg-red-50', 'border-red-200', 'text-red-700');
                        resultDiv.textContent = data.message || '获取失败';
                        currentKey = '';
                    }
                });
            } catch (error) {
                resultContainer.classList.remove('hidden');
                resultDiv.className = 'mt-4 p-4 rounded-lg border bg-red-50 border-red-200 text-red-700';
                resultDiv.textContent = '操作失败：' + error.message;
                currentKey = '';
            }
        }

        async function copyContent() {
            try {
                const resultDiv = document.getElementById('result');
                if (!resultDiv || !resultDiv.textContent) {
                    throw new Error('没有可复制的内容');
                }
                
                await navigator.clipboard.writeText(resultDiv.textContent);
                
                // 显示复制成功提示
                const tooltip = document.getElementById('copyTooltip');
                if (tooltip) {
                    tooltip.classList.add('show');
                    setTimeout(() => tooltip.classList.remove('show'), 2000);
                }
            } catch (err) {
                console.error('复制失败:', err);
                alert('复制失败: ' + (err.message || '未知错误'));
            }
        }

        async function deleteContent() {
            if (!currentKey) {
                alert('没有可删除的内容！');
                return;
            }

            if (!confirm('确定要删除这条内容吗？')) {
                return;
            }

            try {
                await measureLatency(async () => {
                    const response = await fetch(API_URL, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key: currentKey })
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        alert('删除成功！');
                        document.getElementById('fetchKey').value = '';
                        document.getElementById('resultContainer').classList.add('hidden');
                        currentKey = '';
                    } else {
                        alert('删除失败：' + result.message);
                    }
                });
            } catch (error) {
                alert('操作失败：' + error.message);
            }
        }

        // 页面加载完成后进行一次延迟测试
        window.addEventListener('load', () => {
            measureLatency(async () => {
                await fetch(API_URL, { method: 'OPTIONS' });
            });
        });
    </script>
</body>
</html>`;

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const { method, url } = request;
    const { pathname } = new URL(url);

    // 如果是直接访问根路径，返回HTML页面
    if (method === 'GET' && pathname === '/') {
        return new Response(html, {
            headers: {
                'Content-Type': 'text/html;charset=UTF-8',
            },
        });
    }

    // 使用您在控制面板中设置的变量名来引用KV命名空间
    const kvNamespace = MY_KV_NAMESPACE;

    // 设置跨域访问头部
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*', // 在生产环境中，建议替换为特定的域名
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (method === 'OPTIONS') {
        // 处理预检请求
        return new Response(null, {
            headers: corsHeaders,
        });
    } else if (method === 'POST') {
        // 处理POST请求
        try {
            const { key, value, expirationTtl } = await request.json();
            
            // 验证输入
            if (!key || !value) {
                throw new Error('Key and value are required');
            }
            
            // 设置默认过期时间为24小时
            const ttl = expirationTtl || 24 * 60 * 60;
            
            // 存储数据时设置过期时间
            await kvNamespace.put(key, JSON.stringify({
                value,
                timestamp: Date.now()
            }), { expirationTtl: ttl });

            return new Response(JSON.stringify({ 
                success: true, 
                message: 'Data stored successfully',
                expiresIn: ttl
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, message: error.message }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
                status: 400
            });
        }
    } else if (method === 'GET') {
        try {
            // 获取单个内容
            if (pathname !== '/') {
                const key = pathname.slice(1); // 移除开头的 '/'
                const value = await kvNamespace.get(key);
                
                if (!value) {
                    return new Response(JSON.stringify({ 
                        success: false, 
                        message: '当前标识未查询到内容请稍后再试或换个标识'
                    }), {
                        headers: {
                            'Content-Type': 'application/json',
                            ...corsHeaders,
                        },
                        status: 404
                    });
                }

                return new Response(value, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders,
                    },
                });
            }

            // 获取所有内容
            let keys = await kvNamespace.list();
            let allData = {};
            for (let key of keys.keys) {
                const value = await kvNamespace.get(key.name);
                if (value) {
                    allData[key.name] = JSON.parse(value);
                }
            }
            return new Response(JSON.stringify(allData), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, message: error.message }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
                status: 500
            });
        }
    } else if (method === 'PUT') {
        // 处理PUT请求
        try {
            const { key, value } = await request.json();
            await kvNamespace.put(key, value);
            return new Response(JSON.stringify({ success: true, message: 'Data updated successfully' }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, message: error.message }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
        }
    } else if (method === 'DELETE') {
        // 处理DELETE请求
        try {
            const { key } = await request.json();
            await kvNamespace.delete(key);
            return new Response(JSON.stringify({ success: true, message: 'Data deleted successfully' }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, message: error.message }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
        }
    } else {
        return new Response('Method not allowed', {
            status: 405,
            headers: corsHeaders,
        });
    }
}
