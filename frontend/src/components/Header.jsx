import { User } from "lucide-react";

function Header({ user }) {
  return (
    <header className="app-header">
      <div></div>

      <div className="header-user-card">
        <div className="header-user-avatar">
          <User size={18} strokeWidth={1.8} />
        </div>

        <div>
          <p>{user?.name || "Kamana urbain"}</p>
          <strong>{user?.role || "Admin"}</strong>
        </div>
      </div>
    </header>
  );
}

export default Header;