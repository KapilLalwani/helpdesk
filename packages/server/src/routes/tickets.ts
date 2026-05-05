import { Router, type Request, type Response } from "express";
import prisma from "../db.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const tickets = await prisma.ticket.findMany({ orderBy: { createdAt: "desc" } });
  res.json(tickets);
});

router.get("/:id", async (req: Request, res: Response) => {
  const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.json(ticket);
});

router.post("/", async (req: Request, res: Response) => {
  const { title, description, status, priority } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: "title and description are required" });
    return;
  }
  const ticket = await prisma.ticket.create({
    data: { title, description, status, priority },
  });
  res.status(201).json(ticket);
});

router.patch("/:id", async (req: Request, res: Response) => {
  const { title, description, status, priority } = req.body;
  const ticket = await prisma.ticket.update({
    where: { id: req.params.id },
    data: { title, description, status, priority },
  }).catch(() => null);
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.json(ticket);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await prisma.ticket.delete({ where: { id: req.params.id } }).catch(() => null);
  res.status(204).send();
});

export default router;
