# 04 — Executable Workflow

> 25 phases. Each phase lists Goal / Tasks / Files to inspect / Files to create-change /
> Implementation details / Validation commands / Acceptance criteria. Checklist state is
> tracked in `05-implementation-checklist.md`.
>
> Global validation:
> Backend — `cd backend && go fmt ./... && go vet ./... && go test ./... && go build ./...`
> Frontend — `cd frontend && npm run lint && npm run build`

---

## Phase 1 — Backend foundation
**Goal:** Config + shared toolkit so every module reuses one response/error/pagination/security stack.
**Tasks:** - [ ] extend config - [ ] response - [ ] apperror - [ ] pagination - [ ] security - [ ] slugger - [ ] validate
**Inspect:** `internal/config/config.go`, `internal/router/router.go`.
**Create/change:** `internal/config/config.go`, `internal/pkg/{response,apperror,pagination,security,slugger,validate}/*.go`.
**Details:** Config adds `JWTSecret, TokenTTL, StoreDriver, MongoURI, MongoDB, SeedAdminEmail/Password`. `apperror` defines typed errors mapped to HTTP codes; `response` writes the envelope; `security` does bcrypt + HMAC token sign/verify (stdlib); `slugger` slugifies + dedups; `validate` wraps go-playground translator.
**Validation:** `go build ./...`
**Acceptance:** packages compile; token sign/verify + slugger covered by unit tests.

## Phase 2 — Backend config and database
**Goal:** Pick store driver and connect.
**Tasks:** - [ ] Store interface in `domain` - [ ] memory store - [ ] mongo store - [ ] seed.
**Create/change:** `internal/domain/*.go`, `internal/store/memory/*.go`, `internal/store/mongo/*.go`.
**Details:** `domain.Store` aggregates `Users/Categories/Products/Inquiries/Settings/AuditLogs` repos. Memory store seeds admin + sample categories/products. Mongo store wires collections + indexes when `MONGODB_URI` set.
**Validation:** `go build ./... && go test ./...`
**Acceptance:** server boots on memory store; seeded admin can log in.

## Phase 3 — Backend shared response/error/pagination
**Goal:** Covered in Phase 1; verified end-to-end here via middleware integration.
**Tasks:** - [ ] recovery middleware emits envelope - [ ] request logger.
**Acceptance:** unknown route → 404 envelope; panic → 500 envelope.

## Phase 4 — Backend auth module
**Goal:** Login/logout/me + auth & rbac middleware.
**Create/change:** `internal/module/auth/*`, `internal/middleware/{auth,rbac,audit}.go`.
**Details:** bcrypt verify, HMAC token, context injection of current user, role gates.
**Validation:** `go test ./...` + curl login.
**Acceptance:** valid creds → token; bad creds → 401; protected route without token → 401; wrong role → 403.

## Phase 5 — Backend category module
**Goal:** Admin CRUD + slug uniqueness + delete guard + public list.
**Create/change:** `internal/module/category/*`.
**Acceptance:** CRUD works; duplicate name → unique slug; delete with linked products → 409.

## Phase 6 — Backend product module
**Goal:** Admin CRUD, status workflow, search/filter/sort.
**Create/change:** `internal/module/product/*`.
**Acceptance:** create draft; publish/archive transitions enforced; list filters by status/category/search.

## Phase 7 — Backend image/variant module
**Goal:** Embedded image & variant management on products.
**Create/change:** product service methods + routes for images/variants.
**Acceptance:** add/remove image (primary handling), add/update/delete variant returns updated product.

## Phase 8 — Backend inquiry module
**Goal:** Public submit + admin list + status workflow.
**Create/change:** `internal/module/inquiry/*`.
**Acceptance:** public POST creates `new`; admin lists/filters; status advances `new→contacted→closed`.

## Phase 9 — Backend settings module
**Goal:** Singleton settings get/update (super_admin write).
**Create/change:** `internal/module/setting/*`.
**Acceptance:** GET returns singleton; PUT as admin → 403; as super_admin → updates.

## Phase 10 — Backend audit log module
**Goal:** Record every admin mutation + list.
**Create/change:** `internal/module/auditlog/*`, audit middleware/service hook.
**Acceptance:** create/update/delete/status changes appear in `/admin/audit-logs`.

## Phase 11 — Backend public catalog API
**Goal:** Public categories/products/detail/inquiry.
**Create/change:** `internal/module/publicapi/*` (+ dashboard module).
**Acceptance:** only published products returned; detail by slug; draft/archived hidden.

## Phase 12 — Frontend foundation
**Goal:** Env, folders, neutral admin tokens, shadcn-style UI primitives.
**Create/change:** `.env.local.example`, `next.config.ts` (remotePatterns), `globals.css` admin scope, `components/ui/*`.
**Validation:** `npm run lint`
**Acceptance:** UI primitives render; no lint errors.

## Phase 13 — Frontend API client
**Goal:** Centralized client + feature api modules + zod schemas.
**Create/change:** `lib/api-client.ts`, `lib/validations.ts`, `features/*/api.ts`.
**Acceptance:** single fetch wrapper; typed calls; ApiError surfaced.

## Phase 14 — Frontend auth integration
**Goal:** Login page + auth store + cookie + `proxy.ts`.
**Create/change:** `app/login/page.tsx`, `lib/auth.ts`, `proxy.ts`.
**Acceptance:** login stores token+cookie, redirects to `/admin`; `/admin` without cookie → `/login`.

## Phase 15 — Frontend admin layout
**Goal:** Sidebar + topbar shell, responsive, neutral.
**Create/change:** `app/admin/layout.tsx`, `components/admin/*`.
**Acceptance:** nav highlights active route; collapses on mobile; logout works.

## Phase 16 — Frontend dashboard
**Create/change:** `app/admin/page.tsx`. **Acceptance:** stat cards + recent inquiries/audit from real API; loading/empty/error states.

## Phase 17 — Frontend category management
**Create/change:** `app/admin/categories/**`. **Acceptance:** list (search/filter/paginate), create, edit, delete-with-confirm, all via API.

## Phase 18 — Frontend product management
**Create/change:** `app/admin/products/**`. **Acceptance:** list+filters, create, detail (images+variants+status actions), edit, delete.

## Phase 19 — Frontend inquiry management
**Create/change:** `app/admin/inquiries/page.tsx`. **Acceptance:** list, filter by status, advance status.

## Phase 20 — Frontend settings page
**Create/change:** `app/admin/settings/page.tsx`. **Acceptance:** load + save settings; super_admin gate respected (read-only hint for admin).

## Phase 21 — Frontend public catalog
**Create/change:** `app/catalog/page.tsx`. **Acceptance:** server-fetched published products, category filter, search, sort, pagination, empty state.

## Phase 22 — Frontend product detail
**Create/change:** `app/catalog/[slug]/page.tsx`, wire `app/contact`. **Acceptance:** detail by slug from API; inquiry form posts to API.

## Phase 23 — Fullstack integration
**Goal:** End-to-end check across the running stack.
**Validation:** boot backend (memory store) + `npm run build`; curl key endpoints.
**Acceptance:** login→admin CRUD→public reflects published changes; inquiry from `/contact` appears in `/admin/inquiries`.

## Phase 24 — QA validation
**Validation:** `go fmt/vet/test/build` + `npm run lint/build` all green; document any `[!]`.

## Phase 25 — Documentation and final audit
**Create/change:** `05-implementation-checklist.md`, `06-final-audit-report.md`, root `README.md`.
**Acceptance:** checklist reflects real state; audit scores justified; README has exact run/env commands.
