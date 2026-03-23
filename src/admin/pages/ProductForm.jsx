import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import InputField from "../componets/form/InputField";
import SelectField from "../componets/form/SelectField";


const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch product (Edit mode)
  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(
            `https://ecommerce-backend-730a.onrender.com/api/products/${id}`
          );

          setName(data.name);
          setPrice(data.price);
          setCategory(data.category);
          setCountInStock(data.countInStock);
          setImage(data.image);
        } catch (error) {
          console.error(error);
        }
      };

      fetchProduct();
    }
  }, [id, isEdit]);

  // Submit
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));

      if (isEdit) {
        await axios.put(
          `https://ecommerce-backend-730a.onrender.com/api/products/${id}`,
          { name, price, category, countInStock, image },
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );
      } else {
        await axios.post(
          `https://ecommerce-backend-730a.onrender.com/api/products`,
          { name, price, category, countInStock, image },
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );
      }

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isEdit ? "Edit Product" : "Add Product"}
        </h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <InputField
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <InputField
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <SelectField
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <InputField
            type="number"
            placeholder="Stock"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          />

          <InputField
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          {/* Image Preview */}
          {image && (
            <img
              src={image}
              alt="preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading
              ? "Processing..."
              : isEdit
              ? "Update Product"
              : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;