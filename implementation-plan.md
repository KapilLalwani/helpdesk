# Implementation Plan

## Phase 1 — Project Setup & Infrastructure

- [ ] Initialise monorepo structure (`/client`, `/server`)
- [ ] Set up Express server with TypeScript
- [ ] Set up React app with TypeScript
- [ ] Set up PostgreSQL database

---

## Phase 2 — Authentication & User Management

- [ ] Design `User` and `Session` Prisma models
- [ ] Seed initial admin account on first deployment
- [ ] Implement login endpoint (email + password → session token)
- [ ] Implement logout endpoint (invalidate session)
- [ ] Implement session middleware (validate token on protected routes)
- [ ] Admin: create agent endpoint
- [ ] Admin: list agents endpoint
- [ ] Admin: deactivate/delete agent endpoint
- [ ] Role-based access control middleware (admin vs. agent)

---

## Phase 3 — Ticket Core

- [ ] Design `Ticket` Prisma model (status, category, assignee, timestamps, etc.)
- [ ] Create ticket endpoint (manual creation for testing)
- [ ] List tickets endpoint (with filtering by status/category and sorting)
- [ ] Get single ticket endpoint
- [ ] Update ticket status endpoint (open → resolved → closed)
- [ ] Assign ticket to agent endpoint
- [ ] Add internal notes / activity log to ticket

---

## Phase 4 — Email Integration

- [ ] Choose SendGrid or Mailgun and set up account/domain
- [ ] Configure inbound email webhook (parse incoming emails → create tickets)
- [ ] Map email fields to ticket fields (sender, subject → ticket title, body)
- [ ] Implement outbound email sending (send reply from ticket detail)
- [ ] Associate replies with the correct ticket (via email threading)
- [ ] Handle edge cases: duplicate emails, bounces, malformed payloads

---

## Phase 5 — AI Features

- [ ] Integrate Claude API (Anthropic SDK, API key config)
- [ ] Auto-classify ticket category on creation (General / Technical / Refund)
- [ ] Generate AI summary for each ticket
- [ ] Generate AI-suggested reply for each ticket
- [ ] Surface AI suggestions in ticket detail (agent can accept, edit, or ignore)
- [ ] Prompt tuning: test classification accuracy across ticket types
- [ ] Add knowledge base input to response generation (static docs or FAQ)

---

## Phase 6 — Frontend

- [ ] Set up React Router with protected routes (redirect to login if unauthenticated)
- [ ] Login page
- [ ] Dashboard — summary stats (open/resolved/closed counts, recent tickets)
- [ ] Ticket list page — filterable by status and category, sortable
- [ ] Ticket detail page — full thread, AI summary, AI-suggested reply, status actions
- [ ] Reply composer — pre-fill with AI suggestion, editable before sending
- [ ] User management page (admin only) — list, create, and deactivate agents
- [ ] Toast notifications / error handling throughout

---

## Phase 7 — Deployment

- [ ] Write production Dockerfiles for client and server
- [ ] Finalise `docker-compose.yml` for production (app + DB + reverse proxy)
- [ ] Choose cloud provider and provision infrastructure
- [ ] Set up managed PostgreSQL on cloud provider
- [ ] Configure environment variables and secrets in cloud environment
- [ ] Set up CI/CD pipeline (lint, build, test, deploy on merge to main)
- [ ] Configure custom domain and TLS/SSL
- [ ] Smoke test full flow in production (email in → ticket created → AI reply → sent)
