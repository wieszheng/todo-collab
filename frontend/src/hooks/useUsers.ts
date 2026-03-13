import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../services/userService'
import { useAuthStore } from '../stores/authStore'

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((s) => s.setAuth)
  const token = useAuthStore((s) => s.token)

  return useMutation({
    mutationFn: (data: { nickname?: string; avatar_url?: string }) =>
      userApi.updateMe(data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      setAuth(user, token!)
    },
  })
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.list(),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  })
}
