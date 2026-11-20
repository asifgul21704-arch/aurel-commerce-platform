# AUREL API

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

Set your own `MONGODB_URI` and a strong random `JWT_SECRET` in the local `.env`. Never commit that file.

## First owner
Set `OWNER_NAME`, `OWNER_EMAIL`, and a private `OWNER_PASSWORD` (14+ characters) in your local environment, then run:
```bash
npm run create-owner
```
The script refuses to create a second owner. No default credentials are included in this repository.

## Endpoints
- `GET /api/health`
- `POST /api/auth/signup` — customer registration
- `POST /api/auth/login`
- `GET /api/auth/me` — authenticated profile
- `GET /api/auth/admins` — owner only\n- `POST /api/auth/admins` — owner only\n- `PATCH /api/auth/admins/:id` — owner only
- `GET /api/catalog`
- `GET /api/catalog/admin/summary` — admin / owner
- `POST /api/payments/demo-checkout` — authenticated, simulated only
- `GET /api/payments/my-orders` — authenticated order history\n- `GET /api/payments/admin/orders` — admin / owner\n- `PATCH /api/payments/admin/orders/:id/status` — admin / owner

Demo checkout accepts product IDs and quantities only. Prices and currencies are loaded from the server catalog. A single demo order cannot mix EUR and USD items.
