import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/types'
import { authApi } from '@/services/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User | undefined>
  register: (data: { email: string; password: string; firstName: string; lastName: string; taxProfile: string }) => Promise<User | undefined>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const response = await authApi.getProfile()
      setUser(response.data)
    } catch {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password })
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
    return response.data.user
  }

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; taxProfile: string }) => {
    const response = await authApi.register(data as never)
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
    return response.data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
