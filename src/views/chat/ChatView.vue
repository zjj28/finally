<template>
  <div class="chat-view" :class="{ 'dark-mode': isDark }">
    <NavBar />
    <main class="main-content">
      <div class="chat-container">
        <div class="chat-header">
          <h1>
            <i class="icon">🤖</i>
            智能助手
          </h1>
          <p class="subtitle">随时为您解答高铁相关问题</p>
        </div>
        
        <div class="chat-messages" ref="messagesContainer">
          <div v-for="(message, index) in messages" 
               :key="index"
               :class="['message', message.role]">
            <div class="message-content">
              <p>{{ message.content }}</p>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <textarea
            v-model="userInput"
            @keydown.enter.prevent="sendMessage"
            placeholder="请输入您的问题..."
            rows="2"
          ></textarea>
          <button @click="sendMessage" :disabled="isLoading">
            {{ isLoading ? '发送中...' : '发送' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
const userInput = ref('')
const messages = ref([
  {
    role: 'assistant',
    content: '您好！我是高铁智能助手，很高兴为您服务。请问有什么可以帮您？'
  }
])
const isLoading = ref(false)
const messagesContainer = ref(null)

const API_URL = 'http://localhost:11434/api/chat'  // Ollama 默认端口

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  messages.value.push({
    role: 'user',
    content: userInput.value.trim()
  })

  const userMessage = userInput.value
  userInput.value = ''
  isLoading.value = true

  try {
    console.log('Sending request to Ollama...')
    const requestBody = {
      model: 'qwen2.5:latest',  // 更新为正确的模型名称
      messages: [
        {
          role: 'system',
          content: '你是一个专门解答中国高铁相关问题的AI助手，请用专业且友好的方式回答用户的问题。'
        },
        ...messages.value.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      stream: false
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', data)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(data)}`)
    }
    
    // 添加助手回复
    messages.value.push({
      role: 'assistant',
      content: data.message.content
    })
  } catch (error) {
    console.error('Detailed error:', error)
    messages.value.push({
      role: 'assistant',
      content: `抱歉，发生了错误：${error.message}`
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-view {
  min-height: 100vh;
  background: var(--bg-color);
  transition: all 0.3s;
}

.main-content {
  padding: 80px 2rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
  height: calc(100vh - 64px);
}

.chat-container {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.chat-header h1 {
  font-size: 1.6rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.8;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  margin-bottom: 1rem;
}

.message.user {
  justify-content: flex-end;
}

.message-content {
  max-width: 80%;
  padding: 1rem;
  border-radius: 12px;
  background: var(--primary-color);
  color: white;
}

.message.user .message-content {
  background: #4CAF50;
}

.message.assistant .message-content {
  background: #2196F3;
}

.chat-input {
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
}

textarea {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  background: var(--bg-color);
  color: var(--text-color);
}

button {
  padding: 0 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover:not(:disabled) {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 深色模式 */
:deep(.dark-mode) .chat-container {
  background: #1f1f1f;
}

:deep(.dark-mode) .chat-header,
:deep(.dark-mode) .chat-input {
  border-color: rgba(255, 255, 255, 0.1);
}

:deep(.dark-mode) textarea {
  background: #2d2d2d;
  border-color: rgba(255, 255, 255, 0.1);
}
</style> 