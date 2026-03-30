# Git Workflow

## Branching Strategy

- main: protected release-ready branch
- develop: integration branch for approved feature work
- feature/\*: scoped implementation branches
- release/\*: final QA and submission prep

## Current Execution Branches

- Initialized repository with main
- Created develop from main
- Merged feature/bootstrap-foundation into develop
- Merged feature/backend-tenancy-rbac into develop
- Merged feature/tests-hardening into develop
- Active branch: release/assessment-v1

## PR Checklist

- Tenant isolation preserved (no cross-organization query leaks)
- RBAC enforced in backend permissions
- JWT enforced on protected endpoints
- Activity logs generated for create/update/delete
- No secrets committed
- Status tracker updated after implemented chunk
