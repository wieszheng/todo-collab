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

// 请求拦截器 - 添加 token
axiosInstance.interceptors.request.use((config) => {
  // 优先从 auth-storage 读取（zustand persist）
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
        return config
      }
    } catch {
      // 忽略解析错误
    }
  }
  
  // 兼容登录时临时保存的 token
  const token = localStorage.getItem('token')
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
        localStorage.removeItem('token')
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
