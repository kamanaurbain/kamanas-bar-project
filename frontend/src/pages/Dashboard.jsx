import {
  FileText,
  ShoppingCart,
  Trophy,
  User,
  Users,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";

import {
  dashboardStats,
  dashboardSalesEvolution,
  dashboardRecentSales,
  dashboardRecentInvoices,
  dashboardTopProducts,
} from "../data/mockData";

import "../styles/dashboard.css";

function StatCard({ stat }) {
  const icons = {
    Produits: Trophy,
    Ventes: ShoppingCart,
    Factures: FileText,
    Utilisateur: Users,
  };

  const Icon = icons[stat.title] || Trophy;

  return (
    <article className="dashboard-stat-card">
      <div className={`dashboard-stat-icon ${stat.color}`}>
        <Icon size={30} strokeWidth={1.8} />
      </div>

      <div className="dashboard-stat-info">
        <div className="dashboard-stat-title-row">
          <span>{stat.title}</span>
          <small>↑ {stat.percent}</small>
        </div>

        <h2>{stat.value}</h2>
        <p>{stat.subtitle}</p>
      </div>
    </article>
  );
}

function SalesEvolutionChart() {
  const maxValue = 2.5;

  return (
    <div className="dashboard-chart">
      <div className="dashboard-chart-y">
        <span>2.5M</span>
        <span>2M</span>
        <span>1.5M</span>
        <span>1M</span>
        <span>500k</span>
      </div>

      <div className="dashboard-chart-bars">
        {dashboardSalesEvolution.map((item) => (
          <div className="dashboard-chart-item" key={item.day}>
            <div
              className="dashboard-chart-bar"
              style={{ height: `${(item.value / maxValue) * 92}px` }}
            ></div>
            <span>{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentSalesTable() {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Dernieres ventes</h3>
        <button type="button">Tous les ventes</button>
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>N° Vente</th>
            <th>Client</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>

        <tbody>
          {dashboardRecentSales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.client}</td>
              <td>{sale.amount}</td>
              <td>{sale.date}</td>
              <td>
                <StatusBadge status={sale.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function RecentInvoicesTable() {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Factures récentes</h3>
        <button type="button">Tous les factures</button>
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>N° Facture</th>
            <th>Client</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>

        <tbody>
          {dashboardRecentInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.client}</td>
              <td>{invoice.amount}</td>
              <td>{invoice.date}</td>
              <td>
                <StatusBadge status={invoice.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function TopProductsTable() {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Top produits</h3>
        <button type="button">Tous les ventes</button>
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Categorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Statut</th>
          </tr>
        </thead>

        <tbody>
          {dashboardTopProducts.map((product) => (
            <tr key={product.name}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>
                <StatusBadge status={product.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Dashboard({ user, onLogout }) {
  return (
    <DashboardLayout
      activePage="dashboard"
      user={user}
      onLogout={onLogout}
      showHeader={false}
    >
      <div className="dashboard-page-content">
        <header className="dashboard-topbar">
          <h1>Tableau de bord</h1>

          <div className="dashboard-user-card">
            <div className="dashboard-user-avatar">
              <User size={18} strokeWidth={1.8} />
            </div>

            <div>
              <p>{user?.name || "Kamana urbain"}</p>
              <strong>{user?.role || "Admin"}</strong>
            </div>
          </div>
        </header>

        <section className="dashboard-stats-row">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </section>

        <section className="dashboard-main-grid">
          <section className="dashboard-panel dashboard-chart-panel">
            <div className="dashboard-panel-header">
              <h3>Evolutions des ventes</h3>
              <button type="button">7 dernier jours</button>
            </div>

            <SalesEvolutionChart />
          </section>

          <RecentSalesTable />

          <RecentInvoicesTable />

          <TopProductsTable />
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;