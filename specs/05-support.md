# Module 05 — Customer Support

## Purpose
Log and resolve customer issues and requests post-sale. Track each ticket by priority and status, and record when it was resolved.

## User Stories
- I can open a support ticket and link it to a contact
- I can set ticket priority when creating it
- I can update the status as I work through the ticket
- I can filter tickets by status and priority
- I can see when a ticket was resolved

## Data Model — Ticket

| Field | Type | Constraints |
|---|---|---|
| id | integer | PK, auto-increment |
| title | string | required |
| description | text | optional |
| status | enum | `open` \| `in_progress` \| `resolved` \| `closed`; default `open` |
| priority | enum | `low` \| `medium` \| `high` \| `urgent`; default `medium` |
| contact_id | integer FK → contacts | nullable, SET NULL on contact delete |
| resolved_at | datetime | nullable; set automatically when status changes to `resolved` or `closed` |
| created_at | datetime | server default = now() |

## API Endpoints

| Method | Path | Auth | Query Params | Description |
|---|---|---|---|---|
| GET | /support/ | Yes | `?status=`, `?priority=`, `?contact_id=` | List tickets |
| POST | /support/ | Yes | — | Create ticket |
| GET | /support/{id} | Yes | — | Get one ticket |
| PUT | /support/{id} | Yes | — | Update ticket; auto-sets `resolved_at` on first transition to `resolved` or `closed` |
| DELETE | /support/{id} | Yes | — | Delete → 204 No Content |

## Validation Rules
- `title` required; 400 if missing
- `status` must be one of the defined enum values; 422 if invalid
- `priority` must be one of the defined enum values; 422 if invalid
- `resolved_at` is set by the server on status change to `resolved` or `closed`; never accepted from the client

## Frontend
- Page: "Customer Support"
- Filter bar: Status (All / Open / In Progress / Resolved / Closed) and Priority (All / Low / Medium / High / Urgent)
- Table columns: Title, Contact, Status (badge), Priority (badge), Created, Resolved At, Actions
- Actions: Edit (modal), Delete (confirm dialog)
- Modal form fields: Title, Description (textarea), Status (select), Priority (select), Contact (select)
- `resolved_at` displayed as read-only in the table; not editable in the form
