import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Sparkles } from 'lucide-react'
import { useTask, useUpdateTask, useDeleteTask, useUpdateTaskStatus } from '../hooks/useTasks'
import TaskForm from '../components/TaskForm'
import { useState } from 'react'

const statusConfig = {
  todo: { bg: 'bg-[#FFF5F5]', text: 'text-[#E85555]', label: '📋 待办' },
  in_progress: { bg: 'bg-[#E0F7F5]', text: 'text-[#3AB8B0]', label: '⏳ 进行中' },
  done: { bg: 'bg-[#E0F7F5]', text: 'text-[#3AB8B0]', label: '✓ 已完成' },
}

const priorityConfig = {
  low: { bg: 'bg-[#F5F5F5]', text: 'text-[#636E72]', label: '💤 低优先级' },
  medium: { bg: 'bg-[#FFF3E0]', text: 'text-[#E88860]', label: '📌 中优先级' },
  high: { bg: 'bg-[#FFE8E8]', text: 'text-[#E85555]', label: '⚡ 高优先级' },
}

const statusLabels = {
  todo: '待办',
  in_progress: '进行中',
  done: '已完成',
}

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  const { data: task, isLoading } = useTask(taskId!)
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const updateStatus = useUpdateTaskStatus()

  const handleUpdate = async (data: any) => {
    await updateTask.mutateAsync({ taskId: taskId!, data })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个任务吗？🗑️')) {
      await deleteTask.mutateAsync(taskId!)
      navigate('/tasks')
    }
  }

  const handleStatusChange = async (status: string) => {
    await updateStatus.mutateAsync({ taskId: taskId!, status })
  }

  if (isLoading) {
    return <div className="text-center py-12 text-[#636E72]">加载中... ⏳</div>
  }

  if (!task) {
    return <div className="text-center py-12 text-[#636E72]">任务不存在</div>
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/tasks')}
        className="flex items-center gap-2 text-[#636E72] hover:text-[#FF6B6B] transition-colors"
      >
        <ArrowLeft size={20} />
        返回任务列表
      </button>

      {isEditing ? (
        <div className="card">
          <TaskForm
            initialData={task}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isLoading={updateTask.isPending}
            isEdit
          />
        </div>
      ) : (
        <>
          {/* 头部 */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-[#2D3436] flex items-center gap-2">
                <Sparkles className="text-[#FF6B6B]" size={28} />
                {task.title}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-[#636E72] hover:text-[#FF6B6B] hover:bg-[#FFF5F5] rounded-lg transition-colors"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-[#FF6B6B] hover:bg-[#FFE8E8] rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`tag ${status.bg} ${status.text}`}>
                {status.label}
              </span>
              <span className={`tag ${priority.bg} ${priority.text}`}>
                {priority.label}
              </span>
              {task.due_date && (
                <span className="text-sm text-[#636E72] flex items-center gap-1">
                  📅 截止: {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* 状态切换 */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-[#636E72]">切换状态:</span>
              {(['todo', 'in_progress', 'done'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    task.status === s
                      ? 'bg-gradient-primary text-white shadow-glow'
                      : 'bg-[#F5F5F5] text-[#636E72] hover:bg-[#FFF5F5]'
                  }`}
                >
                  {s === 'todo' ? '📋 待办' : s === 'in_progress' ? '⏳ 进行中' : '✓ 已完成'}
                </button>
              ))}
            </div>
          </div>

          {/* 描述 */}
          {task.description && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-[#2D3436] mb-3 flex items-center gap-2">
                💭 任务描述
              </h2>
              <p className="text-[#636E72] whitespace-pre-wrap leading-relaxed">{task.description}</p>
            </div>
          )}

          {/* 元信息 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-[#2D3436] mb-3 flex items-center gap-2">
              ℹ️ 其他信息
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-[#FFF8F0] rounded-lg">
                <span className="text-[#636E72]">创建时间:</span>
                <p className="text-[#2D3436] font-medium mt-1">{new Date(task.created_at).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-[#FFF8F0] rounded-lg">
                <span className="text-[#636E72]">更新时间:</span>
                <p className="text-[#2D3436] font-medium mt-1">{new Date(task.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
