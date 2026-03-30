import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client";
import type { ApiListResponse, Company, PaginationMeta } from "../types/api";

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editIndustry, setEditIndustry] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [error, setError] = useState("");

  const fetchCompanies = async (targetPage = page, targetSearch = search) => {
    try {
      const response = await api.get<ApiListResponse<Company>>("/companies/", {
        params: {
          page: targetPage,
          search: targetSearch || undefined,
        },
      });
      setCompanies(response.data.data);
      setPagination(response.data.pagination ?? null);
    } catch {
      setError("Unable to fetch companies.");
    }
  };

  useEffect(() => {
    fetchCompanies(1, "");
  }, []);

  const createCompany = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/companies/", {
        name,
        industry,
        country,
      });
      setName("");
      setIndustry("");
      setCountry("");
      fetchCompanies(page, search);
    } catch {
      setError("Failed to create company. Check role permissions.");
    }
  };

  const startEditCompany = (company: Company) => {
    setEditCompanyId(company.id);
    setEditName(company.name);
    setEditIndustry(company.industry || "");
    setEditCountry(company.country || "");
    setError("");
  };

  const cancelEditCompany = () => {
    setEditCompanyId(null);
    setEditName("");
    setEditIndustry("");
    setEditCountry("");
  };

  const updateCompany = async (companyId: number) => {
    setError("");

    try {
      await api.patch(`/companies/${companyId}/`, {
        name: editName,
        industry: editIndustry,
        country: editCountry,
      });
      cancelEditCompany();
      fetchCompanies(page, search);
    } catch {
      setError("Failed to update company. Check role permissions.");
    }
  };

  const deleteCompany = async (companyId: number) => {
    const confirmed = window.confirm(
      "Delete this company? This performs a soft delete.",
    );
    if (!confirmed) {
      return;
    }

    setError("");
    try {
      await api.delete(`/companies/${companyId}/`);
      fetchCompanies(page, search);
    } catch {
      setError("Failed to delete company. Check role permissions.");
    }
  };

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    fetchCompanies(1, search);
  };

  const goToPage = (targetPage: number) => {
    setPage(targetPage);
    fetchCompanies(targetPage, search);
  };

  return (
    <section>
      <h2>Companies</h2>
      <form onSubmit={createCompany} className="card inline-form">
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label>
          Industry
          <input
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
          />
        </label>
        <label>
          Country
          <input
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          />
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>
                  {editCompanyId === company.id ? (
                    <input
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                    />
                  ) : (
                    company.name
                  )}
                </td>
                <td>
                  {editCompanyId === company.id ? (
                    <input
                      value={editIndustry}
                      onChange={(event) => setEditIndustry(event.target.value)}
                    />
                  ) : (
                    company.industry || "-"
                  )}
                </td>
                <td>
                  {editCompanyId === company.id ? (
                    <input
                      value={editCountry}
                      onChange={(event) => setEditCountry(event.target.value)}
                    />
                  ) : (
                    company.country || "-"
                  )}
                </td>
                <td>
                  <Link to={`/companies/${company.id}`}>View</Link>
                </td>
                <td>
                  {editCompanyId === company.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => updateCompany(company.id)}
                      >
                        Save
                      </button>
                      <button type="button" onClick={cancelEditCompany}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEditCompany(company)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCompany(company.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
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
  );
}
