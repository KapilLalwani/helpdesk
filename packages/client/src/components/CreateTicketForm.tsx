import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CreateTicketBody } from "../types/ticket.ts";

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
    <form className="create-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>New Ticket</h2>
      {errors.root && <p className="form-error">{errors.root.message}</p>}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Brief summary of the issue"
          className={errors.title ? "input-error" : undefined}
          {...register("title")}
        />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Describe the problem in detail"
          rows={3}
          className={errors.description ? "input-error" : undefined}
          {...register("description")}
        />
        {errors.description && <p className="form-error">{errors.description.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select id="priority" {...register("priority")}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Create Ticket"}
      </button>
    </form>
  );
}
