# 01 — Product Blueprint

## Product goal

E-Katalog is a **product catalog management system**: a public storefront where visitors
browse products and submit inquiries, plus a private admin back-office where staff manage
categories, products (with images & variants), inquiries, company settings, and review audit
logs. It is a catalog/lead system — **not** a checkout/payments system.

## User roles

| Role | Capabilities |
| --- | --- |
| **Public Visitor** | Browse published catalog, view product detail, submit inquiries. No auth. |
| **Admin** | Full CRUD on categories, products, images, variants; read inquiries & update status; read dashboard, settings, audit logs. |
| **Super Admin** | Everything Admin can do **plus** edit company settings and (future) manage admin users. |

## Main user journeys

### Public visitor workflow
1. Land on home → see featured/published products and categories.
2. Open `/catalog`, filter by category, search by keyword, sort by price/newest.
3. Open `/catalog/[slug]` → view product detail, images, variants, price.
4. Submit an inquiry via `/contact` (name, email, optional product reference, message).

### Admin workflow
1. Log in at `/login` → receives a token → redirected to `/admin`.
2. Dashboard shows counts (products by status, categories, new inquiries).
3. Manage categories (create/edit/activate/deactivate/delete).
4. Manage products: create as `draft`, attach images & variants, then `publish`; later `archive`.
5. Triage inquiries: `new → contacted → closed`.
6. Edit company settings (Super Admin).
7. Review audit logs of all admin mutations.

## Entity list

- **User** — `id, name, email, passwordHash, role(admin|super_admin), active, createdAt, updatedAt`
- **Category** — `id, name, slug, description, status(active|inactive), sortOrder, createdAt, updatedAt`
- **Product** — `id, name, slug, categoryId, description, status(draft|published|archived), basePrice, currency, images[], variants[], createdAt, updatedAt`
- **ProductImage** (embedded) — `id, url, alt, isPrimary, sortOrder`
- **ProductVariant** (embedded) — `id, name, sku, price, stock`
- **Inquiry** — `id, name, email, phone, productId?, message, status(new|contacted|closed), createdAt, updatedAt`
- **Setting** — singleton: `companyName, tagline, email, phone, whatsapp, address, logoUrl, socials{...}, updatedAt`
- **AuditLog** — `id, actorId, actorEmail, action, entity, entityId, summary, createdAt`

## Business rules

- Category `slug` and Product `slug` are **unique**; generated from name, de-duplicated with a numeric suffix.
- A category cannot be hard-deleted while products reference it → block with `409` (admin should reassign/archive first). Deactivating is always allowed.
- Only **`published`** products appear in any public endpoint.
- Public product list/detail must never leak `draft`/`archived` items.
- Inquiry submission is public and rate-limited by basic validation (required fields, email format).
- Exactly one `Setting` document exists (singleton, upserted).
- Every admin **mutation** (create/update/delete/status-change) writes an `AuditLog` entry.
- Passwords are stored only as **bcrypt** hashes; never logged or returned.

## Status workflows

**Product:** `draft → published → archived` (and `archived → published` re-publish; `published → draft` unpublish allowed). Invalid jumps rejected with `422`.

```
draft ──publish──▶ published ──archive──▶ archived
  ▲                   │                      │
  └──── unpublish ────┘                      │
        published ◀──── republish ───────────┘
```

**Category:** `active ⇄ inactive`.

**Inquiry:** `new → contacted → closed` (forward-only; reopening not supported in v1).

## Security rules

- All `/api/v1/admin/**` endpoints require a valid bearer token (auth middleware) + appropriate role (RBAC middleware).
- Settings write requires `super_admin`.
- Tokens are HMAC-SHA256 signed, carry `sub`, `role`, `exp`; verified on every request.
- CORS restricted to configured origins; credentials limited to the `Authorization` header.
- Input validated server-side regardless of client validation.
- No secrets in responses or logs; generic error messages for auth failures.

## Production readiness target

| Dimension | Target |
| --- | --- |
| Backend | Clean layered architecture, real DB layer, RBAC, audit, validation, standard envelope, pagination. |
| Frontend | Real API integration, protected admin, loading/empty/error states everywhere, professional neutral SaaS admin UI. |
| Verdict goal | **Beta-ready (80–89)** within this engagement; remaining gaps documented honestly in the final audit. |
