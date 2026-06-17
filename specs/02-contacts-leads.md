# Module 02 — Contacts & Leads

## Purpose
Central record of every person the business interacts with. A *lead* is a prospect not yet a customer; a *contact* is a converted or existing customer. Both live in the same table, distinguished by `type`.

## User Stories
- I can create, view, edit, and delete contacts and leads
- I can filter the list to show only leads, only contacts, or all
- I can search by name, email, or company
- I can mark a person as active or inactive
- I can add free-text notes to a contact record

## Data Model — Contact

| Field | Type | Constraints |
|---|---|---|
| id | integer | PK, auto-increment |
| name | string | required |
| email | string | unique (nullable), optional |
| phone | string | optional |
| company | string | optional |
| type | enum | `lead` \| `contact`; default `lead` |
| status | enum | `active` \| `inactive`; default `active` |
| notes | text | optional |
| created_at | datetime | server default = now() |

## API Endpoints

| Method | Path | Auth | Query Params | Description |
|---|---|---|---|---|
| GET | /contacts/ | Yes | `?type=`, `?status=`, `?q=` | List contacts; `q` searches name, email, company (case-insensitive) |
| POST | /contacts/ | Yes | — | Create contact |
| GET | /contacts/{id} | Yes | — | Get one contact |
| PUT | /contacts/{id} | Yes | — | Update contact (partial — only provided fields updated) |
| DELETE | /contacts/{id} | Yes | — | Delete → 204 No Content |

## Validation Rules
- `name` required; 400 if missing
- `email` must be unique across all contacts if provided; 400 on duplicate
- `type` must be `lead` or `contact`; 422 if invalid
- `status` must be `active` or `inactive`; 422 if invalid
- DELETE on a contact that is referenced by deals/contracts/tickets → FK sets those `contact_id` to NULL (SET NULL on delete)

## Frontend
- Page: "Contacts & Leads"
- Filter tabs: All / Leads / Contacts
- Search bar (filters by name, email, company)
- Table columns: Name, Email, Company, Type (badge), Status (badge), Actions
- Actions: Edit (modal), Delete (confirm dialog)
- Modal form fields: Name, Email, Phone, Company, Type (select), Status (select), Notes (textarea)
