# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered helpdesk ticket management system. Agents receive support emails, which become tickets. Claude API handles auto-classification, summaries, and suggested replies. See `project-scope.md` and `implementation-plan.md` for full feature roadmap.

## Monorepo Structure

Bun workspaces with two packages:
- `packages/client` — React + TypeScript + Vite frontend (port 5173)
- `packages/server` — Express 5 + TypeScript backend running under Bun (port 3000)

The client Vite dev server proxies `/api/*` to `http://localhost:3000` (see `vite.config.ts`). The proxy target reads from `VITE_API_PROXY_TARGET` env var, falling back to `http://localhost:3000`.

## Commands

```bash
# Install dependencies (from root)
bun install

# Run both client and server concurrently
bun run dev

# Run individually
bun run dev:server
bun run dev:client

# Type-check all packages
bun run typecheck

# Build all packages
bun run build

# Run Playwright e2e tests (from root)
bun run test:e2e
bun run test:e2e:ui      # interactive UI mode
bun run test:e2e:debug   # debug mode

# Seed databases (from packages/server)
bun run seed             # seed dev DB (helpdesk)
bun run seed:test        # seed test DB (helpdesk_test)
```

## Architecture

### Server (`packages/server/src/`)
- `index.ts` — Express app setup: helmet, CORS (from `BETTER_AUTH_TRUSTED_ORIGIN`, comma-separated), rate limiting (production only), auth handler, JSON body parsing, health route, `/api/me`, server listen. Throws on missing `BETTER_AUTH_SECRET`.
- `auth.ts` — Better Auth instance using the Prisma adapter (PostgreSQL). Email/password enabled. Self-registration is **disabled** (`disabledPaths: ["/sign-up/email"]`) — accounts must be created via the seed script or admin tools.
- `middleware/requireAuth.ts` — Validates session via `auth.api.getSession`. Attaches session to `res.locals.session`. Returns `401` if unauthenticated.
- `middleware/requireAdmin.ts` — Checks `res.locals.session.user.role === "admin"`. Returns `403` otherwise. Must always be used after `requireAuth`: `[requireAuth, requireAdmin]`.

### Client (`packages/client/src/`)
- `App.tsx` — Root component; React Router routes with `ProtectedRoute` / `PublicRoute` / `AdminRoute` guards
- `lib/auth-client.ts` — Better Auth client instance with `adminClient()` plugin (required for `role` on session user type)
- `components/Layout.tsx` — App shell: top nav with "Users" link (admin only, left side), user name, sign-out button, renders `<Outlet />`
- `components/LoginPage.tsx` — Auth form using Better Auth `signIn.email`; pre-fills admin credentials for convenience
- `components/HomePage.tsx` — Placeholder home page (tickets removed)
- `components/UsersPage.tsx` — Admin-only page at `/users`; currently just a heading
- `components/ProtectedRoute.tsx` — `ProtectedRoute`: redirects to `/login` if no session. `PublicRoute`: redirects to `/` if already authenticated. `AdminRoute`: redirects non-admins to `/`, unauthenticated to `/login`.

### API Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | None | Health check — returns `{ status, timestamp }` |
| GET | `/api/me` | `requireAuth` | Returns `{ id, name, email, role }` from session |

## UI

The client uses **shadcn/ui** with Tailwind v4. Config is at `packages/client/components.json`.

- Style: `base-nova`, base color: `neutral`, CSS variables enabled
- Components installed: `button`, `card`, `input`, `label`, `badge`, `select`, `textarea`
- The `@` alias resolves to `packages/client/src`
- Always use semantic theme tokens (`bg-background`, `text-muted-foreground`, `text-destructive`, etc.) — never hardcode color classes like `slate-*` or `indigo-*`
- shadcn `Select` is built on `@base-ui/react` — use react-hook-form `Controller` to wire it up, not `register()`

## Authentication

**Library:** [Better Auth](https://www.better-auth.com/) with the `admin` plugin.

### Client (`packages/client/src/`)
- `lib/auth-client.ts` — Better Auth React client pointing to `http://localhost:3000`. Must include `adminClient()` plugin so `session.user.role` is typed correctly.
- `authClient.signIn.email({ email, password })` — used in `LoginPage.tsx` to sign in.
- `authClient.signOut()` — used in `Layout.tsx` to sign out.
- `authClient.useSession()` — React hook that returns `{ data: session, isPending }`. Used by route guards and the nav bar.

### Database schema (Prisma)
Schema at `packages/server/prisma/schema.prisma`. Better Auth owns these tables: `User`, `Session`, `Account`, `Verification`. Users have a `role` enum: `admin` | `agent` (default: `agent`).

### Roles
- `admin` — full access; created via seed script
- `agent` — default role for all users

### Seed
Run `bun run seed` (from `packages/server`) to create the initial admin user. Credentials come from env vars: `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME`.

### Environment variables (`packages/server/.env`)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_URL` | Server base URL (e.g. `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Secret key for signing sessions — **required**, server throws on startup if missing |
| `BETTER_AUTH_TRUSTED_ORIGIN` | Allowed client origins, comma-separated (e.g. `http://localhost:5173`) |
| `SEED_ADMIN_EMAIL` | Admin email for seed script |
| `SEED_ADMIN_PASSWORD` | Admin password for seed script |
| `SEED_ADMIN_NAME` | Admin display name for seed script |

## Security

- **Helmet:** Applied globally on all responses
- **CORS:** Restricted to `BETTER_AUTH_TRUSTED_ORIGIN` (comma-separated list)
- **Rate limiting:** `express-rate-limit` on `/api/auth/*` only — **production only** (`NODE_ENV=production`), 100 req / 15 min
- **requireAuth:** Must be applied to all non-public routes
- **requireAdmin:** Use alongside `requireAuth` as `[requireAuth, requireAdmin]` for admin-only routes

## Testing (Playwright)

- Config: `playwright.config.ts` at repo root
- Tests: `e2e/` directory at repo root (empty — no tests written yet)
- Browser: Chromium only
- Test ports: server `3001`, client `5174` (isolated from dev ports 3000/5173)
- Test database: `helpdesk_test` (separate from dev `helpdesk`)
- Env file: `packages/server/.env.test` — loaded via `DOTENV_CONFIG_PATH` in Playwright's webServer config
- Seed test DB: `bun run seed:test` from `packages/server`
- **Important:** `bun --env-file .env.test` must be used (not `DOTENV_CONFIG_PATH=`) when running scripts targeting the test DB, because Bun doesn't propagate inline env vars to dotenv's config path lookup

## Implemented
- **Auth:** Better Auth with email/password sign-in; session-based, DB-backed; admin plugin; self-registration disabled
- **Database:** PostgreSQL via Prisma ORM
- **Routing:** React Router v7 with `ProtectedRoute`, `PublicRoute`, and `AdminRoute` guards
- **Styling:** Tailwind CSS v4 + shadcn/ui (neutral theme)
- **Validation:** react-hook-form + Zod on all forms
- **Role-based UI:** Admin-only `/users` page; nav link conditionally shown based on `session.user.role`
- **Security hardening:** Helmet, CORS from env, rate limiting (prod only), `requireAdmin` middleware, `BETTER_AUTH_SECRET` startup check
- **E2E testing infrastructure:** Playwright configured with isolated test DB and ports

## Planned (not yet implemented)
- **Tickets in DB:** Implement ticket management with Prisma/PostgreSQL
- **AI:** Claude API — ticket classification, summaries, suggested replies
- **Email:** SendGrid or Mailgun for inbound/outbound

## Documentation

Use the **context7 MCP** to fetch up-to-date documentation for any library used in this project before writing or modifying code involving it (React, Vite, Express, Bun, Prisma, Tailwind, React Router, shadcn, Anthropic SDK, etc.).
