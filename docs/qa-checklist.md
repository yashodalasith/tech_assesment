# QA Checklist

## Backend
- Run migrations successfully.
- JWT token obtain and refresh endpoints function.
- Tenant isolation validated with at least two organizations.
- RBAC behavior validated for Admin, Manager, Staff.
- Soft delete works and hidden from list results.
- Activity logs created for create/update/delete actions.
- S3 upload works when AWS env values are set.

## Frontend
- Login flow persists session token.
- Protected routes redirect unauthenticated users to login.
- Companies page supports create + search + pagination.
- Company detail supports contact create + search + pagination.
- Activity log page supports search + pagination.
- Error states are displayed when API calls fail.

## End-to-End Demo Path
- Login.
- Create company.
- Add contact.
- Update record.
- Delete as Admin and show activity log output.
- Show tenant isolation by switching to another org user.
