import { Task } from '../types'
import { useUpdateTaskStatus, useDeleteTask } from '../hooks/useTasks'
import { useNavigate } from 'react-router-dom'

interface TaskCardProps {
  task: Task
}

const statusConfig = {
  todo: { bg: 'bg-warm-100', text: 'text-gray-600', label: '📋 待办' },
  in_progress: { bg: 'bg-accent-100', text: 'text-accent-600', label: '⏳ 进行中' },
  done: { bg: 'bg-success-light', text: 'text-success-dark', label: '✓ 已完成' },
}

const priorityConfig = {
  low: { bg: 'bg-gray-100', text: 'text-gray-500', label: '💤 低' },
  medium: { bg: 'bg-warning-light', text: 'text-warning-dark', label: '📌 中' },
  high: { bg: 'bg-danger-light', text: 'text-danger-dark', label: '⚡ 高' },
}

export default function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate()
  const updateStatus = useUpdateTaskStatus()
  const deleteTask = useDeleteTask()

  const handleStatusChange = async (status: string) => {
    await updateStatus.mutateAsync({ taskId: task.id, status })
  }

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个任务吗？🗑️')) {
      await deleteTask.mutateAsync(task.id)
    }
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  return (
    <div className="card p-5 group cursor-pointer" onClick={() => navigate(`/tasks/${task.id}`)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-800 group-hover:text-primary-500 transition-colors">
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{task.description}</p>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`tag ${status.bg} ${status.text}`}>
              {status.label}
            </span>
            <span className={`tag ${priority.bg} ${priority.text}`}>
              {priority.label}
            </span>
            {task.due_date && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                📅 {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
          {task.status !== 'done' && (
            <button
              onClick={() => handleStatusChange(task.status === 'todo' ? 'in_progress' : 'done')}
              className="btn-primary text-xs py-1.5 px-3"
            >
              {task.status === 'todo' ? '开始 ✨' : '完成 ✓'}
            </button>
          )}
          <button
            onClick={handleDelete}
            className="btn-ghost text-xs py-1.5 px-3 text-danger hover:bg-danger-light"
          >
            删除 🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
