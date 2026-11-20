import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { taskService } from '../services/taskService'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'

export default function Dashboard() {
  const { user }                  = useAuth()
  const [stats, setStats]         = useState(null)
  const [recentTasks, setRecent]  = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([taskService.getStats(), taskService.getMyTasks()])
      .then(([statsRes, tasksRes]) => {
        setStats(statsRes.data.data)
        setRecent(tasksRes.data.data?.slice(0, 5) ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const priorityColor = p => ({LOW:'#10b981',MEDIUM:'#f59e0b',HIGH:'#ef4444',CRITICAL:'#7c3aed'}[p] || '#6b7280')

  if (loading) return <Spinner size="lg" />

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.fullName || user?.username} 👋</h1>
        <p>Here's what's happening with your tasks today.</p>
      </div>

      <div className="stats-grid">
        {[
          { label:'Total Tasks',     value: stats?.totalTasks ?? 0,       icon:'📋', color:'#6366f1' },
          { label:'In Progress',     value: stats?.inProgressTasks ?? 0,  icon:'⚡', color:'#3b82f6' },
          { label:'In Review',       value: stats?.inReviewTasks ?? 0,    icon:'🔍', color:'#f59e0b' },
          { label:'Completed',       value: stats?.doneTasks ?? 0,        icon:'✅', color:'#10b981' },
          { label:'To Do',           value: stats?.todoTasks ?? 0,        icon:'📌', color:'#8b5cf6' },
          { label:'Total Users',     value: stats?.totalUsers ?? 0,       icon:'👥', color:'#06b6d4' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>My Recent Tasks</h2>
          <Link to="/tasks" className="btn btn-outline">View All</Link>
        </div>
        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <span>📭</span>
            <p>No tasks assigned to you yet.</p>
            <Link to="/tasks" className="btn btn-primary">Create a Task</Link>
          </div>
        ) : (
          <div className="recent-tasks">
            {recentTasks.map(t => (
              <div key={t.id} className="recent-task-row">
                <span className="task-title-sm">{t.title}</span>
                <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                  <span className="badge-sm" style={{ color: priorityColor(t.priority) }}>{t.priority}</span>
                  <span className="status-chip">{t.status?.replace('_',' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
