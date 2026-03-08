import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, ListTodo, Calendar, Flag, AlertTriangle, CheckCircle, Clock, Play, Circle, MessageCircle, Send } from 'lucide-react'
import { useTask, useUpdateTask, useDeleteTask, useUpdateTaskStatus } from '../hooks/useTasks'
import { useComments, useCreateComment, useDeleteComment } from '../hooks/useComments'
import { useAuthStore } from '../stores/authStore'
import TaskForm from '../components/TaskForm'
import { useState } from 'react'

const statusConfig = {
  todo: { bg: 'bg-[#FFF5F5]', text: 'text-[#E85555]', icon: Circle, label: '待办' },
  in_progress: { bg: 'bg-[#E0F7F5]', text: 'text-[#3AB8B0]', icon: Play, label: '进行中' },
  done: { bg: 'bg-[#E0F7F5]', text: 'text-[#3AB8B0]', icon: CheckCircle, label: '已完成' },
}

const priorityConfig = {
  low: { bg: 'bg-[#F5F5F5]', text: 'text-[#636E72]', icon: Flag, label: '低优先级' },
  medium: { bg: 'bg-[#FFF3E0]', text: 'text-[#E88860]', icon: Flag, label: '中优先级' },
  high: { bg: 'bg-[#FFE8E8]', text: 'text-[#E85555]', icon: AlertTriangle, label: '高优先级' },
}

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [commentText, setCommentText] = useState('')
  
  const user = useAuthStore((s) => s.user)

  const { data: task, isLoading } = useTask(taskId!)
  const { data: comments = [], isLoading: loadingComments } = useComments(taskId!)
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const updateStatus = useUpdateTaskStatus()
  const createComment = useCreateComment(taskId!)
  const deleteComment = useDeleteComment(taskId!)

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

  const handleAddComment = async () => {
    if (!commentText.trim()) return
    await createComment.mutateAsync(commentText.trim())
    setCommentText('')
  }

  if (isLoading) {
    return <div className="text-center py-8 text-[#636E72] text-sm">加载中...</div>
  }

  if (!task) {
    return <div className="text-center py-8 text-[#636E72] text-sm">任务不存在</div>
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]
  const StatusIcon = status.icon
  const PriorityIcon = priority.icon

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in p-1">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/tasks')}
        className="flex items-center gap-1.5 text-[#636E72] hover:text-[#FF6B6B] transition-colors text-sm"
      >
        <ArrowLeft size={16} />
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
          <div className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-lg font-bold text-[#2D3436] flex items-center gap-2">
                <ListTodo className="text-[#FF6B6B]" size={22} />
                {task.title}
              </h1>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-[#636E72] hover:text-[#FF6B6B] hover:bg-[#FFF5F5] rounded-lg transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-[#FF6B6B] hover:bg-[#FFE8E8] rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`tag ${status.bg} ${status.text} flex items-center gap-0.5`}>
                <StatusIcon size={12} />
                {status.label}
              </span>
              <span className={`tag ${priority.bg} ${priority.text} flex items-center gap-0.5`}>
                <PriorityIcon size={12} />
                {priority.label}
              </span>
              {task.due_date && (
                <span className="text-xs text-[#636E72] flex items-center gap-0.5">
                  <Calendar size={12} />
                  截止: {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* 状态切换 */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#636E72]">切换状态:</span>
              {(['todo', 'in_progress', 'done'] as const).map((s) => {
                const config = statusConfig[s]
                const Icon = config.icon
                return (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                      task.status === s
                        ? 'bg-gradient-primary text-white shadow-glow'
                        : 'bg-[#F5F5F5] text-[#636E72] hover:bg-[#FFF5F5]'
                    }`}
                  >
                    <Icon size={12} />
                    {config.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 描述 */}
          {task.description && (
            <div className="card p-4">
              <h2 className="text-sm font-semibold text-[#2D3436] mb-2">任务描述</h2>
              <p className="text-sm text-[#636E72] whitespace-pre-wrap leading-relaxed">{task.description}</p>
            </div>
          )}

          {/* 评论区域 */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="text-[#FF6B6B]" size={16} />
              <h2 className="text-sm font-semibold text-[#2D3436]">评论</h2>
              <span className="text-xs text-[#636E72]">({comments.length})</span>
            </div>

            {/* 评论输入 */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="写下你的评论..."
                className="input flex-1"
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim() || createComment.isPending}
                className="btn-primary flex items-center gap-1"
              >
                <Send size={14} />
              </button>
            </div>

            {/* 评论列表 */}
            {loadingComments ? (
              <div className="text-center py-4 text-[#636E72] text-sm">加载评论...</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6 text-[#B2BEC3] text-sm">
                暂无评论，来说点什么吧~
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-[#FFF8F0] rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                          {comment.user_id === user?.id ? (user?.nickname?.[0] || user?.email[0].toUpperCase()) : '?'}
                        </div>
                        <div>
                          <p className="text-xs text-[#636E72]">
                            {comment.user_id === user?.id ? (user?.nickname || '我') : '用户'}
                          </p>
                          <p className="text-xs text-[#B2BEC3]">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {comment.user_id === user?.id && (
                        <button
                          onClick={() => deleteComment.mutate(comment.id)}
                          className="p-1 text-[#636E72] hover:text-[#FF6B6B] rounded transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-[#2D3436] mt-2">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 元信息 */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-[#2D3436] mb-2">其他信息</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-[#FFF8F0] rounded-lg">
                <span className="text-[#636E72]">创建时间:</span>
                <p className="text-[#2D3436] font-medium mt-0.5">{new Date(task.created_at).toLocaleString()}</p>
              </div>
              <div className="p-2.5 bg-[#FFF8F0] rounded-lg">
                <span className="text-[#636E72]">更新时间:</span>
                <p className="text-[#2D3436] font-medium mt-0.5">{new Date(task.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
