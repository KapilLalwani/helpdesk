import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "../lib/auth-client";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@example.com", password: "Password123" },
  });

  async function onSubmit(values: FormValues) {
    const { error } = await authClient.signIn.email(values);
    if (error) {
      setError("root", { message: error.message ?? "Invalid credentials" });
    } else {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        className="bg-slate-800 border border-slate-700 rounded-xl p-8 flex flex-col gap-5 w-full max-w-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold text-indigo-500 text-center">Helpdesk</h1>
        <p className="text-sm text-slate-400 text-center -mt-3">Sign in to your account</p>

        {errors.root && (
          <p className="text-red-500 text-sm">{errors.root.message}</p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoFocus
            className={`bg-slate-700 border rounded-lg px-3 py-2 text-slate-100 text-sm outline-none transition-colors placeholder:text-slate-500 ${
              errors.email ? "border-red-500 focus:border-red-500" : "border-slate-600 focus:border-indigo-500"
            }`}
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className={`bg-slate-700 border rounded-lg px-3 py-2 text-slate-100 text-sm outline-none transition-colors placeholder:text-slate-500 ${
              errors.password ? "border-red-500 focus:border-red-500" : "border-slate-600 focus:border-indigo-500"
            }`}
            {...register("password")}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors cursor-pointer"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
