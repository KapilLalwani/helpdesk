import { useNavigate, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export function Layout() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  async function handleSignOut() {
    await authClient.signOut();
    navigate("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between px-8 py-4 bg-slate-800 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-indigo-500">Helpdesk</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">{session?.user.name ?? ""}</span>
          <button
            onClick={handleSignOut}
            className="text-slate-400 hover:text-slate-100 border border-slate-600 hover:border-indigo-500 text-sm rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
