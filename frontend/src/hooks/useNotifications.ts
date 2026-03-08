import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../services/notificationService'

export const useNotifications = (params?: { unread_only?: boolean; limit?: number }) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationApi.list(params),
  })
}

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationApi.getUnreadCount(),
    refetchInterval: 60000, // 每分钟刷新一次
  })
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationApi.delete(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
