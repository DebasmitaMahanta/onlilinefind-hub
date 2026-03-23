import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        "https://ecommerce-backend-730a.onrender.com/api/products"
      );
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));

      await axios.delete(
        `https://ecommerce-backend-730a.onrender.com/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      fetchProducts(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <Link
          to="/admin/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td className="p-3 text-center" colSpan="6">
                    No Products Found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="p-3">
                      <img
                        src={product.image || "https://via.placeholder.com/50"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>

                    <td className="p-3">{product.name}</td>
                    <td className="p-3">₹{product.price}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">{product.countInStock}</td>

                    <td className="p-3 space-x-2">
                      {/* Edit */}
                      <Link to={`/admin/products/${product._id}/edit`}>
                        <button className="bg-yellow-400 px-3 py-1 rounded">
                          Edit
                        </button>
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;