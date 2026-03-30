# Architecture Notes

## Core Approach
- Multi-tenant shared database model with strict organization foreign keys.
- Query-level tenant isolation in all CRM and activity endpoints.
- JWT authentication for all protected API routes.
- RBAC enforced on backend permissions as source of truth.

## Tenant Isolation Layers
- Data model: each relevant row includes organization reference.
- Query layer: viewsets filter by authenticated user organization.
- Validation layer: contact creation validates company organization ownership.
- Permission layer: endpoint writes constrained by role and model.

## Role Rules
- Admin: full CRUD including deletes.
- Manager: create/update allowed, no delete.
- Staff: read access + limited write for contacts only.

## Activity Auditing
- CREATE/UPDATE/DELETE actions generate immutable activity log entries.
- Logs include actor, action, model, object id, timestamp, and organization.
- Logs are query-scoped by organization.

## Storage and Security
- S3 integration enabled via environment variables only.
- No credentials in source code.
- Local development falls back to local media storage when no S3 bucket set.
- Recommended production strategy: private bucket + signed URLs.

## API Design
- Versioned routes: /api/v1/.
- Swagger schema via drf-spectacular.
- Standardized JSON response format.
- Centralized exception formatting.
- Pagination, search, and filtering on list endpoints.
