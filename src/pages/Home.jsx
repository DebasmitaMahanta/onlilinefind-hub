import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchProducts = async (category = "") => {
    try {
      const query = category ? `?category=${encodeURIComponent(category)}` : "";
      const { data } = await axios.get(`${api.products}${query}`);
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(api.productCategories);
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
    fetchCategories();
  }, [selectedCategory]);

  return (
    <>
    <Navbar/>
      <Hero />

      <div className="px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold">Featured Products</h2>

          <div className="flex items-center gap-3">
            <label htmlFor="categoryFilter" className="font-medium">Category:</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;