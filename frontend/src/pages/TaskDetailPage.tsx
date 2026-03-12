import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, ListTodo, Calendar, Flag, AlertTriangle, CheckCircle, Play, Circle, MessageCircle, Send, Clock3, UserPlus, User } from 'lucide-react'
import { useTask, useUpdateTask, useDeleteTask, useUpdateTaskStatus, useAssignTask } from '../hooks/useTasks'
import { useComments, useCreateComment, useDeleteComment } from '../hooks/useComments'
import { useUsers } from '../hooks/useUsers'
import { useAuthStore } from '../stores/authStore'
import TaskForm from '../components/TaskForm'
import { Avatar } from '../components/Avatar'
import { PageLoading, Skeleton } from '../components/Loading'
import { useApiError } from '../hooks/useApiError'
import { useState } from 'react'

const statusConfig = {
  todo: { bg: 'bg-primary-50 dark:bg-primary-100/20', text: 'text-danger-dark', icon: Circle, label: '待办' },
  in_progress: { bg: 'bg-success-light dark:bg-success-light/20', text: 'text-success-dark', icon: Play, label: '进行中' },
  done: { bg: 'bg-success-light dark:bg-success-light/20', text: 'text-success-dark', icon: CheckCircle, label: '已完成' },
}

const priorityConfig = {
  low: { bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-warm dark:text-neutral-light', icon: Flag, label: '低优先级' },
  medium: { bg: 'bg-warning-light dark:bg-warning-light/20', text: 'text-warning-dark', icon: Flag, label: '中优先级' },
  high: { bg: 'bg-danger-light dark:bg-danger-light/20', text: 'text-danger-dark', icon: AlertTriangle, label: '高优先级' },
}

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [commentText, setCommentText] = useState('')
  const { handleError } = useApiError()
  
  const user = useAuthStore((s) => s.user)

  const { data: task, isLoading } = useTask(taskId!)
  const { data: users = [] } = useUsers()
  const { data: comments = [], isLoading: loadingComments } = useComments(taskId!)
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const updateStatus = useUpdateTaskStatus()
  const assignTask = useAssignTask()
  const createComment = useCreateComment(taskId!)
  const deleteComment = useDeleteComment(taskId!)

  const handleUpdate = async (data: any) => {
    try {
      await updateTask.mutateAsync({ taskId: taskId!, data })
      setIsEditing(false)
    } catch (error) {
      alert(handleError(error))
    }
  }

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个任务吗？')) {
      try {
        await deleteTask.mutateAsync(taskId!)
        navigate('/tasks')
      } catch (error) {
        alert(handleError(error))
      }
    }
  }

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ taskId: taskId!, status })
    } catch (error) {
      alert(handleError(error))
    }
  }

  const handleAssign = async (assigneeId: string) => {
    if (!assigneeId) return
    try {
      await assignTask.mutateAsync({ taskId: taskId!, assigneeId })
    } catch (error) {
      alert(handleError(error))
    }
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) return
    try {
      await createComment.mutateAsync(commentText.trim())
      setCommentText('')
    } catch (error) {
      alert(handleError(error))
    }
  }

  if (isLoading) {
    return <PageLoading message="加载任务详情..." />
  }

  if (!task) {
    return (
      <div className="text-center py-8 text-neutral-warm dark:text-neutral-light text-sm">
        任务不存在
      </div>
    )
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]
  const StatusIcon = status.icon
  const PriorityIcon = priority.icon

  return (
    <div className="space-y-4 animate-in p-1">
      {/* 头部导航 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-1.5 transition-colors text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} />
          返回任务列表
        </button>
        
        {!isEditing && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-ghost text-xs flex items-center gap-1"
            >
              <Edit size={14} />
              编辑
            </button>
            <button
              onClick={handleDelete}
              className="btn-ghost text-xs flex items-center gap-1 text-primary hover:bg-danger-light dark:hover:bg-danger-light/20"
            >
              <Trash2 size={14} />
              删除
            </button>
          </div>
        )}
      </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 左侧：任务信息 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 任务标题和状态 */}
            <div className="card overflow-hidden">
              <div className="p-4 border-b" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-card)' }}>
                <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <ListTodo className="text-primary" size={22} />
                  {task.title}
                </h1>
              </div>
              
              <div className="p-4 space-y-4">
                {/* 标签行 */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`tag ${status.bg} ${status.text} flex items-center gap-0.5`}>
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                  <span className={`tag ${priority.bg} ${priority.text} flex items-center gap-0.5`}>
                    <PriorityIcon size={12} />
                    {priority.label}
                  </span>
                  {task.due_date && (
                    <span className="tag bg-secondary-cream dark:bg-neutral-800 flex items-center gap-0.5" style={{ color: 'var(--text-secondary)' }}>
                      <Calendar size={12} />
                      截止: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* 状态切换 */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>切换状态:</span>
                  {(['todo', 'in_progress', 'done'] as const).map((s) => {
                    const config = statusConfig[s]
                    const Icon = config.icon
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                          task.status === s
                            ? 'bg-gradient-primary text-white shadow-glow'
                            : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-neutral-700'
                        }`}
                        style={task.status !== s ? { color: 'var(--text-secondary)' } : undefined}
                      >
                        <Icon size={12} />
                        {config.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 任务描述 */}
            <div className="card">
              <div className="p-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>任务描述</h2>
              </div>
              <div className="p-4">
                {task.description ? (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{task.description}</p>
                ) : (
                  <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>暂无描述</p>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：评论和元信息 */}
          <div className="space-y-4">
            {/* 元信息 */}
            <div className="card">
              <div className="p-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <h2 className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                  <Clock3 size={14} className="text-primary" />
                  任务信息
                </h2>
              </div>
              <div className="p-3 space-y-2">
                {/* 分配人 */}
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-accent)' }}>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <UserPlus size={10} />
                    分配给
                  </span>
                  {task.creator_id === user?.id ? (
                    <select
                      value={task.assignee_id || ''}
                      onChange={(e) => handleAssign(e.target.value)}
                      disabled={assignTask.isPending}
                      className="mt-1 w-full text-xs font-medium bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <option value="">未分配</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nickname || u.email}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                      {task.assignee?.nickname || task.assignee?.email || '未分配'}
                    </p>
                  )}
                </div>
                
                {/* 创建者 */}
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-accent)' }}>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <User size={10} />
                    创建者
                  </span>
                  <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                    {task.creator?.nickname || task.creator?.email || '未知'}
                  </p>
                </div>
                
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-accent)' }}>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <Clock3 size={10} />
                    创建时间
                  </span>
                  <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                    {new Date(task.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-accent)' }}>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <Edit size={10} />
                    更新时间
                  </span>
                  <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                    {new Date(task.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* 评论区域 */}
            <div className="card overflow-hidden">
              <div className="p-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="text-primary" size={14} />
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>评论</h2>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>({comments.length})</span>
                </div>
              </div>

              <div className="p-3">
                {/* 评论输入 */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="写下你的评论..."
                    className="input flex-1 text-sm"
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
                  <div className="text-center py-4 text-neutral-warm dark:text-neutral-light text-xs">加载评论...</div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    暂无评论
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-accent)' }}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar 
                              src={comment.user?.avatar_url} 
                              name={comment.user?.nickname || comment.user?.email || '?'} 
                              size="sm" 
                            />
                            <div>
                              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                                {comment.user?.nickname || comment.user?.email?.split('@')[0] || '用户'}
                              </p>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {new Date(comment.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {comment.user_id === user?.id && (
                            <button
                              onClick={() => deleteComment.mutate(comment.id)}
                              className="p-1 rounded transition-colors text-neutral-warm dark:text-neutral-light hover:text-primary"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-primary)' }}>{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
