import type { TicketStatus, TicketPriority } from "../types/ticket.ts";
import { Badge } from "@/components/ui/badge";

const statusVariant: Record<TicketStatus, "default" | "secondary" | "outline" | "destructive"> = {
  open: "default",
  in_progress: "secondary",
  resolved: "outline",
  closed: "outline",
};

const priorityVariant: Record<TicketPriority, "default" | "secondary" | "outline" | "destructive"> = {
  low: "outline",
  medium: "secondary",
  high: "default",
  critical: "destructive",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge variant={statusVariant[status]}>
      {status.replace("_", " ")}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <Badge variant={priorityVariant[priority]}>
      {priority}
    </Badge>
  );
}
