# Associate Full Stack Technical Assessment

Production-ready multi-tenant CRM using Django REST Framework, React, PostgreSQL, JWT, and AWS S3.

## Structure

- backend/: Django + DRF API
- frontend/: React app
- docs/: documentation and local progress artifacts

## Implemented Features

- Multi-tenant organization-scoped Company and Contact modules
- Role-based access control for Admin, Manager, and Staff
- JWT authentication and protected API routes
- Activity logs for CREATE/UPDATE/DELETE operations
- Pagination, search, filtering, and soft delete support
- S3-ready logo upload configuration via environment variables
- React pages: Login, Dashboard, Companies, Company Detail, Activity Logs

## Quick Start

1. Copy backend/.env.example to backend/.env and adjust values.
2. Copy frontend/.env.example to frontend/.env.
3. Backend:
4. `cd backend`
5. `python manage.py migrate`
6. `python manage.py runserver`
7. Frontend:
8. `cd frontend`
9. `npm install`
10. `npm run dev`

## Docker

Run `docker compose up --build` from repository root.
