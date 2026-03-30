import { useEffect, useState } from 'react'

import { api } from '../api/client'
import type { Activity } from '../types/api'

export function ActivityLogsPage() {
  const [logs, setLogs] = useState<Activity[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/activities/')
        setLogs(response.data.data)
      } catch {
        setError('Unable to fetch activity logs.')
      }
    }

    fetchLogs()
  }, [])

  if (error) {
    return <p className="error-text">{error}</p>
  }

  return (
    <section>
      <h2>Activity Logs</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Model</th>
              <th>Object ID</th>
              <th>Actor</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.action}</td>
                <td>{log.model_name}</td>
                <td>{log.object_id}</td>
                <td>{log.actor_username}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
