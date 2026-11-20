import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to:'/dashboard', label:'Dashboard', icon:'📊' },
  { to:'/tasks',     label:'Tasks',     icon:'✅' },
]

export default function Sidebar() {
  const { isAdmin } = useAuth()
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-name">TaskFlow</span>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
        {isAdmin() && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">🛡️</span>
            <span>Admin</span>
          </NavLink>
        )}
      </nav>
    </aside>
  )
}
