import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams } from 'react-router-dom'

import { api } from '../api/client'
import type { ApiListResponse, Company, Contact, PaginationMeta } from '../types/api'

export function CompanyDetailPage() {
  const { id } = useParams()
  const [company, setCompany] = useState<Company | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [error, setError] = useState('')

  const fetchData = async (targetPage = page, targetSearch = search) => {
    try {
      const [companyResponse, contactsResponse] = await Promise.all([
        api.get(`/companies/${id}/`),
        api.get<ApiListResponse<Contact>>('/contacts/', {
          params: {
            company: id,
            page: targetPage,
            search: targetSearch || undefined,
          },
        }),
      ])
      setCompany(companyResponse.data.data)
      setContacts(contactsResponse.data.data)
      setPagination(contactsResponse.data.pagination ?? null)
    } catch {
      setError('Failed to load company details.')
    }
  }

  useEffect(() => {
    fetchData(1, '')
  }, [id])

  const createContact = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    try {
      await api.post('/contacts/', {
        company: Number(id),
        full_name: fullName,
        email,
        phone,
        role,
      })
      setFullName('')
      setEmail('')
      setPhone('')
      setRole('')
      fetchData(page, search)
    } catch {
      setError('Failed to create contact. Check values and permissions.')
    }
  }

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault()
    setPage(1)
    fetchData(1, search)
  }

  const goToPage = (targetPage: number) => {
    setPage(targetPage)
    fetchData(targetPage, search)
  }

  if (!company) {
    return <p>Loading company...</p>
  }

  return (
    <section>
      <h2>{company.name}</h2>
      <p>
        {company.industry || 'No industry'} | {company.country || 'No country'}
      </p>

      <form onSubmit={createContact} className="card inline-form">
        <label>
          Full name
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Phone
          <input value={phone} onChange={(event) => setPhone(event.target.value)} />
        </label>
        <label>
          Role
          <input value={role} onChange={(event) => setRole(event.target.value)} />
        </label>
        <button type="submit">Add Contact</button>
      </form>

      <form onSubmit={onSearchSubmit} className="card search-row">
        <label>
          Search contacts
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, role"
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
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.full_name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone || '-'}</td>
                <td>{contact.role || '-'}</td>
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
