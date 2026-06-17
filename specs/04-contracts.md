# Module 04 — Contract Management

## Purpose
Track signed agreements with clients — their value, lifecycle status, and duration. Contracts can be linked to a contact record.

## User Stories
- I can create a contract and link it to a contact
- I can set contract value, start date, and end date
- I can update contract status as it moves through its lifecycle
- I can filter contracts by status to see what is active, expiring, or in draft
- I can add notes to a contract

## Data Model — Contract

| Field | Type | Constraints |
|---|---|---|
| id | integer | PK, auto-increment |
| title | string | required |
| client_name | string | optional (denormalised for quick display) |
| contact_id | integer FK → contacts | nullable, SET NULL on contact delete |
| value | float | default 0.0 |
| status | enum | `draft` \| `active` \| `expired` \| `cancelled`; default `draft` |
| start_date | date | optional |
| end_date | date | optional |
| notes | text | optional |
| created_at | datetime | server default = now() |

## API Endpoints

| Method | Path | Auth | Query Params | Description |
|---|---|---|---|---|
| GET | /contracts/ | Yes | `?status=` | List contracts |
| POST | /contracts/ | Yes | — | Create contract |
| GET | /contracts/{id} | Yes | — | Get one contract |
| PUT | /contracts/{id} | Yes | — | Update contract (partial) |
| DELETE | /contracts/{id} | Yes | — | Delete → 204 No Content |

## Validation Rules
- `title` required; 400 if missing
- `status` must be one of the defined enum values; 422 if invalid
- `value` must be ≥ 0
- `end_date` should be after `start_date` if both are provided (warn or reject)
- `contact_id` must reference an existing contact if provided

## Frontend
- Page: "Contracts"
- Filter tabs: All / Draft / Active / Expired / Cancelled
- Table columns: Title, Client Name, Value, Status (badge), Start Date, End Date, Actions
- Actions: Edit (modal), Delete (confirm dialog)
- Modal form fields: Title, Client Name, Contact (select), Value ($), Status (select), Start Date (date picker), End Date (date picker), Notes (textarea)
