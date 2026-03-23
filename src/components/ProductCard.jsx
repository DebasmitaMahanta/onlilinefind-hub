const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg">

      <img
        src={product.image}
        alt={product.name}
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

      <button className="w-full mt-3 bg-black text-white py-2 rounded">
        Add to Cart
      </button>

    </div>
  );
};

export default ProductCard;