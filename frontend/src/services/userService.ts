import { axiosInstance } from './api'
import { User } from '../types'

export const userApi = {
  list: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users')
    return response.data
  },

  get: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data
  },

  updateProfile: async (data: { nickname?: string; avatar_url?: string }): Promise<User> => {
    const response = await axiosInstance.put('/users/me', data)
    return response.data
  },
}
