import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { teamService, TeamCreate, TeamUpdate, InviteMember } from '../services/teamService'

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.list(),
  })
}

export function useTeam(teamId: string) {
  return useQuery({
    queryKey: ['teams', teamId],
    queryFn: () => teamService.get(teamId),
    enabled: !!teamId,
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: TeamCreate) => teamService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useUpdateTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: TeamUpdate }) => 
      teamService.update(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useDeleteTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (teamId: string) => teamService.delete(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useInviteMember() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: InviteMember }) => 
      teamService.inviteMember(teamId, data),
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
      teamService.updateMemberRole(teamId, memberId, role),
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
      teamService.removeMember(teamId, memberId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useLeaveTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (teamId: string) => teamService.leaveTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}
