# Git Workflow

## Branching Strategy
- main: protected release-ready branch
- develop: integration branch for approved feature work
- feature/*: scoped implementation branches
- release/*: final QA and submission prep

## Current Execution Branches
- Initialized repository with main
- Created develop from main
- Active branch: feature/bootstrap-foundation

## Commit Rules
- Make small, meaningful commits by feature scope.
- Follow commit prefixes: chore, feat, fix, test, docs.
- Every commit should pass local checks relevant to changed scope.

## PR Checklist
- Tenant isolation preserved (no cross-organization query leaks)
- RBAC enforced in backend permissions
- JWT enforced on protected endpoints
- Activity logs generated for create/update/delete
- No secrets committed
- Status tracker updated after implemented chunk
