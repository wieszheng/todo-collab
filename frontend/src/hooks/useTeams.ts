import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { teamApi, TeamCreate, TeamUpdate, InviteMember } from '../services/teamService'

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => teamApi.list(),
  })
}

export function useTeam(teamId: string) {
  return useQuery({
    queryKey: ['teams', teamId],
    queryFn: () => teamApi.get(teamId),
    enabled: !!teamId,
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: TeamCreate) => teamApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useUpdateTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: TeamUpdate }) => 
      teamApi.update(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useDeleteTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (teamId: string) => teamApi.delete(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useInviteMember() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: InviteMember }) => 
      teamApi.inviteMember(teamId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ teamId, memberId, role }: { teamId: string; memberId: string; role: string }) => 
      teamApi.updateMemberRole(teamId, memberId, role),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ teamId, memberId }: { teamId: string; memberId: string }) => 
      teamApi.removeMember(teamId, memberId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useLeaveTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (teamId: string) => teamApi.leaveTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}
