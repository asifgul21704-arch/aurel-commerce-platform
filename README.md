# AUREL — Curated Style & Living

AUREL is a premium multi-collection commerce experience bringing together fashion, virtual styling and wellness.

## Collections represented
- **VELL Studio** — eight registered character looks, outfit pieces, saved looks and styling.
- **Offcut** — dark streetwear clothing-rail concept.
- **VirtualFit** — spatial try-on experience.
- **Maison Vell** — six-look runway lookbook.
- **Try the Look** — six-look outfit carousel and styling bag.
- **Blendy** — four smoothie flavours: Berry, Kiwi, Banana and Strawberry.

The source prompts' product names, prices, model assets and flavour assets are retained where available. The experiences are being adapted into one responsive commerce platform rather than isolated single-file demos.

## Stack
- Frontend: React + Vite + JavaScript + CSS
- Backend: Node.js + Express + MongoDB/Mongoose
- Security: bcrypt password hashing, JWT authentication, role-based authorization, Helmet, rate limits and server-side validation
- Payments: simulated demo payment flow only; no real payment gateway or live credentials

## Repository structure
```
backend/
frontend/
```

## Local development
1. Install Node.js 20+.
2. In `backend/`, run `npm install`, copy `.env.example` to `.env`, fill your own local values, then run `npm run dev`.
3. In `frontend/`, run `npm install`, copy `.env.example` to `.env`, then run `npm run dev`.

Never commit `.env` files. See each package README for setup details.

## Roles
- Customer: browse, save looks, maintain a cart and place demo orders.
- Admin: manage catalog and view orders.
- Owner: full administration, including creating and managing admins.

There is no default owner password. Create the first owner through the protected bootstrap script after configuring your own environment values.

## Status
Initial foundation commit: project structure, API foundation, customer experience shell, role-aware dashboard routes and demo-payment endpoint.
