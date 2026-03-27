import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import api from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email & password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        api.login,
        { email, password }
      );

      login(res.data);

      toast.success("Login Successful 🎉");

      setTimeout(() => {
        if (res.data.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

     
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-pink-500 to-red-500 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">ShopTrending Products</h1>
        <p className="text-lg text-center max-w-sm">
          Discover New Trending Products <br />
          Latest Fashion, Electronics & More <br />
          At Affordable Prices 
        </p>

        
      </div>

     
      <div className="flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">

          <h2 className="text-2xl font-bold text-center mb-6">
            Welcome Back 
          </h2>

         
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

         
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition flex justify-center"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        
          <p className="text-center mt-5 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pink-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;