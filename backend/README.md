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
- `GET /api/auth/admins` — owner only
- `POST /api/auth/admins` — owner only
- `PATCH /api/auth/admins/:id` — owner only
- `GET /api/catalog`
- `GET /api/catalog/admin/summary` — admin / owner
- `GET /api/catalog/admin/products` — admin / owner
- `POST /api/catalog/admin/products` — admin / owner
- `PATCH /api/catalog/admin/products/:id` — admin / owner
- `DELETE /api/catalog/admin/products/:id` — admin / owner (archives)
- `POST /api/payments/demo-checkout` — authenticated, simulated only
- `GET /api/payments/my-orders` — authenticated order history
- `GET /api/payments/admin/orders` — admin / owner
- `PATCH /api/payments/admin/orders/:id/status` — admin / owner

Demo checkout accepts product IDs, quantities and optional size/colour choices. Prices and currencies are loaded from the MongoDB server catalog; client-submitted prices are ignored. A single demo order cannot mix EUR and USD items.
