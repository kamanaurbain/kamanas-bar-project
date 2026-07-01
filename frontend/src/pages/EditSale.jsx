import { useState } from "react";
import { Calendar, Save, ShoppingCart, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { sales as initialSales } from "../data/mockData";
import "../styles/sales.css";

const STORAGE_KEY = "kamana_sales";

function getStoredSales() {
  const savedSales = localStorage.getItem(STORAGE_KEY);
  return savedSales ? JSON.parse(savedSales) : initialSales;
}

function EditSale({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const storedSales = getStoredSales();
  const selectedSale = storedSales.find((sale) => sale.id === id) || storedSales[0];

  const [client, setClient] = useState(selectedSale.client);
  const [cashier, setCashier] = useState(selectedSale.cashier);
  const [date, setDate] = useState(selectedSale.date);
  const [status, setStatus] = useState(selectedSale.status);
  const [total, setTotal] = useState(String(selectedSale.total).replace(/\D/g, ""));
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!client || !cashier || !total) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const updatedSales = storedSales.map((sale) =>
      sale.id === selectedSale.id
        ? {
            ...sale,
            client,
            cashier,
            date,
            status,
            total: `${Number(total).toLocaleString("fr-FR")} FBu`,
          }
        : sale
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
    navigate("/sales");
  };

  return (
    <DashboardLayout activePage="sales" user={user} onLogout={onLogout}>
      <section className="sale-form-page">
        <div className="sale-form-header">
          <div>
            <h1>Modifier une vente</h1>
            <p>
              <Link to="/sales">Ventes</Link>
              <span>/</span>
              Modifier une vente
            </p>
          </div>
        </div>

        <form className="sale-form-layout" onSubmit={handleSubmit}>
          <div className="sale-form-main">
            <div className="sale-form-panel">
              <h2>Informations de la vente</h2>

              {error && <div className="sale-form-error">{error}</div>}

              <div className="sale-form-grid">
                <div className="sale-form-group">
                  <label>N° Vente</label>
                  <input type="text" value={selectedSale.id} disabled />
                </div>

                <div className="sale-form-group">
                  <label>Client</label>
                  <input
                    type="text"
                    value={client}
                    onChange={(event) => setClient(event.target.value)}
                  />
                </div>

                <div className="sale-form-group">
                  <label>Caissier</label>
                  <input
                    type="text"
                    value={cashier}
                    onChange={(event) => setCashier(event.target.value)}
                  />
                </div>

                <div className="sale-form-group">
                  <label>Montant total</label>
                  <input
                    type="number"
                    value={total}
                    onChange={(event) => setTotal(event.target.value)}
                  />
                </div>

                <div className="sale-form-group">
                  <label>Date de vente</label>
                  <div className="sale-date-input">
                    <input
                      type="text"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                    />
                    <Calendar size={15} />
                  </div>
                </div>

                <div className="sale-form-group">
                  <label>Statut</label>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option>Terminée</option>
                    <option>Annulée</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <aside className="sale-form-side">
            <div className="sale-side-panel">
              <div className="sale-side-icon">
                <ShoppingCart size={24} />
              </div>

              <h3>Résumé de modification</h3>

              <div className="sale-summary-line">
                <span>Vente</span>
                <strong>{selectedSale.id}</strong>
              </div>

              <div className="sale-summary-line">
                <span>Client</span>
                <strong>{client}</strong>
              </div>

              <div className="sale-summary-line">
                <span>Nouveau total</span>
                <strong>{Number(total || 0).toLocaleString("fr-FR")} FBu</strong>
              </div>

              <div className="sale-side-warning">
                Les modifications seront sauvegardées localement.
              </div>
            </div>

            <div className="sale-form-buttons">
              <Link to="/sales" className="sale-cancel-btn">
                <X size={15} />
                Annuler
              </Link>

              <button type="submit" className="sale-save-btn">
                <Save size={15} />
                Mettre à jour la vente
              </button>
            </div>
          </aside>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default EditSale;