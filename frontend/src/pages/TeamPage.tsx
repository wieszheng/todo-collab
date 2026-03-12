import { useState } from 'react'
import { Users, UserPlus, Shield, Crown, Plus, X, Trash2, LogOut, MoreVertical } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { 
  useTeams, useCreateTeam, useDeleteTeam, 
  useInviteMember, useUpdateMemberRole, useRemoveMember, useLeaveTeam 
} from '../hooks/useTeams'
import { Avatar } from '../components/Avatar'
import { StatRowSkeleton, TeamCardSkeleton } from '../components/Loading'

const roleConfig = {
  owner: { label: '创建者', icon: Crown, color: 'text-warning', bg: 'bg-warning-light dark:bg-warning-light/20' },
  admin: { label: '管理员', icon: Shield, color: 'text-success', bg: 'bg-success-light dark:bg-success-light/20' },
  member: { label: '成员', icon: Users, color: 'text-neutral-warm dark:text-neutral-light', bg: 'bg-neutral-100 dark:bg-neutral-800' },
}

export default function TeamPage() {
  const user = useAuthStore((s) => s.user)
  const { data: teams = [], isLoading } = useTeams()
  const createTeam = useCreateTeam()
  const deleteTeam = useDeleteTeam()
  const inviteMember = useInviteMember()
  const updateMemberRole = useUpdateMemberRole()
  const removeMember = useRemoveMember()
  const leaveTeam = useLeaveTeam()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDesc, setNewTeamDesc] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member')

  const [createError, setCreateError] = useState('')

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return
    setCreateError('')
    try {
      await createTeam.mutateAsync({ 
        name: newTeamName.trim(), 
        description: newTeamDesc.trim() || undefined 
      })
      setNewTeamName('')
      setNewTeamDesc('')
      setShowCreateModal(false)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      setCreateError(err.response?.data?.detail || '创建团队失败，请稍后重试')
    }
  }

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (window.confirm(`确定要解散团队「${teamName}」吗？此操作不可恢复。`)) {
      await deleteTeam.mutateAsync(teamId)
    }
  }

  const handleInviteMember = async (teamId: string) => {
    if (!inviteEmail.trim()) return
    await inviteMember.mutateAsync({ 
      teamId, 
      data: { email: inviteEmail.trim(), role: inviteRole } 
    })
    setInviteEmail('')
    setInviteRole('member')
    setShowInviteModal(null)
  }

  const handleUpdateRole = async (teamId: string, memberId: string, role: 'admin' | 'member') => {
    await updateMemberRole.mutateAsync({ teamId, memberId, role })
    setActiveMenu(null)
  }

  const handleRemoveMember = async (teamId: string, memberId: string, memberName: string) => {
    if (window.confirm(`确定要移除成员「${memberName}」吗？`)) {
      await removeMember.mutateAsync({ teamId, memberId })
      setActiveMenu(null)
    }
  }

  const handleLeaveTeam = async (teamId: string, teamName: string) => {
    if (window.confirm(`确定要退出团队「${teamName}」吗？`)) {
      await leaveTeam.mutateAsync(teamId)
    }
  }

  const getMyRole = (team: typeof teams[0]) => {
    const myMember = team.members?.find(m => m.user_id === user?.id)
    return myMember?.role || 'member'
  }

  const adminCount = teams.reduce((acc, team) => 
    acc + (team.members?.filter(m => m.role === 'admin').length || 0), 0)
  const ownerCount = teams.reduce((acc, team) => 
    acc + (team.members?.filter(m => m.role === 'owner').length || 0), 0)

  return (
    <div className="space-y-4 animate-in p-1">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-charcoal dark:text-white flex items-center gap-2">
            <Users className="text-primary" size={22} />
            团队管理
          </h1>
          <p className="text-neutral-warm dark:text-neutral-light text-sm mt-0.5">管理你的团队成员</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} />
          创建团队
        </button>
      </div>

      {/* 统计卡片 */}
      {isLoading ? (
        <StatRowSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-100/20">
                <Users className="text-primary" size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-gradient">{teams.length}</p>
                <p className="text-neutral-warm dark:text-neutral-light text-xs">我的团队</p>
              </div>
            </div>
          </div>

          <div className="card p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success-light dark:bg-success-light/20">
                <Shield className="text-success" size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-success">{adminCount}</p>
                <p className="text-neutral-warm dark:text-neutral-light text-xs">管理员</p>
              </div>
            </div>
          </div>

          <div className="card p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning-light dark:bg-warning-light/20">
                <Crown className="text-warning" size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-warning">{ownerCount}</p>
                <p className="text-neutral-warm dark:text-neutral-light text-xs">创建者</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 团队列表 */}
      {isLoading ? (
        <div className="space-y-4">
          <TeamCardSkeleton />
          <TeamCardSkeleton />
        </div>
      ) : teams.length === 0 ? (
        <div className="card p-8 text-center">
          <Users className="mx-auto text-neutral-light" size={40} />
          <p className="text-neutral-warm dark:text-neutral-light mt-2 text-sm">还没有团队</p>
          <p className="text-neutral-light text-xs mt-1">点击"创建团队"开始协作</p>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => {
            const myRole = getMyRole(team)
            const isOwner = myRole === 'owner'
            
            return (
              <div key={team.id} className="card overflow-hidden">
                {/* 团队头部 */}
                <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between bg-neutral-cream dark:bg-neutral-800">
                  <div>
                    <h2 className="font-semibold text-neutral-charcoal dark:text-white">{team.name}</h2>
                    {team.description && (
                      <p className="text-xs text-neutral-warm dark:text-neutral-light mt-0.5">{team.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <button
                        onClick={() => setShowInviteModal(team.id)}
                        className="btn-ghost text-xs flex items-center gap-1"
                      >
                        <UserPlus size={14} />
                        邀请
                      </button>
                    )}
                    {!isOwner && (
                      <button
                        onClick={() => handleLeaveTeam(team.id, team.name)}
                        className="btn-ghost text-xs flex items-center gap-1 text-primary"
                      >
                        <LogOut size={14} />
                        退出
                      </button>
                    )}
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteTeam(team.id, team.name)}
                        className="p-1.5 text-primary hover:bg-danger-light dark:hover:bg-danger-light/20 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* 成员列表 */}
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {team.members?.map((member) => {
                    const role = roleConfig[member.role]
                    const RoleIcon = role.icon
                    const displayName = member.user?.nickname || member.user?.email?.split('@')[0] || '用户'
                    const isMe = member.user_id === user?.id
                    
                    return (
                      <div key={member.id} className="p-3 flex items-center justify-between hover:bg-secondary-cream dark:hover:bg-neutral-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar src={member.user?.avatar_url} name={displayName} size="sm" />
                          <div>
                            <p className="font-medium text-sm text-neutral-charcoal dark:text-white">
                              {displayName}
                              {isMe && <span className="text-primary ml-1">(我)</span>}
                            </p>
                            <p className="text-xs text-neutral-warm dark:text-neutral-light">{member.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`tag ${role.bg} ${role.color} flex items-center gap-0.5`}>
                            <RoleIcon size={12} />
                            {role.label}
                          </span>
                          
                          {isOwner && !isMe && (
                            <div className="relative">
                              <button
                                onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                                className="p-1 text-neutral-warm dark:text-neutral-light hover:text-neutral-charcoal dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                              >
                                <MoreVertical size={14} />
                              </button>
                              
                              {activeMenu === member.id && (
                                <div className="absolute right-0 top-6 w-28 card p-1 shadow-lg z-10">
                                  {member.role === 'member' && (
                                    <button
                                      onClick={() => handleUpdateRole(team.id, member.id, 'admin')}
                                      className="w-full text-left px-2 py-1.5 text-xs text-neutral-warm dark:text-neutral-light hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary rounded"
                                    >
                                      设为管理员
                                    </button>
                                  )}
                                  {member.role === 'admin' && (
                                    <button
                                      onClick={() => handleUpdateRole(team.id, member.id, 'member')}
                                      className="w-full text-left px-2 py-1.5 text-xs text-neutral-warm dark:text-neutral-light hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary rounded"
                                    >
                                      设为成员
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleRemoveMember(team.id, member.id, displayName)}
                                    className="w-full text-left px-2 py-1.5 text-xs text-primary hover:bg-danger-light dark:hover:bg-danger-light/20 rounded"
                                  >
                                    移除成员
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 创建团队弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-in p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-charcoal dark:text-white">创建团队</h3>
              <button
                onClick={() => {
                  setCreateError('')
                  setShowCreateModal(false)
                }}
                className="p-1 text-neutral-warm dark:text-neutral-light hover:text-neutral-charcoal dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {createError && (
                <div className="p-2 bg-danger-light dark:bg-danger-light/20 text-primary text-xs rounded-lg">
                  {createError}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-neutral-charcoal dark:text-white mb-1">团队名称</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="输入团队名称"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-charcoal dark:text-white mb-1">描述（可选）</label>
                <textarea
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="简单描述这个团队..."
                  className="input min-h-[80px] resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setCreateError('')
                  setShowCreateModal(false)
                }}
                className="btn-ghost"
              >
                取消
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!newTeamName.trim() || createTeam.isPending}
                className="btn-primary"
              >
                {createTeam.isPending ? '创建中...' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 邀请成员弹窗 */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-in p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-charcoal dark:text-white">邀请成员</h3>
              <button
                onClick={() => setShowInviteModal(null)}
                className="p-1 text-neutral-warm dark:text-neutral-light hover:text-neutral-charcoal dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-charcoal dark:text-white mb-1">成员邮箱</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="输入邮箱地址"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-charcoal dark:text-white mb-1">角色</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setInviteRole('member')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      inviteRole === 'member'
                        ? 'bg-gradient-primary text-white shadow-glow'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-warm dark:text-neutral-light hover:bg-primary-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    成员
                  </button>
                  <button
                    onClick={() => setInviteRole('admin')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      inviteRole === 'admin'
                        ? 'bg-gradient-primary text-white shadow-glow'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-warm dark:text-neutral-light hover:bg-primary-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    管理员
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowInviteModal(null)}
                className="btn-ghost"
              >
                取消
              </button>
              <button
                onClick={() => handleInviteMember(showInviteModal)}
                disabled={!inviteEmail.trim() || inviteMember.isPending}
                className="btn-primary"
              >
                {inviteMember.isPending ? '邀请中...' : '发送邀请'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  )
}
