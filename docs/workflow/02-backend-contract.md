# 02 — Backend Contract

## Architecture decision

**Go + Gin, clean layered architecture.** Each domain module is split into
`model → dto → repository → service → handler → route`. Handlers never touch the DB and
contain no business logic; services orchestrate; repositories are the only DB callers.

The repository layer sits behind a **`Store` interface** with two implementations:

- **MongoDB** (`go.mongodb.org/mongo-driver/v2`) — production driver, used when `MONGODB_URI` is set.
- **In-memory** (mutex-guarded maps, seeded) — used otherwise; makes the API fully runnable and
  integration-testable without a `mongod` (the build environment here has none).

The selected driver is logged at boot. Both implementations satisfy identical interfaces, so
swapping is configuration-only — no fake responses, no hardcoded handler data.

## Module structure

```
backend/
├── cmd/api/main.go
├── internal/
│   ├── config/            # env config (port, cors, jwt secret, token ttl, store driver, seed creds)
│   ├── server/            # router assembly + dependency wiring
│   ├── middleware/        # auth, rbac, audit, recovery, requestlog
│   ├── domain/            # entities + Store/Repository interfaces (no framework imports)
│   ├── store/
│   │   ├── memory/        # in-memory Store + seed
│   │   └── mongo/         # MongoDB Store
│   ├── module/
│   │   ├── auth/ user/ category/ product/ inquiry/ setting/ auditlog/ dashboard/ publicapi/
│   └── pkg/
│       ├── response/ apperror/ pagination/ security/ slugger/ validate/
```

Each `module/<x>` has `dto.go`, `service.go`, `handler.go`, `route.go` (models live in `domain`).

## Database entities (collections)

`users`, `categories`, `products` (images & variants embedded), `inquiries`,
`settings` (singleton), `audit_logs`. Field shapes match `01-product-blueprint.md`.

## Standard API response format

Success:
```json
{ "success": true, "data": { /* object or array */ }, "meta": { /* optional, pagination */ } }
```
Error:
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "human readable", "details": { "field": "reason" } } }
```

`code` ∈ `VALIDATION_ERROR (422)`, `UNAUTHORIZED (401)`, `FORBIDDEN (403)`,
`NOT_FOUND (404)`, `CONFLICT (409)`, `BAD_REQUEST (400)`, `INTERNAL (500)`.

## Pagination format

Query: `?page=1&limit=20&search=&sort=createdAt&order=desc` (plus per-resource filters).
`limit` clamped to `[1,100]`, default `20`; `page` default `1`. Meta:
```json
"meta": { "pagination": { "page": 1, "limit": 20, "total": 134, "totalPages": 7 } }
```

## Auth rules

- `POST /auth/login` → bcrypt-verify → return HMAC-SHA256 token (`sub`,`role`,`exp`) + user.
- Bearer token in `Authorization: Bearer <token>`; verified by auth middleware which loads the user into context.
- `POST /auth/logout` → stateless: client discards token; endpoint returns 200 and writes an audit entry (documented behavior).
- `GET /auth/me` → returns current user from token.
- Token TTL configurable (`TOKEN_TTL_HOURS`, default 24).

## RBAC rules

| Endpoint group | Required role |
| --- | --- |
| `/api/v1/public/**` | none |
| `/api/v1/auth/**` | none (login/logout/me; `me` needs valid token) |
| `/api/v1/admin/**` (read+write) | `admin` or `super_admin` |
| `PUT /api/v1/admin/settings` | `super_admin` only |

## Validation rules (selected)

- `login`: `email` required+email, `password` required min 6.
- `category`: `name` required 2–80; `status` ∈ {active,inactive}; `sortOrder` ≥ 0.
- `product`: `name` required 2–140; `categoryId` required+exists; `basePrice` ≥ 0; `status` ∈ {draft,published,archived}.
- `image`: `url` required URL; `alt` ≤ 140.
- `variant`: `name` required; `price` ≥ 0; `stock` ≥ 0.
- `inquiry`: `name` required; `email` required+email; `message` required 5–2000.

---

## API endpoint list

### Auth
| Method | Path | Auth | Body | Response |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/auth/login` | – | `{email,password}` | `{token, user}` |
| POST | `/api/v1/auth/logout` | bearer | – | `{message}` |
| GET | `/api/v1/auth/me` | bearer | – | `{user}` |

### Admin dashboard
| GET | `/api/v1/admin/dashboard/stats` | admin | – | `{products:{draft,published,archived,total}, categories, inquiriesNew, recentInquiries[], recentAudit[]}` |

### Admin categories
| GET | `/api/v1/admin/categories` | admin | query: page,limit,search,status,sort,order | paginated `Category[]` |
| POST | `/api/v1/admin/categories` | admin | `{name,description,status,sortOrder}` | `Category` |
| GET | `/api/v1/admin/categories/:id` | admin | – | `Category` |
| PUT | `/api/v1/admin/categories/:id` | admin | `{name,description,status,sortOrder}` | `Category` |
| DELETE | `/api/v1/admin/categories/:id` | admin | – | `{message}` (409 if products reference it) |

### Admin products
| GET | `/api/v1/admin/products` | admin | query: page,limit,search,status,categoryId,sort,order | paginated `Product[]` |
| POST | `/api/v1/admin/products` | admin | `{name,categoryId,description,basePrice,currency,status}` | `Product` |
| GET | `/api/v1/admin/products/:id` | admin | – | `Product` |
| PUT | `/api/v1/admin/products/:id` | admin | full product fields incl. `status` | `Product` |
| DELETE | `/api/v1/admin/products/:id` | admin | – | `{message}` |

### Product images
| POST | `/api/v1/admin/products/:id/images` | admin | `{url,alt,isPrimary,sortOrder}` | `Product` |
| DELETE | `/api/v1/admin/products/:id/images/:imageId` | admin | – | `Product` |

### Product variants
| POST | `/api/v1/admin/products/:id/variants` | admin | `{name,sku,price,stock}` | `Product` |
| PUT | `/api/v1/admin/products/:id/variants/:variantId` | admin | `{name,sku,price,stock}` | `Product` |
| DELETE | `/api/v1/admin/products/:id/variants/:variantId` | admin | – | `Product` |

### Public
| GET | `/api/v1/public/categories` | – | – | active `Category[]` |
| GET | `/api/v1/public/products` | – | query: page,limit,search,category,sort,order | paginated published `Product[]` |
| GET | `/api/v1/public/products/:slug` | – | – | published `Product` (404 otherwise) |
| POST | `/api/v1/public/inquiries` | – | `{name,email,phone,productId,message}` | `{message}` (201) |

### Settings
| GET | `/api/v1/admin/settings` | admin | – | `Setting` |
| PUT | `/api/v1/admin/settings` | **super_admin** | full settings | `Setting` |

### Audit logs
| GET | `/api/v1/admin/audit-logs` | admin | query: page,limit,action,entity | paginated `AuditLog[]` |

## Request / response payload notes

- All timestamps are RFC3339 strings.
- `Product` always includes `images[]` and `variants[]` arrays (possibly empty) and a resolved `category` summary `{id,name,slug}`.
- IDs are 24-char hex (Mongo ObjectID hex; the memory store generates compatible hex IDs).
- Money is integer minor-unit-free IDR (`basePrice`/`variant.price` are integer Rupiah, matching the storefront seed convention).
