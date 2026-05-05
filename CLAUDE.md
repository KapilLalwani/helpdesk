# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered helpdesk ticket management system. Agents receive support emails, which become tickets. Claude API handles auto-classification, summaries, and suggested replies. See `project-scope.md` and `implementation-plan.md` for full feature roadmap.

## Monorepo Structure

Bun workspaces with two packages:
- `packages/client` — React + TypeScript + Vite frontend (port 5173)
- `packages/server` — Express 5 + TypeScript backend running under Bun (port 3000)

The client Vite dev server proxies `/api/*` to `http://localhost:3001` (see `vite.config.ts`). The server currently defaults to port 3000 via `process.env.PORT`.

> **Note:** There is a port mismatch — the client proxies to 3001 but the server listens on 3000. Set `PORT=3001` when running the server, or align the ports.

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
- `App.tsx` — Root component
- `hooks/useTickets.ts` — Central data hook: fetches, creates, updates, deletes tickets via `/api/tickets`. All API calls go through this hook.
- `types/ticket.ts` — Mirrors server types (duplicated manually — no shared package yet)
- `components/` — `TicketCard`, `TicketBadge`, `CreateTicketForm`

### API Routes
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check — returns `{ status, timestamp }` |
| GET | `/api/tickets` | List all tickets |
| GET | `/api/tickets/:id` | Get single ticket |
| POST | `/api/tickets` | Create ticket (requires `title`, `description`) |
| PATCH | `/api/tickets/:id` | Update ticket fields |
| DELETE | `/api/tickets/:id` | Delete ticket |

## Documentation

Use the **context7 MCP** to fetch up-to-date documentation for any library used in this project before writing or modifying code involving it (React, Vite, Express, Bun, Prisma, Tailwind, React Router, Anthropic SDK, etc.).

## Planned Stack (not yet implemented)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** DB-backed sessions (no JWTs)
- **AI:** Claude API — ticket classification, summaries, suggested replies
- **Email:** SendGrid or Mailgun for inbound/outbound
- **Styling:** Tailwind CSS
- **Routing:** React Router
