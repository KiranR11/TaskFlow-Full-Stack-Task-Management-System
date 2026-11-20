import { useState, useEffect } from 'react'
import { userService } from '../services/userService'
import Spinner from '../components/common/Spinner'

const ROLES = ['ROLE_USER','ROLE_MANAGER','ROLE_ADMIN']

export default function AdminPanel() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const { data } = await userService.getAllUsers()
      setUsers(data.data ?? [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleToggle = async (id) => {
    await userService.toggleStatus(id)
    fetchUsers()
  }

  const handleRoleChange = async (id, role) => {
    await userService.updateRole(id, role)
    fetchUsers()
  }

  if (loading) return <Spinner size="lg" />

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <span className="badge-info">{users.length} Users</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><div className="user-cell"><div className="avatar-sm">{u.fullName?.[0]??'U'}</div><span>{u.fullName}</span></div></td>
                <td>{u.email}</td>
                <td>
                  <select className="role-select" value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td><span className={`status-pill ${u.enabled ? 'active' : 'inactive'}`}>{u.enabled ? 'Active' : 'Disabled'}</span></td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                <td>
                  <button className={`btn btn-sm ${u.enabled ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => handleToggle(u.id)}>
                    {u.enabled ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
