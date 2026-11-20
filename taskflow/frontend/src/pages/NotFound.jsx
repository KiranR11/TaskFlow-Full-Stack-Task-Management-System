import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign:'center' }}>
        <h1 style={{ fontSize:'4rem', margin:0 }}>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  )
}
