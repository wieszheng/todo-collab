import { axiosInstance } from './api'
import { User } from '../types'

export const userApi = {
  async updateMe(data: { nickname?: string; avatar_url?: string }) {
    const response = await axiosInstance.put('/users/me', data)
    return response.data
  },

  async getMe(): Promise<User> {
    const response = await axiosInstance.get('/users/me')
    return response.data
  },

  async list(): Promise<User[]> {
    const response = await axiosInstance.get('/users/')
    return response.data
  },

  async getById(id: string): Promise<User> {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  },
}
