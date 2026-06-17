# Module 06 — Reporting / Dashboard

## Purpose
Give the user a business health snapshot at a glance: key counts across all modules, pipeline value by stage, and contract value by status.

## User Stories
- I can see a summary of totals across all modules on the dashboard
- I can see deal count and total value per pipeline stage
- I can see contract count and total value per status

## API Endpoints

### GET /reporting/summary
Returns key counts across the system.

**Response**
```json
{
  "contacts": 42,
  "leads": 18,
  "open_deals": 7,
  "active_contracts": 5,
  "open_tickets": 12
}
```

- `open_deals` = deals where stage is not `won` or `lost`
- `open_tickets` = tickets where status is not `resolved` or `closed`

---

### GET /reporting/pipeline
Returns deal count and total value per stage.

**Response**
```json
{
  "lead":        { "count": 3, "total_value": 15000 },
  "qualified":   { "count": 2, "total_value": 30000 },
  "proposal":    { "count": 1, "total_value": 12000 },
  "negotiation": { "count": 1, "total_value": 8000  },
  "won":         { "count": 4, "total_value": 95000 },
  "lost":        { "count": 2, "total_value": 20000 }
}
```

---

### GET /reporting/contracts
Returns contract count and total value per status.

**Response**
```json
{
  "draft":     { "count": 2, "total_value": 5000  },
  "active":    { "count": 5, "total_value": 120000 },
  "expired":   { "count": 3, "total_value": 45000 },
  "cancelled": { "count": 1, "total_value": 8000  }
}
```

## Frontend — Dashboard Page

**Layout (top to bottom):**

1. **Summary cards row** — one card each for: Contacts, Leads, Open Deals, Active Contracts, Open Tickets
2. **Pipeline breakdown** — grid showing each stage with deal count + total value
3. **Contract value breakdown** — grid showing each status with contract count + total value

No charting library required for MVP — display as labelled number grids.
