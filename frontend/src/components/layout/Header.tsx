import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Bell, User, LogOut, ChevronDown } from 'lucide-react'
import { useUnreadCount } from '../../hooks/useNotifications'
import NotificationPanel from '../NotificationPanel'

export default function Header() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const { data: unreadCount = 0 } = useUnreadCount()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-12 bg-white/90 border-b border-[#E8E8E8] flex items-center justify-between px-4">
      {/* 左侧标题 */}
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-[#2D3436]">待办事项协作平台</h1>
      </div>

      {/* 右侧操作 */}
      <div className="flex items-center gap-3">
        {/* 通知按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-[#636E72] hover:text-[#FF6B6B] hover:bg-[#FFF5F5] rounded-lg transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FF6B6B] text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* 用户菜单 */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 hover:bg-[#FFF5F5] rounded-lg transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-xs font-medium shadow-glow">
              {user?.nickname?.[0] || user?.email[0].toUpperCase()}
            </div>
            <span className="text-sm text-[#2D3436] hidden sm:block">
              {user?.nickname || user?.email.split('@')[0]}
            </span>
            <ChevronDown size={14} className="text-[#636E72]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-9 w-40 card p-1 z-50 animate-in shadow-lg">
              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#636E72] hover:text-[#FF6B6B] hover:bg-[#FFF5F5] rounded-lg transition-colors"
              >
                <User size={16} />
                个人设置
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#FF6B6B] hover:bg-[#FFE8E8] rounded-lg transition-colors"
              >
                <LogOut size={16} />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
