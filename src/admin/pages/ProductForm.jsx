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
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
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
          setImageFile(null);
        } catch (error) {
          console.error(error);
        }
      };

      fetchProduct();
    }

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("https://ecommerce-backend-730a.onrender.com/api/products/categories");
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, [id, isEdit]);

  // Submit
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("countInStock", countInStock);

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (image) {
        formData.append("image", image);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEdit) {
        await axios.put(
          `https://ecommerce-backend-730a.onrender.com/api/products/${id}`,
          formData,
          config
        );
      } else {
        await axios.post(
          `https://ecommerce-backend-730a.onrender.com/api/products`,
          formData,
          config
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
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories.length > 0 ? categories : ["Electronics", "Clothing", "Home", "Sports", "Food", "Other"]}
          />

          <InputField
            type="number"
            placeholder="Stock"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          />

          <InputField
            placeholder="Image URL (optional if uploading file)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file || null);

                if (file) {
                  setImage(URL.createObjectURL(file));
                }
              }}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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