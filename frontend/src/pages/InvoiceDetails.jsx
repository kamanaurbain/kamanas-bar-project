import { ArrowLeft, Download, Printer, Receipt } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import { invoices as initialInvoices, invoiceProducts } from "../data/mockData";
import "../styles/invoices.css";

const STORAGE_KEY = "kamana_invoices";

function getStoredInvoices() {
  const savedInvoices = localStorage.getItem(STORAGE_KEY);
  return savedInvoices ? JSON.parse(savedInvoices) : initialInvoices;
}

function InvoiceDetails({ user, onLogout }) {
  const { id } = useParams();
  const invoices = getStoredInvoices();
  const invoice = invoices.find((item) => item.id === id) || invoices[0];

  return (
    <DashboardLayout activePage="invoices" user={user} onLogout={onLogout}>
      <section className="invoice-detail-page">
        <div className="invoice-detail-header">
          <div>
            <h1>Détail de la facture</h1>
            <p>
              <Link to="/invoices">Factures</Link>
              <span>/</span>
              Gestion des factures
            </p>
          </div>

          <Link to="/invoices" className="invoice-back-btn">
            <ArrowLeft size={15} />
            Retour
          </Link>
        </div>

        <div className="invoice-detail-grid">
          <div className="invoice-detail-left">
            <div className="invoice-info-card">
              <div className="invoice-info-header">
                <div>
                  <h2>{invoice.id}</h2>
                  <p>Facture générée depuis la vente {invoice.saleId}</p>
                </div>

                <StatusBadge status={invoice.status} />
              </div>

              <div className="invoice-info-grid">
                <div>
                  <span>N° Facture</span>
                  <strong>{invoice.id}</strong>
                </div>

                <div>
                  <span>N° Vente</span>
                  <strong>{invoice.saleId}</strong>
                </div>

                <div>
                  <span>Client</span>
                  <strong>{invoice.client}</strong>
                </div>

                <div>
                  <span>Caissier</span>
                  <strong>{invoice.cashier}</strong>
                </div>

                <div>
                  <span>Date</span>
                  <strong>{invoice.date}</strong>
                </div>

                <div>
                  <span>Montant total</span>
                  <strong>{invoice.total}</strong>
                </div>
              </div>
            </div>

            <div className="invoice-products-card">
              <h2>Produits facturés</h2>

              <table className="invoice-products-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Qté</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {invoiceProducts.map((product) => (
                    <tr key={product.product}>
                      <td>{product.product}</td>
                      <td>{product.quantity}</td>
                      <td>{product.unitPrice}</td>
                      <td>{product.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="invoice-ticket">
            <div className="ticket-logo">
              <Receipt size={26} />
            </div>

            <h2>Kamana&apos;s Bar</h2>
            <p>FACTURE N° {invoice.id}</p>

            <div className="ticket-line">
              <span>Client</span>
              <strong>{invoice.client}</strong>
            </div>

            <div className="ticket-line">
              <span>Caissier</span>
              <strong>{invoice.cashier}</strong>
            </div>

            <div className="ticket-line">
              <span>Date</span>
              <strong>{invoice.date}</strong>
            </div>

            <div className="ticket-products">
              {invoiceProducts.map((product) => (
                <div key={product.product}>
                  <span>
                    {product.product} x{product.quantity}
                  </span>
                  <strong>{product.amount}</strong>
                </div>
              ))}
            </div>

            <div className="ticket-total">
              <span>Total</span>
              <strong>{invoice.total}</strong>
            </div>

            <div className="ticket-money">
              <div>
                <span>Montant reçu</span>
                <strong>25 000 FBu</strong>
              </div>

              <div>
                <span>Monnaie rendue</span>
                <strong>5 000 FBu</strong>
              </div>
            </div>

            <p className="ticket-thanks">Merci pour votre visite !</p>

            <div className="ticket-actions">
              <button type="button">
                <Download size={14} />
                Télécharger
              </button>

              <button type="button">
                <Printer size={14} />
                Imprimer
              </button>
            </div>
          </aside>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default InvoiceDetails;