import { useEffect, useState } from 'react'

import { api } from '../api/client'

type DashboardData = {
  organization: {
    id: number
    name: string
    subscription_plan: string
  }
  counts: {
    companies: number
    contacts: number
    activities: number
  }
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/accounts/dashboard/')
        setData(response.data.data)
      } catch {
        setError('Unable to load dashboard data.')
      }
    }

    fetchDashboard()
  }, [])

  if (error) {
    return <p className="error-text">{error}</p>
  }

  if (!data) {
    return <p>Loading dashboard...</p>
  }

  return (
    <section>
      <h2>{data.organization.name}</h2>
      <p>Plan: {data.organization.subscription_plan}</p>
      <div className="stats-grid">
        <article className="card">
          <h3>Companies</h3>
          <p>{data.counts.companies}</p>
        </article>
        <article className="card">
          <h3>Contacts</h3>
          <p>{data.counts.contacts}</p>
        </article>
        <article className="card">
          <h3>Activity Logs</h3>
          <p>{data.counts.activities}</p>
        </article>
      </div>
    </section>
  )
}
