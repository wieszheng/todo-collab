import { NavLink } from 'react-router-dom'
import { Home, CheckSquare, Users, Settings } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/tasks', icon: CheckSquare, label: '任务' },
  { to: '/team', icon: Users, label: '团队' },
  { to: '/profile', icon: Settings, label: '设置' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">Todo Collab</h1>
        <p className="text-sm text-gray-500">待办事项协作平台</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
