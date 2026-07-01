import {
  BarChart3,
  Trophy,
  ShoppingCart,
  FileText,
  History,
  Users,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

function Sidebar({ activePage = "dashboard", onLogout }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: BarChart3,
      path: "/dashboard",
    },
    {
      id: "products",
      label: "Produits",
      icon: Trophy,
      path: "/products",
    },
    {
      id: "sales",
      label: "Ventes",
      icon: ShoppingCart,
      path: "/sales",
    },
    {
      id: "invoices",
      label: "Factures",
      icon: FileText,
      path: "/invoices",
    },
    {
      id: "history",
      label: "Historique ventes",
      icon: History,
      path: "/history",
    },
    {
      id: "users",
      label: "Utilisateurs",
      icon: Users,
      path: "/users",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-wrapper">
        <img src={logo} alt="Kamana's Bar" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`sidebar-link ${activePage === item.id ? "active" : ""}`}
            >
              <Icon size={17} strokeWidth={1.9} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <button type="button" className="sidebar-link logout-link" onClick={onLogout}>
          <LogOut size={17} strokeWidth={1.9} />
          <span>Se Deconnecter</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;