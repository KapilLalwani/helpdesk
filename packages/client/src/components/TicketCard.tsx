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
    <div className="bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl p-5 flex flex-col gap-3 transition-colors">
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-sm font-semibold leading-snug flex-1">{ticket.title}</h3>
        <div className="flex flex-col gap-1 items-end shrink-0">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">{ticket.description}</p>

      <div className="flex items-center justify-between gap-2 mt-auto">
        <span className="text-xs text-slate-500">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-xs text-slate-100 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
          <button
            onClick={() => onDelete(ticket.id)}
            className="text-red-400 border border-red-500/50 hover:bg-red-500/10 rounded-lg px-3 py-1 text-xs transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
