import { useMemo, useState } from "react";
import {
  CalendarDays,
  Coins,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  Printer,
  Receipt,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { invoices as initialInvoices, invoiceProducts } from "../data/mockData";
import "../styles/invoices.css";

const STORAGE_KEY = "kamana_invoices";

function getStoredInvoices() {
  const savedInvoices = localStorage.getItem(STORAGE_KEY);
  return savedInvoices ? JSON.parse(savedInvoices) : initialInvoices;
}

function cleanNumber(value) {
  return Number(String(value).replace(/\D/g, ""));
}

function Invoices({ user, onLogout }) {
  const [invoices, setInvoices] = useState(getStoredInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous statuts");
  const [cashierFilter, setCashierFilter] = useState("Tous caissiers");
  const [invoiceToView, setInvoiceToView] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const saveInvoices = (updatedInvoices) => {
    setInvoices(updatedInvoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
  };

  const cashiers = useMemo(() => {
    const uniqueCashiers = [...new Set(invoices.map((invoice) => invoice.cashier))];
    return ["Tous caissiers", ...uniqueCashiers];
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        invoice.id.toLowerCase().includes(search) ||
        invoice.saleId.toLowerCase().includes(search) ||
        invoice.client.toLowerCase().includes(search) ||
        invoice.cashier.toLowerCase().includes(search) ||
        invoice.total.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "Tous statuts" || invoice.status === statusFilter;

      const matchesCashier =
        cashierFilter === "Tous caissiers" || invoice.cashier === cashierFilter;

      return matchesSearch && matchesStatus && matchesCashier;
    });
  }, [invoices, searchTerm, statusFilter, cashierFilter]);

  const paidInvoices = invoices.filter((invoice) => invoice.status === "Payée").length;
  const deletedInvoices = invoices.filter((invoice) => invoice.status === "Supprimée").length;

  const totalAmount = invoices
    .filter((invoice) => invoice.status === "Payée")
    .reduce((sum, invoice) => sum + cleanNumber(invoice.total), 0);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("Tous statuts");
    setCashierFilter("Tous caissiers");
  };

  const handleDelete = () => {
    if (!invoiceToDelete) return;

    const updatedInvoices = invoices.filter(
      (invoice) => invoice.id !== invoiceToDelete.id
    );

    saveInvoices(updatedInvoices);
    setInvoiceToDelete(null);
  };

  return (
    <DashboardLayout activePage="invoices" user={user} onLogout={onLogout}>
      <section className="invoices-page">
        <div className="invoices-header">
          <div>
            <h1>Gestion des factures</h1>
            <p>Consultez et gérez les factures générées par les ventes.</p>
          </div>

          {/* <Link to="/invoices/add" className="invoice-add-btn">
            <Plus size={15} />
            Ajouter facture
          </Link> */}
        </div>

        <div className="invoice-stats">
          <article className="invoice-stat-card">
            <div className="invoice-stat-icon green">
              <Receipt size={25} />
            </div>
            <div>
              <h3>{invoices.length}</h3>
              <p>Factures du jour</p>
            </div>
          </article>

          <article className="invoice-stat-card">
            <div className="invoice-stat-icon orange">
              <Coins size={25} />
            </div>
            <div>
              <h3>{totalAmount.toLocaleString("fr-FR")} FBu</h3>
              <p>Total facturé</p>
            </div>
          </article>

          <article className="invoice-stat-card">
            <div className="invoice-stat-icon green">
              <FileText size={25} />
            </div>
            <div>
              <h3>{paidInvoices}</h3>
              <p>Factures payées</p>
            </div>
          </article>

          <article className="invoice-stat-card">
            <div className="invoice-stat-icon red">
              <Trash2 size={25} />
            </div>
            <div>
              <h3>{deletedInvoices}</h3>
              <p>Factures supprimées</p>
            </div>
          </article>
        </div>

        <div className="invoices-card">
          <div className="invoices-toolbar">
            <div className="invoice-search">
              <Search size={15} />
              <input
                type="text"
                placeholder="Rechercher une facture..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>Tous statuts</option>
              <option>Payée</option>
              <option>Supprimée</option>
            </select>

            <select
              value={cashierFilter}
              onChange={(event) => setCashierFilter(event.target.value)}
            >
              {cashiers.map((cashier) => (
                <option key={cashier}>{cashier}</option>
              ))}
            </select>

            <button type="button" className="invoice-reset-btn" onClick={resetFilters}>
              <Filter size={14} />
              Réinitialiser
            </button>
          </div>

          <div className="invoice-result-line">
            <span>
              {filteredInvoices.length} facture(s) trouvée(s) sur {invoices.length}
            </span>
          </div>

          <table className="invoices-table">
            <thead>
              <tr>
                <th>N° Facture</th>
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
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.saleId}</td>
                    <td>{invoice.client}</td>
                    <td>{invoice.cashier}</td>
                    <td>{invoice.total}</td>
                    <td>{invoice.date}</td>
                    <td>
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td>
                      <div className="invoice-actions">
                        <button
                          type="button"
                          className="invoice-action-view"
                          onClick={() => setInvoiceToView(invoice)}
                        >
                          <Eye size={13} />
                        </button>

                        <Link
                          to={`/invoices/${invoice.id}`}
                          className="invoice-action-detail"
                        >
                          <FileText size={13} />
                        </Link>

                        <button type="button" className="invoice-action-print">
                          <Printer size={13} />
                        </button>

                        <button
                          type="button"
                          className="invoice-action-delete"
                          onClick={() => setInvoiceToDelete(invoice)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="invoice-empty">
                      Aucune facture ne correspond à votre recherche.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {invoiceToView && (
          <div className="invoice-view-overlay">
            <div className="invoice-view-modal">
              <div className="invoice-view-header">
                <div className="invoice-view-title">
                  <div className="invoice-view-icon">
                    <Receipt size={24} />
                  </div>

                  <div>
                    <h2>Détail rapide de la facture</h2>
                    <p>{invoiceToView.id}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="invoice-view-close"
                  onClick={() => setInvoiceToView(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="invoice-view-main">
                <h3>{invoiceToView.client}</h3>
                <StatusBadge status={invoiceToView.status} />
              </div>

              <div className="invoice-view-grid">
                <div className="invoice-view-item">
                  <Receipt size={16} />
                  <div>
                    <span>N° Facture</span>
                    <strong>{invoiceToView.id}</strong>
                  </div>
                </div>

                <div className="invoice-view-item">
                  <ShoppingIcon />
                  <div>
                    <span>N° Vente</span>
                    <strong>{invoiceToView.saleId}</strong>
                  </div>
                </div>

                <div className="invoice-view-item">
                  <User size={16} />
                  <div>
                    <span>Client</span>
                    <strong>{invoiceToView.client}</strong>
                  </div>
                </div>

                <div className="invoice-view-item">
                  <User size={16} />
                  <div>
                    <span>Caissier</span>
                    <strong>{invoiceToView.cashier}</strong>
                  </div>
                </div>

                <div className="invoice-view-item">
                  <Coins size={16} />
                  <div>
                    <span>Total</span>
                    <strong>{invoiceToView.total}</strong>
                  </div>
                </div>

                <div className="invoice-view-item">
                  <CalendarDays size={16} />
                  <div>
                    <span>Date</span>
                    <strong>{invoiceToView.date}</strong>
                  </div>
                </div>
              </div>

              <div className="invoice-view-products">
                <h4>Produits facturés</h4>

                {invoiceProducts.map((product) => (
                  <div className="invoice-view-product-line" key={product.product}>
                    <span>
                      {product.product} x{product.quantity}
                    </span>
                    <strong>{product.amount}</strong>
                  </div>
                ))}
              </div>

              <div className="invoice-view-actions">
                <button
                  type="button"
                  className="invoice-view-cancel"
                  onClick={() => setInvoiceToView(null)}
                >
                  Fermer
                </button>

                <Link to={`/invoices/${invoiceToView.id}`} className="invoice-view-detail">
                  <FileText size={14} />
                  Ouvrir détail
                </Link>
              </div>
            </div>
          </div>
        )}

        {invoiceToDelete && (
          <ConfirmModal
            title="Supprimer cette facture ?"
            message="Cette action supprimera la facture sélectionnée de la liste."
            itemName={`${invoiceToDelete.id} — ${invoiceToDelete.client}`}
            warning="Cette action est irréversible."
            onCancel={() => setInvoiceToDelete(null)}
            onConfirm={handleDelete}
          />
        )}
      </section>
    </DashboardLayout>
  );
}

function ShoppingIcon() {
  return <Receipt size={16} />;
}

export default Invoices;