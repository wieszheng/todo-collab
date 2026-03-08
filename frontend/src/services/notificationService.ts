import { axiosInstance } from './api'
import { Notification } from '../types'

export const notificationApi = {
  list: async (params?: { unread_only?: boolean; limit?: number }): Promise<Notification[]> => {
    const response = await axiosInstance.get('/notifications', { params })
    return response.data
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await axiosInstance.get('/notifications/unread-count')
    return response.data
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await axiosInstance.put(`/notifications/${notificationId}/read`)
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.put('/notifications/read-all')
  },

  delete: async (notificationId: string): Promise<void> => {
    await axiosInstance.delete(`/notifications/${notificationId}`)
  },
}
