import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { api } from '../api/client'
import type { Activity, ApiListResponse, PaginationMeta } from '../types/api'

export function ActivityLogsPage() {
  const [logs, setLogs] = useState<Activity[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [error, setError] = useState('')

  const fetchLogs = async (targetPage = page, targetSearch = search) => {
    try {
      const response = await api.get<ApiListResponse<Activity>>('/activities/', {
        params: {
          page: targetPage,
          search: targetSearch || undefined,
        },
      })
      setLogs(response.data.data)
      setPagination(response.data.pagination ?? null)
    } catch {
      setError('Unable to fetch activity logs.')
    }
  }

  useEffect(() => {
    fetchLogs(1, '')
  }, [])

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault()
    setPage(1)
    fetchLogs(1, search)
  }

  const goToPage = (targetPage: number) => {
    setPage(targetPage)
    fetchLogs(targetPage, search)
  }

  if (error) {
    return <p className="error-text">{error}</p>
  }

  return (
    <section>
      <h2>Activity Logs</h2>
      <form onSubmit={onSearchSubmit} className="card search-row">
        <label>
          Search activity logs
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by actor, model, object id"
          />
        </label>
        <button type="submit">Search</button>
      </form>
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
      {pagination && (
        <div className="pagination-row">
          <button
            type="button"
            disabled={!pagination.previous}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <button
            type="button"
            disabled={!pagination.next}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}
