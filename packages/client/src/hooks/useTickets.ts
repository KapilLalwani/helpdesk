import { useState, useEffect, useCallback } from "react";
import type { Ticket, CreateTicketBody } from "../types/ticket.ts";

const API = "/api/tickets";

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Ticket[];
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Ticket[]>;
      })
      .then((data) => {
        if (!ignore) setTickets(data);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const createTicket = useCallback(
    async (body: CreateTicketBody) => {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchTickets();
    },
    [fetchTickets],
  );

  const updateTicket = useCallback(
    async (id: string, updates: Partial<CreateTicketBody>) => {
      const res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchTickets();
    },
    [fetchTickets],
  );

  const deleteTicket = useCallback(
    async (id: string) => {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    },
    [],
  );

  return { tickets, loading, error, createTicket, updateTicket, deleteTicket, refetch: fetchTickets };
}
