import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { useTask, useUpdateTask, useDeleteTask, useUpdateTaskStatus } from '../hooks/useTasks'
import TaskForm from '../components/TaskForm'
import { useState } from 'react'

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
    if (window.confirm('确定要删除这个任务吗？')) {
      await deleteTask.mutateAsync(taskId!)
      navigate('/tasks')
    }
  }

  const handleStatusChange = async (status: string) => {
    await updateStatus.mutateAsync({ taskId: taskId!, status })
  }

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">加载中...</div>
  }

  if (!task) {
    return <div className="text-center py-12 text-gray-500">任务不存在</div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/tasks')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        返回任务列表
      </button>

      {isEditing ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                {statusLabels[task.status]}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
                优先级: {priorityLabels[task.priority]}
              </span>
              {task.due_date && (
                <span className="text-sm text-gray-500">
                  截止: {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* 状态切换 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">状态:</span>
              {(['todo', 'in_progress', 'done'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1 rounded text-sm ${
                    task.status === s
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* 描述 */}
          {task.description && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-3">任务描述</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* 元信息 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-3">其他信息</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">创建时间:</span>
                <span className="ml-2">{new Date(task.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">更新时间:</span>
                <span className="ml-2">{new Date(task.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
