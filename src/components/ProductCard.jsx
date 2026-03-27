const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Ensure product image is usable and fallback when missing or broken
  const productImage = product.image && product.image.trim() !== "" ? product.image : "https://via.placeholder.com/300x240?text=No+Image";

  return (
    <div 
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer transform hover:scale-105 transition"
    >

      <img
        src={productImage}
        alt={product.name || "Product"}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/300x240?text=No+Image";
        }}
        className="w-full h-60 object-cover rounded"
      />

      <h2 className="mt-3 font-semibold">
        {product.name}
      </h2>

      <p className="text-gray-500 text-sm">
        {product.category}
      </p>

      <p className="text-pink-600 font-bold">
        ₹{product.price}
      </p>

      <button className="w-full mt-3 bg-black text-white py-2 rounded hover:bg-gray-800">
        View Details
      </button>

    </div>
  );
};

import { useNavigate } from "react-router-dom";

export default ProductCard;