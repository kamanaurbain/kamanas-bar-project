import { useMemo, useState } from "react";
import { Calendar, Coins, Plus, Save, ShoppingCart, Trash2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { products as initialProducts, sales as initialSales } from "../data/mockData";
import "../styles/sales.css";

const SALES_KEY = "kamana_sales";
const PRODUCTS_KEY = "kamana_products";

function getStoredSales() {
  const savedSales = localStorage.getItem(SALES_KEY);
  return savedSales ? JSON.parse(savedSales) : initialSales;
}

function getStoredProducts() {
  const savedProducts = localStorage.getItem(PRODUCTS_KEY);
  return savedProducts ? JSON.parse(savedProducts) : initialProducts;
}

function generateSaleId(sales) {
  const nextNumber = sales.length + 1;
  return `VTE-${String(nextNumber).padStart(6, "0")}`;
}

function cleanNumber(value) {
  return Number(String(value).replace(/\D/g, ""));
}

function AddSale({ user, onLogout }) {
  const navigate = useNavigate();
  const products = getStoredProducts();

  const [client, setClient] = useState("Client de passage");
  const [cashier, setCashier] = useState(user?.role || "Admin");
  const [date, setDate] = useState("25/05/2025 22:45");
  const [status, setStatus] = useState("Terminée");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [error, setError] = useState("");

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity * cleanNumber(item.price), 0);
  }, [cart]);

  const change = Math.max(cleanNumber(receivedAmount) - total, 0);

  const handleAddToCart = () => {
    const product = products.find((item) => item.id === selectedProductId);

    if (!product) return;

    const productExists = cart.find((item) => item.id === product.id);

    if (productExists) {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        )
      );
    } else {
      setCart((currentCart) => [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: Number(quantity),
        },
      ]);
    }

    setQuantity(1);
    setError("");
  };

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!client || !cashier || cart.length === 0) {
      setError("Veuillez ajouter au moins un produit dans la vente.");
      return;
    }

    const storedSales = getStoredSales();

    const newSale = {
      id: generateSaleId(storedSales),
      client,
      cashier,
      total: `${total.toLocaleString("fr-FR")} FBu`,
      date,
      status,
      products: cart,
      receivedAmount: `${cleanNumber(receivedAmount).toLocaleString("fr-FR")} FBu`,
      change: `${change.toLocaleString("fr-FR")} FBu`,
    };

    const updatedSales = [newSale, ...storedSales];
    localStorage.setItem(SALES_KEY, JSON.stringify(updatedSales));

    navigate("/sales");
  };

  return (
    <DashboardLayout activePage="sales" user={user} onLogout={onLogout}>
      <section className="sale-form-page">
        <div className="sale-form-header">
          <div>
            <h1>Ajouter une vente</h1>
            <p>
              <Link to="/sales">Ventes</Link>
              <span>/</span>
              Gestion des ventes
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

            <div className="sale-form-panel">
              <h2>Sélection des produits</h2>

              <div className="sale-product-row">
                <div className="sale-form-group">
                  <label>Produit</label>
                  <select
                    value={selectedProductId}
                    onChange={(event) => setSelectedProductId(event.target.value)}
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} — {product.price} FBu
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sale-form-group">
                  <label>Quantité</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </div>

                <button type="button" className="sale-add-product-btn" onClick={handleAddToCart}>
                  <Plus size={15} />
                  Ajouter
                </button>
              </div>

              <table className="sale-cart-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>Qté</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.price} FBu</td>
                        <td>{item.quantity}</td>
                        <td>{(item.quantity * cleanNumber(item.price)).toLocaleString("fr-FR")} FBu</td>
                        <td>
                          <button
                            type="button"
                            className="sale-cart-delete"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">
                        <div className="sale-cart-empty">
                          Aucun produit ajouté dans la vente.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="sale-form-side">
            <div className="sale-side-panel">
              <div className="sale-side-icon">
                <ShoppingCart size={24} />
              </div>

              <h3>Résumé de la vente</h3>

              <div className="sale-summary-line">
                <span>Articles</span>
                <strong>{cart.length}</strong>
              </div>

              <div className="sale-summary-line">
                <span>Total général</span>
                <strong>{total.toLocaleString("fr-FR")} FBu</strong>
              </div>

              <div className="sale-form-group">
                <label>Montant reçu</label>
                <input
                  type="number"
                  placeholder="Ex: 50000"
                  value={receivedAmount}
                  onChange={(event) => setReceivedAmount(event.target.value)}
                />
              </div>

              <div className="sale-summary-line green">
                <span>Monnaie à rendre</span>
                <strong>{change.toLocaleString("fr-FR")} FBu</strong>
              </div>

              <div className="sale-side-warning">
                Paiement local directement au caissier. Pas de paiement en ligne.
              </div>
            </div>

            <div className="sale-form-buttons">
              <Link to="/sales" className="sale-cancel-btn">
                <X size={15} />
                Annuler
              </Link>

              <button type="submit" className="sale-save-btn">
                <Save size={15} />
                Valider la vente
              </button>
            </div>
          </aside>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default AddSale;