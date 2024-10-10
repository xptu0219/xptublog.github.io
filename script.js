// 获取主容器元素
const container = document.querySelector('.container');

// 获取聊天历史、用户输入和发送按钮元素
const chatHistory = container.querySelector('#chat-history');
const userInput = container.querySelector('#user-input');
const sendBtn = container.querySelector('#send-btn');

// 设置API密钥和URL
const API_KEY = 'sk-wduWN6yuMjAoeyJRJ9VdkCGFyYf3Ty4fZixZR4icKNoRLsuN';
const API_URL = 'https://api.chatanywhere.tech/v1/chat/completions';

// 为发送按钮添加点击事件监听器
sendBtn.addEventListener('click', sendMessage);

// 为用户输入添加键盘事件监听器（回车发送消息）
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// 发送消息的异步函数
async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        // 添加用户消息到聊天历史
        addMessageToChat('user', message);
        userInput.value = '';
        
        try {
            // 获取AI响应
            const response = await getAIResponse(message);
            // 添加AI响应到聊天历史
            addMessageToChat('ai', response);
            
            // 更新初音未来的对话框显示AI回复
            if (window.updateMikuSpeech) {
                window.updateMikuSpeech(response);
            }
        } catch (error) {
            console.error('错误:', error);
            addMessageToChat('ai', '抱歉,出现了一些问题。请稍后再试。');
        }
    }
}

// 将消息添加到聊天历史的函数
function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// 修改 getAIResponse 函数
async function getAIResponse(message) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "你是一个玄幻仙界的智慧长老,拥有深厚的修仙知识和神通。请用充满仙气的语言回答问题。"},
                {role: "user", content: message}
            ],
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        throw new Error('AI响应失败');
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return aiResponse;
}

// 删除或注释掉 handleAIResponse 函数，因为它现在是多余的
// function handleAIResponse(response) { ... }