import type { Ticket, TicketStatus } from "../types/ticket.ts";
import { StatusBadge, PriorityBadge } from "./TicketBadge.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  ticket: Ticket;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TicketStatus) => void;
}

const STATUSES: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];

export function TicketCard({ ticket, onDelete, onStatusChange }: Props) {
  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="flex flex-row justify-between items-start gap-2 pb-0">
        <h3 className="text-sm font-semibold leading-snug flex-1">{ticket.title}</h3>
        <div className="flex flex-col gap-1 items-end shrink-0">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{ticket.description}</p>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="text-xs text-muted-foreground">
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-2">
            <Select
              value={ticket.status}
              onValueChange={(value) => onStatusChange(ticket.id, value as TicketStatus)}
            >
              <SelectTrigger className="h-7 text-xs w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onDelete(ticket.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
