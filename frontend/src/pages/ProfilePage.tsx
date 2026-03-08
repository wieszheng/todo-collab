import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { Settings, User, Bell, Palette, Mail, Shield, Palette as ThemeIcon } from 'lucide-react'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance'>('profile')

  const tabs = [
    { id: 'profile', label: '个人信息', icon: User },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'appearance', label: '外观设置', icon: ThemeIcon },
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      {/* 头部 */}
      <div>
        <h1 className="text-2xl font-bold text-[#2D3436] flex items-center gap-2">
          <Settings className="text-[#FF6B6B]" size={28} />
          个人设置
        </h1>
        <p className="text-[#636E72] mt-1">管理你的账户和偏好</p>
      </div>

      <div className="flex gap-6">
        {/* 侧边菜单 */}
        <div className="w-48 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'text-[#636E72] hover:bg-[#FFF5F5] hover:text-[#FF6B6B]'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="flex-1 card p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#2D3436]">个人信息</h2>
              
              {/* 头像 */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-glow">
                  {user?.nickname?.[0] || user?.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-[#636E72]">点击更换头像</p>
                  <button className="text-sm text-[#FF6B6B] hover:underline mt-1">
                    上传新头像
                  </button>
                </div>
              </div>

              {/* 信息表单 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-2">
                    <Mail size={16} className="inline mr-1" />
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input bg-[#F5F5F5] cursor-not-allowed"
                  />
                  <p className="text-xs text-[#636E72] mt-1">邮箱不可修改</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-2">
                    <User size={16} className="inline mr-1" />
                    昵称
                  </label>
                  <input
                    type="text"
                    value={user?.nickname || ''}
                    placeholder="设置一个昵称"
                    className="input"
                  />
                </div>

                <button className="btn-primary">
                  保存修改
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#2D3436]">通知设置</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#FFF8F0] rounded-xl">
                  <div>
                    <p className="font-medium text-[#2D3436]">任务提醒</p>
                    <p className="text-sm text-[#636E72]">任务截止前发送提醒</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-[#FF6B6B]" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#FFF8F0] rounded-xl">
                  <div>
                    <p className="font-medium text-[#2D3436]">团队动态</p>
                    <p className="text-sm text-[#636E72]">团队成员活动通知</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-[#FF6B6B]" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#FFF8F0] rounded-xl">
                  <div>
                    <p className="font-medium text-[#2D3436]">系统通知</p>
                    <p className="text-sm text-[#636E72]">产品更新和公告</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-[#FF6B6B]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#2D3436]">外观设置</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-[#2D3436] mb-3">主题色</p>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-xl bg-[#FF6B6B] shadow-glow ring-2 ring-[#FF6B6B] ring-offset-2"></button>
                    <button className="w-10 h-10 rounded-xl bg-[#4ECDC4] hover:scale-110 transition-transform"></button>
                    <button className="w-10 h-10 rounded-xl bg-[#A8DADC] hover:scale-110 transition-transform"></button>
                    <button className="w-10 h-10 rounded-xl bg-[#636E72] hover:scale-110 transition-transform"></button>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-[#2D3436] mb-3">界面模式</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-xl bg-gradient-primary text-white shadow-glow flex items-center gap-1.5">
                      <Settings size={16} /> 浅色
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-[#F5F5F5] text-[#636E72] hover:bg-[#E8E8E8] flex items-center gap-1.5">
                      <Settings size={16} /> 深色
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-[#F5F5F5] text-[#636E72] hover:bg-[#E8E8E8] flex items-center gap-1.5">
                      <Settings size={16} /> 跟随系统
                    </button>
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
