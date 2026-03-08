import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export const userService = {
  async updateMe(data: { nickname?: string; avatar_url?: string }) {
    const response = await axios.put(`${API_URL}/users/me`, data, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  async getMe() {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  async list() {
    const response = await axios.get(`${API_URL}/users/`, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  async getById(id: string) {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  },
}
