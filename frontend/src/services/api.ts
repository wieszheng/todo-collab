import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
  (error) => {
    if (error.response?.status === 401) {
      // 登录/注册页的 401 错误由页面自己处理，不拦截
      const isAuthPage = ['/login', '/register'].some(path => 
        window.location.pathname.endsWith(path)
      )
      
      if (!isAuthPage) {
        // 清理 auth-storage
        localStorage.removeItem('auth-storage')
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
