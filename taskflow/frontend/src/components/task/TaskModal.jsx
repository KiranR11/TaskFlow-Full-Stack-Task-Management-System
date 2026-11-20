import { useState, useEffect } from 'react'

const STATUSES   = ['TODO','IN_PROGRESS','IN_REVIEW','DONE','CANCELLED']
const PRIORITIES = ['LOW','MEDIUM','HIGH','CRITICAL']

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    title:'', description:'', status:'TODO', priority:'MEDIUM',
    assignedTo:'', projectName:'', dueDate:'', notes:'', tags:''
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (task) setForm({ ...task, tags: task.tags?.join(', ') ?? '' })
  }, [task])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    setLoading(true); setError('')
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] }
      await onSave(payload)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task')
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task?.id ? 'Edit Task' : 'New Task'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="Task title" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-input" rows={3} placeholder="Task description" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="form-input">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="form-input">
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Project</label>
              <input name="projectName" value={form.projectName} onChange={handleChange} className="form-input" placeholder="Project name" />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input name="dueDate" type="date" value={form.dueDate || ''} onChange={handleChange} className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} className="form-input" placeholder="bug, frontend, urgent" />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="form-input" rows={2} placeholder="Additional notes" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (task?.id ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
