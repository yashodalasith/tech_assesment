import { Link, Outlet, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'

export function Layout() {
  const clear = useAuthStore((state) => state.clear)
  const navigate = useNavigate()

  const logout = () => {
    clear()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>CRM</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/activity-logs">Activity Logs</Link>
        </nav>
        <button type="button" onClick={logout} className="secondary-btn">
          Logout
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
