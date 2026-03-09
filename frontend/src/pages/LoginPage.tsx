import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../services/authService'
import { Sparkles, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { access_token } = await authApi.login(email, password)
      localStorage.setItem('token', access_token)
      
      const user = await authApi.getMe()
      setAuth(user, access_token)
      
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || '登录失败，请检查邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-48 h-48 bg-primary rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-16 right-16 w-64 h-64 bg-secondary-lavender rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-primary rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary shadow-glow mb-3">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gradient">Todo Collab</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>待办事项协作平台</p>
        </div>

        {/* 登录卡片 */}
        <div className="card p-5 animate-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-light dark:bg-danger-light/20 text-danger-dark p-3 rounded-lg text-xs flex items-center gap-1.5">
                <span>!</span>
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  <Mail size={14} className="inline mr-1" />
                  邮箱
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
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  <Lock size={14} className="inline mr-1" />
                  密码
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2"
            >
              {loading ? '登录中...' : '登录'}
            </button>

            <div className="text-center text-xs pt-1">
              <span style={{ color: 'var(--text-secondary)' }}>还没有账号？</span>
              {' '}
              <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
                立即注册
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
