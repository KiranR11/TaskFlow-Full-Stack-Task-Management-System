import api from './api'
export const taskService = {
  getAll:        ()        => api.get('/tasks'),
  getMyTasks:    ()        => api.get('/tasks/my-tasks'),
  getById:       (id)      => api.get(`/tasks/${id}`),
  create:        (data)    => api.post('/tasks', data),
  update:        (id,data) => api.put(`/tasks/${id}`, data),
  delete:        (id)      => api.delete(`/tasks/${id}`),
  search:        (kw)      => api.get(`/tasks/search?keyword=${kw}`),
  getByStatus:   (s)       => api.get(`/tasks/status/${s}`),
  getByPriority: (p)       => api.get(`/tasks/priority/${p}`),
  getStats:      ()        => api.get('/dashboard/stats'),
}
