import { axiosInstance } from './api'

export const userService = {
  async updateMe(data: { nickname?: string; avatar_url?: string }) {
    const response = await axiosInstance.put('/users/me', data)
    return response.data
  },

  async getMe() {
    const response = await axiosInstance.get('/users/me')
    return response.data
  },

  async list() {
    const response = await axiosInstance.get('/users/')
    return response.data
  },

  async getById(id: string) {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  },
}
