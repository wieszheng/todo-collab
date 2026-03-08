import { Task } from '../types'
import { useUpdateTaskStatus, useDeleteTask } from '../hooks/useTasks'
import { useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, Circle, AlertTriangle, Flag, Calendar, Play, Trash2 } from 'lucide-react'

interface TaskCardProps {
  task: Task
}

const statusConfig = {
  todo: { 
    bg: 'bg-[#FFF5F5]', 
    text: 'text-[#E85555]', 
    icon: Circle,
    label: '待办' 
  },
  in_progress: { 
    bg: 'bg-[#E0F7F5]', 
    text: 'text-[#3AB8B0]', 
    icon: Play,
    label: '进行中' 
  },
  done: { 
    bg: 'bg-[#E0F7F5]', 
    text: 'text-[#3AB8B0]', 
    icon: CheckCircle,
    label: '已完成' 
  },
}

const priorityConfig = {
  low: { bg: 'bg-[#F5F5F5]', text: 'text-[#636E72]', icon: Flag, label: '低' },
  medium: { bg: 'bg-[#FFF3E0]', text: 'text-[#E88860]', icon: Flag, label: '中' },
  high: { bg: 'bg-[#FFE8E8]', text: 'text-[#E85555]', icon: AlertTriangle, label: '高' },
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
    <div className="card p-5 group cursor-pointer" onClick={() => navigate(`/tasks/${task.id}`)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-[#2D3436] group-hover:text-[#FF6B6B] transition-colors">
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className="text-sm text-[#636E72] line-clamp-2 mb-3">{task.description}</p>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`tag ${status.bg} ${status.text} flex items-center gap-1`}>
              <StatusIcon size={14} />
              {status.label}
            </span>
            <span className={`tag ${priority.bg} ${priority.text} flex items-center gap-1`}>
              <PriorityIcon size={14} />
              {priority.label}
            </span>
            {task.due_date && (
              <span className="text-xs text-[#636E72] flex items-center gap-1">
                <Calendar size={12} />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
          {task.status !== 'done' && (
            <button
              onClick={() => handleStatusChange(task.status === 'todo' ? 'in_progress' : 'done')}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
            >
              {task.status === 'todo' ? (
                <>
                  <Play size={14} /> 开始
                </>
              ) : (
                <>
                  <CheckCircle size={14} /> 完成
                </>
              )}
            </button>
          )}
          <button
            onClick={handleDelete}
            className="btn-ghost text-xs py-1.5 px-3 text-[#FF6B6B] hover:bg-[#FFF5F5] flex items-center gap-1"
          >
            <Trash2 size={14} /> 删除
          </button>
        </div>
      </div>
    </div>
  )
}
