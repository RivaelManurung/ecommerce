# Implementation Checklist

> Legend: `[x]` done · `[!]` done with technical debt · `[ ]` not done · `[-]` skipped (reason).
> Verified against the actual code. Validation results are in `06-final-audit-report.md`.

## Backend Foundation
- [x] Config loaded from env (`internal/config`, incl. JWT secret, TTL, store driver, Mongo, seed creds; loads `.env`)
- [x] Database connection works (Mongo driver impl; in-memory driver default — both implement `domain.Store`)
- [x] Centralized response implemented (`pkg/response` envelope)
- [x] Centralized error handling implemented (`pkg/apperror` typed errors + `response.Fail` + recovery middleware)
- [x] Pagination implemented (`pkg/pagination` parse + meta)
- [x] Validation implemented (`pkg/validate` + gin binding, friendly field errors)

## Auth
- [x] Login endpoint exists (`POST /api/v1/auth/login`)
- [x] Password hashing secure (bcrypt via `pkg/security`)
- [x] Auth middleware exists (`middleware.Auth`, HMAC token verify + user load)
- [x] Me endpoint exists (`GET /api/v1/auth/me`)
- [x] Logout endpoint exists (`POST /api/v1/auth/logout`, stateless; documented + audited)
- [x] RBAC middleware (`middleware.RequireRole`; settings write = super_admin)

## Categories
- [x] Admin category list (search/status filter, paginated)
- [x] Admin category create
- [x] Admin category update
- [x] Admin category delete (409 guard when products reference it)
- [x] Public category list (active only)
- [x] Slug uniqueness handled (`pkg/slugger.Unique`)

## Products
- [x] Admin product list (search/status/category filters, sort, paginated)
- [x] Admin product create (defaults draft)
- [x] Admin product update
- [x] Admin product delete
- [x] Product status workflow (draft↔published↔archived, invalid transitions → 422)
- [x] Product image support (add/remove, primary handling)
- [!] Product variant support — backend add/update/delete fully implemented & reachable; admin UI exposes **add + delete only** (no inline edit form yet)
- [x] Public product list (published only)
- [x] Public product detail by slug (404 if not published)
- [x] Search/filter/sort (admin + public)

## Inquiries
- [x] Public inquiry submit (`POST /api/v1/public/inquiries`)
- [x] Admin inquiry list (status filter, paginated)
- [x] Inquiry status workflow (`PATCH /admin/inquiries/:id/status`, forward-only)

## Settings & Audit (backend)
- [x] Settings get/update (singleton; PUT requires super_admin)
- [x] Audit log on every admin mutation (create/update/delete/status/login/logout)
- [x] Audit log list with action/entity filters

## Frontend Auth
- [x] Login page connected to backend (`/login` → `POST /auth/login`)
- [!] Token/session stored safely (cookie `ek_token`, **not httpOnly** — readable by JS; acceptable for SPA, hardening noted)
- [x] Protected admin routes (`proxy.ts` matcher `/admin/:path*` + client `me()` revalidation)
- [x] Logout flow (calls API, clears cookie+store, redirects)

## Frontend Admin
- [x] Admin layout (sidebar + topbar, responsive drawer)
- [x] Dashboard page (stat cards, recent inquiries/activity)
- [x] Category CRUD pages (list/create/edit + delete confirm)
- [x] Product CRUD pages (list/create/detail/edit, image + variant managers, status actions)
- [x] Inquiry management page (list + forward-only status change)
- [x] Settings page (super_admin edit, admin read-only)
- [x] Audit logs page (filters + pagination)

## Frontend Public
- [!] Homepage (existing storefront home retained — still uses local seed data, not wired to API)
- [x] Catalog page (`/catalog`, server-fetched published products, filters, sort, pagination)
- [x] Product detail page (`/catalog/[slug]`, real API, 404 handling)
- [x] Contact/inquiry page (`/contact` wired to `POST /public/inquiries`)
- [x] Search/filter UX (catalog filters update URL)
- [-] Legacy storefront routes `/shop`, `/product/[slug]`, `/category/[slug]` still use local seed data (out of scope; contract routes are `/catalog*` which ARE wired — documented in audit)

## Integration
- [x] Frontend uses real backend API (admin + catalog + contact)
- [x] API client centralized (`lib/api-client.ts` — single fetch wrapper, no other fetch calls)
- [x] Error handling visible to user (ApiError → toasts / inline panels / field errors)
- [x] Loading state exists (skeletons / spinners)
- [x] Empty state exists (`EmptyState` everywhere a list can be empty)
- [x] Build passes (`npm run lint` + `npm run build`; backend `go vet/test/build`) — see audit for exact results

## Documentation
- [x] README updated (root `README.md`)
- [x] API guide created (`02-backend-contract.md`)
- [x] Run guide created (README + audit "exact commands")
- [x] Env guide created (`backend/.env.example`, `frontend/.env.local.example`, README)
- [x] Final audit report created (`06-final-audit-report.md`)
