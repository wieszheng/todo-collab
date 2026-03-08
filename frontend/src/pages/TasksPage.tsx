import { useState } from 'react'
import { Plus, Filter, ListTodo, CheckCircle, Clock, Flag, AlertTriangle } from 'lucide-react'
import { useTasks, useCreateTask } from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'

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
  
  const { data: tasks = [], isLoading } = useTasks({
    status: statusFilter === 'all' ? undefined : statusFilter,
    priority: priorityFilter === 'all' ? undefined : priorityFilter,
  })
  
  const createTask = useCreateTask()

  const handleCreateTask = async (data: any) => {
    await createTask.mutateAsync(data)
    setShowForm(false)
  }

  return (
    <div className="space-y-6 animate-in">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D3436] flex items-center gap-2">
            <ListTodo className="text-[#FF6B6B]" size={28} />
            任务列表
          </h1>
          <p className="text-[#636E72] mt-1">管理你的所有任务</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          新建任务
        </button>
      </div>

      {/* 筛选器 */}
      <div className="card p-4 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2 text-[#636E72]">
          <Filter size={20} />
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#636E72]">状态:</span>
          <div className="flex gap-2">
            {statusOptions.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.value}
                  onClick={() => setStatusFilter(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    statusFilter === s.value
                      ? 'bg-gradient-primary text-white shadow-glow'
                      : 'bg-[#F5F5F5] text-[#636E72] hover:bg-[#FFF5F5]'
                  }`}
                >
                  <Icon size={14} />
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[#636E72]">优先级:</span>
          <div className="flex gap-2">
            {priorityOptions.map((p) => {
              const Icon = p.icon
              return (
                <button
                  key={p.value}
                  onClick={() => setPriorityFilter(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    priorityFilter === p.value
                      ? 'bg-gradient-primary text-white shadow-glow'
                      : 'bg-[#F5F5F5] text-[#636E72] hover:bg-[#FFF5F5]'
                  }`}
                >
                  {Icon && <Icon size={14} />}
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 任务列表 */}
      {isLoading ? (
        <div className="text-center py-12 text-[#636E72]">加载中...</div>
      ) : tasks.length === 0 ? (
        <div className="card p-12 text-center">
          <ListTodo className="mx-auto text-[#B2BEC3]" size={64} />
          <p className="text-[#636E72] mt-4">暂无任务</p>
          <p className="text-[#B2BEC3] text-sm mt-1">点击"新建任务"创建第一个吧！</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task, index) => (
            <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-in">
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      )}

      {/* 新建任务弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg animate-in">
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
