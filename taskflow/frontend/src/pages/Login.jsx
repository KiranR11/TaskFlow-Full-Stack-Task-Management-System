import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

export default function Login() {
  const [form, setForm]       = useState({ username:'', password:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user }       = useAuth()
  const navigate              = useNavigate()

  if (user) { navigate('/dashboard'); return null }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await authService.login(form)
      login({ userId:data.data.userId, username:data.data.username, email:data.data.email,
              fullName:data.data.fullName, role:data.data.role }, data.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">⚡</span>
          <h1>TaskFlow</h1>
          <p>Sign in to your account</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input className="form-input" type="text" placeholder="Enter username"
              value={form.username} onChange={e => setForm(f => ({...f, username:e.target.value}))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" placeholder="Enter password"
              value={form.password} onChange={e => setForm(f => ({...f, password:e.target.value}))} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}
