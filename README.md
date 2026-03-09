# Financy

<div align="center">

**Personal finance, simplified.**

A full-stack app to track spending, manage categories, and keep your money in order.

</div>

---

## Stack

| | |
|---|---|
| **Frontend** | React · Vite · TypeScript · Apollo Client · TanStack Query · Tailwind CSS · React Hook Form · Zod · Radix UI |
| **Backend** | Node.js · TypeScript · GraphQL (Apollo Server) · Prisma · PostgreSQL · JWT |

---

## Quick start

**Prerequisites:** Node.js 20+, Docker (for PostgreSQL), pnpm

```bash
# 1. Backend — start DB and API
cd backend
cp .env.example .env
docker-compose up -d
pnpm install
pnpm exec prisma migrate dev --name init
pnpm run dev
# → http://localhost:4000
```

```bash
# 2. Frontend — in another terminal
cd frontend
pnpm install
pnpm run dev
# → http://localhost:5173
```

---

## Project layout

```
financy/
├── backend/     # GraphQL API, Prisma, auth, business logic
└── frontend/    # React SPA, Vite, Tailwind
```

See [backend/README.md](backend/README.md) for API details, env vars, and tests.

---

<p align="center"><sub>Financy</sub></p>
