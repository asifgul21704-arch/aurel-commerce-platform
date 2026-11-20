# AUREL — Curated Style & Living

AUREL brings the supplied fashion, virtual-styling and smoothie experiences into one premium, responsive commerce platform. Each source concept remains its own visual collection within one shared customer account, bag and order system.

## Integrated source experiences

- **VELL Studio** — eight registered looks, one recurring character, face filters, realism controls, body tuning, DNA helix, personality, story, saved looks, favourites, undo/redo and individual wardrobe pieces.
- **Offcut** — ten-piece streetwear rail, exact sprite-sheet crops, ten garment silhouettes, 3D hover rail and product detail.
- **Blendy** — Berry, Kiwi, Banana and Strawberry slider with original colour palette, bottle crops, floating fruit pieces, swipe and autoplay. No price is invented where the source prompt did not provide one.
- **VirtualFit** — five garments, ten-card looping rail, model try-on scan, colour choices and S/M/L/XL sizing.
- **Maison Vell** — six-look draggable depth runway, keyboard/wheel navigation and twelve synchronized product pieces.
- **Try the Look** — six model looks, source-matched products, shoe/apparel sizes and the source's display-only bundle price.

## Commerce and account features

- Customer registration, login, profile and order history.
- Password hashing, JWT authentication, protected routes, role checks and auth rate limits.
- Three roles: customer, admin and owner.
- Admin workspace for catalog creation, editing, archiving and order-status management.
- Owner-only administrator creation and access suspension.
- MongoDB-backed catalog seeded once from the supplied source data.
- Server-side price and currency lookup; client-submitted prices are never trusted.
- Demo-only payment outcomes. No card data, live payment gateway or real money is used.
- USD and EUR orders are kept separate; a mixed-currency bag must be checked out in separate demo orders.


## Demo checkout flow

The customer bag routes to a dedicated checkout screen. Customers can select the simulated card or wallet method and choose an approved or declined test outcome. The API records the resulting demo order and payment reference; it never asks for card numbers, bank credentials, OTPs or real payment secrets. Successful simulations create processing orders, while declined simulations are recorded as failed/cancelled demo orders.

## Stack

- Frontend: React, Vite, JavaScript, CSS and Lucide icons.
- Backend: Node.js, Express and Mongoose.
- Database: MongoDB.
- CI: GitHub Actions runs frontend production build and backend syntax checks.

## Repository structure

```
backend/
  src/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    scripts/
    services/
frontend/
  public/
  src/
    components/
    data/
    hooks/
    pages/
.github/workflows/
```

## Run locally

1. Use Node.js 20 or newer.
2. In `backend/`, run `npm install`.
3. Copy `backend/.env.example` to `backend/.env`; set your own MongoDB URI and a long random JWT secret.
4. Set `OWNER_NAME`, `OWNER_EMAIL` and a private owner password of at least 14 characters in your local environment, then run `npm run create-owner` once from `backend/`.
5. Start the API with `npm run dev`.
6. In a second terminal, enter `frontend/`, run `npm install`, copy `.env.example` to `.env`, then run `npm run dev`.

The API seeds the 74 source-derived fashion catalog products when the MongoDB Product collection is empty. Blendy remains a flavour showcase because its source prompt did not specify a price.

## Deployment configuration

- Backend service: provide `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` and `NODE_ENV` in the hosting provider's private environment settings.
- Frontend: set `VITE_API_BASE_URL` to the deployed API base URL.
- Do not commit `.env`, owner passwords, database URIs, tokens or other secrets. The repository includes placeholders only.

## Project status

The integrated source experiences, customer authentication, MongoDB catalog, role-protected admin/owner tools and simulated checkout are committed. GitHub Actions frontend build and backend syntax checks are passing. Live deployment still requires the owner's private database and hosting environment configuration.
