import { useEffect, useState } from "react";
import { Calendar, Save, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import * as productService from "../services/productService";
import "../styles/products.css";

function EditProduct({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    unit: "",
    status: "Disponible",
    dateAdded: "",
    description: "",
    minStock: "",
    reference: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        const product = await productService.getProduct(id);
        if (isMounted) {
          setFormData({
            name: product.name || "",
            category: product.category || "",
            price: product.price || "",
            stock: product.stock || "",
            unit: product.unit || "",
            status: product.status || "Disponible",
            dateAdded: product.dateAdded || "",
            description: product.description || "",
            minStock: product.minStock || "",
            reference: product.reference || "",
          });
        }
      } catch {
        if (isMounted) setError("Impossible de charger le produit.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (event) => {
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

    try {
      setSaving(true);
      await productService.updateProduct(id, {
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
      });
      navigate("/products");
    } catch {
      setError("Impossible de mettre a jour le produit.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activePage="products" user={user} onLogout={onLogout}>
        <section className="product-form-page">Chargement...</section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="products" user={user} onLogout={onLogout}>
      <section className="product-form-page">
        <div className="product-form-header">
          <div>
            <h1>Modifier un produit</h1>
            <p>
              <Link to="/products">Produits</Link>
              <span>/</span>
              Modifier un produit
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
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>CatÃ©gorie</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
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
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>QuantitÃ© en stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>UnitÃ©</label>
                  <select name="unit" value={formData.unit} onChange={handleChange}>
                    <option>Bouteille</option>
                    <option>PiÃ¨ce</option>
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
                    <option>TerminÃ©</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description du produit</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="form-panel">
              <h2>Stock et dÃ©tails supplÃ©mentaires</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Stock minimum dâ€™alerte</label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>RÃ©fÃ©rence produit / Code</label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Date dâ€™ajout</label>
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
            <div className="side-panel product-preview">
              <h3>AperÃ§u du produit</h3>

              <div className="preview-circle">
                {formData.name.charAt(0) || "P"}
              </div>

              <h4>{formData.name || "Produit"}</h4>
              <p>{formData.category || "Non dÃ©finie"}</p>

              <div className="preview-info">
                <span>Prix</span>
                <strong>{formData.price || "0"} FBu</strong>
              </div>

              <div className="preview-info">
                <span>Stock</span>
                <strong>{formData.stock || "0"}</strong>
              </div>
            </div>

            <div className="form-buttons">
              <Link to="/products" className="cancel-btn">
                <X size={15} />
                Annuler
              </Link>

              <button type="submit" className="save-btn" disabled={saving}>
                <Save size={15} />
                Mettre Ã  jour le produit
              </button>
            </div>
          </aside>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default EditProduct;
