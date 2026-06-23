# E-Katalog

A production-grade **product catalog management system**: a public storefront for
browsing published products and submitting inquiries, plus a private, role-based
**admin console** for managing categories, products (images + variants), inquiries,
company settings, and audit logs.

- **Backend:** Go 1.26 · Gin · clean layered architecture (handler → service → repository)
  behind a `Store` interface with **MongoDB** and **in-memory** drivers.
- **Frontend:** Next.js 16 (App Router) · React 19 · Tailwind v4 · zustand · react-hook-form + zod.
  Neutral **shadcn-style** admin UI; the storefront keeps its editorial theme.

> Full design + execution record lives in [`docs/workflow/`](docs/workflow/) (discovery →
> blueprint → contracts → executable workflow → checklist → final audit).

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Backend | Go 1.26, Gin, go-playground/validator, golang.org/x/crypto (bcrypt) |
| Persistence | MongoDB (`mongo-driver/v2`) **or** in-memory (default for dev) |
| Auth | HMAC-SHA256 signed bearer tokens (stdlib), bcrypt password hashing, RBAC |
| Frontend | Next.js 16.2.9, React 19, Tailwind CSS v4, zustand, RHF + Zod, lucide-react |

## Features

- Authentication (login / me / logout) with `admin` and `super_admin` roles.
- Category CRUD with unique slugs and a delete guard (can't delete a category with products).
- Product CRUD with a `draft → published → archived` status workflow, embedded images & variants.
- Public catalog (published-only), product detail by slug, and an inquiry/contact form.
- Inquiry triage (`new → contacted → closed`, forward-only).
- Company settings (super-admin only) and an audit log of every admin mutation.
- Standard response envelope, centralized errors, pagination, server-side validation, CORS.

---

## Backend setup

```bash
cd backend
cp .env.example .env        # optional; sensible defaults are built in
go mod tidy                 # first run only (downloads dependencies)
go run ./cmd/api            # serves http://localhost:8080
```

By default the API uses the **in-memory store** (seeded with demo data) so it runs with no
database. To use MongoDB, set `MONGODB_URI` (the driver is auto-selected):

```bash
MONGODB_URI="mongodb://localhost:27017" MONGODB_DB="ekatalog" go run ./cmd/api
```

### Backend environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `8080` | HTTP port |
| `GIN_MODE` | `debug` | `debug` / `release` / `test` |
| `CORS_ALLOW_ORIGINS` | `http://localhost:3000,http://localhost:3001` | Allowed origins (CSV) |
| `JWT_SECRET` | `dev-insecure-secret-change-me` | Token signing secret — **set in production** |
| `TOKEN_TTL_HOURS` | `24` | Token lifetime |
| `STORE_DRIVER` | auto | `memory` or `mongo` (auto = `mongo` if `MONGODB_URI` set) |
| `MONGODB_URI` | _empty_ | Mongo connection string |
| `MONGODB_DB` | `ekatalog` | Mongo database name |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | `admin@ekatalog.test` / `admin12345` | Seed admin |
| `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD` | `superadmin@ekatalog.test` / `super12345` | Seed super admin |

### Default seed accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@ekatalog.test` | `admin12345` |
| Super Admin | `superadmin@ekatalog.test` | `super12345` |

---

## Frontend setup

```bash
cd frontend
cp .env.local.example .env.local   # points at the backend API
npm install                        # first run only
npm run dev                        # serves http://localhost:3000
```

### Frontend environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend API base URL |

Then open:
- Storefront: <http://localhost:3000>
- Catalog: <http://localhost:3000/catalog>
- Admin login: <http://localhost:3000/login> → redirects to `/admin`

---

## API overview

Base path: `/api/v1`. Standard envelope: `{ "success": true, "data": …, "meta"? }` or
`{ "success": false, "error": { code, message, details? } }`.

- **Auth:** `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- **Admin dashboard:** `GET /admin/dashboard/stats`
- **Admin categories:** `GET|POST /admin/categories`, `GET|PUT|DELETE /admin/categories/:id`
- **Admin products:** `GET|POST /admin/products`, `GET|PUT|DELETE /admin/products/:id`
- **Images:** `POST /admin/products/:id/images`, `DELETE /admin/products/:id/images/:imageId`
- **Variants:** `POST /admin/products/:id/variants`, `PUT|DELETE /admin/products/:id/variants/:variantId`
- **Inquiries:** `GET /admin/inquiries`, `PATCH /admin/inquiries/:id/status`
- **Settings:** `GET /admin/settings`, `PUT /admin/settings` _(super_admin)_
- **Audit logs:** `GET /admin/audit-logs`
- **Public:** `GET /public/categories`, `GET /public/products`, `GET /public/products/:slug`, `POST /public/inquiries`

Full request/response contract: [`docs/workflow/02-backend-contract.md`](docs/workflow/02-backend-contract.md).

---

## Development & build commands

```bash
# Backend
cd backend
go fmt ./... && go vet ./... && go test ./...
go build ./...
go run ./cmd/api

# Frontend
cd frontend
npm run lint
npm run build
npm run dev
```

## Folder structure

```
backend/
  cmd/api/                 # entrypoint
  internal/
    config/ server/ middleware/ domain/
    store/{memory,mongo}/  # Store implementations + seed
    module/{auth,category,product,inquiry,setting,auditlog,dashboard,publicapi}/
    pkg/{response,apperror,pagination,security,slugger,validate,id}/
frontend/
  src/app/                 # storefront + /login + /admin/** + /catalog/**
  src/components/{ui,admin,contact,...}
  src/features/{auth,categories,products,inquiries,settings,dashboard,audit,public}/
  src/lib/                 # api-client, auth, validations, format, admin-types
  src/proxy.ts             # admin route guard (Next 16 middleware)
docs/workflow/             # 00..06 design + audit documents
```

## Documentation

- [00 — Repository Discovery](docs/workflow/00-repository-discovery.md)
- [01 — Product Blueprint](docs/workflow/01-product-blueprint.md)
- [02 — Backend Contract](docs/workflow/02-backend-contract.md)
- [03 — Frontend Contract](docs/workflow/03-frontend-contract.md)
- [04 — Executable Workflow](docs/workflow/04-executable-workflow.md)
- [05 — Implementation Checklist](docs/workflow/05-implementation-checklist.md)
- [06 — Final Audit Report](docs/workflow/06-final-audit-report.md)


