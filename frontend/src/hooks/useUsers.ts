import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../services/userService'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.list(),
  })
}

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.get(userId),
    enabled: !!userId,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { nickname?: string; avatar_url?: string }) =>
      userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
