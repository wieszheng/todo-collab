import { axiosInstance } from './api'
import { Task, TaskCreate, TaskUpdate } from '../types'

export const taskApi = {
  list: async (params?: {
    status?: string
    priority?: string
    assignee_id?: string
  }): Promise<Task[]> => {
    const response = await axiosInstance.get('/tasks', { params })
    return response.data
  },

  get: async (taskId: string): Promise<Task> => {
    const response = await axiosInstance.get(`/tasks/${taskId}`)
    return response.data
  },

  create: async (data: TaskCreate): Promise<Task> => {
    const response = await axiosInstance.post('/tasks', data)
    return response.data
  },

  update: async (taskId: string, data: TaskUpdate): Promise<Task> => {
    const response = await axiosInstance.put(`/tasks/${taskId}`, data)
    return response.data
  },

  delete: async (taskId: string): Promise<void> => {
    await axiosInstance.delete(`/tasks/${taskId}`)
  },

  updateStatus: async (taskId: string, status: string): Promise<Task> => {
    const response = await axiosInstance.put(`/tasks/${taskId}/status`, null, {
      params: { status }
    })
    return response.data
  },

  assign: async (taskId: string, assigneeId: string): Promise<Task> => {
    const response = await axiosInstance.put(`/tasks/${taskId}/assign`, null, {
      params: { assignee_id: assigneeId }
    })
    return response.data
  },
}
