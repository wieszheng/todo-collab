import { Plus, Filter, ListTodo, CheckCircle, Clock, Flag, AlertTriangle } from 'lucide-react'
import { useTasks, useCreateTask } from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import { TaskListSkeleton } from '../components/Loading'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type StatusFilter = 'all' | 'todo' | 'in_progress' | 'done'
type PriorityFilter = 'all' | 'low' | 'medium' | 'high'

const statusOptions = [
  { value: 'all', label: '全部', icon: ListTodo },
  { value: 'todo', label: '待办', icon: Clock },
  { value: 'in_progress', label: '进行中', icon: Flag },
  { value: 'done', label: '已完成', icon: CheckCircle },
] as const

const priorityOptions = [
  { value: 'all', label: '全部' },
  { value: 'high', label: '高', icon: AlertTriangle },
  { value: 'medium', label: '中', icon: Flag },
  { value: 'low', label: '低' },
] as const

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const queryClient = useQueryClient()
  
  const { data: tasks = [], isLoading } = useTasks({
    status: statusFilter === 'all' ? undefined : statusFilter,
    priority: priorityFilter === 'all' ? undefined : priorityFilter,
  })
  
  const createTask = useCreateTask()

  const handleCreateTask = async (data: any) => {
    setError(null)
    try {
      await createTask.mutateAsync(data)
      setShowForm(false)
      // 强制刷新任务列表
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    } catch (err: any) {
      setError(err.response?.data?.detail || '创建失败，请重试')
    }
  }

  return (
    <div className="space-y-4 animate-in p-1">
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700">✕</button>
        </div>
      )}
      
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-charcoal dark:text-white flex items-center gap-2">
            <ListTodo className="text-primary" size={22} />
            任务列表
          </h1>
          <p className="text-neutral-warm dark:text-neutral-light text-sm mt-0.5">管理你的所有任务</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} />
          新建任务
        </button>
      </div>

      {/* 筛选器 */}
      <div className="card p-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-neutral-warm dark:text-neutral-light">
          <Filter size={16} />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-warm dark:text-neutral-light">状态:</span>
          <div className="flex gap-1">
            {statusOptions.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.value}
                  onClick={() => setStatusFilter(s.value)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                    statusFilter === s.value
                      ? 'bg-gradient-primary text-white shadow-glow'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-warm dark:text-neutral-light hover:bg-primary-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Icon size={12} />
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-warm dark:text-neutral-light">优先级:</span>
          <div className="flex gap-1">
            {priorityOptions.map((p) => {
              const Icon = 'icon' in p ? p.icon : null
              return (
                <button
                  key={p.value}
                  onClick={() => setPriorityFilter(p.value)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                    priorityFilter === p.value
                      ? 'bg-gradient-primary text-white shadow-glow'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-warm dark:text-neutral-light hover:bg-primary-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 任务列表 */}
      {isLoading ? (
        <TaskListSkeleton count={4} />
      ) : tasks.length === 0 ? (
        <div className="card p-8 text-center">
          <ListTodo className="mx-auto text-neutral-light" size={40} />
          <p className="text-neutral-warm dark:text-neutral-light mt-2 text-sm">暂无任务</p>
          <p className="text-neutral-light text-xs mt-1">点击"新建任务"创建第一个吧</p>
        </div>
      ) : (
        <div className="grid gap-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
          {tasks.map((task, index) => (
            <div key={task.id} style={{ animationDelay: `${index * 30}ms` }} className="animate-in">
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      )}

      {/* 新建任务弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-in">
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
              isLoading={createTask.isPending}
            />
          </div>
        </div>
      )}
    </div>
  )
}
