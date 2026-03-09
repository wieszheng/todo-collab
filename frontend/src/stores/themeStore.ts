import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 预设主题色 - 四种风格，深浅模式都好看
export const themeColors = {
  // 珊瑚红 - 温暖活力
  coral: {
    name: '珊瑚红',
    primary: '#FF6B6B',
    primaryLight: '#FF8A8A',
    primaryDark: '#E85555',
    glow: '0 4px 20px rgba(255, 107, 107, 0.3)',
    // 深色模式下稍微提亮
    darkPrimary: '#FF7B7B',
    darkPrimaryLight: '#FF9999',
    darkGlow: '0 4px 24px rgba(255, 107, 107, 0.2)',
  },
  // 薄荷绿 - 清新自然
  mint: {
    name: '薄荷绿',
    primary: '#20C997',
    primaryLight: '#38D9A9',
    primaryDark: '#12B886',
    glow: '0 4px 20px rgba(32, 201, 151, 0.3)',
    darkPrimary: '#38D9A9',
    darkPrimaryLight: '#63E6BE',
    darkGlow: '0 4px 24px rgba(32, 201, 151, 0.25)',
  },
  // 薰衣草紫 - 优雅浪漫
  lavender: {
    name: '薰衣草紫',
    primary: '#9775FA',
    primaryLight: '#B197FC',
    primaryDark: '#845EF7',
    glow: '0 4px 20px rgba(151, 117, 250, 0.3)',
    darkPrimary: '#B197FC',
    darkPrimaryLight: '#D0BFFF',
    darkGlow: '0 4px 24px rgba(151, 117, 250, 0.25)',
  },
  // 琥珀金 - 温暖经典
  amber: {
    name: '琥珀金',
    primary: '#F59F00',
    primaryLight: '#FCC419',
    primaryDark: '#E8590C',
    glow: '0 4px 20px rgba(245, 159, 0, 0.3)',
    darkPrimary: '#FCC419',
    darkPrimaryLight: '#FFE066',
    darkGlow: '0 4px 24px rgba(245, 159, 0, 0.25)',
  },
}

export type ThemeColorKey = keyof typeof themeColors
export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  color: ThemeColorKey
  mode: ThemeMode
  setColor: (color: ThemeColorKey) => void
  setMode: (mode: ThemeMode) => void
}

// 应用主题色到 CSS 变量
const applyThemeColor = (colorKey: ThemeColorKey) => {
  const color = themeColors[colorKey]
  const root = document.documentElement
  const isDark = root.classList.contains('dark')
  
  // 根据当前模式选择颜色
  const primary = isDark ? color.darkPrimary : color.primary
  const primaryLight = isDark ? color.darkPrimaryLight : color.primaryLight
  const primaryDark = color.primaryDark // dark 色保持不变
  const glow = isDark ? color.darkGlow : color.glow
  
  root.style.setProperty('--color-primary', primary)
  root.style.setProperty('--color-primary-light', primaryLight)
  root.style.setProperty('--color-primary-dark', primaryDark)
  root.style.setProperty('--shadow-glow', glow)
}

// 应用主题模式
const applyThemeMode = (mode: ThemeMode) => {
  const root = document.documentElement
  
  if (mode === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', isDark)
  } else {
    root.classList.toggle('dark', mode === 'dark')
  }
}

// 监听系统主题变化
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const stored = localStorage.getItem('theme-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.state?.mode === 'system') {
        document.documentElement.classList.toggle('dark', e.matches)
        // 模式变化时重新应用主题色
        applyThemeColor(parsed.state.color || 'coral')
      }
    }
  })
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      color: 'coral',
      mode: 'light',
      setColor: (color) => {
        set({ color })
        applyThemeColor(color)
      },
      setMode: (mode) => {
        const currentColor = get().color
        set({ mode })
        applyThemeMode(mode)
        // 模式变化后重新应用颜色
        setTimeout(() => applyThemeColor(currentColor), 0)
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // 恢复存储时应用主题
        if (state) {
          applyThemeColor(state.color)
          applyThemeMode(state.mode)
        }
      },
    }
  )
)

// 初始化主题（在应用启动时调用）
export const initTheme = () => {
  const state = useThemeStore.getState()
  applyThemeColor(state.color)
  applyThemeMode(state.mode)
}
