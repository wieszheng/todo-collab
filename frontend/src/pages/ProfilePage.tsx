import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useUpdateUser } from '../hooks/useUsers'
import { Settings, User, Bell, Palette, Mail, Save } from 'lucide-react'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance'>('profile')
  const [nickname, setNickname] = useState(user?.nickname || '')
  const [saved, setSaved] = useState(false)
  
  const updateUser = useUpdateUser()

  const tabs = [
    { id: 'profile', label: '个人信息', icon: User },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'appearance', label: '外观设置', icon: Palette },
  ] as const

  const handleSave = async () => {
    await updateUser.mutateAsync({ nickname })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-in p-1">
      {/* 头部 */}
      <div>
        <h1 className="text-xl font-bold text-[#2D3436] flex items-center gap-2">
          <Settings className="text-[#FF6B6B]" size={22} />
          个人设置
        </h1>
        <p className="text-[#636E72] text-sm mt-0.5">管理你的账户和偏好</p>
      </div>

      <div className="flex gap-4">
        {/* 侧边菜单 */}
        <div className="w-36 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'text-[#636E72] hover:bg-[#FFF5F5] hover:text-[#FF6B6B]'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="flex-1 card p-4">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-[#2D3436]">个人信息</h2>
              
              {/* 头像 */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-lg font-bold shadow-glow">
                  {user?.nickname?.[0] || user?.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-[#636E72]">点击更换头像</p>
                  <button className="text-xs text-[#FF6B6B] hover:underline mt-0.5">
                    上传新头像
                  </button>
                </div>
              </div>

              {/* 信息表单 */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#2D3436] mb-1">
                    <Mail size={14} className="inline mr-1" />
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input bg-[#F5F5F5] cursor-not-allowed"
                  />
                  <p className="text-xs text-[#636E72] mt-0.5">邮箱不可修改</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D3436] mb-1">
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
              <h2 className="text-sm font-semibold text-[#2D3436]">通知设置</h2>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-[#FFF8F0] rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-[#2D3436]">任务提醒</p>
                    <p className="text-xs text-[#636E72]">任务截止前发送提醒</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-[#FF6B6B]" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 bg-[#FFF8F0] rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-[#2D3436]">团队动态</p>
                    <p className="text-xs text-[#636E72]">团队成员活动通知</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-[#FF6B6B]" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 bg-[#FFF8F0] rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-[#2D3436]">系统通知</p>
                    <p className="text-xs text-[#636E72]">产品更新和公告</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-[#FF6B6B]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-[#2D3436]">外观设置</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-[#2D3436] mb-2">主题色</p>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-[#FF6B6B] shadow-glow ring-2 ring-[#FF6B6B] ring-offset-1"></button>
                    <button className="w-8 h-8 rounded-lg bg-[#4ECDC4] hover:scale-110 transition-transform"></button>
                    <button className="w-8 h-8 rounded-lg bg-[#A8DADC] hover:scale-110 transition-transform"></button>
                    <button className="w-8 h-8 rounded-lg bg-[#636E72] hover:scale-110 transition-transform"></button>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-sm text-[#2D3436] mb-2">界面模式</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-gradient-primary text-white shadow-glow flex items-center gap-1 text-sm">
                      <Settings size={14} /> 浅色
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-[#F5F5F5] text-[#636E72] hover:bg-[#E8E8E8] flex items-center gap-1 text-sm">
                      <Settings size={14} /> 深色
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-[#F5F5F5] text-[#636E72] hover:bg-[#E8E8E8] flex items-center gap-1 text-sm">
                      <Settings size={14} /> 跟随系统
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
