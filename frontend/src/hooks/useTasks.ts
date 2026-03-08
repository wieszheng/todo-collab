import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '../services/taskService'
import { TaskCreate, TaskUpdate } from '../types'

export const useTasks = (params?: {
  status?: string
  priority?: string
  assignee_id?: string
}) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskApi.list(params),
  })
}

export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskApi.get(taskId),
    enabled: !!taskId,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: TaskCreate) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: TaskUpdate }) =>
      taskApi.update(taskId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (taskId: string) => taskApi.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      taskApi.updateStatus(taskId, status),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })
}

export const useAssignTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ taskId, assigneeId }: { taskId: string; assigneeId: string }) =>
      taskApi.assign(taskId, assigneeId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })
}
