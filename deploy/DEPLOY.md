# Deploying E-Katalog to a VPS

Self-hosted stack: **Postgres + Go backend + Next.js frontend behind Caddy**
(automatic HTTPS). Everything runs with `docker compose`.

## 1. Prerequisites
- A VPS (≥1 vCPU / 2 GB RAM) with **Docker + Docker Compose v2**.
- Two DNS **A records** pointing at the VPS IP:
  - `app.yourdomain.com` → storefront + admin
  - `api.yourdomain.com` → backend API
- Ports **80** and **443** open.

## 2. First-time setup on the VPS
```bash
# create a deploy dir and copy the two files there
mkdir -p /opt/ekatalog && cd /opt/ekatalog
# upload deploy/docker-compose.prod.yml and deploy/Caddyfile here
# then create the env file from the template and fill it in:
cp .env.prod.example .env     # (or upload .env.prod.example, rename to .env)
nano .env
```
Fill **every `CHANGE_ME`** in `.env`. Generate strong secrets:
```bash
openssl rand -hex 32     # JWT_SECRET, PAYMENT_WEBHOOK_SECRET
```
Keep **`SEED_DEMO=false`** so no demo customers/orders are created in prod.

## 3. Launch
```bash
docker compose -f docker-compose.prod.yml up -d --build   # build on the VPS
# OR, if using CI-built images (set BACKEND_IMAGE/FRONTEND_IMAGE in .env):
docker compose -f docker-compose.prod.yml pull && \
docker compose -f docker-compose.prod.yml up -d
```
Caddy obtains certificates automatically on first request. Check:
```bash
docker compose -f docker-compose.prod.yml ps
curl -fsS https://api.yourdomain.com/health
```
First boot runs DB migrations and seeds the 2 staff accounts (from `.env`).

## 4. Automated deploys (GitHub Actions → GHCR → VPS)
The `Deploy (VPS)` workflow builds + pushes images to GHCR and rolls the stack
over SSH. Configure in the repo:

| Kind | Name | Value |
|---|---|---|
| Variable | `API_DOMAIN` | `api.yourdomain.com` (baked into the frontend) |
| Variable | `VPS_DEPLOY_ENABLED` | `true` to deploy on push to main (optional) |
| Secret | `VPS_HOST` / `VPS_USER` / `VPS_SSH_KEY` | SSH access |
| Secret | `VPS_PORT` | SSH port (optional, default 22) |
| Secret | `VPS_DEPLOY_PATH` | e.g. `/opt/ekatalog` |
| Secret | `GHCR_USER` / `GHCR_TOKEN` | only if the GHCR packages are private |

## 5. Security checklist before go-live
- [ ] `SEED_DEMO=false`
- [ ] `JWT_SECRET` and `PAYMENT_WEBHOOK_SECRET` set to strong random values
- [ ] `SEED_ADMIN_PASSWORD` / `SEED_SUPERADMIN_PASSWORD` changed from defaults
- [ ] `CORS_ALLOW_ORIGINS` / `APP_BASE_URL` use the real `https://app.*` domain
- [ ] Postgres password is strong; `pgdata` volume is backed up
- [ ] HTTPS works on both domains (Caddy)

## 6. Still stubbed (wire real providers when ready)
- **Email** (password reset): currently logs the link — set up SMTP/Resend.
- **Payments** (Midtrans/Xendit), **Ongkir** (Biteship/RajaOngkir), **Google OAuth**:
  the code paths exist but need real API keys/credentials.

## 7. Common operations
```bash
docker compose -f docker-compose.prod.yml logs -f backend   # tail logs
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml down              # stop (keeps data)

# Backup / restore Postgres
docker compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup_$(date +%F).sql
```
