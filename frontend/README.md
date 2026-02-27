# Financy Frontend

React + Vite frontend for Financy.

## Development

```bash
pnpm install
pnpm dev
```

## Tests

Tests use [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react).

- **Run tests once:** `pnpm test:run`
- **Run tests in watch mode:** `pnpm test`
- **Run tests with UI:** `pnpm test:ui`

Test files live next to source (e.g. `lib/currency.test.ts`, `components/ui/button.test.tsx`). Use `renderWithProviders` from `@/test/test-utils` for components that need Apollo, Auth, or Router.

## Build

```bash
pnpm build
```

## Lint

```bash
pnpm lint
```
