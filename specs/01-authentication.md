# Module 01 — Authentication

## Purpose
Secure all CRM data. Only authenticated users can access any resource.

## User Stories
- I can register with my email and password
- I can log in and receive a session token
- I can see who I am currently logged in as
- I am automatically redirected to login when my session expires

## Data Model — User

| Field | Type | Constraints |
|---|---|---|
| id | integer | PK, auto-increment |
| email | string | unique, required |
| hashed_password | string | bcrypt, required |
| created_at | datetime | server default = now() |

## API Endpoints

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | /auth/register | No | `{email, password}` | `{access_token, token_type}` |
| POST | /auth/login | No | form: `{username, password}` | `{access_token, token_type}` |
| GET | /auth/me | Yes | — | `{id, email, created_at}` |

## Validation Rules
- `email` must be a valid email format
- `password` minimum 8 characters
- Duplicate email on register → 400 Bad Request
- Invalid credentials on login → 401 Unauthorized
- Token format: JWT, signed with `SECRET_KEY` from environment variable
- Token TTL: 24 hours (configurable via env)

## Frontend
- Login page with email/password form and a register toggle
- On successful login → redirect to dashboard
- On 401 from any API call → redirect to `/login` using React Router (not `window.location.href`)
- JWT stored in `localStorage`; sent as `Authorization: Bearer <token>` on every request
