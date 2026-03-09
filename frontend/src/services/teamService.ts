import { axiosInstance } from './api'

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
  user?: {
    id: string
    email: string
    nickname: string | null
    avatar_url: string | null
  }
}

export interface Team {
  id: string
  name: string
  description: string | null
  creator_id: string
  created_at: string
  members?: TeamMember[]
}

export interface TeamCreate {
  name: string
  description?: string
}

export interface TeamUpdate {
  name?: string
  description?: string
}

export interface InviteMember {
  email: string
  role: 'admin' | 'member'
}

export const teamApi = {
  list: async (): Promise<Team[]> => {
    const response = await axiosInstance.get('/teams')
    return response.data
  },

  get: async (teamId: string): Promise<Team> => {
    const response = await axiosInstance.get(`/teams/${teamId}`)
    return response.data
  },

  create: async (data: TeamCreate): Promise<Team> => {
    const response = await axiosInstance.post('/teams', data)
    return response.data
  },

  update: async (teamId: string, data: TeamUpdate): Promise<Team> => {
    const response = await axiosInstance.put(`/teams/${teamId}`, data)
    return response.data
  },

  delete: async (teamId: string): Promise<void> => {
    await axiosInstance.delete(`/teams/${teamId}`)
  },

  inviteMember: async (teamId: string, data: InviteMember): Promise<TeamMember> => {
    const response = await axiosInstance.post(`/teams/${teamId}/invite`, data)
    return response.data
  },

  updateMemberRole: async (teamId: string, memberId: string, role: string): Promise<void> => {
    await axiosInstance.put(`/teams/${teamId}/members/${memberId}`, { role })
  },

  removeMember: async (teamId: string, memberId: string): Promise<void> => {
    await axiosInstance.delete(`/teams/${teamId}/members/${memberId}`)
  },

  leaveTeam: async (teamId: string): Promise<void> => {
    await axiosInstance.post(`/teams/${teamId}/leave`)
  },
}
