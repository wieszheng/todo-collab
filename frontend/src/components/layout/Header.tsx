import { LogOut, Bell, Search } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

export default function Header() {
  const { user, logout } = useAuthStore()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索任务..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
            {user?.nickname?.[0] || user?.email[0].toUpperCase()}
          </div>
          <span className="text-gray-700">{user?.nickname || user?.email}</span>
        </div>

        <button
          onClick={logout}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          title="退出登录"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
