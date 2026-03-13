import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Bell, User, LogOut, ChevronDown } from 'lucide-react'
import { useUnreadCount } from '../../hooks/useNotifications'
import NotificationPanel from '../NotificationPanel'
import { Avatar } from '../Avatar'

export default function Header() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const { data: unreadData } = useUnreadCount()
  const unreadCount = unreadData?.count ?? 0

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-12 border-b flex items-center justify-between px-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
      {/* 左侧标题 */}
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>待办事项协作平台</h1>
      </div>

      {/* 右侧操作 */}
      <div className="flex items-center gap-3">
        {/* 通知按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
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
            className="flex items-center gap-2 p-1 rounded-lg transition-colors"
            style={{ backgroundColor: 'transparent' }}
          >
            <Avatar src={user?.avatar_url} name={user?.nickname || user?.email} size="sm" />
            <span className="text-sm hidden sm:block" style={{ color: 'var(--text-primary)' }}>
              {user?.nickname || user?.email.split('@')[0]}
            </span>
            <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-9 w-40 card p-1 z-50 animate-in shadow-lg">
              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <User size={16} />
                个人设置
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary rounded-lg transition-colors"
                style={{ backgroundColor: 'transparent' }}
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
