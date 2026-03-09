# Personal Finance Management API

A production-ready backend API for a Personal Finance Management application, built with Node.js, TypeScript, GraphQL (Apollo Server), Prisma, and PostgreSQL.

## Tech Stack
- **Language**: TypeScript
- **API**: GraphQL (Apollo Server)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + bcryptjs
- **Testing**: Vitest (Unit) + Playwright (E2E)

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v20+)

### 1. Install dependencies
```bash
pnpm install
```

### 2. Environment setup
Copy `.env.example` to `.env` and set your own credentials. See comments in `.env.example` for what each variable expects; default values match the docker-compose database and are suitable for local development.
```bash
cp .env.example .env
```

### 3. Start infrastructure
Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```

### 4. Database migration
Apply the Prisma schema to the database:
```bash
npx prisma migrate dev --name init
```

### 5. Start the server
Run the development server:
```bash
pnpm run dev
```
The server will start at `http://localhost:4000/`.

## Testing

### Unit Tests
Run unit tests with Vitest:
```bash
pnpm run test:unit
```

### E2E Tests
Run end-to-end tests with Playwright (requires server to be running):
```bash
pnpm run test:e2e
```

## Folder Structure
- `src/context.ts`: Apollo Server context
- `src/server.ts`: Entry point
- `src/dto/`: Data transfer objects (category, transaction)
- `src/models/`: GraphQL type definitions (auth-payload, category, transaction, user)
- `src/resolvers/`: GraphQL resolvers (auth, category, transaction, user)
- `src/services/`: Business logic (auth, category, transaction)
- `src/utils/`: Utility functions (auth, etc.)
- `prisma/`: Database schema and migrations
- `tests/`: E2E tests (Playwright)
