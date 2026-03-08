import { useQuery } from '@tanstack/react-query'
import { CheckSquare, Clock, AlertCircle, TrendingUp, ListTodo, Calendar, Sun, Moon } from 'lucide-react'
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

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: '早上好', icon: Sun }
    if (hour < 18) return { text: '下午好', icon: Sun }
    return { text: '晚上好', icon: Moon }
  }

  const GreetingIcon = greeting().icon

  return (
    <div className="space-y-4 animate-in p-1">
      {/* 欢迎区 */}
      <div className="card p-4 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
        
        <div className="relative">
          <p className="text-white/80 text-xs flex items-center gap-1">
            <GreetingIcon size={14} /> {greeting().text}
          </p>
          <h1 className="text-lg font-bold mt-0.5">
            {user?.nickname || '用户'}，今天想做点什么？
          </h1>
          <p className="text-white/70 mt-1 text-sm">让我们一起完成今天的任务吧</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-3 hover:shadow-glow group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FFF5F5] group-hover:bg-[#FFE8E8] transition-colors">
              <CheckSquare className="text-[#FF6B6B]" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gradient">{todoCount}</p>
              <p className="text-[#636E72] text-xs">待办任务</p>
            </div>
          </div>
        </div>

        <div className="card p-3 hover:shadow-glow-mint group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E0F7F5] group-hover:bg-[#D0F0EC] transition-colors">
              <Clock className="text-[#4ECDC4]" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#4ECDC4]">{inProgressCount}</p>
              <p className="text-[#636E72] text-xs">进行中</p>
            </div>
          </div>
        </div>

        <div className="card p-3 group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E0F7F5] group-hover:bg-[#D0F0EC] transition-colors">
              <TrendingUp className="text-[#4ECDC4]" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#4ECDC4]">{doneCount}</p>
              <p className="text-[#636E72] text-xs">已完成</p>
            </div>
          </div>
        </div>

        <div className="card p-3 group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FFF3E0] group-hover:bg-[#FFE8D0] transition-colors">
              <AlertCircle className="text-[#FFA07A]" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#FFA07A]">{highPriorityCount}</p>
              <p className="text-[#636E72] text-xs">高优先级</p>
            </div>
          </div>
        </div>
      </div>

      {/* 最近任务 */}
      <div className="card">
        <div className="p-3 border-b border-[#E8E8E8] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ListTodo className="text-[#FF6B6B]" size={16} />
            <h2 className="text-sm font-semibold text-[#2D3436]">最近任务</h2>
          </div>
          <a href="/tasks" className="text-xs text-[#FF6B6B] hover:text-[#E85555]">查看全部 →</a>
        </div>
        <div className="p-3">
          {isLoading ? (
            <div className="text-center py-6 text-[#636E72] text-sm">加载中...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <ListTodo className="mx-auto text-[#B2BEC3]" size={36} />
              <p className="text-[#636E72] mt-2 text-sm">暂无任务，创建一个吧</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2.5 bg-[#FFF8F0] rounded-lg hover:bg-[#FFF5F5] transition-colors"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm text-[#2D3436] truncate">{task.title}</h3>
                    <p className="text-xs text-[#636E72] mt-0.5 flex items-center gap-1">
                      {task.due_date ? (
                        <>
                          <Calendar size={10} />
                          截止: {new Date(task.due_date).toLocaleDateString()}
                        </>
                      ) : '无截止日期'}
                    </p>
                  </div>
                  <span className={`tag ${
                    task.status === 'done' ? 'tag-success' :
                    task.status === 'in_progress' ? 'tag-mint' :
                    'tag-primary'
                  } shrink-0 ml-2`}>
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
