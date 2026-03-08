import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../services/authService'
import { Sparkles, Mail, Lock, User } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authApi.register({ email, password, nickname: nickname || undefined })
      navigate('/login', { state: { message: '注册成功，请登录' } })
    } catch (err: any) {
      setError(err.response?.data?.detail || '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF8F0]">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-56 h-56 bg-[#A8DADC] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#FFB4A2] rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary shadow-glow mb-3">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gradient">创建账号</h2>
          <p className="text-[#636E72] text-sm mt-1">加入 Todo Collab</p>
        </div>

        {/* 注册卡片 */}
        <div className="card p-5 animate-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-[#FFE8E8] text-[#E85555] p-3 rounded-lg text-xs flex items-center gap-1.5">
                <span>!</span>
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#2D3436] mb-1">
                  <Mail size={14} className="inline mr-1" />
                  邮箱 *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                  placeholder="your@email.com"
                />
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
                  className="input"
                  placeholder="你的名字"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D3436] mb-1">
                  <Lock size={14} className="inline mr-1" />
                  密码 *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input"
                  placeholder="至少6位密码"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2"
            >
              {loading ? '注册中...' : '注册'}
            </button>

            <div className="text-center text-xs pt-1">
              <span className="text-[#636E72]">已有账号？</span>
              {' '}
              <Link to="/login" className="text-[#FF6B6B] hover:text-[#E85555] font-medium">
                立即登录
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
