import { ref } from 'vue'

// 创建一个共享的状态
const isDark = ref(false)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark-mode')
  }

  return {
    isDark,
    toggleTheme
  }
} 