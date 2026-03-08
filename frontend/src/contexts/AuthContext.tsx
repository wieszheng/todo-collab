import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../services/authService'

interface AuthContextType {
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const { user, token, setAuth, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      if (token && !user) {
        try {
          const userData = await authApi.getMe()
          setAuth(userData, token)
        } catch {
          logout()
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const isAuthenticated = !!user && !!token

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
