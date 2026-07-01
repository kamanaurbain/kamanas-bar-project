import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";

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

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("kamana_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("kamana_user");
      return null;
    }
  });

  const handleLogin = (connectedUser) => {
    localStorage.setItem("kamana_user", JSON.stringify(connectedUser));
    setUser(connectedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("kamana_user");
    setUser(null);
  };

  function ProtectedRoute({ children }) {
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