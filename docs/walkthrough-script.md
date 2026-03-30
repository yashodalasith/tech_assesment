# 15-20 Minute Demo Walkthrough Script

## 1. Intro (1-2 min)
- Problem: multi-tenant CRM with strict isolation and RBAC.
- Stack: Django DRF + React + PostgreSQL-ready config + JWT + S3-ready upload.
- Goal: production mindset with clean architecture.

## 2. Architecture Overview (2-3 min)
- Show model relationships: Organization -> Users/Companies/Contacts/ActivityLogs.
- Explain tenant isolation layers: FK ownership, queryset scoping, serializer validation.
- Explain RBAC policy matrix (Admin/Manager/Staff).

## 3. Authentication Flow (2-3 min)
- Show token endpoint and login in UI.
- Show protected routes in frontend.
- Show token refresh behavior in API client.

## 4. CRUD + Multi-Tenant Proof (4-5 min)
- Login as Org A admin and create company/contact.
- Show search + pagination on list screens.
- Login as Org B user and prove Org A records are not visible.
- Explain why backend scoping prevents cross-tenant leaks.

## 5. RBAC Proof (2-3 min)
- Show Manager denied delete.
- Show Staff limited to contact writes.
- Show Admin can delete and operation becomes soft delete.

## 6. Activity Logging (2 min)
- Perform create/update/delete actions.
- Open Activity Logs page and show generated entries.
- Explain immutable audit trail value.

## 7. Security + Ops (2 min)
- Show env-driven secrets and .env.example files.
- Explain S3 secure setup (least-privilege IAM, signed URL strategy).
- Show Docker compose and CI workflow overview.

## 8. Closing (1 min)
- Summarize test coverage and quality gates.
- Mention future improvements: refresh token rotation, rate limiting, richer metrics.
