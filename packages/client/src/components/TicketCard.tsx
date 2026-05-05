import type { Ticket, TicketStatus } from "../types/ticket.ts";
import { StatusBadge, PriorityBadge } from "./TicketBadge.tsx";

interface Props {
  ticket: Ticket;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TicketStatus) => void;
}

const STATUSES: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];

export function TicketCard({ ticket, onDelete, onStatusChange }: Props) {
  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <h3 className="ticket-title">{ticket.title}</h3>
        <div className="ticket-badges">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>
      <p className="ticket-description">{ticket.description}</p>
      <div className="ticket-card-footer">
        <span className="ticket-date">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
        <div className="ticket-actions">
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
            className="status-select"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
          <button
            onClick={() => onDelete(ticket.id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
