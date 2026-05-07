import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CreateTicketBody } from "../types/ticket.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high", "critical"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onCreate: (body: CreateTicketBody) => Promise<void>;
}

export function CreateTicketForm({ onCreate }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", priority: "medium" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await onCreate({ ...values, status: "open" });
      reset();
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to create ticket",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">New Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {errors.root && (
            <p className="text-xs text-destructive">{errors.root.message}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief summary of the issue"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the problem in detail"
              rows={3}
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="priority">Priority</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating…" : "Create Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
