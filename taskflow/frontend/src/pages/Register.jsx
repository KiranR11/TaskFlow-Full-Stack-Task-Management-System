import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

export default function Register() {
  const [form, setForm]       = useState({ username:'', email:'', password:'', fullName:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user }       = useAuth()
  const navigate              = useNavigate()

  if (user) { navigate('/dashboard'); return null }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await authService.register(form)
      login({ userId:data.data.userId, username:data.data.username, email:data.data.email,
              fullName:data.data.fullName, role:data.data.role }, data.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">⚡</span>
          <h1>TaskFlow</h1>
          <p>Create your account</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" placeholder="John Doe"
              value={form.fullName} onChange={e => setForm(f=>({...f,fullName:e.target.value}))} required />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input className="form-input" placeholder="johndoe"
              value={form.username} onChange={e => setForm(f=>({...f,username:e.target.value}))} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" type="email" placeholder="john@example.com"
              value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} minLength={6} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  )
}
