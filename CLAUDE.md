# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered helpdesk ticket management system. Agents receive support emails, which become tickets. Claude API handles auto-classification, summaries, and suggested replies. See `project-scope.md` and `implementation-plan.md` for full feature roadmap.

## Monorepo Structure

Bun workspaces with two packages:
- `packages/client` — React + TypeScript + Vite frontend (port 5173)
- `packages/server` — Express 5 + TypeScript backend running under Bun (port 3000)

The client Vite dev server proxies `/api/*` to `http://localhost:3000` (see `vite.config.ts`).

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
```

## Architecture

### Server (`packages/server/src/`)
- `index.ts` — Express app setup: CORS (origin: localhost:5173), JSON body parsing, health route, server listen
- `routes/tickets.ts` — Full CRUD for tickets; data is **in-memory only** (no DB yet). Tickets live in a module-level array.
- `types/ticket.ts` — Shared `Ticket`, `TicketStatus`, `TicketPriority`, `CreateTicketBody`, `UpdateTicketBody` types

### Client (`packages/client/src/`)
- `App.tsx` — Root component; React Router routes with `ProtectedRoute` / `PublicRoute` guards
- `hooks/useTickets.ts` — Central data hook: fetches, creates, updates, deletes tickets via `/api/tickets`. All API calls go through this hook.
- `types/ticket.ts` — Mirrors server types (duplicated manually — no shared package yet)
- `lib/auth-client.ts` — Better Auth client instance
- `components/Layout.tsx` — App shell: top nav with sign-out button, renders `<Outlet />`
- `components/LoginPage.tsx` — Auth form using Better Auth `signIn.email`
- `components/HomePage.tsx` — Ticket list + create form
- `components/TicketCard.tsx` — Single ticket display with status change and delete
- `components/TicketBadge.tsx` — `StatusBadge` and `PriorityBadge` using shadcn `Badge`
- `components/CreateTicketForm.tsx` — New ticket form with react-hook-form + Zod

### API Routes
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check — returns `{ status, timestamp }` |
| GET | `/api/tickets` | List all tickets |
| GET | `/api/tickets/:id` | Get single ticket |
| POST | `/api/tickets` | Create ticket (requires `title`, `description`) |
| PATCH | `/api/tickets/:id` | Update ticket fields |
| DELETE | `/api/tickets/:id` | Delete ticket |

## UI

The client uses **shadcn/ui** with Tailwind v4. Config is at `packages/client/components.json`.

- Style: `base-nova`, base color: `neutral`, CSS variables enabled
- Components installed: `button`, `card`, `input`, `label`, `badge`, `select`, `textarea`
- The `@` alias resolves to `packages/client/src`
- Always use semantic theme tokens (`bg-background`, `text-muted-foreground`, `text-destructive`, etc.) — never hardcode color classes like `slate-*` or `indigo-*`
- shadcn `Select` is built on `@base-ui/react` — use react-hook-form `Controller` to wire it up, not `register()`

## Authentication

**Library:** [Better Auth](https://www.better-auth.com/) with the `admin` plugin.

### Server (`packages/server/src/`)
- `auth.ts` — Better Auth instance using the Prisma adapter (PostgreSQL). Email/password enabled. Self-registration is **disabled** (`disabledPaths: ["/sign-up/email"]`) — accounts must be created via the seed script or admin tools.
- `index.ts` — Auth handler mounted at `/api/auth/*` via `toNodeHandler(auth)`. Must be registered **before** `express.json()`.
- `middleware/requireAuth.ts` — Express middleware that validates the session from request headers using `auth.api.getSession`. Attaches the session to `res.locals.session`. Returns `401` if unauthenticated.

### Client (`packages/client/src/`)
- `lib/auth-client.ts` — Better Auth React client pointing to `http://localhost:3000`.
- `authClient.signIn.email({ email, password })` — used in `LoginPage.tsx` to sign in.
- `authClient.signOut()` — used in `Layout.tsx` to sign out.
- `authClient.useSession()` — React hook that returns `{ data: session, isPending }`. Used by route guards and the nav bar.
- `components/ProtectedRoute.tsx` — Redirects to `/login` if no session. `PublicRoute` redirects to `/` if already authenticated.

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
| `BETTER_AUTH_SECRET` | Secret key for signing sessions |
| `BETTER_AUTH_TRUSTED_ORIGIN` | Allowed client origin (e.g. `http://localhost:5173`) |
| `SEED_ADMIN_EMAIL` | Admin email for seed script |
| `SEED_ADMIN_PASSWORD` | Admin password for seed script |
| `SEED_ADMIN_NAME` | Admin display name for seed script |

## Implemented
- **Auth:** Better Auth with email/password sign-in; session-based, DB-backed; admin plugin; self-registration disabled
- **Database:** PostgreSQL via Prisma ORM (auth tables live in DB; tickets are still in-memory)
- **Routing:** React Router v7 with protected/public route guards
- **Styling:** Tailwind CSS v4 + shadcn/ui (neutral theme)
- **Validation:** react-hook-form + Zod on all forms

## Planned (not yet implemented)
- **Tickets in DB:** Migrate tickets from in-memory array to Prisma/PostgreSQL
- **AI:** Claude API — ticket classification, summaries, suggested replies
- **Email:** SendGrid or Mailgun for inbound/outbound

## Documentation

Use the **context7 MCP** to fetch up-to-date documentation for any library used in this project before writing or modifying code involving it (React, Vite, Express, Bun, Prisma, Tailwind, React Router, shadcn, Anthropic SDK, etc.).
