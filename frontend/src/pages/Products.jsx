import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  Eye,
  Layers,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  Package,
  CalendarDays,
  Tag,
  Coins,
  Hash,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import { products as initialProducts } from "../data/mockData";
import "../styles/products.css";

const STORAGE_KEY = "kamana_products";

function getStoredProducts() {
  const savedProducts = localStorage.getItem(STORAGE_KEY);
  return savedProducts ? JSON.parse(savedProducts) : initialProducts;
}

function Products({ user, onLogout }) {
  const [products, setProducts] = useState(getStoredProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Toutes categories");
  const [statusFilter, setStatusFilter] = useState("Tous statuts stock");
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToView, setProductToView] = useState(null);

  const saveProducts = (updatedProducts) => {
    setProducts(updatedProducts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
  };

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];

    return ["Toutes categories", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.id.toLowerCase().includes(search) ||
        product.reference.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "Toutes categories" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "Tous statuts stock" ||
        product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const totalProducts = products.length;
  const totalCategories = categories.length - 1;

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= Number(product.minStock)
  ).length;

  const ruptureProducts = products.filter(
    (product) => product.status === "Rupture" || Number(product.stock) === 0
  ).length;

  const handleDelete = () => {
    if (!productToDelete) return;

    const updatedProducts = products.filter(
      (product) => product.id !== productToDelete.id
    );

    saveProducts(updatedProducts);
    setProductToDelete(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("Toutes categories");
    setStatusFilter("Tous statuts stock");
  };

  return (
    <DashboardLayout activePage="products" user={user} onLogout={onLogout}>
      <section className="products-page">
        <div className="products-header">
          <div>
            <h1>Administrations des Produits</h1>
            <p>Gerer les produits du bistro et surveiller les stocks.</p>
          </div>

          <Link to="/products/add" className="products-add-btn">
            <Plus size={15} />
            Ajouter Produit
          </Link>
        </div>

        <div className="products-stats">
          <article className="product-stat-card">
            <div className="product-stat-icon green">
              <Boxes size={25} />
            </div>

            <div>
              <h3>{totalProducts}</h3>
              <p>Produits</p>
            </div>
          </article>

          <article className="product-stat-card">
            <div className="product-stat-icon orange">
              <Layers size={25} />
            </div>

            <div>
              <h3>{totalCategories}</h3>
              <p>Categories</p>
            </div>
          </article>

          <article className="product-stat-card">
            <div className="product-stat-icon yellow">
              <AlertTriangle size={25} />
            </div>

            <div>
              <h3>{lowStockProducts}</h3>
              <p>Stock faible</p>
            </div>
          </article>

          <article className="product-stat-card">
            <div className="product-stat-icon red">
              <AlertTriangle size={25} />
            </div>

            <div>
              <h3>{ruptureProducts}</h3>
              <p>Repture</p>
            </div>
          </article>
        </div>

        <div className="products-card">
          <div className="products-toolbar">
            <div className="products-search">
              <Search size={15} />

              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>Tous statuts stock</option>
              <option>Disponible</option>
              <option>Rupture</option>
              <option>Terminé</option>
            </select>

            <button
              type="button"
              className="products-reset-btn"
              onClick={resetFilters}
            >
              <X size={14} />
              Réinitialiser
            </button>
          </div>

          <div className="products-result-line">
            <span>
              {filteredProducts.length} produit(s) trouvé(s) sur{" "}
              {products.length}
            </span>
          </div>

          <table className="products-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Produit</th>
                <th>Categorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Date ajout</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>

                    <td>
                      <strong>{product.name}</strong>
                      <span>{product.reference}</span>
                    </td>

                    <td>{product.category}</td>
                    <td>{product.price} FBu</td>
                    <td>{product.stock}</td>

                    <td>
                      <StatusBadge status={product.status} />
                    </td>

                    <td>{product.dateAdded}</td>

                    <td>
                      <div className="products-actions">
                        <button
                          type="button"
                          className="action-view"
                          onClick={() => setProductToView(product)}
                        >
                          <Eye size={13} />
                        </button>

                        <Link
                          to={`/products/edit/${product.id}`}
                          className="action-edit"
                        >
                          <Pencil size={13} />
                        </Link>

                        <button
                          type="button"
                          className="action-delete"
                          onClick={() => setProductToDelete(product)}
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
                    <div className="products-empty">
                      Aucun produit ne correspond à votre recherche.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {productToView && (
          <div className="product-view-overlay">
            <div className="product-view-modal">
              <div className="product-view-header">
                <div className="product-view-title">
                  <div className="product-view-icon">
                    <Package size={24} />
                  </div>

                  <div>
                    <h2>Détail du produit</h2>
                    <p>{productToView.id}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="product-view-close"
                  onClick={() => setProductToView(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="product-view-main">
                <div className="product-view-avatar">
                  {productToView.name.charAt(0)}
                </div>

                <h3>{productToView.name}</h3>
                <StatusBadge status={productToView.status} />
              </div>

              <div className="product-view-grid">
                <div className="product-view-item">
                  <Tag size={16} />
                  <div>
                    <span>Catégorie</span>
                    <strong>{productToView.category}</strong>
                  </div>
                </div>

                <div className="product-view-item">
                  <Coins size={16} />
                  <div>
                    <span>Prix unitaire</span>
                    <strong>{productToView.price} FBu</strong>
                  </div>
                </div>

                <div className="product-view-item">
                  <Boxes size={16} />
                  <div>
                    <span>Quantité en stock</span>
                    <strong>{productToView.stock}</strong>
                  </div>
                </div>

                <div className="product-view-item">
                  <Package size={16} />
                  <div>
                    <span>Unité</span>
                    <strong>{productToView.unit}</strong>
                  </div>
                </div>

                <div className="product-view-item">
                  <AlertTriangle size={16} />
                  <div>
                    <span>Stock minimum</span>
                    <strong>{productToView.minStock}</strong>
                  </div>
                </div>

                <div className="product-view-item">
                  <Hash size={16} />
                  <div>
                    <span>Référence</span>
                    <strong>{productToView.reference}</strong>
                  </div>
                </div>

                <div className="product-view-item">
                  <CalendarDays size={16} />
                  <div>
                    <span>Date d’ajout</span>
                    <strong>{productToView.dateAdded}</strong>
                  </div>
                </div>
              </div>

              <div className="product-view-description">
                <span>Description</span>
                <p>{productToView.description || "Aucune description."}</p>
              </div>

              <div className="product-view-actions">
                <button
                  type="button"
                  className="product-view-cancel"
                  onClick={() => setProductToView(null)}
                >
                  Fermer
                </button>

                <Link
                  to={`/products/edit/${productToView.id}`}
                  className="product-view-edit"
                >
                  <Pencil size={14} />
                  Modifier
                </Link>
              </div>
            </div>
          </div>
        )}

        {productToDelete && (
          <div className="delete-overlay">
            <div className="delete-modal">
              <div className="delete-icon">
                <Trash2 size={28} />
              </div>

              <h2>Supprimer ce produit ?</h2>

              <p>Cette action supprimera le produit sélectionné de la liste.</p>

              <div className="delete-product-name">
                {productToDelete.id} — {productToDelete.name}
              </div>

              <div className="delete-warning">
                Cette suppression est simulée côté frontend.
              </div>

              <div className="delete-actions">
                <button
                  type="button"
                  className="delete-cancel"
                  onClick={() => setProductToDelete(null)}
                >
                  Annuler
                </button>

                <button
                  type="button"
                  className="delete-confirm"
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

export default Products;