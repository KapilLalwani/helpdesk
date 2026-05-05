import type { TicketStatus, TicketPriority } from "../types/ticket.ts";

const statusColors: Record<TicketStatus, string> = {
  open: "badge-open",
  in_progress: "badge-progress",
  resolved: "badge-resolved",
  closed: "badge-closed",
};

const priorityColors: Record<TicketPriority, string> = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
  critical: "priority-critical",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`badge ${statusColors[status]}`}>{status.replace("_", " ")}</span>;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <span className={`badge ${priorityColors[priority]}`}>{priority}</span>;
}
