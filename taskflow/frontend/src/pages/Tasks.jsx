import { useState, useEffect } from 'react'
import { taskService } from '../services/taskService'
import TaskCard from '../components/task/TaskCard'
import TaskModal from '../components/task/TaskModal'
import Spinner from '../components/common/Spinner'

export default function Tasks() {
  const [tasks, setTasks]       = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setModal]   = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const { data } = await taskService.getAll()
      setTasks(data.data ?? [])
      setFiltered(data.data ?? [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTasks() }, [])

  useEffect(() => {
    let f = [...tasks]
    if (search)         f = f.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    if (statusFilter)   f = f.filter(t => t.status === statusFilter)
    if (priorityFilter) f = f.filter(t => t.priority === priorityFilter)
    setFiltered(f)
  }, [search, statusFilter, priorityFilter, tasks])

  const handleSave = async (payload) => {
    if (editTask?.id) await taskService.update(editTask.id, payload)
    else              await taskService.create(payload)
    fetchTasks()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    await taskService.delete(id)
    fetchTasks()
  }

  const openEdit = (task) => { setEditTask(task); setModal(true) }
  const openNew  = ()     => { setEditTask(null);  setModal(true) }

  if (loading) return <Spinner size="lg" />

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>Tasks <span className="task-count">({filtered.length})</span></h1>
        <button className="btn btn-primary" onClick={openNew}>+ New Task</button>
      </div>

      <div className="filters-bar">
        <input className="form-input search-input" placeholder="🔍  Search tasks..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-input filter-select" value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {['TODO','IN_PROGRESS','IN_REVIEW','DONE','CANCELLED'].map(s =>
            <option key={s}>{s}</option>)}
        </select>
        <select className="form-input filter-select" value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          {['LOW','MEDIUM','HIGH','CRITICAL'].map(p =>
            <option key={p}>{p}</option>)}
        </select>
        {(search || statusFilter || priorityFilter) &&
          <button className="btn btn-outline" onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter('') }}>
            Clear Filters
          </button>
        }
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>📭</span>
          <p>No tasks found.</p>
          <button className="btn btn-primary" onClick={openNew}>Create First Task</button>
        </div>
      ) : (
        <div className="tasks-grid">
          {filtered.map(t => (
            <TaskCard key={t.id} task={t} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <TaskModal task={editTask} onClose={() => setModal(false)} onSave={handleSave} />
      )}
    </div>
  )
}
