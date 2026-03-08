import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { Settings, User, Bell, Palette, Mail, Camera, Save } from 'lucide-react'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance'>('profile')

  const tabs = [
    { id: 'profile', label: '个人信息', icon: User },
    { id: 'notifications', label: '通知', icon: Bell },
    { id: 'appearance', label: '外观', icon: Palette },
  ] as const

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in p-1">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2D3436] flex items-center gap-2">
            <Settings className="text-[#FF6B6B]" size={22} />
            设置
          </h1>
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex gap-1 p-1 bg-[#F5F5F5] rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#FF6B6B] shadow-sm'
                : 'text-[#636E72] hover:text-[#2D3436]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="card p-4">
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* 头像区域 */}
            <div className="flex items-center gap-4 pb-4 border-b border-[#E8E8E8]">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-glow">
                  {user?.nickname?.[0] || user?.email[0].toUpperCase()}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-[#636E72] hover:text-[#FF6B6B] transition-colors">
                  <Camera size={12} />
                </button>
              </div>
              <div>
                <p className="font-medium text-[#2D3436]">{user?.nickname || '未设置昵称'}</p>
                <p className="text-xs text-[#636E72]">{user?.email}</p>
              </div>
            </div>

            {/* 表单 */}
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#2D3436] mb-1">
                    <Mail size={12} className="inline mr-1" />
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input bg-[#F5F5F5] cursor-not-allowed text-[#636E72]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D3436] mb-1">
                    <User size={12} className="inline mr-1" />
                    昵称
                  </label>
                  <input
                    type="text"
                    value={user?.nickname || ''}
                    placeholder="设置昵称"
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button className="btn-primary flex items-center gap-1.5">
                  <Save size={14} />
                  保存修改
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#FFF8F0] rounded-lg hover:bg-[#FFF5F5] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFE8E8] rounded-lg">
                  <Bell className="text-[#FF6B6B]" size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#2D3436]">任务提醒</p>
                  <p className="text-xs text-[#636E72]">截止日期前发送提醒</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-[#E8E8E8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B6B]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FFF8F0] rounded-lg hover:bg-[#FFF5F5] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E0F7F5] rounded-lg">
                  <User className="text-[#4ECDC4]" size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#2D3436]">团队动态</p>
                  <p className="text-xs text-[#636E72]">成员活动通知</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-[#E8E8E8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B6B]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FFF8F0] rounded-lg hover:bg-[#FFF5F5] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFF3E0] rounded-lg">
                  <Settings className="text-[#FFA07A]" size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#2D3436]">系统通知</p>
                  <p className="text-xs text-[#636E72]">产品更新和公告</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-[#E8E8E8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B6B]"></div>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div>
              <p className="font-medium text-sm text-[#2D3436] mb-2">主题色</p>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-[#FF6B6B] shadow-glow ring-2 ring-[#FF6B6B] ring-offset-2 transition-all"></button>
                <button className="w-10 h-10 rounded-xl bg-[#4ECDC4] hover:scale-105 transition-transform"></button>
                <button className="w-10 h-10 rounded-xl bg-[#A8DADC] hover:scale-105 transition-transform"></button>
                <button className="w-10 h-10 rounded-xl bg-[#636E72] hover:scale-105 transition-transform"></button>
                <button className="w-10 h-10 rounded-xl bg-[#9B59B6] hover:scale-105 transition-transform"></button>
                <button className="w-10 h-10 rounded-xl bg-[#3498DB] hover:scale-105 transition-transform"></button>
              </div>
            </div>

            <div>
              <p className="font-medium text-sm text-[#2D3436] mb-2">界面模式</p>
              <div className="grid grid-cols-3 gap-2">
                <button className="p-3 rounded-xl bg-gradient-primary text-white shadow-glow flex flex-col items-center gap-1">
                  <Settings size={18} />
                  <span className="text-xs">浅色</span>
                </button>
                <button className="p-3 rounded-xl bg-[#2D3436] text-white flex flex-col items-center gap-1 hover:opacity-90">
                  <Settings size={18} />
                  <span className="text-xs">深色</span>
                </button>
                <button className="p-3 rounded-xl bg-[#F5F5F5] text-[#636E72] flex flex-col items-center gap-1 hover:bg-[#E8E8E8]">
                  <Settings size={18} />
                  <span className="text-xs">跟随系统</span>
                </button>
              </div>
            </div>

            <div>
              <p className="font-medium text-sm text-[#2D3436] mb-2">字体大小</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#636E72]">小</span>
                <input type="range" min="12" max="18" defaultValue="14" className="flex-1 h-1 bg-[#E8E8E8] rounded-lg appearance-none cursor-pointer accent-[#FF6B6B]" />
                <span className="text-xs text-[#636E72]">大</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
