import { useState } from "react";
import { Calendar, Save, ShieldCheck, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { users as initialUsers } from "../data/mockData";
import "../styles/users.css";

const STORAGE_KEY = "kamana_users";

function getStoredUsers() {
  const savedUsers = localStorage.getItem(STORAGE_KEY);
  return savedUsers ? JSON.parse(savedUsers) : initialUsers;
}

function EditUser({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const storedUsers = getStoredUsers();
  const selectedUser = storedUsers.find((item) => item.id === id) || storedUsers[0];

  const [formData, setFormData] = useState({
    name: selectedUser.name,
    email: selectedUser.email,
    phone: selectedUser.phone,
    role: selectedUser.role,
    status: selectedUser.status,
    dateCreated: selectedUser.dateCreated,
    photo: selectedUser.photo || "",
    permissions: selectedUser.permissions || {
      sales: true,
      products: true,
      invoices: true,
      admin: selectedUser.role === "Administrateur",
      users: selectedUser.role === "Administrateur",
      history: true,
    },
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

  const handlePermissionChange = (permission) => {
    setFormData((currentData) => ({
      ...currentData,
      permissions: {
        ...currentData.permissions,
        [permission]: !currentData.permissions[permission],
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    const updatedUsers = storedUsers.map((item) =>
      item.id === selectedUser.id
        ? {
            ...item,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: formData.status,
            dateCreated: formData.dateCreated,
            photo: formData.photo,
            permissions: formData.permissions,
          }
        : item
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    navigate("/users");
  };

  return (
    <DashboardLayout activePage="users" user={user} onLogout={onLogout}>
      <section className="user-form-page">
        <div className="user-form-header">
          <div>
            <h1>Modifier un utilisateur</h1>

            <p>
              <Link to="/users">Utilisateurs</Link>
              <span>/</span>
              Modifier un utilisateur
            </p>
          </div>
        </div>

        <form className="user-form-layout" onSubmit={handleSubmit}>
          <div className="user-form-main">
            <div className="user-form-panel">
              <h2>Informations de l’utilisateur</h2>

              {error && <div className="user-form-error">{error}</div>}

              <div className="user-form-grid">
                <div className="user-form-group">
                  <label>N° Utilisateur</label>
                  <input type="text" value={selectedUser.id} disabled />
                </div>

                <div className="user-form-group">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="user-form-group">
                  <label>Adresse email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="user-form-group">
                  <label>Téléphone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="user-form-group">
                  <label>Rôle</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option>Administrateur</option>
                    <option>Caissier</option>
                    <option>Serveur</option>
                    <option>Magasinier</option>
                  </select>
                </div>

                <div className="user-form-group">
                  <label>Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option>Actif</option>
                    <option>Désactivé</option>
                  </select>
                </div>

                <div className="user-form-group">
                  <label>Date de création</label>
                  <div className="user-date-input">
                    <input
                      type="text"
                      name="dateCreated"
                      value={formData.dateCreated}
                      onChange={handleChange}
                    />
                    <Calendar size={15} />
                  </div>
                </div>

                <div className="user-form-group">
                  <label>Photo de profil</label>
                  <input
                    type="text"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="user-form-panel">
              <h2>Accès et permissions</h2>

              <div className="permissions-grid">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.permissions.sales}
                    onChange={() => handlePermissionChange("sales")}
                  />
                  Gestion des ventes
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={formData.permissions.products}
                    onChange={() => handlePermissionChange("products")}
                  />
                  Gestion des produits
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={formData.permissions.invoices}
                    onChange={() => handlePermissionChange("invoices")}
                  />
                  Accès aux factures
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={formData.permissions.admin}
                    onChange={() => handlePermissionChange("admin")}
                  />
                  Administration complète
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={formData.permissions.users}
                    onChange={() => handlePermissionChange("users")}
                  />
                  Gestion des utilisateurs
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={formData.permissions.history}
                    onChange={() => handlePermissionChange("history")}
                  />
                  Historique des ventes
                </label>
              </div>

              <div className="user-password-note">
                Les modifications seront appliquées immédiatement.
              </div>
            </div>
          </div>

          <aside className="user-form-side">
            <div className="user-side-panel user-preview-card">
              <div className="user-side-avatar">
                {formData.name.charAt(0) || "U"}
              </div>

              <h3>{formData.name}</h3>
              <p>{formData.role}</p>

              <div className="user-summary-line">
                <span>Email</span>
                <strong>{formData.email}</strong>
              </div>

              <div className="user-summary-line green">
                <span>Statut</span>
                <strong>{formData.status}</strong>
              </div>

              <div className="user-side-warning">
                Vérifiez bien les informations avant de sauvegarder.
              </div>
            </div>

            <div className="user-form-buttons">
              <Link to="/users" className="user-cancel-btn">
                <X size={15} />
                Annuler
              </Link>

              <button type="submit" className="user-save-btn">
                <Save size={15} />
                Mettre à jour l’utilisateur
              </button>
            </div>
          </aside>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default EditUser;