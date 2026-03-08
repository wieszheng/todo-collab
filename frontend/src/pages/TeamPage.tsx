import { Users, UserPlus, Shield, Crown, ListTodo } from 'lucide-react'

export default function TeamPage() {
  // 模拟团队成员数据
  const members = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'owner', avatar: '张' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: 'admin', avatar: '李' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: 'member', avatar: '王' },
  ]

  const roleConfig = {
    owner: { label: '创建者', icon: Crown, color: 'text-[#FFA07A]', bg: 'bg-[#FFF3E0]' },
    admin: { label: '管理员', icon: Shield, color: 'text-[#4ECDC4]', bg: 'bg-[#E0F7F5]' },
    member: { label: '成员', icon: Users, color: 'text-[#636E72]', bg: 'bg-[#F5F5F5]' },
  }

  return (
    <div className="space-y-6 animate-in">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D3436] flex items-center gap-2">
            <Users className="text-[#FF6B6B]" size={28} />
            团队管理
          </h1>
          <p className="text-[#636E72] mt-1">管理你的团队成员</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus size={20} />
          邀请成员
        </button>
      </div>

      {/* 团队统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FFF5F5]">
              <Users className="text-[#FF6B6B]" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gradient">{members.length}</p>
              <p className="text-[#636E72] text-sm">团队成员</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#E0F7F5]">
              <Shield className="text-[#4ECDC4]" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#4ECDC4]">
                {members.filter(m => m.role === 'admin').length}
              </p>
              <p className="text-[#636E72] text-sm">管理员</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FFF3E0]">
              <Crown className="text-[#FFA07A]" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FFA07A]">
                {members.filter(m => m.role === 'owner').length}
              </p>
              <p className="text-[#636E72] text-sm">创建者</p>
            </div>
          </div>
        </div>
      </div>

      {/* 成员列表 */}
      <div className="card">
        <div className="p-5 border-b border-[#E8E8E8]">
          <h2 className="text-lg font-semibold text-[#2D3436]">成员列表</h2>
        </div>
        <div className="divide-y divide-[#E8E8E8]">
          {members.map((member) => {
            const role = roleConfig[member.role]
            const RoleIcon = role.icon
            
            return (
              <div key={member.id} className="p-4 flex items-center justify-between hover:bg-[#FFF8F0] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-[#2D3436]">{member.name}</p>
                    <p className="text-sm text-[#636E72]">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`tag ${role.bg} ${role.color} flex items-center gap-1`}>
                    <RoleIcon size={14} />
                    {role.label}
                  </span>
                  <button className="btn-ghost text-sm">
                    管理
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 空状态提示 */}
      {members.length === 0 && (
        <div className="card p-12 text-center">
          <Users className="mx-auto text-[#B2BEC3]" size={64} />
          <p className="text-[#636E72] mt-4">暂无团队成员</p>
          <p className="text-[#B2BEC3] text-sm mt-1">点击"邀请成员"添加第一位成员</p>
        </div>
      )}
    </div>
  )
}
