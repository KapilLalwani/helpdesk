import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export function ProtectedRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div className="text-muted-foreground text-center py-16">Loading…</div>;
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function PublicRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div className="text-muted-foreground text-center py-16">Loading…</div>;
  if (session) return <Navigate to="/" replace />;
  return <Outlet />;
}
