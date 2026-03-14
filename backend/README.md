# Personal Finance Management API

A production-ready backend API for a Personal Finance Management application, built with Node.js, TypeScript, GraphQL (Apollo Server), Prisma, and SQLite.

## Tech Stack
- **Language**: TypeScript
- **API**: GraphQL (Apollo Server)
- **Database**: SQLite
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
Copy `.env.example` to `.env` and set your own credentials. The default `DATABASE_URL` points to a local SQLite file (`file:./dev.db`).
```bash
cp .env.example .env
```

### 3. Database migration
Apply the Prisma schema to the database:
```bash
npx prisma migrate dev --name init
```

### 4. Start the server
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
Run end-to-end tests with Playwright (requires server to be running). The test runner uses Prisma against the same database as the server, so both must use the same `DATABASE_URL`. Example with a dedicated E2E database:
```bash
# Terminal 1: start server with E2E DB
DATABASE_URL="file:./prisma/e2e.db" pnpm start

# Terminal 2: run tests with the same DB
DATABASE_URL="file:./prisma/e2e.db" pnpm run test:e2e
```
If the server is already running with the default `.env` (e.g. `file:./dev.db`), you can run `pnpm run test:e2e` without setting `DATABASE_URL` and tests will use the same database.

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
