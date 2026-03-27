import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menu, setMenu] = useState(null);
  const { user, logout, cart } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const categories = {
    Men: ["T-Shirts", "Shirts", "Jeans", "Shoes"],
    Women: ["Dresses", "Tops", "Kurtis", "Heels"],
    Kids: ["Toys", "Clothing", "School Bags"],
  };

  return (
    <nav className="bg-white shadow-sm px-10 py-4 flex justify-between items-center relative">

      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-pink-600 cursor-pointer"
      >
        ShopEase
      </h1>

      {/* Menu */}
      <ul className="flex gap-10 font-medium text-sm uppercase">
        {Object.keys(categories).map((item) => (
          <li
            key={item}
            className="cursor-pointer hover:text-pink-600"
            onMouseEnter={() => setMenu(item)}
            onMouseLeave={() => setMenu(null)}
          >
            {item}

            {/* Dropdown */}
            {menu === item && (
              <div className="absolute left-0 top-16 bg-white shadow-lg p-6 w-full flex gap-10 z-50">
                {categories[item].map((cat, index) => (
                  <p
                    key={index}
                    className="hover:text-pink-600 cursor-pointer"
                  >
                    {cat}
                  </p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* 👤 User Info */}
        {user && (
          <span className="text-sm">
            Hi, {user.name || "User"}
          </span>
        )}

        {/* 🛠 Admin Link */}
        {user?.isAdmin && (
          <Link
            to="/admin/dashboard"
            className="text-sm hover:text-pink-600"
          >
            Admin
          </Link>
        )}

        {/* 📦 My Orders Link */}
        {user && (
          <Link
            to="/orders"
            className="text-sm hover:text-pink-600"
          >
            My Orders
          </Link>
        )}

        {/* 🔐 Auth */}
        {user ? (
          <button onClick={handleLogout} className="hover:text-pink-600">
            Logout
          </button>
        ) : (
          <Link to="/login" className="hover:text-pink-600">
            Login
          </Link>
        )}

        {/* 🛒 Cart */}
        <button
          onClick={() => navigate("/cart")}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg relative"
        >
          Cart
          {/* 🔥 Cart Badge with dynamic count */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;