import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { api } from '../api/client'
import type { ApiListResponse, Company, PaginationMeta } from '../types/api'

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [country, setCountry] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [error, setError] = useState('')

  const fetchCompanies = async (targetPage = page, targetSearch = search) => {
    try {
      const response = await api.get<ApiListResponse<Company>>('/companies/', {
        params: {
          page: targetPage,
          search: targetSearch || undefined,
        },
      })
      setCompanies(response.data.data)
      setPagination(response.data.pagination ?? null)
    } catch {
      setError('Unable to fetch companies.')
    }
  }

  useEffect(() => {
    fetchCompanies(1, '')
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
      fetchCompanies(page, search)
    } catch {
      setError('Failed to create company. Check role permissions.')
    }
  }

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault()
    setPage(1)
    fetchCompanies(1, search)
  }

  const goToPage = (targetPage: number) => {
    setPage(targetPage)
    fetchCompanies(targetPage, search)
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
      <form onSubmit={onSearchSubmit} className="card search-row">
        <label>
          Search companies
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, industry, country"
          />
        </label>
        <button type="submit">Search</button>
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
