import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 错误消息映射
const ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  403: '没有权限执行此操作',
  404: '资源不存在',
  500: '服务器错误，请稍后重试',
}

/**
 * 临时设置认证 token（用于登录流程中 getMe 请求）
 */
export function setAuthToken(token: string | null) {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axiosInstance.defaults.headers.common['Authorization']
  }
}

/**
 * 从 zustand persist storage 读取 token
 */
function getStoredToken(): string | null {
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage)
      return state?.token || null
    } catch {
      return null
    }
  }
  return null
}

// 请求拦截器 - 添加 token
axiosInstance.interceptors.request.use((config) => {
  // 优先使用临时设置的 token（登录流程中）
  if (config.headers.Authorization) {
    return config
  }
  
  // 从 zustand persist 读取 token
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// 响应拦截器 - 处理错误
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    const status = error.response?.status
    const detail = error.response?.data?.detail
    
    // 401 特殊处理
    if (status === 401) {
      const isAuthPage = ['/login', '/register'].some(path => 
        window.location.pathname.endsWith(path)
      )
      
      if (!isAuthPage) {
        localStorage.removeItem('auth-storage')
        setAuthToken(null)
        window.location.href = '/login'
        toast.error('登录已过期，请重新登录')
      }
      
      return Promise.reject(error)
    }
    
    // 其他错误统一处理
    if (status && status >= 400) {
      const message = detail || ERROR_MESSAGES[status] || '请求失败'
      toast.error(message)
    }
    
    // 网络错误
    if (!error.response) {
      toast.error('网络连接失败，请检查网络')
    }
    
    return Promise.reject(error)
  }
)
