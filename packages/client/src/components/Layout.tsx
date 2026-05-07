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
    <div className="app">
      <header className="app-header">
        <h1>Helpdesk</h1>
        <div className="nav-user">
          <span className="nav-user-name">{session?.user.name ?? ""}</span>
          <button className="btn btn-signout" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
