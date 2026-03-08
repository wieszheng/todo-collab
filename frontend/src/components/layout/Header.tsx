import { LogOut, Bell, Search, Sparkles } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

export default function Header() {
  const { user, logout } = useAuthStore()

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-primary-100 flex items-center justify-between px-6">
      {/* 搜索框 */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-400 transition-colors" size={18} />
          <input
            type="text"
            placeholder="搜索任务..."
            className="input pl-11 w-72 focus:w-80 transition-all duration-300"
          />
        </div>
      </div>

      {/* 右侧工具栏 */}
      <div className="flex items-center gap-3">
        {/* 通知按钮 */}
        <button className="relative p-2.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all duration-200">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full animate-pulse-soft"></span>
        </button>

        {/* 用户信息 */}
        <div className="flex items-center gap-3 pl-3 pr-4 py-2 bg-warm-100 rounded-xl">
          <div className="avatar">
            {user?.nickname?.[0] || user?.email[0].toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-800">{user?.nickname || '用户'}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* 退出按钮 */}
        <button
          onClick={logout}
          className="p-2.5 text-gray-400 hover:text-danger hover:bg-danger-light rounded-xl transition-all duration-200"
          title="退出登录"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
