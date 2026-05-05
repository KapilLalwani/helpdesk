import { useState, type FormEvent } from "react";
import type { CreateTicketBody, TicketPriority } from "../types/ticket.ts";

interface Props {
  onCreate: (body: CreateTicketBody) => Promise<void>;
}

export function CreateTicketForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await onCreate({ title, description, priority, status: "open" });
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <h2>New Ticket</h2>
      {formError && <p className="form-error">{formError}</p>}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of the issue"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the problem in detail"
          rows={3}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TicketPriority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Creating..." : "Create Ticket"}
      </button>
    </form>
  );
}
