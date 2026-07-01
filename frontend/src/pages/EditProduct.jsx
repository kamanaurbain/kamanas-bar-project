import { Calendar, Save, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { products } from "../data/mockData";
import "../styles/products.css";

function EditProduct({ user, onLogout }) {
  const { id } = useParams();

  const product =
    products.find((item) => item.id === id) || products[0];

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

        <form className="product-form-layout">
          <div className="product-form-main">
            <div className="form-panel">
              <h2>Informations du produit</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Nom du produit</label>
                  <input type="text" defaultValue={product.name} />
                </div>

                <div className="form-group">
                  <label>Catégorie</label>
                  <select defaultValue={product.category}>
                    <option>Boissons</option>
                    <option>Plats</option>
                    <option>Snacks</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Prix unitaire</label>
                  <input type="text" defaultValue={product.price} />
                </div>

                <div className="form-group">
                  <label>Quantité en stock</label>
                  <input type="number" defaultValue={product.stock} />
                </div>

                <div className="form-group">
                  <label>Unité</label>
                  <select defaultValue={product.unit}>
                    <option>Bouteille</option>
                    <option>Pièce</option>
                    <option>Plat</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Statut du produit</label>
                  <select defaultValue={product.status}>
                    <option>Disponible</option>
                    <option>Rupture</option>
                    <option>Terminé</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description du produit</label>
                <textarea defaultValue={product.description}></textarea>
              </div>
            </div>

            <div className="form-panel">
              <h2>Stock et détails supplémentaires</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Stock minimum d’alerte</label>
                  <input type="number" defaultValue={product.minStock} />
                </div>

                <div className="form-group">
                  <label>Référence produit / Code</label>
                  <input type="text" defaultValue={product.reference} />
                </div>

                <div className="form-group">
                  <label>Date d’ajout</label>
                  <div className="date-input">
                    <input type="text" defaultValue={product.dateAdded} />
                    <Calendar size={15} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="product-form-side">
            <div className="side-panel product-preview">
              <h3>Aperçu du produit</h3>

              <div className="preview-circle">
                {product.name.charAt(0)}
              </div>

              <h4>{product.name}</h4>
              <p>{product.category}</p>

              <div className="preview-info">
                <span>Prix</span>
                <strong>{product.price} FBu</strong>
              </div>

              <div className="preview-info">
                <span>Stock</span>
                <strong>{product.stock}</strong>
              </div>
            </div>

            <div className="form-buttons">
              <Link to="/products" className="cancel-btn">
                <X size={15} />
                Annuler
              </Link>

              <button type="button" className="save-btn">
                <Save size={15} />
                Mettre à jour le produit
              </button>
            </div>
          </aside>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default EditProduct;