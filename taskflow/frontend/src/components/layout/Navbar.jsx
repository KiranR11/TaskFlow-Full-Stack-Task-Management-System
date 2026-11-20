import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="page-title">TaskFlow</h2>
      </div>
      <div className="navbar-right">
        <div className="user-info">
          <div className="avatar">{user?.fullName?.[0] ?? user?.username?.[0] ?? 'U'}</div>
          <div>
            <div className="user-name">{user?.fullName || user?.username}</div>
            <div className="user-role">{user?.role?.replace('ROLE_','')}</div>
          </div>
        </div>
        <button className="btn btn-outline" onClick={logout}>Logout</button>
      </div>
    </header>
  )
}
