import { useMemo, useState } from "react";
import {
  CalendarDays,
  Coins,
  Download,
  Eye,
  Filter,
  History,
  Receipt,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import { salesHistory as initialSalesHistory, sales as initialSales } from "../data/mockData";
import "../styles/history.css";

const SALES_KEY = "kamana_sales";

function getStoredHistory() {
  const savedSales = localStorage.getItem(SALES_KEY);

  if (savedSales) {
    const parsedSales = JSON.parse(savedSales);

    return parsedSales.map((sale) => ({
      id: sale.id,
      client: sale.client,
      cashier: sale.cashier,
      products: sale.products
        ? `${sale.products.length} article(s)`
        : sale.productsCount || "3 articles",
      total: sale.total,
      date: sale.date,
      status: sale.status,
      productsList: sale.products || [],
      receivedAmount: sale.receivedAmount || "25 000 FBu",
      change: sale.change || "5 000 FBu",
    }));
  }

  if (initialSalesHistory && initialSalesHistory.length > 0) {
    return initialSalesHistory;
  }

  return initialSales;
}

function cleanNumber(value) {
  return Number(String(value).replace(/\D/g, ""));
}

function SalesHistory({ user, onLogout }) {
  const [history] = useState(getStoredHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous statuts");
  const [cashierFilter, setCashierFilter] = useState("Tous caissiers");
  const [selectedSale, setSelectedSale] = useState(null);

  const cashiers = useMemo(() => {
    const uniqueCashiers = [...new Set(history.map((sale) => sale.cashier))];
    return ["Tous caissiers", ...uniqueCashiers];
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter((sale) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        sale.id.toLowerCase().includes(search) ||
        sale.client.toLowerCase().includes(search) ||
        sale.cashier.toLowerCase().includes(search) ||
        sale.total.toLowerCase().includes(search) ||
        sale.products.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "Tous statuts" || sale.status === statusFilter;

      const matchesCashier =
        cashierFilter === "Tous caissiers" || sale.cashier === cashierFilter;

      return matchesSearch && matchesStatus && matchesCashier;
    });
  }, [history, searchTerm, statusFilter, cashierFilter]);

  const totalSales = history.length;

  const cancelledSales = history.filter(
    (sale) => sale.status === "Annulée"
  ).length;

  const totalAmount = history
    .filter((sale) => sale.status === "Terminée")
    .reduce((sum, sale) => sum + cleanNumber(sale.total), 0);

  const bestDay = "Samedi";

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("Tous statuts");
    setCashierFilter("Tous caissiers");
  };

  const handleExport = () => {
    alert("Export simulé : historique des ventes exporté avec succès.");
  };

  return (
    <DashboardLayout activePage="history" user={user} onLogout={onLogout}>
      <section className="history-page">
        <div className="history-header">
          <div>
            <h1>Historique des ventes</h1>
            <p>Consultez l'historique complet des ventes de Kamana&apos;s Bar.</p>
          </div>

          <button type="button" className="history-export-btn" onClick={handleExport}>
            <Download size={15} />
            Exporter
          </button>
        </div>

        <div className="history-stats">
          <article className="history-stat-card">
            <div className="history-stat-icon green">
              <History size={25} />
            </div>

            <div>
              <h3>{totalSales}</h3>
              <p>Ventes totales</p>
            </div>
          </article>

          <article className="history-stat-card">
            <div className="history-stat-icon orange">
              <Coins size={25} />
            </div>

            <div>
              <h3>{totalAmount.toLocaleString("fr-FR")} FBu</h3>
              <p>Montant total</p>
            </div>
          </article>

          <article className="history-stat-card">
            <div className="history-stat-icon green">
              <CalendarDays size={25} />
            </div>

            <div>
              <h3>{bestDay}</h3>
              <p>Meilleur jour</p>
            </div>
          </article>

          <article className="history-stat-card">
            <div className="history-stat-icon red">
              <X size={25} />
            </div>

            <div>
              <h3>{cancelledSales}</h3>
              <p>Ventes annulées</p>
            </div>
          </article>
        </div>

        <div className="history-card">
          <div className="history-toolbar">
            <div className="history-search">
              <Search size={15} />

              <input
                type="text"
                placeholder="Rechercher dans l'historique..."
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

            <button type="button" className="history-reset-btn" onClick={resetFilters}>
              <Filter size={14} />
              Réinitialiser
            </button>
          </div>

          <div className="history-result-line">
            <span>
              {filteredHistory.length} vente(s) trouvée(s) sur {history.length}
            </span>
          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>N° Vente</th>
                <th>Client</th>
                <th>Caissier</th>
                <th>Produits</th>
                <th>Montant total</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>{sale.client}</td>
                    <td>{sale.cashier}</td>
                    <td>{sale.products}</td>
                    <td>{sale.total}</td>
                    <td>{sale.date}</td>
                    <td>
                      <StatusBadge status={sale.status} />
                    </td>
                    <td>
                      <div className="history-actions">
                        <button
                          type="button"
                          className="history-action-view"
                          onClick={() => setSelectedSale(sale)}
                        >
                          <Eye size={13} />
                        </button>

                        <button type="button" className="history-action-ticket">
                          <Receipt size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="history-empty">
                      Aucune vente ne correspond à votre recherche.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedSale && (
          <div className="history-view-overlay">
            <div className="history-view-modal">
              <div className="history-view-header">
                <div className="history-view-title">
                  <div className="history-view-icon">
                    <ShoppingCart size={24} />
                  </div>

                  <div>
                    <h2>Détail historique vente</h2>
                    <p>{selectedSale.id}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="history-view-close"
                  onClick={() => setSelectedSale(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="history-view-main">
                <h3>{selectedSale.client}</h3>
                <StatusBadge status={selectedSale.status} />
              </div>

              <div className="history-view-grid">
                <div className="history-view-item">
                  <ShoppingCart size={16} />
                  <div>
                    <span>N° Vente</span>
                    <strong>{selectedSale.id}</strong>
                  </div>
                </div>

                <div className="history-view-item">
                  <User size={16} />
                  <div>
                    <span>Client</span>
                    <strong>{selectedSale.client}</strong>
                  </div>
                </div>

                <div className="history-view-item">
                  <User size={16} />
                  <div>
                    <span>Caissier</span>
                    <strong>{selectedSale.cashier}</strong>
                  </div>
                </div>

                <div className="history-view-item">
                  <Coins size={16} />
                  <div>
                    <span>Montant total</span>
                    <strong>{selectedSale.total}</strong>
                  </div>
                </div>

                <div className="history-view-item">
                  <CalendarDays size={16} />
                  <div>
                    <span>Date</span>
                    <strong>{selectedSale.date}</strong>
                  </div>
                </div>

                <div className="history-view-item">
                  <Receipt size={16} />
                  <div>
                    <span>Facture</span>
                    <strong>Disponible</strong>
                  </div>
                </div>
              </div>

              <div className="history-view-products">
                <h4>Produits vendus</h4>

                {selectedSale.productsList && selectedSale.productsList.length > 0 ? (
                  selectedSale.productsList.map((product) => (
                    <div className="history-product-line" key={product.id}>
                      <span>
                        {product.name} x{product.quantity}
                      </span>
                      <strong>
                        {(product.quantity * cleanNumber(product.price)).toLocaleString(
                          "fr-FR"
                        )}{" "}
                        FBu
                      </strong>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="history-product-line">
                      <span>Fanta Orange 33cl x2</span>
                      <strong>2 000 FBu</strong>
                    </div>

                    <div className="history-product-line">
                      <span>Brochette de boeuf x3</span>
                      <strong>12 000 FBu</strong>
                    </div>

                    <div className="history-product-line">
                      <span>Primus 33cl x4</span>
                      <strong>6 000 FBu</strong>
                    </div>
                  </>
                )}
              </div>

              <div className="history-payment-box">
                <div>
                  <span>Montant reçu</span>
                  <strong>{selectedSale.receivedAmount || "25 000 FBu"}</strong>
                </div>

                <div>
                  <span>Monnaie rendue</span>
                  <strong>{selectedSale.change || "5 000 FBu"}</strong>
                </div>
              </div>

              <div className="history-view-actions">
                <button
                  type="button"
                  className="history-view-cancel"
                  onClick={() => setSelectedSale(null)}
                >
                  Fermer
                </button>

                <button type="button" className="history-view-export">
                  <Download size={14} />
                  Exporter
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default SalesHistory;