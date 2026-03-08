import { useQuery } from '@tanstack/react-query'
import { CheckSquare, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import { taskApi } from '../services/taskService'
import { useAuthStore } from '../stores/authStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskApi.list(),
  })

  const todoCount = tasks.filter((t) => t.status === 'todo').length
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length
  const doneCount = tasks.filter((t) => t.status === 'done').length
  const highPriorityCount = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          你好，{user?.nickname || user?.email}！
        </h1>
        <p className="text-gray-600 mt-1">今天想做点什么？</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <CheckSquare className="text-gray-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{todoCount}</p>
              <p className="text-gray-600 text-sm">待办任务</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgressCount}</p>
              <p className="text-gray-600 text-sm">进行中</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{doneCount}</p>
              <p className="text-gray-600 text-sm">已完成</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{highPriorityCount}</p>
              <p className="text-gray-600 text-sm">高优先级</p>
            </div>
          </div>
        </div>
      </div>

      {/* 最近任务 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">最近任务</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <p className="text-gray-500">加载中...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无任务，创建一个吧！</p>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      {task.due_date ? `截止: ${new Date(task.due_date).toLocaleDateString()}` : '无截止日期'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    task.status === 'done' ? 'bg-green-100 text-green-700' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status === 'done' ? '已完成' : task.status === 'in_progress' ? '进行中' : '待办'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
