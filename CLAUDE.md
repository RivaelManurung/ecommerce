# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

This is a two-part monorepo for **E-Katalog**, a product catalog + e-commerce platform.

- `backend/` — Go 1.26 / Gin API. **It is a git submodule** (`github.com/RivaelManurung/backend-ecommerce`), so changes there are committed to that separate repo, not this one. Run `git submodule update --init` after cloning.
- `frontend/` — Next.js 16 (App Router) / React 19 app serving both the public storefront/catalog and the admin + super-admin console.
- `deploy/` — Docker Compose, Caddy and nginx configs for VPS deployment (see `deploy/DEPLOY.md`).
- `docs/workflow/` — the design + audit record (00 discovery → 06 final audit).

> **The root `README.md` is stale.** It describes a MongoDB, catalog-only system. The backend has since migrated to **PostgreSQL** (`jackc/pgx/v5`) and grown into full e-commerce (cart, orders, payments, shipping, coupons, reviews, wishlist, customer accounts). Trust the code over the README.

## Common commands

### Backend (`cd backend`, uses a `Makefile`)

```bash
make dev          # go run ./cmd/api/main.go — migrates + seeds on boot, reads .env
make test         # go test ./...
make test-race    # go test -race ./...
make cover        # go test -cover ./...
make fmt          # gofmt -w
make vet          # go vet ./...
make build        # -> ./bin/api
make stop         # kill whatever holds the API port
make restart      # stop + dev
make fresh        # stop, wipe local dev DB, reseed (DESTRUCTIVE)
make reseed       # DROP SCHEMA public then rebuild on next boot (DESTRUCTIVE)
make psql         # psql shell to the local dev DB
```

Run a single test: `go test ./internal/module/product/... -run TestName -v`

`make stop`/`reseed`/`psql` read `PORT` and `DATABASE_URL` from `backend/.env`.

### Frontend (`cd frontend`, npm)

```bash
npm run dev       # next dev --webpack  -> http://localhost:3000
npm run build     # next build
npm run lint      # eslint
npm run start     # serve the production build
```

## Backend architecture

Clean layered architecture behind a single `Store` interface. Entry point is `cmd/api/main.go`; `internal/server/server.go` `New()` is where everything is wired.

- **`internal/domain/store.go`** defines the `Store` interface (`st.Users()`, `st.Products()`, etc.). Two implementations exist under `internal/store/`: **`postgres/`** (prod, `pgx`) and **`memory/`** (dev default, seeded, no DB). `STORE_DRIVER=memory|postgres` (auto = postgres when `DATABASE_URL` is set). `store.Seed()` runs on boot.
- **`internal/module/<name>/`** is the unit of feature code. Each module holds a `handler.go` (Gin handlers) and a domain file. Modules: `auth adminuser customer category product inventory cart order payment shipping coupon review wishlist inquiry setting auditlog dashboard reports publicapi`. Adding a feature = new module + register its routes in `server.go`.
- **Route groups (`server.go`)** all live under `/api/v1`: `authGroup` (`/auth`, public), `account` (authenticated, any logged-in user), `admin` (`/admin`, gated by `middleware.Auth` + role check), `publicGroup` (`/public`, unauthenticated storefront reads).
- **`internal/pkg/`** holds cross-cutting helpers: `response` (the `{success, data, meta}` / `{success, error}` envelope — use it for every response), `apperror` (centralized error codes), `pagination`, `validate` (go-playground), `security` (auth tokens), `slugger`, `id`, `googleauth`.
- **Auth** is **HMAC-SHA256 signed bearer tokens built on the stdlib** (`internal/pkg/security/security.go`), *not* a JWT library — do not swap in `jwt-go` expecting compatibility. bcrypt for passwords. RBAC roles: `admin`, `super_admin`, plus customer accounts.

Key env vars (see `internal/config/`): `PORT` `GIN_MODE` `DATABASE_URL` `STORE_DRIVER` `JWT_SECRET` `TOKEN_TTL_HOURS` `CORS_ALLOW_ORIGINS` `AUTH_RATE_LIMIT`/`AUTH_RATE_WINDOW_SECONDS` `GOOGLE_CLIENT_ID` `PAYMENT_WEBHOOK_SECRET` `SHIPPING_ORIGIN_PROVINCE` `SEED_DEMO` `SEED_*`. **Set `SEED_DEMO=false` and rotate `JWT_SECRET`/seed passwords in production.**

## Frontend architecture

Next.js 16 App Router. `src/` is organized by concern:

- **`src/app/`** — routes. Storefront (`/`, `/catalog`, `/cart`, `/checkout`, `/orders`, `/wishlist`, `/contact`, static pages) and the private console under `/admin/**`. Auth pages: `/login`, `/register`, `/forgot-password`, `/reset-password`.
- **`src/features/<name>/`** — feature logic (data hooks, forms, state) mirroring backend modules: `auth cart orders wishlist products categories inquiries settings dashboard public` plus admin surfaces `admin-customers admin-orders admin-inventory admin-coupons admin-reviews admin-reports admin-users audit`.
- **`src/lib/`** — `api-client`, auth, zod validations, formatters, shared admin types.
- **`src/proxy.ts`** — Next 16 middleware (`middleware.ts` is deprecated → `proxy.ts`). Guards `/admin/**` by reading the `role` claim from the `ek_token` cookie and redirecting non-admins to `/admin/login`. **This is only a navigation hint — it does NOT verify the token signature; the backend re-checks token + role on every API call.**
- **`next.config.ts` `redirects()`** — legacy paths (`/shop`, `/search`, `/category/:slug`, `/product/:slug`, `/account`) redirect into the current `/catalog` and `/orders` routes. `/cart` and `/checkout` are real pages and must **not** be added to this redirect list.

State/data: zustand (client state), react-hook-form + zod (forms). `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8080/api/v1`) points at the backend.

### Admin UI design rule (from `frontend/AGENTS.md`)

All admin dashboard screens must follow the shadcn/ui SaaS visual language: neutral colors, semantic tokens, clean cards, compact tables, structured forms, subtle borders, consistent spacing, proper loading/empty/error states — **no random gradients or overly colorful "AI-looking" sections**. The storefront keeps its own editorial theme (see `frontend/DESIGN.md`). `globals.css` resets live in `@layer base` so Tailwind utilities win.

## Response & API conventions

Standard envelope on all endpoints: `{ "success": true, "data": …, "meta"? }` or `{ "success": false, "error": { code, message, details? } }`. Product status workflow is `draft → published → archived`; inquiry status is forward-only `new → contacted → closed`. Categories with products cannot be deleted.
