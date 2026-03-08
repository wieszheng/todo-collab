import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../services/authService'
import { Sparkles } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #fff5f7 0%, #f5f3ff 50%, #fff5f7 100%)'
    }}>
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-32 w-80 h-80 bg-accent-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-32 left-32 w-72 h-72 bg-primary-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gradient">创建账号</h2>
          <p className="text-gray-500 mt-2">加入 Todo Collab 🌸</p>
        </div>

        {/* 注册卡片 */}
        <div className="card p-8 animate-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-danger-light text-danger-dark p-4 rounded-xl text-sm flex items-center gap-2">
                <span>❌</span>
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📧 邮箱 *
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💭 昵称
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔐 密码 *
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
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? '注册中... ⏳' : '注册 ✨'}
            </button>

            <div className="text-center text-sm pt-2">
              <span className="text-gray-500">已有账号？</span>
              {' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                立即登录 💖
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
