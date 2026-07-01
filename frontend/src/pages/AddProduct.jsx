import { useState } from "react";
import { Calendar, Save, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { products as initialProducts } from "../data/mockData";
import "../styles/products.css";

const STORAGE_KEY = "kamana_products";

function getStoredProducts() {
  const savedProducts = localStorage.getItem(STORAGE_KEY);
  return savedProducts ? JSON.parse(savedProducts) : initialProducts;
}

function generateProductId(products) {
  const nextNumber = products.length + 1;
  return `PRO-${String(nextNumber).padStart(3, "0")}`;
}

function AddProduct({ user, onLogout }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    unit: "",
    status: "Disponible",
    dateAdded: "25/05/2025",
    description: "",
    minStock: "",
    reference: "",
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

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock ||
      !formData.unit ||
      !formData.reference
    ) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    const storedProducts = getStoredProducts();

    const newProduct = {
      id: generateProductId(storedProducts),
      name: formData.name,
      category: formData.category,
      price: formData.price,
      stock: formData.stock,
      unit: formData.unit,
      status: formData.status,
      dateAdded: formData.dateAdded,
      description: formData.description || "Aucune description.",
      minStock: formData.minStock || "0",
      reference: formData.reference,
    };

    const updatedProducts = [newProduct, ...storedProducts];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

    navigate("/products");
  };

  return (
    <DashboardLayout activePage="products" user={user} onLogout={onLogout}>
      <section className="product-form-page">
        <div className="product-form-header">
          <div>
            <h1>Ajouter un produit</h1>

            <p>
              <Link to="/products">Produits</Link>
              <span>/</span>
              Ajouter un produit
            </p>
          </div>
        </div>

        <form className="product-form-layout" onSubmit={handleSubmit}>
          <div className="product-form-main">
            <div className="form-panel">
              <h2>Informations du produit</h2>

              {error && <div className="product-form-error">{error}</div>}

              <div className="form-grid">
                <div className="form-group">
                  <label>Nom du produit</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ex: Fanta Orange 33cl"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Selectionner une categorie</option>
                    <option>Boissons</option>
                    <option>Plats</option>
                    <option>Snacks</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Prix unitaire</label>
                  <input
                    type="text"
                    name="price"
                    placeholder="Ex: 1000"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Quantité en stock</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Ex: 150"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Unité</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    <option value="">Selectionner une unite</option>
                    <option>Bouteille</option>
                    <option>Pièce</option>
                    <option>Plat</option>
                    <option>Verre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Statut du produit</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option>Disponible</option>
                    <option>Rupture</option>
                    <option>Terminé</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description du produit</label>
                <textarea
                  name="description"
                  placeholder="Description courte du produit..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="form-panel">
              <h2>Stock et détails supplémentaires</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Stock minimum d’alerte</label>
                  <input
                    type="number"
                    name="minStock"
                    placeholder="Ex: 10"
                    value={formData.minStock}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Référence produit / Code</label>
                  <input
                    type="text"
                    name="reference"
                    placeholder="Ex: FAN-ORG-033"
                    value={formData.reference}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Date d’ajout</label>
                  <div className="date-input">
                    <input
                      type="text"
                      name="dateAdded"
                      value={formData.dateAdded}
                      onChange={handleChange}
                    />
                    <Calendar size={15} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="product-form-side">
            <div className="side-panel">
              <h3>Résumé</h3>

              <p>
                Remplissez les informations du produit avant de l’enregistrer
                dans la liste.
              </p>

              <div className="side-preview-box">
                <span>Nom</span>
                <strong>{formData.name || "Nouveau produit"}</strong>
              </div>

              <div className="side-preview-box">
                <span>Catégorie</span>
                <strong>{formData.category || "Non définie"}</strong>
              </div>

              <div className="side-preview-box">
                <span>Prix</span>
                <strong>
                  {formData.price ? `${formData.price} FBu` : "0 FBu"}
                </strong>
              </div>

              <div className="side-warning">
                Le produit sera visible dans le module ventes après
                enregistrement.
              </div>
            </div>

            <div className="form-buttons">
              <Link to="/products" className="cancel-btn">
                <X size={15} />
                Annuler
              </Link>

              <button type="submit" className="save-btn">
                <Save size={15} />
                Enregistrer le produit
              </button>
            </div>
          </aside>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default AddProduct;