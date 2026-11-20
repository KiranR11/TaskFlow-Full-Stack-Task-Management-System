import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('taskflow_token')
    const storedUser  = localStorage.getItem('taskflow_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('taskflow_token', jwtToken)
    localStorage.setItem('taskflow_user',  JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('taskflow_token')
    localStorage.removeItem('taskflow_user')
  }

  const isAdmin   = () => user?.role === 'ROLE_ADMIN'
  const isManager = () => user?.role === 'ROLE_MANAGER' || isAdmin()

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isManager, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
