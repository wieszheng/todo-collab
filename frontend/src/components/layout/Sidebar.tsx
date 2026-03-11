import { NavLink } from 'react-router-dom'
import { Home, ListTodo, Users, Settings, Sparkles } from 'lucide-react'
import { useTasks } from '../../hooks/useTasks'

const navItems = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/tasks', icon: ListTodo, label: '任务' },
  { to: '/team', icon: Users, label: '团队' },
  { to: '/profile', icon: Settings, label: '设置' },
]

export default function Sidebar() {
  const { data: tasks } = useTasks()

  // 计算今日待办数量：今天到期且未完成
  const todayTodoCount = tasks?.filter((task) => {
    if (task.status === 'done') return false
    if (!task.due_date) return false
    const dueDate = new Date(task.due_date)
    const today = new Date()
    return (
      dueDate.getFullYear() === today.getFullYear() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getDate() === today.getDate()
    )
  }).length ?? 0

  return (
    <aside className="w-52 border-r flex flex-col" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
      {/* Logo 区域 */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="text-white" size={16} />
          </div>
          <div>
            <h1 className="text-base font-bold text-gradient">Todo Collab</h1>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>待办事项协作</p>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* 底部统计卡片 */}
      <div className="p-3">
        <div className="card p-3 text-center" style={{ background: 'linear-gradient(135deg, var(--bg-hover) 0%, var(--bg-accent) 100%)' }}>
          <ListTodo className="mx-auto text-primary" size={24} />
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>今日待办</p>
          <p className="text-xl font-bold text-gradient">{todayTodoCount} 项</p>
        </div>
      </div>
    </aside>
  )
}
