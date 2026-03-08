import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export interface Comment {
  id: string
  content: string
  task_id: string
  user_id: string
  created_at: string
}

export const commentService = {
  async listByTask(taskId: string): Promise<Comment[]> {
    const response = await axios.get(`${API_URL}/comments/task/${taskId}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  async create(taskId: string, content: string): Promise<Comment> {
    const response = await axios.post(
      `${API_URL}/comments/task/${taskId}`,
      { content },
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  async delete(commentId: string): Promise<void> {
    await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: getAuthHeaders(),
    })
  },
}
