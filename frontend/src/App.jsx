import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

import Sales from "./pages/Sales";
import AddSale from "./pages/AddSale";
import EditSale from "./pages/EditSale";

import Invoices from "./pages/Invoices";
import AddInvoice from "./pages/AddInvoice";
import InvoiceDetails from "./pages/InvoiceDetails";

import SalesHistory from "./pages/SalesHistory";

import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import { TOKEN_KEY } from "./services/api";
import * as authService from "./services/authService";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const connectedUser = await authService.getMe();
        setUser(connectedUser);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogin = async (loginResultOrCredentials) => {
    const loginResult =
      loginResultOrCredentials?.accessToken ||
      loginResultOrCredentials?.token ||
      loginResultOrCredentials?.user
        ? loginResultOrCredentials
        : await authService.login(loginResultOrCredentials);

    const token = loginResult.accessToken || loginResult.token;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }

    setUser(loginResult.user);
  };

  const handleLogout = async () => {
    try {
      if (localStorage.getItem(TOKEN_KEY)) {
        await authService.logout();
      }
    } catch {
      // The local session is still cleared if the API logout fails.
    }

    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  function ProtectedRoute({ children }) {
    if (loading) {
      return <div>Chargement...</div>;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }

  return (
    <Routes>
      {/* LANDING PAGE = LOGIN */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          loading ? (
            <div>Chargement...</div>
          ) : 
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/add"
        element={
          <ProtectedRoute>
            <AddProduct user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/edit/:id"
        element={
          <ProtectedRoute>
            <EditProduct user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <Sales user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales/add"
        element={
          <ProtectedRoute>
            <AddSale user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales/edit/:id"
        element={
          <ProtectedRoute>
            <EditSale user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <Invoices user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices/add"
        element={
          <ProtectedRoute>
            <AddInvoice user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices/:id"
        element={
          <ProtectedRoute>
            <InvoiceDetails user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <SalesHistory user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/add"
        element={
          <ProtectedRoute>
            <AddUser user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/edit/:id"
        element={
          <ProtectedRoute>
            <EditUser user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
