# Module 03 — Sales Pipeline

## Purpose
Track deals from first contact through to close. Visualise the funnel and the total value sitting at each stage.

## User Stories
- I can create a deal and link it to a contact
- I can see all deals as a kanban board grouped by stage
- I can move a deal to a different stage by editing it
- I can see the deal count and total value per stage
- I can set an expected close date on a deal
- I can add notes to a deal

## Data Model — Deal

| Field | Type | Constraints |
|---|---|---|
| id | integer | PK, auto-increment |
| title | string | required |
| value | float | default 0.0 |
| stage | enum | `lead` \| `qualified` \| `proposal` \| `negotiation` \| `won` \| `lost`; default `lead` |
| contact_id | integer FK → contacts | nullable, SET NULL on contact delete |
| expected_close_date | date | optional |
| notes | text | optional |
| created_at | datetime | server default = now() |

## API Endpoints

| Method | Path | Auth | Query Params | Description |
|---|---|---|---|---|
| GET | /pipeline/ | Yes | `?stage=`, `?contact_id=` | List deals |
| POST | /pipeline/ | Yes | — | Create deal |
| GET | /pipeline/{id} | Yes | — | Get one deal |
| PUT | /pipeline/{id} | Yes | — | Update deal (partial) |
| DELETE | /pipeline/{id} | Yes | — | Delete → 204 No Content |

## Validation Rules
- `title` required; 400 if missing
- `stage` must be one of the defined enum values; 422 if invalid
- `value` must be ≥ 0
- `contact_id` must reference an existing contact if provided; 404 if not found

## Frontend
- Page: "Sales Pipeline"
- Kanban board: one column per stage in order (lead → qualified → proposal → negotiation → won → lost)
- Each column header shows: stage name, deal count, total value (e.g. "3 deals · $45,000")
- Deal card shows: title, value, linked contact name (if set)
- Click card → opens edit modal
- "Add Deal" button → opens create modal
- Modal form fields: Title, Value ($), Stage (select), Contact (select from contacts list), Expected Close Date (date picker), Notes (textarea)
