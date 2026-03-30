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

Frontend runs on `http://127.0.0.1:5173` and backend API on `http://127.0.0.1:8000/api/v1`.

## Docker

Run `docker compose up --build` from repository root.

With this repo's current Docker port mapping, frontend runs on `http://127.0.0.1:5173` and backend API on `http://127.0.0.1:8001/api/v1`.
For external DB tools (pgAdmin/DBeaver), connect to Postgres at `127.0.0.1:5433`.

## Create a Login User

There is no public "create account" page in the frontend. Create a user from Django shell.

### Option A: Docker Run

1. Apply migrations:
   - `docker compose exec backend python manage.py migrate`
2. Create an organization + admin user:
   - `docker compose exec backend python manage.py shell -c "from accounts.models import Organization,User; org,_=Organization.objects.get_or_create(name='Demo Org', defaults={'subscription_plan':'BASIC'}); u,created=User.objects.get_or_create(username='demo_admin', defaults={'organization':org,'role':'ADMIN','email':'demo@example.com'}); u.organization=org; u.role='ADMIN'; u.is_staff=True; u.is_superuser=True; u.set_password('DemoPass123!'); u.save(); print('created' if created else 'updated')"`

### Option B: Local Run (non-Docker)

1. `cd backend`
2. `python manage.py migrate`
3. `python manage.py shell -c "from accounts.models import Organization,User; org,_=Organization.objects.get_or_create(name='Demo Org', defaults={'subscription_plan':'BASIC'}); u,created=User.objects.get_or_create(username='demo_admin', defaults={'organization':org,'role':'ADMIN','email':'demo@example.com'}); u.organization=org; u.role='ADMIN'; u.is_staff=True; u.is_superuser=True; u.set_password('DemoPass123!'); u.save(); print('created' if created else 'updated')"`

Login credentials:

- Username: `demo_admin`
- Password: `DemoPass123!`

You can change these values later by re-running the same command with your preferred username/password.

## Inspect Docker DB Data

Use these commands from repository root to inspect Postgres data running in Docker.

```bash
# list tables
docker compose exec db psql -U crm_user -d crm_db -c "\dt"

# view users
docker compose exec db psql -U crm_user -d crm_db -c "SELECT id, username, role, organization_id FROM accounts_user ORDER BY id;"

# view organizations
docker compose exec db psql -U crm_user -d crm_db -c "SELECT id, name, subscription_plan FROM accounts_organization ORDER BY id;"

# view companies
docker compose exec db psql -U crm_user -d crm_db -c "SELECT id, name, organization_id, is_deleted FROM crm_company ORDER BY id;"
```
