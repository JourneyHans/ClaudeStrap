let apiKey = '';
let apiUrl = 'https://api.anthropic.com';
let conversationHistory = [];
let currentConversationId = null;
let conversations = [];

// 版本信息
const APP_VERSION = 'v0.1';
const GIT_COMMIT = '845fa72';

// 设置版本信息
function setVersionInfo() {
    const versionElement = document.getElementById('versionInfo');
    if (versionElement) {
        versionElement.innerHTML = `<span class="version-badge">${APP_VERSION}(${GIT_COMMIT})</span>`;
    }
}

// 页面加载时从本地存储读取配置
window.onload = function() {
    setVersionInfo();
    loadConfig();
    loadConversations();

    // 如果没有对话，创建新对话；否则加载最近的对话
    if (conversations.length === 0) {
        newConversation();
    } else {
        // 加载最近的对话（第一个）
        currentConversationId = conversations[0].id;
        loadConversation(currentConversationId);
        loadConversationList();
    }
};

// 加载配置
function loadConfig() {
    const savedApiKey = localStorage.getItem('claude_api_key');
    const savedApiUrl = localStorage.getItem('claude_api_url');
    
    if (savedApiKey) {
        document.getElementById('apiKey').value = savedApiKey;
        apiKey = savedApiKey;
    }
    if (savedApiUrl) {
        document.getElementById('apiUrl').value = savedApiUrl;
        apiUrl = savedApiUrl;
    }
    
    // 初始化API状态显示
    updateApiStatus();
}

// 加载对话列表
function loadConversations() {
    const saved = localStorage.getItem('claude_conversations');
    if (saved) {
        conversations = JSON.parse(saved);
    }
}

// 保存对话列表
function saveConversations() {
    localStorage.setItem('claude_conversations', JSON.stringify(conversations));
}

// 保存当前对话
function saveCurrentConversation() {
    if (!currentConversationId) return;
    
    const messages = [];
    const messageElements = document.querySelectorAll('#chatMessages .message');
    
    messageElements.forEach(element => {
        const isUser = element.classList.contains('user-message');
        const content = element.querySelector('p').textContent;
        // 跳过欢迎消息，只保存真实的对话
        if (content === '你好！我是 Claude，很高兴为您服务。请告诉我您需要什么帮助？' && !isUser) {
            return;
        }
        messages.push({
            role: isUser ? 'user' : 'assistant',
            content: content
        });
    });
    
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (conversation) {
        conversation.messages = messages;
        conversation.updatedAt = new Date().toISOString();
        saveConversations();
    }
}

// 创建新对话
function newConversation() {
    // 保存当前对话
    if (currentConversationId) {
        saveCurrentConversation();
    }
    
    // 创建新对话ID
    currentConversationId = Date.now().toString();
    
    // 创建新对话对象
    const newConversation = {
        id: currentConversationId,
        title: '新对话',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    conversations.unshift(newConversation);
    saveConversations();
    
    // 清空聊天界面
    clearChat();
    
    // 更新对话列表
    loadConversationList();
}

// 加载对话
function loadConversation(conversationId) {
    // 保存当前对话
    if (currentConversationId) {
        saveCurrentConversation();
    }
    
    currentConversationId = conversationId;
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (conversation) {
        // 清空聊天界面
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        // 加载消息
        conversation.messages.forEach(msg => {
            addMessage(msg.content, msg.role === 'user' ? 'user' : 'bot');
        });
        
        // 如果没有消息，显示欢迎消息
        if (conversation.messages.length === 0) {
            addMessage('你好！我是 Claude，很高兴为您服务。请告诉我您需要什么帮助？', 'bot');
        }
        
        // 更新列表中的选中状态
        updateConversationSelection();
    }
}

// 删除对话
function deleteConversation(conversationId) {
    if (!confirm('确定要删除这个对话吗？')) return;
    
    conversations = conversations.filter(c => c.id !== conversationId);
    saveConversations();
    
    // 如果删除的是当前对话
    if (currentConversationId === conversationId) {
        // 如果还有其他对话，加载第一个对话
        if (conversations.length > 0) {
            currentConversationId = conversations[0].id;
            loadConversation(currentConversationId);
        } else {
            // 如果没有对话了，创建新对话
            newConversation();
        }
    }
    
    // 更新对话列表
    loadConversationList();
}

// 更新对话标题
function updateConversationTitle(conversationId, title) {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
        conversation.title = title || '新对话';
        conversation.updatedAt = new Date().toISOString();
        saveConversations();
        loadConversationList();
    }
}

// 格式化日期显示
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
        return diffDays + '天前';
    } else {
        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    }
}

// 加载对话列表到界面
function loadConversationList() {
    const listContainer = document.getElementById('conversationList');
    listContainer.innerHTML = '';
    
    if (conversations.length === 0) {
        listContainer.innerHTML = '<div class="no-conversations">暂无对话历史</div>';
        return;
    }
    
    conversations.forEach(conversation => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        item.dataset.conversationId = conversation.id;
        
        if (conversation.id === currentConversationId) {
            item.classList.add('active');
        }
        
        // 整个对话项都可以点击切换
        item.onclick = function(e) {
            // 如果点击的是按钮，不触发切换
            if (e.target.closest('.conversation-actions')) {
                return;
            }
            loadConversation(conversation.id);
        };
        
        const lastMessageTime = conversation.messages.length > 0 ? conversation.updatedAt : conversation.createdAt;
        
        item.innerHTML = `
            <div class="conversation-content">
                <div class="conversation-title">${conversation.title}</div>
                <div class="conversation-meta">
                    <span class="conversation-date">${formatDate(lastMessageTime)}</span>
                    ${conversation.messages.length > 0 ? `<span class="message-count">${conversation.messages.length}条消息</span>` : ''}
                </div>
            </div>
            <div class="conversation-actions">
                <button onclick="editConversationTitle('${conversation.id}')" class="edit-btn" title="编辑标题">✏️</button>
                <button onclick="deleteConversation('${conversation.id}')" class="delete-btn" title="删除对话">🗑️</button>
            </div>
        `;
        
        listContainer.appendChild(item);
    });
}

// 更新对话选中状态
function updateConversationSelection() {
    const items = document.querySelectorAll('.conversation-item');
    items.forEach(item => {
        item.classList.remove('active');
    });
    
    // 通过data属性找到当前对话项
    const activeItem = document.querySelector(`[data-conversation-id="${currentConversationId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// 编辑对话标题
function editConversationTitle(conversationId) {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    const newTitle = prompt('请输入新的对话标题:', conversation.title);
    if (newTitle !== null) {
        updateConversationTitle(conversationId, newTitle);
    }
}

// 切换API密钥可见性
function toggleApiKeyVisibility() {
    const apiKeyInput = document.getElementById('apiKey');
    const toggleButton = document.querySelector('.toggle-visibility');
    
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleButton.textContent = '🙈';
        toggleButton.title = '隐藏API密钥';
    } else {
        apiKeyInput.type = 'password';
        toggleButton.textContent = '👁️';
        toggleButton.title = '显示API密钥';
    }
}

// 复制API密钥
function copyApiKey() {
    const apiKeyInput = document.getElementById('apiKey');
    if (apiKeyInput.value) {
        navigator.clipboard.writeText(apiKeyInput.value).then(() => {
            showToast('API密钥已复制到剪贴板');
        }).catch(() => {
            // 备用方案
            apiKeyInput.select();
            document.execCommand('copy');
            showToast('API密钥已复制到剪贴板');
        });
    } else {
        showToast('请先输入API密钥');
    }
}

// 复制API URL
function copyApiUrl() {
    const apiUrlInput = document.getElementById('apiUrl');
    if (apiUrlInput.value) {
        navigator.clipboard.writeText(apiUrlInput.value).then(() => {
            showToast('API URL已复制到剪贴板');
        }).catch(() => {
            // 备用方案
            apiUrlInput.select();
            document.execCommand('copy');
            showToast('API URL已复制到剪贴板');
        });
    } else {
        showToast('请先输入API URL');
    }
}

// 显示提示消息
function showToast(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 3秒后隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 更新API状态显示
function updateApiStatus() {
    const statusElement = document.getElementById('apiStatus');
    const indicator = statusElement.querySelector('.status-indicator');
    const text = statusElement.querySelector('span:last-child');
    
    if (apiKey) {
        indicator.className = 'status-indicator configured';
        text.textContent = '已配置';
    } else {
        indicator.className = 'status-indicator not-configured';
        text.textContent = '未配置';
    }
}

// 保存配置
function saveConfig() {
    apiKey = document.getElementById('apiKey').value;
    apiUrl = document.getElementById('apiUrl').value || 'https://api.anthropic.com';
    
    localStorage.setItem('claude_api_key', apiKey);
    localStorage.setItem('claude_api_url', apiUrl);
    
    updateApiStatus();
    showToast('配置已保存！');
}

// 发送消息
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) return;

    if (!apiKey) {
        alert('请先输入 API Key');
        return;
    }

    // 添加用户消息到聊天界面
    addMessage(message, 'user');

    // 清空输入框
    userInput.value = '';

    // 显示加载状态
    showLoading();

    try {
        const response = await callClaudeAPI(message);
        hideLoading();
        addMessage(response, 'bot');
    } catch (error) {
        hideLoading();
        addMessage(`错误: ${error.message}`, 'bot');
    }
}

// 调用 Claude API (保持原有功能用于其他可能的需求)
async function callClaudeAPI(message) {
    const response = await fetch(`${apiUrl}/v1/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        })
    });

    if (!response.ok) {
        let errorDetails = `HTTP ${response.status}`;
        try {
            const errorData = await response.json();
            errorDetails = errorData.error?.message || errorDetails;
            console.error('API Error:', errorData);
        } catch (e) {
            console.error('Response not JSON:', await response.text());
        }
        throw new Error(errorDetails);
    }

    const data = await response.json();
    return data.content[0].text;
}

// 发送消息（流式响应版本）
async function sendMessageStream() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) return;

    if (!apiKey) {
        alert('请先输入 API Key');
        return;
    }

    console.log('Starting streaming message...');

    // 添加用户消息到聊天界面
    addMessage(message, 'user');

    // 清空输入框
    userInput.value = '';

    // 显示加载状态
    showLoading();

    try {
        await callClaudeAPIStream(message);
        console.log('Streaming completed successfully');
        hideLoading();
    } catch (error) {
        console.error('Streaming error:', error);
        hideLoading();
        addMessage(`流式响应错误: ${error.message}`, 'bot');

        // 提供回退选项
        addMessage('提示：如果流式响应持续失败，请使用普通的"发送"按钮', 'bot');
    }
}
// 调用 Claude API 流式响应
async function callClaudeAPIStream(message) {
    console.log('Starting stream API call...');

    const requestBody = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        stream: true,
        messages: [
            {
                role: 'user',
                content: message
            }
        ]
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${apiUrl}/v1/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
        let errorDetails = `HTTP ${response.status}`;
        try {
            const errorData = await response.json();
            errorDetails = errorData.error?.message || errorDetails;
            console.error('API Error:', errorData);
        } catch (e) {
            const errorText = await response.text();
            console.error('Response not JSON:', errorText);
            errorDetails = `HTTP ${response.status}: ${errorText}`;
        }
        throw new Error(errorDetails);
    }

    console.log('Stream response successful, starting to read...');
    console.log('Response body type:', typeof response.body);
    console.log('Response body readable:', response.body);

    // 检查是否支持流式响应
    if (!response.body) {
        throw new Error('浏览器不支持流式响应');
    }

    // 创建一个新的消息元素用于流式显示
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const paragraph = document.createElement('p');
    paragraph.textContent = '';
    messageContent.appendChild(paragraph);

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 处理流式响应
    if (!response.body) {
        throw new Error('响应体为空，不支持流式响应');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    console.log('Starting to read stream...');

    try {
        while (true) {
            const { done, value } = await reader.read();

            console.log('Read chunk:', { done, valueSize: value?.length });

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            console.log('Decoded chunk:', chunk);

            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.trim() === '') continue;

                console.log('Processing line:', line);

                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        console.log('Stream completed');
                        break;
                    }

                    try {
                        const parsed = JSON.parse(data);
                        console.log('Parsed data:', parsed);

                        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                            fullContent += parsed.delta.text;
                            paragraph.textContent = fullContent;
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }
                    } catch (e) {
                        console.error('Failed to parse JSON:', data, e);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Stream reading error:', error);
        throw error;
    } finally {
        reader.releaseLock();
    }

    // 保存完整的对话
    setTimeout(() => {
        saveCurrentConversation();
    }, 100);

    return fullContent;
}

// 添加消息到聊天界面
function addMessage(content, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = content;
    messageContent.appendChild(paragraph);
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 自动更新对话标题
    if (sender === 'user' && content.length > 0) {
        updateConversationTitle(currentConversationId, content.substring(0, 30) + (content.length > 30 ? '...' : ''));
    }
    
    // 保存对话
    setTimeout(() => {
        saveCurrentConversation();
    }, 100);
}

// 显示加载状态
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

// 隐藏加载状态
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// 清空当前对话
function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="message bot-message">
            <div class="message-content">
                <p>你好！我是 Claude，很高兴为您服务。请告诉我您需要什么帮助？</p>
            </div>
        </div>
    `;
    conversationHistory = [];
    
    // 重置当前对话的标题
    updateConversationTitle(currentConversationId, '新对话');
    
    // 保存清空后的对话
    setTimeout(() => {
        saveCurrentConversation();
    }, 100);
}

// 清空所有对话历史
function clearAllHistory() {
    if (!confirm('确定要清空所有对话历史吗？此操作不可恢复！')) return;
    
    conversations = [];
    saveConversations();
    
    // 创建新对话
    newConversation();
}

// 导出对话
function exportConversation() {
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (!conversation || conversation.messages.length === 0) {
        alert('当前对话没有内容可以导出');
        return;
    }
    
    let exportText = `# ${conversation.title}\n\n`;
    exportText += `创建时间: ${new Date(conversation.createdAt).toLocaleString()}\n`;
    exportText += `更新时间: ${new Date(conversation.updatedAt).toLocaleString()}\n\n`;
    exportText += `--- 对话内容 ---\n\n`;
    
    conversation.messages.forEach(msg => {
        const speaker = msg.role === 'user' ? '用户' : 'Claude';
        exportText += `**${speaker}**: ${msg.content}\n\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}_${currentConversationId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 导出所有对话
function exportAllConversations() {
    if (conversations.length === 0) {
        alert('没有对话可以导出');
        return;
    }
    
    let exportText = `# Claude 对话历史\n\n`;
    exportText += `导出时间: ${new Date().toLocaleString()}\n\n`;
    exportText += `--- 所有对话 ---\n\n`;
    
    conversations.forEach(conversation => {
        exportText += `## ${conversation.title}\n\n`;
        exportText += `创建时间: ${new Date(conversation.createdAt).toLocaleString()}\n`;
        exportText += `更新时间: ${new Date(conversation.updatedAt).toLocaleString()}\n\n`;
        
        if (conversation.messages.length > 0) {
            conversation.messages.forEach(msg => {
                const speaker = msg.role === 'user' ? '用户' : 'Claude';
                exportText += `**${speaker}**: ${msg.content}\n\n`;
            });
        } else {
            exportText += `*此对话暂无内容*\n\n`;
        }
        
        exportText += `---\n\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claude_conversations_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 回车发送消息
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});