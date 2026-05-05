import { Router, type Request, type Response } from "express";
import type { Ticket, CreateTicketBody, UpdateTicketBody } from "../types/ticket.ts";
import { randomUUID } from "crypto";

const router = Router();

const tickets: Ticket[] = [
  {
    id: randomUUID(),
    title: "Login page crashes on mobile",
    description: "Users report a white screen after tapping the login button on iOS Safari.",
    status: "open",
    priority: "high",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    title: "Export to CSV broken",
    description: "The export button in the reports section produces an empty file.",
    status: "in_progress",
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

router.get("/", (_req: Request, res: Response) => {
  res.json(tickets);
});

router.get("/:id", (req: Request, res: Response) => {
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.json(ticket);
});

router.post("/", (req: Request, res: Response) => {
  const body = req.body as CreateTicketBody;
  if (!body.title || !body.description) {
    res.status(400).json({ error: "title and description are required" });
    return;
  }
  const ticket: Ticket = {
    id: randomUUID(),
    title: body.title,
    description: body.description,
    status: body.status ?? "open",
    priority: body.priority ?? "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  res.status(201).json(ticket);
});

router.patch("/:id", (req: Request, res: Response) => {
  const index = tickets.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  const updates = req.body as UpdateTicketBody;
  tickets[index] = {
    ...tickets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  res.json(tickets[index]);
});

router.delete("/:id", (req: Request, res: Response) => {
  const index = tickets.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  tickets.splice(index, 1);
  res.status(204).send();
});

export default router;
