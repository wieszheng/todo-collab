import { Bell, X, Check, Trash2, CheckCheck, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../hooks/useNotifications'

interface NotificationPanelProps {
  onClose: () => void
}

const typeConfig = {
  task_assigned: { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-100/20' },
  task_updated: { icon: Clock, color: 'text-success', bg: 'bg-success-light dark:bg-success-light/20' },
  task_due: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning-light dark:bg-warning-light/20' },
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
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-1.5">
          <Bell className="text-primary" size={16} />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>通知</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-primary text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-primary hover:underline flex items-center gap-0.5"
            >
              <CheckCheck size={12} />
              全部已读
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 通知列表 */}
      <div className="max-h-72 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>加载中...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="mx-auto" size={32} style={{ color: 'var(--text-muted)' }} />
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>暂无通知</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
            {notifications.map((notification) => {
              const config = typeConfig[notification.type] || { icon: Bell, color: 'text-neutral-warm dark:text-neutral-light', bg: 'bg-neutral-100 dark:bg-neutral-800' }
              const Icon = config.icon
              
              return (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-secondary-cream dark:hover:bg-neutral-700 transition-colors ${
                    !notification.is_read ? 'bg-primary-50 dark:bg-primary-100/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`p-1.5 rounded-lg ${config.bg} shrink-0`}>
                      <Icon className={config.color} size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${!notification.is_read ? '' : ''}`} style={{ color: notification.is_read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                        {notification.title}
                      </p>
                      {notification.content && (
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {notification.content}
                        </p>
                      )}
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-success hover:bg-success-light dark:hover:bg-success-light/20 rounded-lg"
                          title="标记已读"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 hover:text-primary hover:bg-danger-light dark:hover:bg-danger-light/20 rounded-lg"
                        style={{ color: 'var(--text-secondary)' }}
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
