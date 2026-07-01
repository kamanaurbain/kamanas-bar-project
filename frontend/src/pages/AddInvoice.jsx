import { useState } from "react";
import { Calendar, Coins, Save, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { invoices as initialInvoices } from "../data/mockData";
import "../styles/invoices.css";

const STORAGE_KEY = "kamana_invoices";

function getStoredInvoices() {
  const savedInvoices = localStorage.getItem(STORAGE_KEY);
  return savedInvoices ? JSON.parse(savedInvoices) : initialInvoices;
}

function generateInvoiceId(invoices) {
  const nextNumber = invoices.length + 1;
  return `FAC-${String(nextNumber).padStart(6, "0")}`;
}

function generateSaleId(invoices) {
  const nextNumber = invoices.length + 1;
  return `VTE-${String(nextNumber).padStart(6, "0")}`;
}

function AddInvoice({ user, onLogout }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    saleId: "",
    client: "Client de passage",
    cashier: user?.role || "Admin",
    total: "",
    date: "25/05/2025 22:45",
    status: "Payée",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.client || !formData.cashier || !formData.total) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    const storedInvoices = getStoredInvoices();

    const newInvoice = {
      id: generateInvoiceId(storedInvoices),
      saleId: formData.saleId || generateSaleId(storedInvoices),
      client: formData.client,
      cashier: formData.cashier,
      total: `${Number(formData.total).toLocaleString("fr-FR")} FBu`,
      date: formData.date,
      status: formData.status,
    };

    const updatedInvoices = [newInvoice, ...storedInvoices];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
    navigate("/invoices");
  };

  return (
    <DashboardLayout activePage="invoices" user={user} onLogout={onLogout}>
      <section className="invoice-form-page">
        <div className="invoice-form-header">
          <div>
            <h1>Ajouter une facture</h1>
            <p>
              <Link to="/invoices">Factures</Link>
              <span>/</span>
              Ajouter une facture
            </p>
          </div>
        </div>

        <form className="invoice-form-layout" onSubmit={handleSubmit}>
          <div className="invoice-form-main">
            <div className="invoice-form-panel">
              <h2>Informations de la facture</h2>

              {error && <div className="invoice-form-error">{error}</div>}

              <div className="invoice-form-grid">
                <div className="invoice-form-group">
                  <label>N° Vente</label>
                  <input
                    type="text"
                    name="saleId"
                    placeholder="Ex: VTE-000145"
                    value={formData.saleId}
                    onChange={handleChange}
                  />
                </div>

                <div className="invoice-form-group">
                  <label>Client</label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                  />
                </div>

                <div className="invoice-form-group">
                  <label>Caissier</label>
                  <input
                    type="text"
                    name="cashier"
                    value={formData.cashier}
                    onChange={handleChange}
                  />
                </div>

                <div className="invoice-form-group">
                  <label>Montant total</label>
                  <input
                    type="number"
                    name="total"
                    placeholder="Ex: 20000"
                    value={formData.total}
                    onChange={handleChange}
                  />
                </div>

                <div className="invoice-form-group">
                  <label>Date</label>
                  <div className="invoice-date-input">
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                    <Calendar size={15} />
                  </div>
                </div>

                <div className="invoice-form-group">
                  <label>Statut</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option>Payée</option>
                    <option>Supprimée</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <aside className="invoice-form-side">
            <div className="invoice-side-panel">
              <div className="invoice-side-icon">
                <Coins size={24} />
              </div>

              <h3>Résumé facture</h3>

              <div className="invoice-summary-line">
                <span>Client</span>
                <strong>{formData.client || "Non défini"}</strong>
              </div>

              <div className="invoice-summary-line">
                <span>Caissier</span>
                <strong>{formData.cashier || "Non défini"}</strong>
              </div>

              <div className="invoice-summary-line green">
                <span>Total</span>
                <strong>
                  {formData.total
                    ? `${Number(formData.total).toLocaleString("fr-FR")} FBu`
                    : "0 FBu"}
                </strong>
              </div>

              <div className="invoice-side-warning">
                La facture sera enregistrée localement dans le navigateur.
              </div>
            </div>

            <div className="invoice-form-buttons">
              <Link to="/invoices" className="invoice-cancel-btn">
                <X size={15} />
                Annuler
              </Link>

              <button type="submit" className="invoice-save-btn">
                <Save size={15} />
                Enregistrer la facture
              </button>
            </div>
          </aside>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default AddInvoice;