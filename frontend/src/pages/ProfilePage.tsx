import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore, themeColors, ThemeColorKey, ThemeMode } from '../stores/themeStore'
import { useUpdateUser } from '../hooks/useUsers'
import { Settings, User, Bell, Palette, Mail, Save, Sun, Moon, Monitor, Check } from 'lucide-react'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const { color, mode, setColor, setMode } = useThemeStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance'>('profile')
  const [nickname, setNickname] = useState(user?.nickname || '')
  const [saved, setSaved] = useState(false)
  
  const updateUser = useUpdateUser()

  const tabs = [
    { id: 'profile', label: '个人信息', icon: User },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'appearance', label: '外观设置', icon: Palette },
  ] as const

  const colorOptions: { key: ThemeColorKey; color: string }[] = [
    { key: 'coral', color: '#FF6B6B' },
    { key: 'mint', color: '#20C997' },
    { key: 'lavender', color: '#9775FA' },
    { key: 'amber', color: '#F59F00' },
  ]

  const modeOptions: { key: ThemeMode; label: string; icon: typeof Sun }[] = [
    { key: 'light', label: '浅色', icon: Sun },
    { key: 'dark', label: '深色', icon: Moon },
    { key: 'system', label: '跟随系统', icon: Monitor },
  ]

  const handleSave = async () => {
    await updateUser.mutateAsync({ nickname })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4 animate-in p-1">
      {/* 头部 */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Settings style={{ color: 'var(--color-primary)' }} size={22} />
          个人设置
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>管理你的账户和偏好</p>
      </div>

      <div className="card flex overflow-hidden">
        {/* 侧边菜单 */}
        <div className="w-40 border-r p-2 space-y-1" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-card)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'hover:bg-[var(--bg-hover)]'
              }`}
              style={activeTab !== tab.id ? { color: 'var(--text-secondary)' } : undefined}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="flex-1 p-4">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>个人信息</h2>
              
              {/* 头像 */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-lg font-bold shadow-glow">
                  {user?.nickname?.[0] || user?.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>点击更换头像</p>
                  <button className="text-xs hover:underline mt-0.5" style={{ color: 'var(--color-primary)' }}>
                    上传新头像
                  </button>
                </div>
              </div>

              {/* 信息表单 */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    <Mail size={14} className="inline mr-1" />
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input cursor-not-allowed"
                    style={{ backgroundColor: 'var(--bg-hover)' }}
                  />
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>邮箱不可修改</p>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    <User size={14} className="inline mr-1" />
                    昵称
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="设置一个昵称"
                    className="input"
                  />
                </div>

                <button 
                  onClick={handleSave}
                  disabled={updateUser.isPending}
                  className="btn-primary flex items-center gap-1.5"
                >
                  <Save size={14} />
                  {updateUser.isPending ? '保存中...' : saved ? '已保存!' : '保存修改'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>通知设置</h2>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-accent)' }}>
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>任务提醒</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>任务截止前发送提醒</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-[var(--color-primary)]" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-accent)' }}>
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>团队动态</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>团队成员活动通知</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-[var(--color-primary)]" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-accent)' }}>
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>系统通知</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>产品更新和公告</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-[var(--color-primary)]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-5">
              {/* 主题色 */}
              <div>
                <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>主题色</h2>
                <div className="flex gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setColor(option.key)}
                      className={`w-10 h-10 rounded-xl transition-all relative ${
                        color === option.key 
                          ? 'scale-110 shadow-lg' 
                          : 'hover:scale-105'
                      }`}
                      style={{ 
                        backgroundColor: option.color,
                        boxShadow: color === option.key ? `0 4px 20px ${option.color}40` : undefined
                      }}
                      title={themeColors[option.key].name}
                    >
                      {color === option.key && (
                        <Check size={16} className="absolute inset-0 m-auto text-white" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  当前: {themeColors[color].name}
                </p>
              </div>

              {/* 界面模式 */}
              <div>
                <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>界面模式</h2>
                <div className="flex gap-2">
                  {modeOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.key}
                        onClick={() => setMode(option.key)}
                        className={`px-4 py-2 rounded-xl flex items-center gap-1.5 text-sm font-medium transition-all ${
                          mode === option.key
                            ? 'bg-gradient-primary text-white shadow-glow'
                            : 'border'
                        }`}
                        style={mode !== option.key ? { 
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-secondary)',
                          borderColor: 'var(--border-light)'
                        } : undefined}
                      >
                        <Icon size={14} />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 预览 */}
              <div>
                <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>预览效果</h2>
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
                      {user?.nickname?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {user?.nickname || '用户名'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary text-xs px-3 py-1.5">
                      主要按钮
                    </button>
                    <button className="btn-ghost text-xs px-3 py-1.5">
                      次要按钮
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="tag tag-primary">标签</span>
                    <span className="tag tag-mint">成功</span>
                    <span className="tag tag-warning">警告</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
