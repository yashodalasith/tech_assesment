import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams } from 'react-router-dom'

import { api } from '../api/client'
import type { Company, Contact } from '../types/api'

export function CompanyDetailPage() {
  const { id } = useParams()
  const [company, setCompany] = useState<Company | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [companyResponse, contactsResponse] = await Promise.all([
        api.get(`/companies/${id}/`),
        api.get(`/contacts/?company=${id}`),
      ])
      setCompany(companyResponse.data.data)
      setContacts(contactsResponse.data.data)
    } catch {
      setError('Failed to load company details.')
    }
  }

  useEffect(() => {
    fetchData()
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
      fetchData()
    } catch {
      setError('Failed to create contact. Check values and permissions.')
    }
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
    </section>
  )
}
