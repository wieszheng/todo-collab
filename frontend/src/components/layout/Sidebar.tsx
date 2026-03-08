import { NavLink } from 'react-router-dom'
import { Home, CheckSquare, Users, Settings, Sparkles } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: '首页', emoji: '🏠' },
  { to: '/tasks', icon: CheckSquare, label: '任务', emoji: '✨' },
  { to: '/team', icon: Users, label: '团队', emoji: '👥' },
  { to: '/profile', icon: Settings, label: '设置', emoji: '⚙️' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-primary-100 flex flex-col">
      {/* Logo 区域 */}
      <div className="p-6 border-b border-primary-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient">Todo Collab</h1>
            <p className="text-xs text-gray-400">待办事项协作平台 ✨</p>
          </div>
        </div>
      </div>
      
      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label, emoji }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* 底部装饰 */}
      <div className="p-4">
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">🌸</div>
          <p className="text-sm text-gray-500">今日待办</p>
          <p className="text-2xl font-bold text-gradient">3 项</p>
        </div>
      </div>
    </aside>
  )
}
