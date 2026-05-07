import { useNavigate, Outlet, Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { Button } from "@/components/ui/button";

export function Layout() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  async function handleSignOut() {
    await authClient.signOut();
    navigate("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">Helpdesk</h1>
          {session?.user.role === "admin" && (
            <Link to="/users" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Users
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{session?.user.name ?? ""}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
