import { axiosInstance } from './api'
import { User, UserCreate, Token } from '../types'

export const authApi = {
  register: async (data: UserCreate): Promise<User> => {
    const response = await axiosInstance.post('/auth/register', data)
    return response.data
  },

  login: async (email: string, password: string): Promise<Token> => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    const response = await axiosInstance.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get('/users/me')
    return response.data
  },
}
