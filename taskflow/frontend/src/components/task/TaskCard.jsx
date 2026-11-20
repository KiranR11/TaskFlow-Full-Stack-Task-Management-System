const priorityColors = {
  LOW:'#10b981', MEDIUM:'#f59e0b', HIGH:'#ef4444', CRITICAL:'#7c3aed'
}
const statusColors = {
  TODO:'#6b7280', IN_PROGRESS:'#3b82f6', IN_REVIEW:'#f59e0b', DONE:'#10b981', CANCELLED:'#ef4444'
}

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className="task-title">{task.title}</span>
        <div className="task-actions">
          <button className="btn-icon" onClick={() => onEdit(task)} title="Edit">✏️</button>
          <button className="btn-icon btn-danger" onClick={() => onDelete(task.id)} title="Delete">🗑️</button>
        </div>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-meta">
        <span className="badge" style={{ background: priorityColors[task.priority] + '22', color: priorityColors[task.priority], border: `1px solid ${priorityColors[task.priority]}44` }}>
          {task.priority}
        </span>
        <span className="badge" style={{ background: statusColors[task.status] + '22', color: statusColors[task.status], border: `1px solid ${statusColors[task.status]}44` }}>
          {task.status?.replace('_',' ')}
        </span>
      </div>
      <div className="task-footer">
        {task.assignedToName && <span className="task-assignee">👤 {task.assignedToName}</span>}
        {task.dueDate && <span className="task-due">📅 {task.dueDate}</span>}
        {task.projectName && <span className="task-project">📁 {task.projectName}</span>}
      </div>
    </div>
  )
}
