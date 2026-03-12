import { AxiosError } from 'axios'

export interface ApiError {
  message: string
  detail?: string
  status?: number
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail
    const message = typeof detail === 'string' 
      ? detail 
      : detail?.message || '请求失败，请稍后重试'
    return {
      message,
      detail,
      status: error.response?.status,
    }
  }
  
  if (error instanceof Error) {
    return { message: error.message }
  }
  
  return { message: '未知错误' }
}

export function useApiError() {
  const handleError = (error: unknown): string => {
    const apiError = parseApiError(error)
    return apiError.message
  }
  
  return { handleError, parseApiError }
}
