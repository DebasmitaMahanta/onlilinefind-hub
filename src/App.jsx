import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";


import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";


import Dashboard from "./admin/pages/Dashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./admin/componets/AdminLayout";
import Products from "./admin/pages/Products";

import ProductForm from "./admin/pages/ProductForm";
import Users from "./admin/pages/Users";
import { useAuth } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const { user } = useAuth(); // ✅ get logged-in user

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
    

      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />

        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <h1 className="p-5 text-xl">User Profile</h1>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="users" element={<Users />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<h1 className="text-center mt-10">404 - Page Not Found</h1>}
        />
      </Routes>
    </>
  );
}

export default App;