# CRM MVP — Specifications

Single-tenant CRM for tracking prospects, deals, contracts, support tickets, and business performance.

**Stack:** FastAPI · SQLite · React 18 · Vite

**Scope constraints (MVP):** single-user auth, no file attachments, no email integration, no calendar sync, no pagination required until row counts grow.

## Modules

| # | Module | Spec |
|---|--------|------|
| 01 | Authentication | [01-authentication.md](01-authentication.md) |
| 02 | Contacts & Leads | [02-contacts-leads.md](02-contacts-leads.md) |
| 03 | Sales Pipeline | [03-sales-pipeline.md](03-sales-pipeline.md) |
| 04 | Contract Management | [04-contracts.md](04-contracts.md) |
| 05 | Customer Support | [05-support.md](05-support.md) |
| 06 | Reporting / Dashboard | [06-reporting.md](06-reporting.md) |

## Cross-module rules

- Every non-auth route requires a valid JWT Bearer token → 401 if missing or expired
- All enum fields validated server-side → 422 if an invalid value is passed
- `email` on Contact must be unique → 400 on duplicate
- SQLite FK enforcement enabled via `PRAGMA foreign_keys=ON` per connection
- All list endpoints support the query params defined in each module spec
- Pagination is out of scope for MVP
