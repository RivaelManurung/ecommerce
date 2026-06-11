# 03 — Frontend Contract

## Architecture decision

Next.js 16.2.9 **App Router**. The existing **storefront is preserved**; a new **admin area**
(`/admin/**`) and contract **public catalog routes** (`/catalog`, `/catalog/[slug]`) are added.
A single typed **API client** is the only place that talks to the backend. Admin pages are
client components (interactive CRUD); public catalog pages are server components that fetch
published data. Visual language: storefront keeps its rose/editorial theme; **admin is a
neutral shadcn-style SaaS** (per `frontend/AGENTS.md`) scoped under the admin layout.

## Route structure

**Public:** `/` (existing home), `/catalog`, `/catalog/[slug]`, `/contact` (wired to inquiry API).
**Auth:** `/login` (real backend login → redirects admins to `/admin`).
**Admin (protected):** `/admin`, `/admin/categories`, `/admin/categories/create`,
`/admin/categories/[id]/edit`, `/admin/products`, `/admin/products/create`,
`/admin/products/[id]`, `/admin/products/[id]/edit`, `/admin/inquiries`, `/admin/settings`,
`/admin/audit-logs`.

## Component structure

```
src/lib/
  api-client.ts      # fetch wrapper: base URL from env, bearer token, envelope unwrap, ApiError
  auth.ts            # zustand store (user, token), cookie sync, hooks
  validations.ts     # zod schemas mirroring backend validation
  utils.ts           # cn re-export, formatters
src/features/<x>/api.ts   # typed calls per domain (auth, categories, products, inquiries, settings, dashboard, audit)
src/components/ui/        # shadcn-style: button(existing), input, textarea, label, card, table,
                          # badge, select, dialog, skeleton, toast, dropdown
src/components/admin/     # admin-shell (sidebar, topbar), data-table, page-header, stat-card,
                          # status-badge, confirm-dialog, form-field
```

## API client strategy

- Base URL from `process.env.NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8080/api/v1`).
- `apiFetch<T>(path, { method, body, auth })` → attaches `Authorization: Bearer <token>` when `auth`,
  parses the standard envelope, throws a typed `ApiError {status, code, message, details}` on `success:false`.
- **No `fetch` calls outside this module.** No hardcoded backend URLs in components.

## Auth strategy

- Login posts to `/auth/login`; on success the token + user are stored in the zustand store
  **and** mirrored to a `ek_token` cookie so `proxy.ts` can guard server-side.
- `proxy.ts` (Next 16 middleware replacement) matches `/admin/:path*`; redirects to `/login?next=...`
  when the cookie is absent.
- Client admin shell also calls `/auth/me` on mount to validate the token; on 401 it clears state and redirects.
- Logout: call `/auth/logout`, clear store + cookie, redirect to `/login`.
- Tradeoff (documented): token cookie is readable by JS (not httpOnly) because it is issued to a SPA
  client; acceptable for this scope, noted in the audit as hardening follow-up.

## Form validation strategy

`react-hook-form` + `zod` (`@hookform/resolvers/zod`). Schemas in `lib/validations.ts` mirror the
backend rules so client and server agree. Server `VALIDATION_ERROR.details` are surfaced back onto
fields. **Inputs are never direct children of `<label>`** (avoids the global `label>input` CSS rule).

## Loading / error / empty state rules

Every data view renders one of four states explicitly:
- **Loading** → skeleton rows/cards.
- **Error** → inline error panel with retry.
- **Empty** → `EmptyState` with icon + message + primary action.
- **Loaded** → content.

No silent blank screens; no spinners without layout.

## Admin UX workflow

Persistent left sidebar (Dashboard, Categories, Products, Inquiries, Settings, Audit Logs) + topbar
(page title, user menu, logout). Tables are compact with pagination, search, and status filters.
Forms are card-grouped with clear primary/secondary actions and inline validation. Destructive
actions use a confirm dialog. Toasts confirm mutations.

## Public catalog UX workflow

`/catalog` (server-rendered): category filter chips, keyword search, sort control, responsive product
grid, pagination, empty state. `/catalog/[slug]`: gallery + variants + price + inquiry CTA → `/contact`.
`/contact`: validated form posting to `/public/inquiries` with success + error states.

## Responsive design rules

- Mobile-first; admin sidebar collapses to a sheet/drawer under `lg`.
- Tables scroll horizontally on small screens or collapse to stacked cards.
- Min tap target 44px; container max-width consistent.

## Accessibility checklist

- [ ] All inputs have associated `<label htmlFor>`.
- [ ] Focus-visible rings on interactive elements.
- [ ] Dialogs trap focus and close on Esc.
- [ ] Color is not the only status signal (badge text + color).
- [ ] Images have `alt`.
- [ ] Buttons have discernible text / `aria-label`.
