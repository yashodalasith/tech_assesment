import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { api } from '../api/client'
import type { Company } from '../types/api'

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [country, setCountry] = useState('')
  const [error, setError] = useState('')

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies/')
      setCompanies(response.data.data)
    } catch {
      setError('Unable to fetch companies.')
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const createCompany = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    try {
      await api.post('/companies/', {
        name,
        industry,
        country,
      })
      setName('')
      setIndustry('')
      setCountry('')
      fetchCompanies()
    } catch {
      setError('Failed to create company. Check role permissions.')
    }
  }

  return (
    <section>
      <h2>Companies</h2>
      <form onSubmit={createCompany} className="card inline-form">
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Industry
          <input value={industry} onChange={(event) => setIndustry(event.target.value)} />
        </label>
        <label>
          Country
          <input value={country} onChange={(event) => setCountry(event.target.value)} />
        </label>
        <button type="submit">Create Company</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th>Country</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.industry || '-'}</td>
                <td>{company.country || '-'}</td>
                <td>
                  <Link to={`/companies/${company.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
