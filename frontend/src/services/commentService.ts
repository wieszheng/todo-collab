import { axiosInstance } from './api'

export interface Comment {
  id: string
  content: string
  task_id: string
  user_id: string
  created_at: string
  user: {
    id: string
    email: string
    nickname: string | null
    avatar_url: string | null
  } | null
}

export const commentService = {
  async listByTask(taskId: string): Promise<Comment[]> {
    const response = await axiosInstance.get(`/comments/task/${taskId}`)
    return response.data
  },

  async create(taskId: string, content: string): Promise<Comment> {
    const response = await axiosInstance.post(`/comments/task/${taskId}`, { content })
    return response.data
  },

  async delete(commentId: string): Promise<void> {
    await axiosInstance.delete(`/comments/${commentId}`)
  },
}
