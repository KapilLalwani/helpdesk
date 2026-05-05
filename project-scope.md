# AI-Powered Ticket Management System

## Problem

We receive hundreds of support emails daily. Our agents maually read, classify, and respond to each ticket - which is slow and leads to impersonal, channel responses.

## Solution

Build a ticket management system that uses AI to automatically classify, respond to, and route support tickets - delivering faster, more personalized responses to students while freeing up agents for complex issues

## Features

- Receive support emails and create tickets
- Auto-generate human-friendly responses using a knowledge base
- Ticket list with filtering and sorting
- Ticket detail view
- AI-powered ticket classification
- AI summaries
- AI-suggested replies
- User management (admin only)
- Dashboard to view and manage all tickets

## Ticket Statuses

- **Open** — ticket has been received and is awaiting resolution
- **Resolved** — ticket has been addressed and a response sent
- **Closed** — ticket is fully closed (no further action needed)

## Ticket Categories

Each ticket belongs to exactly one category:

- **General Question** — general enquiries not fitting other categories
- **Technical Question** — issues related to technical problems or system usage
- **Refund Request** — requests for refunds or payment-related matters

## User Roles

- **Admin** — the initial user seeded at deployment; can create and manage agent accounts, has full system access
- **Agent** — created by an admin; can view, manage, and respond to tickets

## Technology Stack

**Frontend**
- React with TypeScript
- Tailwind CSS for styling
- React Router for client-side routing

**Backend**
- Node.js with Express and TypeScript
- Prisma ORM
- PostgreSQL database

**Authentication**
- Database sessions (session tokens stored in DB, not JWTs)

**AI**
- Claude API (Anthropic) — classification, summaries, suggested replies

**Email**
- SendGrid or Mailgun for inbound email ingestion and outbound sending

**Deployment**
- Docker for containerisation
- Cloud provider TBD (e.g. AWS, GCP, or Azure)