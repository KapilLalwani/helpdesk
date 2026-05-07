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

const inputBase =
  "bg-slate-700 border rounded-lg px-3 py-2 text-slate-100 text-sm outline-none transition-colors placeholder:text-slate-500 w-full";
const inputNormal = "border-slate-600 focus:border-indigo-500";
const inputError = "border-red-500 focus:border-red-500";

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
    <form
      className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-base font-semibold">New Ticket</h2>

      {errors.root && <p className="text-red-500 text-xs">{errors.root.message}</p>}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Brief summary of the issue"
          className={`${inputBase} ${errors.title ? inputError : inputNormal}`}
          {...register("title")}
        />
        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Describe the problem in detail"
          rows={3}
          className={`${inputBase} ${errors.description ? inputError : inputNormal} resize-y`}
          {...register("description")}
        />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="priority" className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Priority
        </label>
        <select
          id="priority"
          className={`${inputBase} ${inputNormal} cursor-pointer`}
          {...register("priority")}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors cursor-pointer"
      >
        {isSubmitting ? "Creating…" : "Create Ticket"}
      </button>
    </form>
  );
}
