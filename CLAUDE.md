# CRM Project — Claude Code Guide

## Project
CRM MVP with contract management, sales pipeline, customer support, contact/lead management, and reporting.

- **Repo:** KasirajanA/i2i-anticlock-metaswarm
- **Task tracking:** GitHub Project #1 — https://github.com/users/KasirajanA/projects/1/views/1
- **Issues:** https://github.com/KasirajanA/i2i-anticlock-metaswarm/issues

## Stack
| Layer | Tech |
|---|---|
| Backend | Python 3.14 · FastAPI · SQLAlchemy · SQLite |
| Frontend | React 18 · Vite · Axios · React Router |
| Auth | JWT (python-jose) · bcrypt |
| Conda env | `anticlock` |

## Structure
```
crm/
├── backend/
│   ├── main.py          # app entry, CORS, router mounts
│   ├── database.py      # SQLAlchemy engine + session
│   ├── auth/            # register, login, JWT
│   ├── contacts/        # contacts + leads CRUD
│   ├── pipeline/        # deals + stages CRUD
│   ├── contracts/       # contracts CRUD
│   ├── support/         # tickets CRUD
│   └── reporting/       # summary + pipeline stats
└── frontend/
    └── src/
        ├── api/         # Axios client with JWT interceptor
        ├── context/     # AuthContext
        └── pages/       # Login, Dashboard, Contacts, Pipeline, Contracts, Support
```

## Run Commands

### Backend
```bash
conda activate anticlock
cd crm/backend
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### Frontend
```bash
cd crm/frontend
npm run dev
# → http://localhost:5173
```

### Run tests
```bash
conda activate anticlock
cd crm/backend
pytest --cov=. --cov-report=term-missing --cov-fail-under=80
```

### Build check
```bash
cd crm/frontend && npm run build
```

## Coding Rules

- **NEVER** commit a hardcoded `SECRET_KEY` — must be loaded from `os.environ`
- **ALWAYS** call `db.refresh(obj)` after `db.commit()` before accessing ORM attributes
- **ALWAYS** add `allow_credentials=True` to CORSMiddleware when using JWT Bearer auth
- **NEVER** use `payload["sub"]` — use `payload.get("sub")` to avoid KeyError 500
- **ALWAYS** wrap frontend async API calls in try/catch with user-visible error state
- **NEVER** use `window.location.href` for navigation inside React — use React Router `navigate`
- SQLite FK enforcement requires `PRAGMA foreign_keys=ON` via SQLAlchemy event listener
- Password validation minimum 8 characters enforced in Pydantic schema

## Module Patterns

### Adding a new backend module
1. Create `crm/backend/<module>/` with `__init__.py`, `models.py`, `schemas.py`, `router.py`
2. Model: inherit from `Base`, use `server_default=func.now()` for timestamps
3. Schemas: separate `Create`, `Update` (all fields Optional), `Out` (with `model_config = {"from_attributes": True}`)
4. Router: protect all routes with `_=Depends(get_current_user)`
5. Register in `main.py`: `app.include_router(router, prefix="/module", tags=["module"])`

### CRUD pattern
- List: `db.query(Model).all()` — add pagination when row count may be large
- Create: `Model(**data.model_dump())` → `db.add` → `db.commit` → `db.refresh` → return
- Update: get-or-404 → `setattr` loop with `model_dump(exclude_none=True)` → `db.commit` → `db.refresh`
- Delete: get-or-404 → `db.delete` → `db.commit` → 204

## Task Tracking
- All work tracked via GitHub Issues + Project board
- Use `gh issue create --repo KasirajanA/i2i-anticlock-metaswarm` for new tasks
- Close issues with `gh issue close <n> --repo KasirajanA/i2i-anticlock-metaswarm`
- Always add implementation comments before closing
- **Do NOT use the built-in TaskCreate/TaskUpdate tools** — GitHub project is the source of truth
