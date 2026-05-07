import type { TicketStatus, TicketPriority } from "../types/ticket.ts";

const statusClasses: Record<TicketStatus, string> = {
  open: "bg-blue-500/15 text-blue-400",
  in_progress: "bg-amber-500/15 text-amber-400",
  resolved: "bg-green-500/15 text-green-400",
  closed: "bg-slate-500/15 text-slate-400",
};

const priorityClasses: Record<TicketPriority, string> = {
  low: "bg-green-500/15 text-green-400",
  medium: "bg-amber-500/15 text-amber-400",
  high: "bg-orange-500/15 text-orange-400",
  critical: "bg-red-500/15 text-red-400",
};

const base = "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap";

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`${base} ${statusClasses[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`${base} ${priorityClasses[priority]}`}>
      {priority}
    </span>
  );
}
