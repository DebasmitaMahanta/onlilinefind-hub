import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminTopbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full bg-white shadow px-6 py-3 flex justify-between items-center">
      
      {/* Left Side */}
      <h1 className="text-lg font-semibold text-gray-700">
        Admin Dashboard
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        
        {/* Admin Name */}
        <span className="text-gray-600 text-sm">
          {user?.name || "Admin"}
        </span>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
          {user?.name ? user.name[0].toUpperCase() : "A"}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminTopbar;