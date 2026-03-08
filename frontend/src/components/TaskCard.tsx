import { Task } from '../types'
import { useUpdateTaskStatus, useDeleteTask } from '../hooks/useTasks'
import { useNavigate } from 'react-router-dom'

interface TaskCardProps {
  task: Task
}

const statusColors = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const statusLabels = {
  todo: '待办',
  in_progress: '进行中',
  done: '已完成',
}

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
}

export default function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate()
  const updateStatus = useUpdateTaskStatus()
  const deleteTask = useDeleteTask()

  const handleStatusChange = async (status: string) => {
    await updateStatus.mutateAsync({ taskId: task.id, status })
  }

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个任务吗？')) {
      await deleteTask.mutateAsync(task.id)
    }
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => navigate(`/tasks/${task.id}`)}>
          <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{task.description}</p>
          )}
          
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[task.status]}`}>
              {statusLabels[task.status]}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>
            {task.due_date && (
              <span className="text-xs text-gray-500">
                截止: {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {task.status !== 'done' && (
            <button
              onClick={() => handleStatusChange(task.status === 'todo' ? 'in_progress' : 'done')}
              className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark"
            >
              {task.status === 'todo' ? '开始' : '完成'}
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-xs px-3 py-1 text-red-600 hover:bg-red-50 rounded"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
}
