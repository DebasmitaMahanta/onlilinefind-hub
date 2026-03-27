import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          api.getUrl(`/products/${id}`)
        );
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          api.getUrl(`/reviews/${id}`)
        );
        setReviews(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`${product.name} added to cart!`);
      navigate("/cart");
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to submit a review");
      navigate("/login");
      return;
    }

    if (!newReview.trim()) {
      alert("Please write a review");
      return;
    }

    setSubmitting(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));

      const { data } = await axios.post(
        api.reviews,
        {
          productId: id,
          rating,
          comment: newReview,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      setReviews([data, ...reviews]);
      setNewReview("");
      setRating(5);
      alert("Review submitted successfully!");

      // Fetch updated product to get new rating
      const { data: updatedProduct } = await axios.get(
        api.getUrl(`/products/${id}`)
      );
      setProduct(updatedProduct);
    } catch (error) {
      console.error(error);
      alert("Error submitting review: " + error.message);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-10">Loading...</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-10">Product not found</div>
      </>
    );
  }

  const productImage =
    product.image && product.image.trim() !== ""
      ? product.image
      : "https://via.placeholder.com/400x400?text=No+Image";

  const avgRating = product?.rating || 0;

  return (
    <>
      <Navbar />

      <div className="px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Product Image */}
          <div>
            <img
              src={productImage}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
              }}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <p className="text-gray-600 mb-4">{product.category}</p>

            <div className="mb-4">
              <span className="text-yellow-500 font-semibold">
                ⭐ {avgRating.toFixed(1)} ({product?.numReviews || 0} reviews)
              </span>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-pink-600">₹{product.price}</h3>
              <p className="text-sm text-gray-500">
                Stock: {product.countInStock > 0 ? product.countInStock : "Out of stock"}
              </p>
            </div>

            {/* Quantity Selector */}
            {product.countInStock > 0 && (
              <div className="mb-6 flex items-center gap-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Math.min(product.countInStock, parseInt(e.target.value) || 1)))
                    }
                    className="w-16 text-center border-0 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock <= 0}
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:bg-gray-400"
            >
              {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

            <div className="mb-4">
              <label className="block font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 mb-4"
              rows="4"
            ></textarea>

            <button
              type="submit"
              disabled={submitting}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-400"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold">{review.name}</h4>
                      <p className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-yellow-500">{"⭐".repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
