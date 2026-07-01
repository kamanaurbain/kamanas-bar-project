import { useMemo, useState } from "react";
import {
  Eye,
  Filter,
  Lock,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  User,
  UserCheck,
  Users as UsersIcon,
  UserX,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { users as initialUsers } from "../data/mockData";
import "../styles/users.css";

const STORAGE_KEY = "kamana_users";

function getStoredUsers() {
  const savedUsers = localStorage.getItem(STORAGE_KEY);
  return savedUsers ? JSON.parse(savedUsers) : initialUsers;
}

function Users({ user, onLogout }) {
  const [users, setUsers] = useState(getStoredUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous rôles");
  const [statusFilter, setStatusFilter] = useState("Tous statuts");
  const [userToView, setUserToView] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  const roles = useMemo(() => {
    const uniqueRoles = [...new Set(users.map((item) => item.role))];
    return ["Tous rôles", ...uniqueRoles];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        item.id.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.role.toLowerCase().includes(search) ||
        item.phone.toLowerCase().includes(search);

      const matchesRole = roleFilter === "Tous rôles" || item.role === roleFilter;

      const matchesStatus =
        statusFilter === "Tous statuts" || item.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const activeUsers = users.filter((item) => item.status === "Actif").length;
  const inactiveUsers = users.filter((item) => item.status === "Désactivé").length;
  const admins = users.filter((item) => item.role === "Administrateur").length;
  const cashiers = users.filter((item) => item.role === "Caissier").length;

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("Tous rôles");
    setStatusFilter("Tous statuts");
  };

  const handleDelete = () => {
    if (!userToDelete) return;

    const updatedUsers = users.filter((item) => item.id !== userToDelete.id);

    saveUsers(updatedUsers);
    setUserToDelete(null);
  };

  return (
    <DashboardLayout activePage="users" user={user} onLogout={onLogout}>
      <section className="users-page">
        <div className="users-header">
          <div>
            <h1>Gestion des utilisateurs</h1>
            <p>Gérez les comptes du personnel de Kamana’s Bar.</p>
          </div>

          <Link to="/users/add" className="user-add-btn">
            <Plus size={15} />
            Nouvel utilisateur
          </Link>
        </div>

        <div className="users-stats">
          <article className="user-stat-card">
            <div className="user-stat-icon green">
              <UserCheck size={25} />
            </div>

            <div>
              <h3>{activeUsers}</h3>
              <p>Utilisateurs actifs</p>
            </div>
          </article>

          <article className="user-stat-card">
            <div className="user-stat-icon orange">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h3>{admins}</h3>
              <p>Administrateurs</p>
            </div>
          </article>

          <article className="user-stat-card">
            <div className="user-stat-icon green">
              <UsersIcon size={25} />
            </div>

            <div>
              <h3>{cashiers}</h3>
              <p>Caissiers</p>
            </div>
          </article>

          <article className="user-stat-card">
            <div className="user-stat-icon red">
              <UserX size={25} />
            </div>

            <div>
              <h3>{inactiveUsers}</h3>
              <p>Comptes désactivés</p>
            </div>
          </article>
        </div>

        <div className="users-card">
          <div className="users-toolbar">
            <div className="users-search">
              <Search size={15} />

              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              {roles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>Tous statuts</option>
              <option>Actif</option>
              <option>Désactivé</option>
            </select>

            <button type="button" className="users-reset-btn" onClick={resetFilters}>
              <Filter size={14} />
              Réinitialiser
            </button>
          </div>

          <div className="users-result-line">
            <span>
              {filteredUsers.length} utilisateur(s) trouvé(s) sur {users.length}
            </span>
          </div>

          <table className="users-table">
            <thead>
              <tr>
                <th>N° Utilisateur</th>
                <th>Nom complet</th>
                <th>Adresse email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Date création</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>

                    <td>
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </td>

                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{item.role}</td>

                    <td>
                      <StatusBadge status={item.status} />
                    </td>

                    <td>{item.dateCreated}</td>

                    <td>
                      <div className="users-actions">
                        <button
                          type="button"
                          className="user-action-view"
                          onClick={() => setUserToView(item)}
                        >
                          <Eye size={13} />
                        </button>

                        <Link to={`/users/edit/${item.id}`} className="user-action-edit">
                          <Pencil size={13} />
                        </Link>

                        <button
                          type="button"
                          className="user-action-delete"
                          onClick={() => setUserToDelete(item)}
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
                    <div className="users-empty">
                      Aucun utilisateur ne correspond à votre recherche.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {userToView && (
          <div className="user-view-overlay">
            <div className="user-view-modal">
              <div className="user-view-header">
                <div className="user-view-title">
                  <div className="user-view-icon">
                    <User size={24} />
                  </div>

                  <div>
                    <h2>Détail de l’utilisateur</h2>
                    <p>{userToView.id}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="user-view-close"
                  onClick={() => setUserToView(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="user-view-main">
                <div className="user-view-avatar">
                  {userToView.name.charAt(0)}
                </div>

                <h3>{userToView.name}</h3>
                <StatusBadge status={userToView.status} />
              </div>

              <div className="user-view-grid">
                <div className="user-view-item">
                  <Mail size={16} />
                  <div>
                    <span>Email</span>
                    <strong>{userToView.email}</strong>
                  </div>
                </div>

                <div className="user-view-item">
                  <Phone size={16} />
                  <div>
                    <span>Téléphone</span>
                    <strong>{userToView.phone}</strong>
                  </div>
                </div>

                <div className="user-view-item">
                  <ShieldCheck size={16} />
                  <div>
                    <span>Rôle</span>
                    <strong>{userToView.role}</strong>
                  </div>
                </div>

                <div className="user-view-item">
                  <Lock size={16} />
                  <div>
                    <span>Permission</span>
                    <strong>Accès autorisé</strong>
                  </div>
                </div>

                <div className="user-view-item">
                  <UserCheck size={16} />
                  <div>
                    <span>Statut</span>
                    <strong>{userToView.status}</strong>
                  </div>
                </div>

                <div className="user-view-item">
                  <UsersIcon size={16} />
                  <div>
                    <span>Date création</span>
                    <strong>{userToView.dateCreated}</strong>
                  </div>
                </div>
              </div>

              <div className="user-permissions-box">
                <h4>Permissions</h4>

                <div className="user-permission-line">
                  <span>Gestion des ventes</span>
                  <strong>Oui</strong>
                </div>

                <div className="user-permission-line">
                  <span>Gestion des produits</span>
                  <strong>Oui</strong>
                </div>

                <div className="user-permission-line">
                  <span>Accès aux factures</span>
                  <strong>Oui</strong>
                </div>

                <div className="user-permission-line">
                  <span>Historique des ventes</span>
                  <strong>Oui</strong>
                </div>
              </div>

              <div className="user-view-actions">
                <button
                  type="button"
                  className="user-view-cancel"
                  onClick={() => setUserToView(null)}
                >
                  Fermer
                </button>

                <Link to={`/users/edit/${userToView.id}`} className="user-view-edit">
                  <Pencil size={14} />
                  Modifier
                </Link>
              </div>
            </div>
          </div>
        )}

        {userToDelete && (
          <ConfirmModal
            title="Supprimer cet utilisateur ?"
            message="Cette action supprimera l’utilisateur sélectionné de la liste."
            itemName={`${userToDelete.id} — ${userToDelete.name}`}
            warning="Cette action est irréversible."
            onCancel={() => setUserToDelete(null)}
            onConfirm={handleDelete}
          />
        )}
      </section>
    </DashboardLayout>
  );
}

export default Users;