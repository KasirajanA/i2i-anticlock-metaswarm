# CRM MVP

A web-based CRM for tracking prospects, deals, contracts, support tickets, and business performance.

## Stack

| Layer | Tech |
|---|---|
| Backend | Python 3.9+ · FastAPI · SQLAlchemy · SQLite |
| Frontend | React 18 · Vite · Axios · React Router |
| Auth | JWT (python-jose) · bcrypt |

## Features

- **Contacts & Leads** — track people, filter by type, search by name/email/company
- **Sales Pipeline** — kanban board across 6 stages with deal value totals
- **Contract Management** — track agreements with status lifecycle and date ranges
- **Customer Support** — ticket queue with priority, status filters, and auto-resolved timestamp
- **Dashboard** — live summary counts, pipeline value by stage, contract value by status
- **Auth** — JWT-based register/login; all routes protected

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+

### 1. Set up the Python environment

Using a virtual environment (recommended):

```bash
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r crm/backend/requirements.txt
```

Or with conda:

```bash
conda create -n crm python=3.11 -y
conda activate crm
pip install -r crm/backend/requirements.txt
```

### 2. Set the secret key

```bash
export SECRET_KEY="your-secret-key-here"
```

### 3. Start the backend

```bash
cd crm/backend
uvicorn main:app --reload
# API       → http://localhost:8000
# Swagger   → http://localhost:8000/docs
```

### 4. Start the frontend

```bash
cd crm/frontend
npm install
npm run dev
# App → http://localhost:5173
```

### 5. Register an account

Open `http://localhost:5173`, click **No account? Register**, and create your user (password min 8 characters).

## Project Structure

```
crm/
├── backend/
│   ├── main.py          # app entry, CORS, router mounts
│   ├── database.py      # SQLAlchemy engine + session
│   ├── auth/            # register, login, JWT, /me
│   ├── contacts/        # contacts + leads CRUD with search/filter
│   ├── pipeline/        # deals + stages CRUD
│   ├── contracts/       # contracts CRUD
│   ├── support/         # tickets CRUD with resolved_at tracking
│   └── reporting/       # summary, pipeline stats, contract stats
└── frontend/
    └── src/
        ├── api/         # Axios client with JWT interceptor
        ├── context/     # AuthContext
        └── pages/       # Login, Dashboard, Contacts, Pipeline, Contracts, Support
specs/                   # Module specifications (source of truth)
```

## API Overview

| Module | Base path |
|---|---|
| Auth | `/auth` |
| Contacts | `/contacts` |
| Pipeline | `/pipeline` |
| Contracts | `/contracts` |
| Support | `/support` |
| Reporting | `/reporting` |

Full interactive docs at `http://localhost:8000/docs` when the backend is running.

## Specs

Detailed module specifications live in [`specs/`](specs/README.md). Each spec covers the data model, API endpoints, validation rules, and frontend requirements.

## Running Tests

```bash
cd crm/backend
pytest --cov=. --cov-report=term-missing --cov-fail-under=80
```
