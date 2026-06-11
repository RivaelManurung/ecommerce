# 00 — Repository Discovery

> Read-only scan performed before any code was written. No assumptions — every
> claim below was verified by reading the actual files.

## 1. Detected backend stack

| Item | Value |
| --- | --- |
| Language | Go `1.26` (toolchain `go1.26.3`) |
| HTTP framework | `github.com/gin-gonic/gin v1.12.0` |
| Module path | `e-katalog/backend` |
| Database driver present | `go.mongodb.org/mongo-driver/v2 v2.5.0` (MongoDB) — currently `// indirect` |
| Validation | `github.com/go-playground/validator/v10 v10.30.1` (transitive via gin) |
| Crypto | `golang.org/x/crypto v0.48.0` available (bcrypt) |
| Entrypoint | `backend/cmd/api/main.go` |

**Conclusion:** Backend is **Go + Gin + MongoDB**. JWT is *not* present in `go.mod`;
sessions/tokens will be implemented with the standard library (`crypto/hmac`,
`crypto/sha256`) to avoid pulling an unverified dependency.

## 2. Detected frontend stack

| Item | Value |
| --- | --- |
| Framework | `next 16.2.9` (App Router) |
| React | `19.2.4` |
| Styling | Tailwind CSS `v4` (`@tailwindcss/postcss`) — no `tailwind.config`, CSS-first |
| State | `zustand 5` |
| Forms | `react-hook-form 7` + `@hookform/resolvers` + `zod 4` |
| Animation | `framer-motion 12` |
| Icons | `lucide-react ^1.17` ⚠️ (limited icon set — see risks) |
| Utils | `clsx`, `tailwind-merge` (`cn()` helper present) |

**Non-standard Next.js conventions** (verified against `node_modules/next/dist/docs`, per `AGENTS.md`):
- `params` / `searchParams` in pages are **`Promise`** — must be `await`ed.
- `cookies()` / `headers()` from `next/headers` are **async**.
- Route Handler dynamic params are **async Promises**.
- Middleware file is **`proxy.ts`** exporting `export function proxy(...)` — `middleware.ts` is deprecated.
- Images use `images.remotePatterns` (not `domains`).
- `useRouter` from `next/navigation`.

## 3. Existing folder structure

```
backend/
  cmd/api/main.go              # boots config + router
  internal/config/config.go    # PORT, CORS_ALLOW_ORIGINS only
  internal/router/router.go    # health + hardcoded /products (in-memory slice)
  .env.example                 # PORT, GIN_MODE, CORS_ALLOW_ORIGINS
frontend/
  src/app/                     # storefront pages (home, shop, product, cart, checkout, login, register, ...)
  src/components/              # home/, product/, layout/, cart/, checkout/, shared/, ui/, static/, auth/
  src/lib/                     # data/ (seed), store/ (cart, wishlist), utils/, validations/
  src/types/                   # product, cart, checkout
```

## 4. Existing routes / pages (frontend)

Storefront (all driven by **local seed data** in `src/lib/data/*`):
`/`, `/shop`, `/search`, `/category/[slug]`, `/product/[slug]`, `/cart`, `/checkout`,
`/order/success`, `/wishlist`, `/account`, `/login`, `/register`, `/about`, `/contact`,
`/faq`, `/shipping`, `/returns`, `/privacy`, `/terms`.

There is **no `/admin` area, no `/catalog` route, no API client, and no backend connection.**

## 5. Existing backend modules

Only a flat `router.go` with a hardcoded `[]product` slice and two read endpoints.
No service/repository/middleware/auth/config-for-db layers exist yet.

## 6. Existing dependencies

See §1/§2. Notable absences: no `components.json`/shadcn install (frontend uses a hand-rolled
`components/ui/button.tsx`), no JWT lib, no DB layer.

## 7. Existing config files

- `backend/.env.example` (3 vars), `backend/.gitignore`
- `frontend/next.config.ts` (empty), `tsconfig.json` (`@/*` → `src/*`), `postcss.config.mjs`,
  `eslint.config.mjs` (flat config), `frontend/AGENTS.md` (shadcn admin design rule).

## 8. Existing scripts

- Backend: none beyond `go run ./cmd/api`.
- Frontend `package.json`: `dev`, `build`, `start`, `lint`.

## 9. Broken / missing parts

- Backend has **no DB connection, no auth, no real modules** — only mock data.
- Frontend storefront is **fully disconnected** from any backend (local data only).
- No standard API response envelope, no pagination, no RBAC, no audit logging.
- No admin dashboard whatsoever.

## 10. Risk list

| # | Risk | Mitigation |
| --- | --- | --- |
| R1 | No `mongod` running in the build env; Mongo can't be smoke-tested here. | Repository layer behind a `Store` interface with **two impls**: real Mongo + in-memory (seeded). Driver chosen by env; defaults to in-memory when `MONGODB_URI` is unset. Server is fully runnable + integration-testable now. |
| R2 | `lucide-react ^1.17` lacks many icons (`Instagram` etc. absent). | Verify each icon import exists before use; substitute available icons. |
| R3 | Global CSS rule `label > input {...}` overrides Tailwind on inputs nested in `<label>`. | Admin form inputs are **not** direct children of `<label>`; use a dedicated `Input` component with explicit classes. |
| R4 | Non-standard Next 16 async `params`/`cookies` — wrong usage fails the build. | All dynamic pages/handlers `await` params/cookies; middleware uses `proxy.ts`. |
| R5 | Storefront visual language (rose/blush, gradients) conflicts with required neutral shadcn admin. | Admin uses a separate neutral token scope; storefront left untouched. |
| R6 | `/login` already used by storefront customer mock auth (no backend). | Repurpose `/login` as the real backend-connected (admin) login per the API contract; legacy `/register` left as-is (out of backend scope). |

## 11. Recommended implementation strategy

1. **Preserve** the storefront; do not delete working code.
2. Build a **clean-architecture Go backend** (handler → service → repository) behind a `Store`
   interface (Mongo + memory), with a shared response/error/pagination/security toolkit, JWT-like
   HMAC tokens, RBAC, and audit logging.
3. Add a **centralized frontend API client** + auth store + `proxy.ts` route protection.
4. Build a **neutral shadcn-style admin** area (`/admin/**`) wired to the real API.
5. Add contract public routes (`/catalog`, `/catalog/[slug]`) + wire `/contact` to the real public API.
6. Validate at every step with real commands (`go build/vet/test`, `npm run lint/build`).
7. Cross-check against the checklist and produce an honest audit.
