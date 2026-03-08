import { Bell, X, Check, Trash2, CheckCheck, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../hooks/useNotifications'

interface NotificationPanelProps {
  onClose: () => void
}

const typeConfig = {
  task_assigned: { icon: CheckCircle, color: 'text-[#FF6B6B]', bg: 'bg-[#FFF5F5]' },
  task_updated: { icon: Clock, color: 'text-[#4ECDC4]', bg: 'bg-[#E0F7F5]' },
  task_due: { icon: AlertTriangle, color: 'text-[#FFA07A]', bg: 'bg-[#FFF3E0]' },
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { data: notifications = [], isLoading } = useNotifications()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()
  const deleteNotification = useDeleteNotification()

  const unreadCount = notifications.filter(n => !n.is_read).length

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id)
  }

  const handleMarkAllAsRead = () => {
    if (window.confirm('确定将所有通知标记为已读吗？')) {
      markAllAsRead.mutate()
    }
  }

  const handleDelete = (id: string) => {
    deleteNotification.mutate(id)
  }

  return (
    <div className="absolute right-0 top-10 w-80 card p-0 z-50 animate-in shadow-lg">
      {/* 头部 */}
      <div className="flex items-center justify-between p-3 border-b border-[#E8E8E8]">
        <div className="flex items-center gap-1.5">
          <Bell className="text-[#FF6B6B]" size={16} />
          <h3 className="font-semibold text-sm text-[#2D3436]">通知</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-[#FF6B6B] text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-[#FF6B6B] hover:underline flex items-center gap-0.5"
            >
              <CheckCheck size={12} />
              全部已读
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#636E72] hover:text-[#2D3436] rounded-lg"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 通知列表 */}
      <div className="max-h-72 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 text-center text-[#636E72] text-sm">加载中...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="mx-auto text-[#B2BEC3]" size={32} />
            <p className="text-[#636E72] mt-2 text-sm">暂无通知</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E8E8]">
            {notifications.map((notification) => {
              const config = typeConfig[notification.type] || { icon: Bell, color: 'text-[#636E72]', bg: 'bg-[#F5F5F5]' }
              const Icon = config.icon
              
              return (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-[#FFF8F0] transition-colors ${
                    !notification.is_read ? 'bg-[#FFF5F5]' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`p-1.5 rounded-lg ${config.bg} shrink-0`}>
                      <Icon className={config.color} size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${!notification.is_read ? 'text-[#2D3436]' : 'text-[#636E72]'}`}>
                        {notification.title}
                      </p>
                      {notification.content && (
                        <p className="text-xs text-[#636E72] mt-0.5 line-clamp-2">
                          {notification.content}
                        </p>
                      )}
                      <p className="text-xs text-[#B2BEC3] mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-[#4ECDC4] hover:bg-[#E0F7F5] rounded-lg"
                          title="标记已读"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 text-[#636E72] hover:text-[#FF6B6B] hover:bg-[#FFE8E8] rounded-lg"
                        title="删除"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
