# Local Runbook

## 1. Backend
- Create backend/.env from backend/.env.example.
- Install dependencies from backend/requirements.txt.
- Run migrations.
- Start Django server on port 8000.

## 2. Frontend
- Create frontend/.env from frontend/.env.example.
- Install frontend dependencies.
- Start Vite dev server on port 5173.

## 3. Docker Option
- Ensure backend/.env and frontend/.env exist.
- Run docker compose up --build.
- Backend: http://127.0.0.1:8000
- Frontend: http://127.0.0.1:5173

## 4. Useful API Paths
- JWT token: /api/v1/auth/token/
- JWT refresh: /api/v1/auth/token/refresh/
- Swagger: /api/v1/docs/
- Dashboard: /api/v1/accounts/dashboard/
- Companies: /api/v1/companies/
- Contacts: /api/v1/contacts/
- Activity logs: /api/v1/activities/
