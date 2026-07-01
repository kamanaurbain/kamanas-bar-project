import { useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  X,
  Receipt,
  User,
  CalendarDays,
  Coins,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import { sales as initialSales } from "../data/mockData";
import "../styles/sales.css";

const STORAGE_KEY = "kamana_sales";

function getStoredSales() {
  const savedSales = localStorage.getItem(STORAGE_KEY);
  return savedSales ? JSON.parse(savedSales) : initialSales;
}

function Sales({ user, onLogout }) {
  const [sales, setSales] = useState(getStoredSales);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous statuts");
  const [cashierFilter, setCashierFilter] = useState("Tous caissiers");
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [saleToView, setSaleToView] = useState(null);

  const saveSales = (updatedSales) => {
    setSales(updatedSales);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
  };

  const cashiers = useMemo(() => {
    const uniqueCashiers = [...new Set(sales.map((sale) => sale.cashier))];
    return ["Tous caissiers", ...uniqueCashiers];
  }, [sales]);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        sale.id.toLowerCase().includes(search) ||
        sale.client.toLowerCase().includes(search) ||
        sale.cashier.toLowerCase().includes(search) ||
        sale.total.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "Tous statuts" || sale.status === statusFilter;

      const matchesCashier =
        cashierFilter === "Tous caissiers" || sale.cashier === cashierFilter;

      return matchesSearch && matchesStatus && matchesCashier;
    });
  }, [sales, searchTerm, statusFilter, cashierFilter]);

  const todaySales = sales.filter((sale) => sale.status === "Terminée").length;
  const cancelledSales = sales.filter((sale) => sale.status === "Annulée").length;
  const generatedInvoices = sales.filter((sale) => sale.status === "Terminée").length;

  const totalAmount = sales
    .filter((sale) => sale.status === "Terminée")
    .reduce((sum, sale) => {
      const number = Number(String(sale.total).replace(/\D/g, ""));
      return sum + number;
    }, 0);

  const handleDelete = () => {
    if (!saleToDelete) return;

    const updatedSales = sales.filter((sale) => sale.id !== saleToDelete.id);
    saveSales(updatedSales);
    setSaleToDelete(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("Tous statuts");
    setCashierFilter("Tous caissiers");
  };

  return (
    <DashboardLayout activePage="sales" user={user} onLogout={onLogout}>
      <section className="sales-page">
        <div className="sales-header">
          <div>
            <h1>Gestion des ventes</h1>
            <p>Gerer les ventes locales du bistro et générer les factures.</p>
          </div>

          <Link to="/sales/add" className="sales-add-btn">
            <Plus size={15} />
            Nouvelle vente
          </Link>
        </div>

        <div className="sales-stats">
          <article className="sale-stat-card">
            <div className="sale-stat-icon green">
              <ShoppingCart size={25} />
            </div>
            <div>
              <h3>{todaySales}</h3>
              <p>Ventes du jour</p>
            </div>
          </article>

          <article className="sale-stat-card">
            <div className="sale-stat-icon orange">
              <Coins size={25} />
            </div>
            <div>
              <h3>{totalAmount.toLocaleString("fr-FR")} FBu</h3>
              <p>Chiffre d’affaires</p>
            </div>
          </article>

          <article className="sale-stat-card">
            <div className="sale-stat-icon green">
              <Receipt size={25} />
            </div>
            <div>
              <h3>{generatedInvoices}</h3>
              <p>Factures générées</p>
            </div>
          </article>

          <article className="sale-stat-card">
            <div className="sale-stat-icon red">
              <X size={25} />
            </div>
            <div>
              <h3>{cancelledSales}</h3>
              <p>Ventes annulées</p>
            </div>
          </article>
        </div>

        <div className="sales-card">
          <div className="sales-toolbar">
            <div className="sales-search">
              <Search size={15} />
              <input
                type="text"
                placeholder="Rechercher une vente..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>Tous statuts</option>
              <option>Terminée</option>
              <option>Annulée</option>
            </select>

            <select
              value={cashierFilter}
              onChange={(event) => setCashierFilter(event.target.value)}
            >
              {cashiers.map((cashier) => (
                <option key={cashier}>{cashier}</option>
              ))}
            </select>

            <button type="button" className="sales-reset-btn" onClick={resetFilters}>
              <Filter size={14} />
              Réinitialiser
            </button>
          </div>

          <div className="sales-result-line">
            <span>
              {filteredSales.length} vente(s) trouvée(s) sur {sales.length}
            </span>
          </div>

          <table className="sales-table">
            <thead>
              <tr>
                <th>N° Vente</th>
                <th>Client</th>
                <th>Caissier</th>
                <th>Montant total</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>{sale.client}</td>
                    <td>{sale.cashier}</td>
                    <td>{sale.total}</td>
                    <td>{sale.date}</td>
                    <td>
                      <StatusBadge status={sale.status} />
                    </td>
                    <td>
                      <div className="sales-actions">
                        <button
                          type="button"
                          className="sale-action-view"
                          onClick={() => setSaleToView(sale)}
                        >
                          <Eye size={13} />
                        </button>

                        <Link to={`/sales/edit/${sale.id}`} className="sale-action-edit">
                          <Pencil size={13} />
                        </Link>

                        <button
                          type="button"
                          className="sale-action-delete"
                          onClick={() => setSaleToDelete(sale)}
                        >
                          <Trash2 size={13} />
                        </button>

                        <button type="button" className="sale-action-invoice">
                          <Receipt size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="sales-empty">
                      Aucune vente ne correspond à votre recherche.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {saleToView && (
          <div className="sale-view-overlay">
            <div className="sale-view-modal">
              <div className="sale-view-header">
                <div className="sale-view-title">
                  <div className="sale-view-icon">
                    <ShoppingCart size={24} />
                  </div>

                  <div>
                    <h2>Détail de la vente</h2>
                    <p>{saleToView.id}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="sale-view-close"
                  onClick={() => setSaleToView(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="sale-view-main">
                <h3>{saleToView.client}</h3>
                <StatusBadge status={saleToView.status} />
              </div>

              <div className="sale-view-grid">
                <div className="sale-view-item">
                  <User size={16} />
                  <div>
                    <span>Client</span>
                    <strong>{saleToView.client}</strong>
                  </div>
                </div>

                <div className="sale-view-item">
                  <User size={16} />
                  <div>
                    <span>Caissier</span>
                    <strong>{saleToView.cashier}</strong>
                  </div>
                </div>

                <div className="sale-view-item">
                  <Coins size={16} />
                  <div>
                    <span>Montant total</span>
                    <strong>{saleToView.total}</strong>
                  </div>
                </div>

                <div className="sale-view-item">
                  <CalendarDays size={16} />
                  <div>
                    <span>Date</span>
                    <strong>{saleToView.date}</strong>
                  </div>
                </div>

                <div className="sale-view-item">
                  <Receipt size={16} />
                  <div>
                    <span>Facture</span>
                    <strong>Générée automatiquement</strong>
                  </div>
                </div>
              </div>

              <div className="sale-view-description">
                <span>Information</span>
                <p>
                  Cette vente est enregistrée localement. Le paiement est fait
                  directement au caissier, sans paiement en ligne.
                </p>
              </div>

              <div className="sale-view-actions">
                <button
                  type="button"
                  className="sale-view-cancel"
                  onClick={() => setSaleToView(null)}
                >
                  Fermer
                </button>

                <Link to={`/sales/edit/${saleToView.id}`} className="sale-view-edit">
                  <Pencil size={14} />
                  Modifier
                </Link>
              </div>
            </div>
          </div>
        )}

        {saleToDelete && (
          <div className="sale-delete-overlay">
            <div className="sale-delete-modal">
              <div className="sale-delete-icon">
                <Trash2 size={28} />
              </div>

              <h2>Supprimer cette vente ?</h2>

              <p>Cette action supprimera la vente sélectionnée de la liste.</p>

              <div className="sale-delete-name">
                {saleToDelete.id} — {saleToDelete.client}
              </div>

              <div className="sale-delete-warning">
                Cette suppression est simulée côté frontend.
              </div>

              <div className="sale-delete-actions">
                <button
                  type="button"
                  className="sale-delete-cancel"
                  onClick={() => setSaleToDelete(null)}
                >
                  Annuler
                </button>

                <button
                  type="button"
                  className="sale-delete-confirm"
                  onClick={handleDelete}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default Sales;