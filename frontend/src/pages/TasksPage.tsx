import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useCreateTask } from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'

type StatusFilter = 'all' | 'todo' | 'in_progress' | 'done'
type PriorityFilter = 'all' | 'low' | 'medium' | 'high'

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
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">任务列表</h1>
          <p className="text-gray-600 mt-1">管理你的所有任务</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={20} />
          新建任务
        </button>
      </div>

      {/* 筛选器 */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <Filter size={20} className="text-gray-400" />
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">状态:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          >
            <option value="all">全部</option>
            <option value="todo">待办</option>
            <option value="in_progress">进行中</option>
            <option value="done">已完成</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">优先级:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          >
            <option value="all">全部</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>

      {/* 任务列表 */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          暂无任务，点击"新建任务"创建第一个吧！
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* 新建任务弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
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
