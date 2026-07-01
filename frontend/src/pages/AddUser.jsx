import { useState } from "react";
import { Calendar, Save, ShieldCheck, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { users as initialUsers } from "../data/mockData";
import "../styles/users.css";

const STORAGE_KEY = "kamana_users";

function getStoredUsers() {
  const savedUsers = localStorage.getItem(STORAGE_KEY);
  return savedUsers ? JSON.parse(savedUsers) : initialUsers;
}

function generateUserId(users) {
  const nextNumber = users.length + 1;
  return `UTI-${String(nextNumber).padStart(5, "0")}`;
}

function AddUser({ user, onLogout }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Caissier",
    status: "Actif",
    dateCreated: "25/05/2025",
    photo: "",
    permissions: {
      sales: true,
      products: true,
      invoices: true,
      admin: false,
      users: false,
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

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    const storedUsers = getStoredUsers();

    const newUser = {
      id: generateUserId(storedUsers),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      dateCreated: formData.dateCreated,
      photo: formData.photo,
      permissions: formData.permissions,
    };

    const updatedUsers = [newUser, ...storedUsers];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    navigate("/users");
  };

  return (
    <DashboardLayout activePage="users" user={user} onLogout={onLogout}>
      <section className="user-form-page">
        <div className="user-form-header">
          <div>
            <h1>Ajouter un utilisateur</h1>

            <p>
              <Link to="/users">Utilisateurs</Link>
              <span>/</span>
              Ajouter un utilisateur
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
                  <label>Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ex: Jean K."
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="user-form-group">
                  <label>Adresse email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="exemple@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="user-form-group">
                  <label>Téléphone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+257 79 00 00 00"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="user-form-group">
                  <label>Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="user-form-group">
                  <label>Confirmer mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="********"
                    value={formData.confirmPassword}
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
                  <select name="status" value={formData.status} onChange={handleChange}>
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
                    placeholder="Lien ou nom du fichier"
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
                Le mot de passe doit contenir au moins 8 caractères.
              </div>
            </div>
          </div>

          <aside className="user-form-side">
            <div className="user-side-panel">
              <div className="user-side-icon">
                <ShieldCheck size={24} />
              </div>

              <h3>Résumé utilisateur</h3>

              <div className="user-summary-line">
                <span>Nom</span>
                <strong>{formData.name || "Nouvel utilisateur"}</strong>
              </div>

              <div className="user-summary-line">
                <span>Email</span>
                <strong>{formData.email || "Non défini"}</strong>
              </div>

              <div className="user-summary-line">
                <span>Rôle</span>
                <strong>{formData.role}</strong>
              </div>

              <div className="user-summary-line green">
                <span>Statut</span>
                <strong>{formData.status}</strong>
              </div>

              <div className="user-side-warning">
                Le compte sera enregistré localement dans le navigateur.
              </div>
            </div>

            <div className="user-form-buttons">
              <Link to="/users" className="user-cancel-btn">
                <X size={15} />
                Annuler
              </Link>

              <button type="submit" className="user-save-btn">
                <Save size={15} />
                Enregistrer l’utilisateur
              </button>
            </div>
          </aside>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default AddUser;