import { Task } from '../types'
import { useUpdateTaskStatus, useDeleteTask } from '../hooks/useTasks'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Circle, AlertTriangle, Flag, Calendar, Play, Trash2 } from 'lucide-react'
import { Avatar } from './Avatar'

interface TaskCardProps {
  task: Task
}

const statusConfig = {
  todo: { 
    bg: 'bg-primary-50 dark:bg-primary-100/20', 
    text: 'text-danger-dark', 
    icon: Circle,
    label: '待办' 
  },
  in_progress: { 
    bg: 'bg-success-light dark:bg-success-light/20', 
    text: 'text-success-dark', 
    icon: Play,
    label: '进行中' 
  },
  done: { 
    bg: 'bg-success-light dark:bg-success-light/20', 
    text: 'text-success-dark', 
    icon: CheckCircle,
    label: '已完成' 
  },
}

const priorityConfig = {
  low: { bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-warm dark:text-neutral-light', icon: Flag, label: '低' },
  medium: { bg: 'bg-warning-light dark:bg-warning-light/20', text: 'text-warning-dark', icon: Flag, label: '中' },
  high: { bg: 'bg-danger-light dark:bg-danger-light/20', text: 'text-danger-dark', icon: AlertTriangle, label: '高' },
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

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]
  const StatusIcon = status.icon
  const PriorityIcon = priority.icon

  return (
    <div className="card p-3 group cursor-pointer" onClick={() => navigate(`/tasks/${task.id}`)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-sm text-neutral-charcoal dark:text-white group-hover:text-primary transition-colors truncate">
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className="text-xs text-neutral-warm dark:text-neutral-light line-clamp-1 mb-2">{task.description}</p>
          )}
          
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`tag ${status.bg} ${status.text} flex items-center gap-0.5`}>
              <StatusIcon size={12} />
              {status.label}
            </span>
            <span className={`tag ${priority.bg} ${priority.text} flex items-center gap-0.5`}>
              <PriorityIcon size={12} />
              {priority.label}
            </span>
            {task.due_date && (
              <span className="text-xs text-neutral-warm dark:text-neutral-light flex items-center gap-0.5">
                <Calendar size={10} />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
            {task.assignee && (
              <div className="flex items-center gap-1">
                <Avatar src={task.assignee.avatar_url} name={task.assignee.nickname || task.assignee.email} size="sm" />
                <span className="text-xs text-neutral-warm dark:text-neutral-light">
                  {task.assignee.nickname || task.assignee.email.split('@')[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {task.status !== 'done' && (
            <button
              onClick={() => handleStatusChange(task.status === 'todo' ? 'in_progress' : 'done')}
              className="btn-primary text-xs py-1 px-2 flex items-center gap-1"
            >
              {task.status === 'todo' ? (
                <>
                  <Play size={12} /> 开始
                </>
              ) : (
                <>
                  <CheckCircle size={12} /> 完成
                </>
              )}
            </button>
          )}
          <button
            onClick={handleDelete}
            className="btn-ghost text-xs py-1 px-2 text-primary hover:bg-primary-50 dark:hover:bg-neutral-700 flex items-center gap-1"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
