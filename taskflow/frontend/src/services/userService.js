import api from './api'
export const userService = {
  getAllUsers:      ()       => api.get('/admin/users'),
  toggleStatus:    (id)     => api.put(`/admin/users/${id}/toggle-status`),
  updateRole:      (id,role)=> api.put(`/admin/users/${id}/role?role=${role}`),
}
