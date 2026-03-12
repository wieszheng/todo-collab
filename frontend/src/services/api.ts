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
  // 优先从 token 直接存储读取（登录时先存这里）
  const directToken = localStorage.getItem('token')
  if (directToken) {
    config.headers.Authorization = `Bearer ${directToken}`
    return config
  }
  
  // 其次从 Zustand persist 存储中读取 token
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    } catch {
      // 忽略解析错误
    }
  }
  return config
})

// 响应拦截器 - 处理错误
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 清理 auth-storage
      localStorage.removeItem('auth-storage')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
