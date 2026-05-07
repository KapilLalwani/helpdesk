import { useTickets } from "../hooks/useTickets.ts";
import { TicketCard } from "./TicketCard.tsx";
import { CreateTicketForm } from "./CreateTicketForm.tsx";

export function HomePage() {
  const { tickets, loading, error, createTicket, updateTicket, deleteTicket } = useTickets();

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <CreateTicketForm onCreate={createTicket} />

      {loading && (
        <p className="text-sm text-muted-foreground text-center py-8">Loading tickets…</p>
      )}

      {error && (
        <p className="text-sm text-destructive text-center py-8">{error}</p>
      )}

      {!loading && !error && tickets.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No tickets yet. Create one above.
        </p>
      )}

      {!loading && tickets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onDelete={deleteTicket}
              onStatusChange={(id, status) => updateTicket(id, { status })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
